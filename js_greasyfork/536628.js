// ==UserScript==
// @name         Copy Unvisited Links (Custom History v1.9 - Filter Pasted URLs)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Tracks clicked/visited links. Copies unvisited links from page and also Filters user-pasted URLs against history.
// @author       Greg Cromwell / Gemini AI
// @license      MIT
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536628/Copy%20Unvisited%20Links%20%28Custom%20History%20v19%20-%20Filter%20Pasted%20URLs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536628/Copy%20Unvisited%20Links%20%28Custom%20History%20v19%20-%20Filter%20Pasted%20URLs%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const SCRIPT_VERSION = "1.9";
    const CONSOLE_PREFIX = `[Custom History v${SCRIPT_VERSION}]`;
    const CUSTOM_HISTORY_KEY = `customUserVisitedLinks_v${SCRIPT_VERSION}`;
    const MAX_CUSTOM_HISTORY_SIZE = 10000;
    const COPY_BUTTON_ID = `copyCustomUnvisitedBtn_v${SCRIPT_VERSION}`;
    const PASTE_FILTER_BUTTON_ID = `pasteFilterBtn_v${SCRIPT_VERSION}`;
    const MODAL_ID = `pasteFilterModal_v${SCRIPT_VERSION}`;
    const TEXTAREA_ID = `pasteFilterTextarea_v${SCRIPT_VERSION}`;

    console.log(`${CONSOLE_PREFIX} Script loading.`);

    // --- 1. URL Normalization ---
    function normalizeUrl(url) {
        try {
            const urlObj = new URL(url, document.baseURI);
            let normalized = `${urlObj.protocol}//${urlObj.hostname}${urlObj.port ? ':' + urlObj.port : ''}${urlObj.pathname}`;
            if (normalized.length > 1 && normalized.endsWith('/')) {
                normalized = normalized.slice(0, -1);
            }
            return normalized.toLowerCase();
        } catch (e) {
            console.warn(`${CONSOLE_PREFIX} Could not normalize URL: "${url}"`, e.message);
            return null;
        }
    }

    // --- 2. Custom History Management ---
    async function getCustomHistorySet() {
        const historyArray = await GM_getValue(CUSTOM_HISTORY_KEY, []);
        return new Set(Array.isArray(historyArray) ? historyArray : []);
    }

    async function addUrlToCustomHistory(url) {
        const normalizedUrl = normalizeUrl(url);
        if (!normalizedUrl) return;
        let historyArray = await GM_getValue(CUSTOM_HISTORY_KEY, []);
        if (!Array.isArray(historyArray)) {
            historyArray = [];
        }
        const tempHistorySet = new Set(historyArray);
        if (!tempHistorySet.has(normalizedUrl)) {
            historyArray.push(normalizedUrl);
            if (historyArray.length > MAX_CUSTOM_HISTORY_SIZE) {
                historyArray = historyArray.slice(historyArray.length - MAX_CUSTOM_HISTORY_SIZE);
            }
            await GM_setValue(CUSTOM_HISTORY_KEY, historyArray);
        }
    }

    // --- 3. Link Processing: Attach Click Listeners ---
    async function processLinksOnPageForHistory() {
        const links = document.querySelectorAll('a[href]');
        links.forEach(link => {
            const linkHref = link.href;
            link.addEventListener('click', function handleLinkClick() {
                addUrlToCustomHistory(linkHref);
            });
        });
    }

    // --- 4. Button Functionality ---

    // Function for the first button: Copy "New" Links from page
    async function handleCopyUnvisitedClick() {
        console.log(`${CONSOLE_PREFIX} handleCopyUnvisitedClick called.`);
        alert("Processing page links... Check console (F12) for progress.");
        const visitedSet = await getCustomHistorySet();
        const unvisitedLinksToCopy = [];
        let pageLinkCount = 0;
        const allPageLinks = document.querySelectorAll('a[href]');
        pageLinkCount = allPageLinks.length;
        allPageLinks.forEach(link => {
            const originalHref = link.href;
            const normalizedHref = normalizeUrl(originalHref);
            if (normalizedHref && !normalizedHref.startsWith('javascript:') && !normalizedHref.startsWith('mailto:')) {
                if (!visitedSet.has(normalizedHref)) {
                    unvisitedLinksToCopy.push(originalHref);
                }
            }
        });
        const uniqueUnvisitedLinks = [...new Set(unvisitedLinksToCopy)];
        if (uniqueUnvisitedLinks.length > 0) {
            GM_setClipboard(uniqueUnvisitedLinks.join('\n'), 'text');
            alert(`Copied ${uniqueUnvisitedLinks.length} unique "new" link(s) (not in custom history) out of ${pageLinkCount} links to clipboard.`);
        } else {
            alert(`No "new" links found on this page (out of ${pageLinkCount} links) based on your custom history.`);
        }
        console.log(`${CONSOLE_PREFIX} handleCopyUnvisitedClick finished.`);
    }

    // --- Modal for Pasting Links ---
    function showPasteModal(callback) {
        if (document.getElementById(MODAL_ID)) {
             document.getElementById(MODAL_ID).style.display = 'flex';
             document.getElementById(TEXTAREA_ID).value = ''; // Clear previous content
             document.getElementById(TEXTAREA_ID).focus();
             return;
        }

        const modalOverlay = document.createElement('div');
        modalOverlay.id = MODAL_ID;
        Object.assign(modalOverlay.style, {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: '10001'
        });

        const modalContent = document.createElement('div');
        Object.assign(modalContent.style, {
            background: 'white', padding: '25px', borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)', minWidth: '350px', maxWidth: '90%',
            display: 'flex', flexDirection: 'column', gap: '15px'
        });

        const title = document.createElement('h3');
        title.textContent = 'Filter Pasted Links';
        Object.assign(title.style, { margin: '0 0 10px 0', textAlign: 'center' });

        const instruction = document.createElement('p');
        instruction.textContent = 'Paste your list of URLs below (one URL per line):';
        Object.assign(instruction.style, { margin: '0 0 5px 0', fontSize: '14px' });


        const textarea = document.createElement('textarea');
        textarea.id = TEXTAREA_ID;
        Object.assign(textarea.style, {
            width: 'calc(100% - 20px)', minHeight: '150px', border: '1px solid #ccc',
            borderRadius: '4px', padding: '10px', fontSize: '13px', resize: 'vertical'
        });

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' });

        const processButton = document.createElement('button');
        processButton.textContent = 'Filter & Copy';
        Object.assign(processButton.style, {
            padding: '8px 15px', background: '#4CAF50', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        Object.assign(cancelButton.style, {
            padding: '8px 15px', background: '#f44336', color: 'white',
            border: 'none', borderRadius: '4px', cursor: 'pointer'
        });

        processButton.onclick = () => {
            const text = textarea.value;
            modalOverlay.style.display = 'none';
            callback(text);
        };

        cancelButton.onclick = () => {
            modalOverlay.style.display = 'none';
        };
        
        modalOverlay.onclick = (event) => { // Close if backdrop is clicked
            if (event.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        };


        buttonContainer.append(cancelButton, processButton);
        modalContent.append(title, instruction, textarea, buttonContainer);
        modalOverlay.appendChild(modalContent);
        document.body.appendChild(modalOverlay);
        textarea.focus();
    }

    // Function for the second button: Process Pasted Text
    async function handleFilterPastedContentClick() {
        console.log(`${CONSOLE_PREFIX} handleFilterPastedContentClick called.`);
        showPasteModal(async (pastedText) => {
            if (!pastedText || pastedText.trim() === "") {
                alert("No text was pasted or processed.");
                console.log(`${CONSOLE_PREFIX} No text provided in modal.`);
                return;
            }

            const urlsFromPastedText = pastedText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
            if (urlsFromPastedText.length === 0) {
                alert("No valid URLs found in the pasted text after parsing.");
                console.log(`${CONSOLE_PREFIX} No URLs found in pasted content.`);
                return;
            }
            console.log(`${CONSOLE_PREFIX} Found ${urlsFromPastedText.length} lines/URLs in pasted text.`);

            const visitedSet = await getCustomHistorySet();
            const unvisitedFromPasted = [];
            urlsFromPastedText.forEach(url => {
                const normalizedUrl = normalizeUrl(url);
                if (normalizedUrl && !normalizedUrl.startsWith('javascript:') && !normalizedUrl.startsWith('mailto:')) {
                    if (!visitedSet.has(normalizedUrl)) {
                        unvisitedFromPasted.push(url); // Store original URL
                    }
                }
            });

            const uniqueUnvisitedFromPasted = [...new Set(unvisitedFromPasted)];
            console.log(`${CONSOLE_PREFIX} Found ${uniqueUnvisitedFromPasted.length} unique unvisited links from pasted text.`);

            if (uniqueUnvisitedFromPasted.length > 0) {
                GM_setClipboard(uniqueUnvisitedFromPasted.join('\n'), 'text');
                alert(`Filtered Pasted Text: ${uniqueUnvisitedFromPasted.length} unique "new" link(s) (not in your custom history) out of ${urlsFromPastedText.length} pasted links are now on your clipboard.`);
            } else {
                alert(`No "new" links found in your pasted text (out of ${urlsFromPastedText.length} lines) based on your custom history. Clipboard not changed.`);
            }
            console.log(`${CONSOLE_PREFIX} handleFilterPastedContentClick processing finished.`);
        });
    }

    // --- UI Element Creation ---
    function createAndAddButtons() {
        // Button 1: Copy "New" Links from Page
        if (!document.getElementById(COPY_BUTTON_ID)) {
            const button1 = document.createElement('button');
            button1.id = COPY_BUTTON_ID;
            button1.textContent = `CpNew v${SCRIPT_VERSION.substring(0,3)}`; // Shorter text
            button1.title = `Copy "New" Links from Page (v${SCRIPT_VERSION})`;
            Object.assign(button1.style, {
                position: 'fixed', top: '75px', right: '1px', zIndex: '3001',
                fontSize: '10px', padding: '1px 2px', margin: '0', lineHeight: '1',
                minWidth: '30px', backgroundColor: 'lightblue', border: '1px solid gray',
                borderRadius: '2px', cursor: 'pointer', boxShadow: '1px 1px 1px rgba(0,0,0,0.1)'
            });
            button1.addEventListener('click', handleCopyUnvisitedClick);
            appendElementToBody(button1, "Copy New Links button");
        }

        // Button 2: Paste & Filter
        if (!document.getElementById(PASTE_FILTER_BUTTON_ID)) {
            const button2 = document.createElement('button');
            button2.id = PASTE_FILTER_BUTTON_ID;
            button2.textContent = `Paste&Filt`; // Shorter text
            button2.title = `Paste and Filter URLs against Custom History (v${SCRIPT_VERSION})`;
            Object.assign(button2.style, {
                position: 'fixed', top: '95px', right: '1px', zIndex: '3000',
                fontSize: '10px', padding: '1px 2px', margin: '0', lineHeight: '1',
                minWidth: '30px', backgroundColor: 'lightgreen', border: '1px solid gray',
                borderRadius: '2px', cursor: 'pointer', boxShadow: '1px 1px 1px rgba(0,0,0,0.1)'
            });
            button2.addEventListener('click', handleFilterPastedContentClick);
            appendElementToBody(button2, "Paste & Filter button");
        }
    }

    function appendElementToBody(element, elementName) {
        if (document.body) {
            document.body.appendChild(element);
        } else {
            window.addEventListener('DOMContentLoaded', () => {
                if (document.body) document.body.appendChild(element);
                else console.error(`${CONSOLE_PREFIX} ${elementName}: document.body still not found.`);
            }, { once: true });
        }
    }

    // --- 5. Initialization and Dynamic Content Handling ---
    function initializeScript() {
        addUrlToCustomHistory(window.location.href);
        processLinksOnPageForHistory();
        createAndAddButtons();
    }

    try {
        initializeScript();
    } catch(e) {
        console.error(`${CONSOLE_PREFIX} CRITICAL ERROR during script initialization:`, e);
        alert(`[Custom History v${SCRIPT_VERSION}] CRITICAL ERROR: ${e.message}. Check console.`);
    }

    const observer = new MutationObserver((mutationsList) => {
        if (!document.getElementById(COPY_BUTTON_ID) || !document.getElementById(PASTE_FILTER_BUTTON_ID)) {
            createAndAddButtons();
        }
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                let hasNewLinks = false;
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && (node.matches('a[href]') || node.querySelector('a[href]'))) {
                        hasNewLinks = true;
                    }
                });
                if (hasNewLinks) {
                    processLinksOnPageForHistory();
                    break;
                }
            }
        }
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            if (document.body) observer.observe(document.body, { childList: true, subtree: true });
            else console.error(`${CONSOLE_PREFIX} MutationObserver: document.body not found.`);
        }, { once: true });
    }

    window[`clearUserLinkHistory_v${SCRIPT_VERSION.replace(/\./g, '_')}`] = async () => {
        console.log(`${CONSOLE_PREFIX} clearUserLinkHistory called by user.`);
        if (confirm(`Are you sure you want to clear all custom link history for script version ${SCRIPT_VERSION}?`)) {
            await GM_setValue(CUSTOM_HISTORY_KEY, []);
            alert(`Custom link history (v${SCRIPT_VERSION}) cleared. Reload page for full effect.`);
        } else {
            alert(`Custom link history (v${SCRIPT_VERSION}) clearing cancelled.`);
        }
    };
    console.log(`${CONSOLE_PREFIX} Script loaded. Type 'clearUserLinkHistory_v${SCRIPT_VERSION.replace(/\./g, '_')}()' in console to clear history.`);

})();