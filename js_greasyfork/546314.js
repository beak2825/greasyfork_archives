// ==UserScript==
// @name         JPDB RTK Information Inserter
// @version      1.0
// @description  Inserts RTK (Remembering the Kanji) information into JPDB kanji cards
// @author       Henry Russell
// @match        https://jpdb.io/kanji/*
// @match        https://jpdb.io/review*
// @connect      hrussellzfac023.github.io
// @grant        GM_xmlhttpRequest
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/546314/JPDB%20RTK%20Information%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/546314/JPDB%20RTK%20Information%20Inserter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentKanji = '';

    function extractKanjiFromURL() {
        const url = window.location.href;
        
        // For kanji pages like https://jpdb.io/kanji/犬
        const kanjiMatch = url.match(/https:\/\/jpdb\.io\/kanji\/(.+?)(?:[?#]|$)/);
        if (kanjiMatch) {
            // Remove any URL parameters and decode
            const kanjiPart = kanjiMatch[1].split('?')[0].split('#')[0];
            return decodeURIComponent(kanjiPart);
        }
        
        // For review pages
        const hiddenInput = document.querySelector('input[name="c"]');
        if (hiddenInput) {
            const parts = hiddenInput.value.split(',');
            if (parts.length > 1 && parts[0] === 'kb') {
                return parts[1];
            }
        }
        
        return '';
    }

    function fetchRTKInfo(kanji) {
        const encodedKanji = encodeURIComponent(kanji);
        const url = `https://hrussellzfac023.github.io/rtk/${encodedKanji}/index.html`;
        
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                if (response.status === 200) {
                    parseAndInsertRTKInfo(response.responseText, kanji);
                } else {
                    console.log(`Failed to fetch RTK page for ${kanji}: ${response.status}`);
                }
            },
            onerror: function(error) {
                console.error('Error fetching RTK page:', error);
            }
        });
    }

    function parseAndInsertRTKInfo(html, kanji) {
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract RTK information
        const rtkInfo = extractRTKData(doc);
        
        if (!rtkInfo.keyword) {
            console.log(`No RTK information found for kanji: ${kanji}`);
            return;
        }
        
        insertRTKInfoIntoJPDB(rtkInfo, kanji);
    }

    function extractRTKData(doc) {
        const rtkInfo = {};
        
        // Extract keyword (frame number)
        const keywordElement = doc.querySelector('h2 code');
        if (keywordElement) {
            rtkInfo.keyword = keywordElement.textContent.trim();
            rtkInfo.frameNumber = keywordElement.getAttribute('title') || '';
        }
        
        // Extract On-Yomi and Kun-Yomi
        const yomiElement = doc.querySelector('h3');
        if (yomiElement) {
            const yomiText = yomiElement.textContent;
            const onYomiMatch = yomiText.match(/On-Yomi:\s*([^—]+)/);
            const kunYomiMatch = yomiText.match(/Kun-Yomi:\s*(.+)/);
            
            if (onYomiMatch) {
                rtkInfo.onYomi = onYomiMatch[1].trim();
            }
            if (kunYomiMatch) {
                rtkInfo.kunYomi = kunYomiMatch[1].trim();
            }
        }
        
        // Extract elements
        const headings = doc.querySelectorAll('h2');
        for (const heading of headings) {
            if (heading.textContent.includes('Elements:')) {
                const nextP = heading.nextElementSibling;
                if (nextP && nextP.tagName === 'P') {
                    rtkInfo.elements = nextP.textContent.trim();
                }
                break;
            }
        }
        
        // Extract Heisig story
        const heisigStoryHeading = Array.from(doc.querySelectorAll('h2')).find(h => 
            h.textContent.includes('Heisig story:')
        );
        if (heisigStoryHeading) {
            const storyP = heisigStoryHeading.nextElementSibling;
            if (storyP && storyP.tagName === 'P') {
                rtkInfo.heisigStory = storyP.innerHTML; // Use innerHTML to preserve formatting
            }
        }
        
        // Extract Heisig comment
        const heisigCommentHeading = Array.from(doc.querySelectorAll('h2')).find(h => 
            h.textContent.includes('Heisig comment:')
        );
        if (heisigCommentHeading) {
            const commentP = heisigCommentHeading.nextElementSibling;
            if (commentP && commentP.tagName === 'P') {
                rtkInfo.heisigComment = commentP.innerHTML; // Use innerHTML to preserve formatting
            }
        }
        
        // Extract Koohii stories
        const koohiiHeading = Array.from(doc.querySelectorAll('h2')).find(h => 
            h.textContent.includes('Koohii stories:')
        );
        if (koohiiHeading) {
            rtkInfo.koohiiStories = [];
            let nextElement = koohiiHeading.nextElementSibling;
            while (nextElement && nextElement.tagName === 'P') {
                rtkInfo.koohiiStories.push(nextElement.innerHTML);
                nextElement = nextElement.nextElementSibling;
            }
        }
        
        return rtkInfo;
    }

    function insertRTKInfoIntoJPDB(rtkInfo, kanji) {
        // Check if we already inserted RTK info to avoid duplicates
        if (document.getElementById('rtk-info-container')) {
            return;
        }

        // Find a good insertion point - look for the main content area to insert after it
        let insertionPoint = null;
        
        // For kanji pages, try to insert after the mnemonic section but before "Used in" sections
        const mnemonicSection = document.querySelector('h6.subsection-label + .subsection .mnemonic');
        if (mnemonicSection) {
            // Find the parent container of the mnemonic section
            let mnemonicContainer = mnemonicSection.closest('.vbox > div, .result > div');
            if (mnemonicContainer) {
                insertionPoint = mnemonicContainer;
            }
        }
        
        // Fallback: look for the result kanji container (the main container for kanji pages)
        if (!insertionPoint) {
            const resultKanji = document.querySelector('.result.kanji');
            if (resultKanji) {
                insertionPoint = resultKanji;
            }
        }
        
        // Fallback: look for the main vbox gap container that holds the kanji display and components
        if (!insertionPoint) {
            const vboxContainers = document.querySelectorAll('.vbox.gap');
            for (const vbox of vboxContainers) {
                // Check if this vbox contains the kanji SVG or mnemonic components
                if (vbox.querySelector('svg.kanji') || vbox.querySelector('.subsection-composed-of-kanji')) {
                    insertionPoint = vbox.parentNode; // Get the parent container instead
                    break;
                }
            }
        }
        
        // Final fallback to main content area
        if (!insertionPoint) {
            insertionPoint = document.querySelector('.container') || document.querySelector('.review-reveal') || document.body;
        }
        
        if (!insertionPoint) {
            console.log('Could not find suitable insertion point for RTK info');
            return;
        }

        // Create the main container
        const container = document.createElement('div');
        container.id = 'rtk-info-container';
        container.style.cssText = `
            margin: 20px 0;
            border: 1px solid var(--table-border-color);
            border-radius: 8px;
            padding: 1rem;
            background-color: var(--foreground-background-color);
        `;

        // Create RTK header
        const header = document.createElement('h6');
        header.className = 'subsection-label';
        header.style.cssText = `
            color: var(--subsection-label-color);
            font-size: 85%;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
        `;
        header.innerHTML = `RTK information ${kanji}`;
        
        container.appendChild(header);

        // Create content container
        const contentDiv = document.createElement('div');
        contentDiv.className = 'subsection';
        contentDiv.style.cssText = `
            padding-left: 0.5rem;
        `;

        // Add keyword
        if (rtkInfo.keyword) {
            const keywordDiv = document.createElement('div');
            keywordDiv.style.cssText = `
                margin-bottom: 0.75rem;
            `;
            keywordDiv.innerHTML = `<strong>Keyword:</strong> <span style="font-size: 110%; color: var(--text-strong-color);">${rtkInfo.keyword}</span>`;
            contentDiv.appendChild(keywordDiv);
        }

        // Add readings if available
        if (rtkInfo.onYomi || rtkInfo.kunYomi) {
            const readingsDiv = document.createElement('div');
            readingsDiv.style.cssText = `
                margin-bottom: 0.75rem;
                font-size: 95%;
            `;
            let readingsHTML = '<strong>Readings:</strong> ';
            if (rtkInfo.onYomi) {
                readingsHTML += `On-Yomi: <span style="font-family: 'Extra Sans JP', 'Noto Sans JP', sans-serif;">${rtkInfo.onYomi}</span>`;
            }
            if (rtkInfo.kunYomi) {
                if (rtkInfo.onYomi) readingsHTML += ' — ';
                readingsHTML += `Kun-Yomi: <span style="font-family: 'Extra Sans JP', 'Noto Sans JP', sans-serif;">${rtkInfo.kunYomi}</span>`;
            }
            readingsDiv.innerHTML = readingsHTML;
            contentDiv.appendChild(readingsDiv);
        }

        // Add elements
        if (rtkInfo.elements) {
            const elementsDiv = document.createElement('div');
            elementsDiv.style.cssText = `
                margin-bottom: 0.75rem;
                font-size: 95%;
            `;
            elementsDiv.innerHTML = `<strong>Elements:</strong> ${rtkInfo.elements}`;
            contentDiv.appendChild(elementsDiv);
        }

        // Add Heisig story
        if (rtkInfo.heisigStory) {
            const storyHeader = document.createElement('h6');
            storyHeader.style.cssText = `
                color: var(--subsection-label-color);
                font-size: 90%;
                margin: 1rem 0 0.5rem 0;
                font-weight: bold;
            `;
            storyHeader.textContent = 'Heisig Story:';
            contentDiv.appendChild(storyHeader);

            const storyDiv = document.createElement('div');
            storyDiv.className = 'mnemonic';
            storyDiv.style.cssText = `
                font-size: 95%;
                line-height: 1.4;
                margin-bottom: 0.75rem;
                text-align: justify;
                text-justify: inter-word;
            `;
            storyDiv.innerHTML = rtkInfo.heisigStory;
            contentDiv.appendChild(storyDiv);
        }

        // Add Heisig comment
        if (rtkInfo.heisigComment) {
            const commentHeader = document.createElement('h6');
            commentHeader.style.cssText = `
                color: var(--subsection-label-color);
                font-size: 90%;
                margin: 1rem 0 0.5rem 0;
                font-weight: bold;
            `;
            commentHeader.textContent = 'Heisig Comment:';
            contentDiv.appendChild(commentHeader);

            const commentDiv = document.createElement('div');
            commentDiv.className = 'mnemonic';
            commentDiv.style.cssText = `
                font-size: 95%;
                line-height: 1.4;
                margin-bottom: 0.75rem;
                text-align: justify;
                text-justify: inter-word;
            `;
            commentDiv.innerHTML = rtkInfo.heisigComment;
            contentDiv.appendChild(commentDiv);
        }

        // Add Koohii stories
        if (rtkInfo.koohiiStories && rtkInfo.koohiiStories.length > 0) {
            const koohiiHeader = document.createElement('h6');
            koohiiHeader.style.cssText = `
                color: var(--subsection-label-color);
                font-size: 90%;
                margin: 1rem 0 0.5rem 0;
                font-weight: bold;
            `;
            koohiiHeader.textContent = 'Koohii Stories:';
            contentDiv.appendChild(koohiiHeader);

            const koohiiContainer = document.createElement('div');
            koohiiContainer.style.cssText = `
                margin-bottom: 0.75rem;
            `;

            rtkInfo.koohiiStories.forEach((story, index) => {
                const storyDiv = document.createElement('div');
                storyDiv.style.cssText = `
                    font-size: 90%;
                    line-height: 1.4;
                    margin-bottom: 0.5rem;
                    padding: 0.5rem;
                    background-color: var(--deeper-background-color);
                    border-radius: 4px;
                    border-left: 3px solid var(--link-color);
                `;
                storyDiv.innerHTML = story;
                koohiiContainer.appendChild(storyDiv);
            });

            contentDiv.appendChild(koohiiContainer);
        }

        container.appendChild(contentDiv);

        // Insert the container after the main kanji content area
        if (insertionPoint.classList && insertionPoint.classList.contains('result') && insertionPoint.classList.contains('kanji')) {
            // Insert after the entire result kanji container (for review pages)
            insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);
        } else if (mnemonicSection && insertionPoint) {
            // For kanji pages, insert after the mnemonic section
            insertionPoint.parentNode.insertBefore(container, insertionPoint.nextSibling);
        } else {
            // Fallback insertion - append to the container
            insertionPoint.appendChild(container);
        }
    }

    function init() {
        // Don't fetch on the front of review cards - only after "Show Answer"
        if (window.location.href.includes('/review') && !document.querySelector('.review-reveal')) {
            return;
        }

        const kanji = extractKanjiFromURL();
        if (kanji) {
            currentKanji = kanji;
            console.log(`Found kanji for RTK lookup: ${kanji}`);
            fetchRTKInfo(kanji);
        }
    }

    // Run on page load
    init();
    
    // Observer for URL changes (for review pages)
    const observer = new MutationObserver(() => {
        if (window.location.href !== observer.lastUrl) {
            observer.lastUrl = window.location.href;
            setTimeout(init, 600); 
        }
    });
    
    observer.lastUrl = window.location.href;
    observer.observe(document, { subtree: true, childList: true });

})();