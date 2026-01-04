// ==UserScript==
// @name         LRCLIB Lyrics Copier
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a “Copy Lyrics” button to quickly copy any lyrics from LRCLIB.
// @author       weebsauce
// @license      MIT
// @match        *://*lrclib.net/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/526217/LRCLIB%20Lyrics%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/526217/LRCLIB%20Lyrics%20Copier.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ------------------------------------------------------------
    // Function to copy the lyrics text to the clipboard
    // ------------------------------------------------------------
    function copyLyrics() {
        // Selector for the lyrics element
        const lyricsSelector = '.grow.rounded.bg-indigo-50.text-indigo-900.whitespace-pre-line.p-4.overflow-scroll';
        const lyricsEl = document.querySelector(lyricsSelector);

        if (!lyricsEl) {
            alert("Lyrics element not found!");
            return;
        }

        const lyrics = lyricsEl.innerText.trim();

        // Use GM_setClipboard if available
        if (typeof GM_setClipboard === 'function') {
            GM_setClipboard(lyrics);
            alert("Lyrics copied to clipboard!");
        } else if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(lyrics)
                .then(() => alert("Lyrics copied to clipboard!"))
                .catch(err => {
                    console.error("Failed to copy lyrics: ", err);
                    alert("Failed to copy lyrics. See console for details.");
                });
        } else {
            // Fallback: temporary textarea + execCommand
            const textArea = document.createElement("textarea");
            textArea.value = lyrics;
            textArea.style.top = "0";
            textArea.style.left = "0";
            textArea.style.position = "fixed";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                const successful = document.execCommand('copy');
                alert(successful ? "Lyrics copied to clipboard!" : "Failed to copy lyrics.");
            } catch (err) {
                console.error("Error copying lyrics: ", err);
                alert("Error copying lyrics. See console for details.");
            }
            document.body.removeChild(textArea);
        }
    }

    // ------------------------------------------------------------
    // Function to create a new copy button with the site styling
    // ------------------------------------------------------------
    function createCopyButton() {
        const btn = document.createElement('button');
        btn.innerText = 'Copy Lyrics';
        // Apply the site's button classes
        btn.className = 'button button-normal py-2 px-8 rounded-full';
        // Add a little margin so it sits nicely next to the "Close" button
        btn.style.marginLeft = '0.5rem';
        // Mark this button so we know it's already been added
        btn.dataset.copyLyricsButton = 'true';
        btn.addEventListener('click', copyLyrics);
        return btn;
    }

    // ------------------------------------------------------------
    // Insert the copy button into the given modal container.
    // It looks for a button with text "Close" and inserts after it;
    // otherwise, it appends the button at the end.
    // ------------------------------------------------------------
    function insertButtonIntoModal(modalContainer) {
        const newCopyButton = createCopyButton();
        // Look for a "Close" button (ignoring case)
        const closeButton = Array.from(modalContainer.querySelectorAll('button'))
            .find(btn => btn.textContent.trim().toLowerCase() === 'close');
        if (closeButton) {
            closeButton.parentNode.insertBefore(newCopyButton, closeButton.nextSibling);
        } else {
            modalContainer.appendChild(newCopyButton);
        }
    }

    // ------------------------------------------------------------
    // Check if the given node (or any of its descendants) is a modal container
    // that needs a copy button.
    // ------------------------------------------------------------
    function checkAndInsertButton(node) {
        const modalSelector = '.fixed.top-0.left-0.h-full.w-full.flex.items-center.justify-center.z-30.p-4';
        // If the node itself is a modal container…
        if (node.matches && node.matches(modalSelector)) {
            if (!node.querySelector('[data-copy-lyrics-button="true"]')) {
                insertButtonIntoModal(node);
            }
        }
        // …and if it contains any modal containers:
        const modals = node.querySelectorAll(modalSelector);
        modals.forEach(modal => {
            if (!modal.querySelector('[data-copy-lyrics-button="true"]')) {
                insertButtonIntoModal(modal);
            }
        });
    }

    // ------------------------------------------------------------
    // MutationObserver callback to check for modal container additions.
    // ------------------------------------------------------------
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(addedNode => {
                if (addedNode.nodeType === 1) { // element nodes only
                    checkAndInsertButton(addedNode);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // ------------------------------------------------------------
    // Initial check in case the modal is already present.
    // ------------------------------------------------------------
    (function initialCheck() {
        const modalSelector = '.fixed.top-0.left-0.h-full.w-full.flex.items-center.justify-center.z-30.p-4';
        document.querySelectorAll(modalSelector).forEach(modal => {
            if (!modal.querySelector('[data-copy-lyrics-button="true"]')) {
                insertButtonIntoModal(modal);
            }
        });
    })();
})();
