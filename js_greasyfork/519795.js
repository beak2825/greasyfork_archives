// ==UserScript==
// @name         Copy Genius Lyrics
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button to copy lyrics from Genius.com with proper formatting
// @match        https://genius.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519795/Copy%20Genius%20Lyrics.user.js
// @updateURL https://update.greasyfork.org/scripts/519795/Copy%20Genius%20Lyrics.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /** Error logging */
    const logError = (error, context) => console.error(`[Copy Genius Lyrics] Error in ${context}:`, error);

    /** Recursively processes nodes to extract text while preserving structure */
    const processNode = (node) => {
        let result = '';

        for (const child of node.childNodes) {
            if (child.nodeType === Node.TEXT_NODE) {
                result += child.textContent;
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // Skip elements marked for exclusion
                if (child.getAttribute('data-exclude-from-selection') === 'true') {
                    continue;
                }

                // Handle line breaks and paragraph-like elements
                const tagName = child.tagName?.toLowerCase();
                if (tagName === 'br') {
                    result += '\n';
                } else if (['div', 'p', 'span'].includes(tagName) && child.className?.includes('Lyrics__Container')) {
                    // Process lyrics container content
                    const childText = processNode(child);
                    if (childText.trim()) {
                        result += childText;
                        // Add line break if this container doesn't end with one
                        if (!result.endsWith('\n')) {
                            result += '\n';
                        }
                    }
                } else {
                    result += processNode(child);
                }
            }
        }

        return result;
    };

    /** Copies lyrics to clipboard with proper formatting */
    const copyLyrics = () => {
        try {
            const lyricsContainers = document.querySelectorAll('[data-lyrics-container="true"]');

            if (lyricsContainers.length === 0) {
                showNotification('No lyrics found.');
                return;
            }

            let lyrics = '';

            lyricsContainers.forEach((container, index) => {
                const containerText = processNode(container).trim();

                if (containerText) {
                    lyrics += containerText;
                    // Add double line break between sections, but not after the last one
                    if (index < lyricsContainers.length - 1) {
                        lyrics += '\n\n';
                    }
                }
            });

            // Clean up extra whitespace while preserving intentional line breaks
            lyrics = lyrics
                .replace(/\n{3,}/g, '\n\n') // Replace 3+ line breaks with double
                .replace(/[ \t]+/g, ' ') // Replace multiple spaces/tabs with single space
                .replace(/[ \t]*\n[ \t]*/g, '\n') // Remove spaces around line breaks
                .trim();

            if (!lyrics) {
                showNotification('No lyrics content found.');
                return;
            }

            navigator.clipboard.writeText(lyrics)
                .then(() => showNotification('Lyrics copied!'))
                .catch(error => {
                    logError(error, 'copyLyrics (clipboard)');
                    showNotification('Failed to copy.');
                });

        } catch (error) {
            logError(error, 'copyLyrics');
            showNotification('An error occurred.');
        }
    };

    /** Displays a notification message */
    const showNotification = (message) => {
        try {
            const notification = document.createElement('div');
            notification.className = 'copy-lyrics-notification';
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 500);
            }, 2000);
        } catch (error) {
            logError(error, 'showNotification');
        }
    };

    /** Initializes the copy button and injects it into the DOM */
    const initCopyButton = () => {
        try {
            const headerContainer = document.querySelector('div[class*="LyricsHeader__Container"]');
            if (!headerContainer) {
                logError('Target container not found (LyricsHeader__Container)', 'DOM initialization');
                return;
            }

            if (document.querySelector('#copy-lyrics-button')) return; // Avoid duplicate buttons

            const button = document.createElement('button');
            button.id = 'copy-lyrics-button';
            button.textContent = 'Copy Lyrics';
            button.addEventListener('click', copyLyrics);
            headerContainer.appendChild(button);
        } catch (error) {
            logError(error, 'initCopyButton');
        }
    };

    /** Injects custom styles for the button and notification */
    const injectStyles = () => {
        GM_addStyle(`
            #copy-lyrics-button {
                margin-left: 10px;
                padding: 8px 15px;
                font-size: 14px;
                background-color: #1db954;
                color: white;
                border: none;
                border-radius: 5px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: background-color 0.2s ease-in-out;
                order: -1;
            }

            #copy-lyrics-button:hover {
                background-color: #1ed760;
            }

            .copy-lyrics-notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px 20px;
                background-color: #1db954;
                color: white;
                font-size: 14px;
                border-radius: 5px;
                opacity: 0;
                animation: fadeInOut 2.5s forwards;
                z-index: 1000;
            }

            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateY(20px); }
                10% { opacity: 1; transform: translateY(0); }
                90% { opacity: 1; transform: translateY(0); }
                100% { opacity: 0; transform: translateY(20px); }
            }
        `);
    };

    /** Initializes the script */
    const init = () => {
        injectStyles();
        initCopyButton();
    };

    // Run script after page load
    window.addEventListener('load', init);
})();