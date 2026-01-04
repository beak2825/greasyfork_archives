// ==UserScript==
// @name         Torn Faction Newsletter Formatter
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Adds three buttons to the faction newsletter editor to paste predefined formats from Pastebin or hardcoded fallback. Fetches templates fresh every button press.
// @author       Rosti
// @match        https://www.torn.com/factions.php?step=your*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @connect      pastebin.com
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/542293/Torn%20Faction%20Newsletter%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/542293/Torn%20Faction%20Newsletter%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Pastebin sources
    const pastebinUrl1 = 'https://pastebin.com/raw/q3BGhgjb'; // Welcome Post
    const pastebinUrl2 = 'https://pastebin.com/raw/4Zea2pnP'; // OC Reminder
    const pastebinUrl3 = 'https://pastebin.com/raw/PUT-YOUR-LINK-HERE'; // Third button

    // Fallback template if fetch fails
    const hardcodedTemplate = `
placeholder
`;

    // --- helpers ---
    function fetchTemplateFrom(url, fallback, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url,
            nocache: true, // Force fresh fetch
            onload: (response) => {
                if (response.status === 200 && response.responseText) {
                    callback(response.responseText);
                } else {
                    console.error('Fetch failed, using fallback.', response.status);
                    callback(fallback);
                }
            },
            onerror: (error) => {
                console.error('Error fetching template:', error);
                callback(fallback);
            }
        });
    }

    function getEditorElements() {
        const sourceEditor = document.querySelector('textarea.sourceArea___uUut3');
        const richTextEditor = document.querySelector('div.editor-content.mce-content-body');
        return { sourceEditor, richTextEditor };
    }

    function getCurrentEditorContent() {
        const { sourceEditor, richTextEditor } = getEditorElements();
        if (richTextEditor && !richTextEditor.classList.contains('hidden___M4Yzx')) {
            return (richTextEditor.innerHTML || '').trim();
        } else if (sourceEditor) {
            return (sourceEditor.value || '').trim();
        }
        return '';
    }

    function insertText(text) {
        const { sourceEditor, richTextEditor } = getEditorElements();

        if (richTextEditor && !richTextEditor.classList.contains('hidden___M4Yzx')) {
            richTextEditor.innerHTML = text;
        } else if (sourceEditor) {
            sourceEditor.value = text;
        } else {
            alert('Could not find the newsletter editor.');
        }
    }

    function createButton(label, { url, fallback, id }) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'torn-btn';
        button.textContent = label;
        button.id = id;
        button.style.margin = '6px 8px 6px 0';

        button.addEventListener('click', () => {
            const existing = getCurrentEditorContent();
            if (existing !== '' && !confirm('The editor already contains text. Replace it?')) return;

            // Fetch fresh content every time button is clicked
            fetchTemplateFrom(url, fallback, insertText);
        });

        return button;
    }

    function addButtons() {
        if (!window.location.hash.includes('#/tab=controls&option=newsletter')) return;

        const descriptionDiv = document.querySelector('div.desc');
        if (!descriptionDiv) return;

        let btnWrap = document.getElementById('torn-newsletter-btn-wrap');
        if (!btnWrap) {
            btnWrap = document.createElement('div');
            btnWrap.id = 'torn-newsletter-btn-wrap';
            btnWrap.style.display = 'flex';
            btnWrap.style.flexWrap = 'wrap';
            btnWrap.style.margin = '10px 0';
            descriptionDiv.parentNode.insertBefore(btnWrap, descriptionDiv.nextSibling);
        }

        if (!document.getElementById('btn-welcome-post')) {
            btnWrap.appendChild(
                createButton('Welcome Post', { url: pastebinUrl1, fallback: hardcodedTemplate, id: 'btn-welcome-post' })
            );
        }

        if (!document.getElementById('btn-oc-reminder')) {
            btnWrap.appendChild(
                createButton('OC Reminder', { url: pastebinUrl2, fallback: hardcodedTemplate, id: 'btn-oc-reminder' })
            );
        }

        if (!document.getElementById('btn-third')) {
            btnWrap.appendChild(
                createButton('Third', { url: pastebinUrl3, fallback: hardcodedTemplate, id: 'btn-third' })
            );
        }
    }

    const observer = new MutationObserver(addButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    addButtons();
})();
