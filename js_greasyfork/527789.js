// ==UserScript==
// @name         YouTube Transcript Copier
// @match        https://www.youtube.com/watch*
// @license      MIT
// @grant        none
// @version      1.0
// @author       Amir Tehrani
// @description  Adds a styled button to copy the YouTube video transcript, with a timestamp toggle
// @namespace    https://greasyfork.org/
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/527789/YouTube%20Transcript%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/527789/YouTube%20Transcript%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;
    let currentURL = window.location.href;
    let insertionAttempts = 0;
    const maxAttempts = 20;
    let retryInterval = null;
    let includeTimestamps = false; // Default: no timestamps
    let copyButton = null;
    let buttonTextNode = null;
    let transcriptPanelTimeout = null; // Timeout for panel loading
    let transcriptButtonTimeout = null; // Timeout for the "Show transcript" button

    function createTranscriptButton() {
        if (document.getElementById('show-transcript-button')) {
            return true;
        }

        copyButton = document.createElement('button');
        copyButton.id = 'show-transcript-button';
        copyButton.classList.add('yt-transcript-button');
        copyButton.setAttribute('aria-label', 'Copy Transcript'); // Accessibility

        buttonTextNode = document.createTextNode('Copy Transcript');
        copyButton.appendChild(buttonTextNode);

        const timestampSpan = document.createElement('span');
        timestampSpan.id = 'timestamp-toggle';
        timestampSpan.textContent = ' (No Time)';
        timestampSpan.style.cssText = `
            font-size: 0.75em;
            margin-left: 6px;
            color: rgba(255, 255, 255, 0.7);
            cursor: pointer;
            user-select: none;
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 12px;
            padding: 3px 6px;
            display: inline-block;
            vertical-align: middle;
            transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
            background-color: rgba(0, 0, 0, 0.1);
        `;

        timestampSpan.addEventListener('mouseover', function() {
            this.style.borderColor = 'rgba(255, 255, 255, 0.9)';
            this.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
        });
        timestampSpan.addEventListener('mouseout', function() {
            this.style.borderColor = includeTimestamps ? 'white' : 'rgba(255, 255, 255, 0.3)';
            this.style.backgroundColor = includeTimestamps ? 'rgba(0,0,0, 0.4)' : 'rgba(0, 0, 0, 0.1)';
        });

        copyButton.appendChild(timestampSpan);

        timestampSpan.addEventListener('click', function(event) {
            event.stopPropagation(); // Prevent main button click
            includeTimestamps = !includeTimestamps;
            this.textContent = includeTimestamps ? ' (Time)' : ' (No Time)';
            this.style.color = includeTimestamps ? 'white' : 'rgba(255, 255, 255, 0.7)';
            this.style.borderColor = includeTimestamps ? 'white' : 'rgba(255, 255, 255, 0.3)';
            this.style.backgroundColor = includeTimestamps ? 'rgba(0,0,0, 0.4)' : 'rgba(0, 0, 0, 0.1)';
        });

        copyButton.addEventListener('click', handleCopyClick);

        function insertButton() {
            const potentialTargets = [
                '#description #top-level-buttons-computed',
                '#top-row.ytd-watch-metadata',
                '#above-the-fold',
                '#meta-contents',
                '#primary-inner'
            ];

            for (const targetSelector of potentialTargets) {
                const targetElement = document.querySelector(targetSelector);
                if (targetElement) {
                    targetElement.parentNode.insertBefore(copyButton, targetElement.nextSibling);
                    injectStyles();
                    return true;
                }
            }
            return false;
        }

        return insertButton();
    }

    function handleCopyClick() {
        updateButtonText('Copy Transcript');

        const moreActionsButton = document.querySelector('button[aria-label="More actions"]');
        if (moreActionsButton) {
            moreActionsButton.click();
        }

        const buttonIntervalId = setInterval(() => {
            const transcriptButton = document.querySelector('[aria-label="Show transcript"]');
            if (transcriptButton) {
                transcriptButton.click();
                clearInterval(buttonIntervalId);
                clearTimeout(transcriptButtonTimeout);

                const panelIntervalId = setInterval(() => {
                    const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"] #content');
                    if (transcriptPanel && transcriptPanel.querySelector('ytd-transcript-segment-renderer')) {
                        clearInterval(panelIntervalId);
                        clearTimeout(transcriptPanelTimeout);
                        copyTranscriptText(transcriptPanel);
                    }
                }, 100);

                transcriptPanelTimeout = setTimeout(() => {
                    clearInterval(panelIntervalId);
                    console.error("Transcript panel or segments not found after timeout.");
                    if (copyButton) {
                        updateButtonText("Transcript Not Found");
                        copyButton.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
                    }
                }, 15000);
            }
        }, 250);

        transcriptButtonTimeout = setTimeout(() => {
            clearInterval(buttonIntervalId);
            if (copyButton) {
                updateButtonText("Transcript Not Found")
                copyButton.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
            }
            console.error("Transcript button not found after timeout.");
        }, 10000);
    }

    function copyTranscriptText(transcriptPanel) {
        if (!transcriptPanel) {
            console.error("Transcript container not found.");
            updateButtonText("Error");
            return;
        }

        let transcriptText = "";

        if (includeTimestamps) {
            transcriptPanel.querySelectorAll('ytd-transcript-segment-renderer').forEach(line => {
                const timestampElement = line.querySelector('.segment-timestamp');
                const textElement = line.querySelector('.segment-text');
                if (timestampElement && textElement) {
                    transcriptText += timestampElement.textContent.trim() + " " + textElement.textContent.trim() + "\n";
                }
            });
        } else {
            transcriptPanel.querySelectorAll('.segment-text').forEach(segment => {
                transcriptText += segment.textContent.trim() + " ";
            });
        }

        navigator.clipboard.writeText(transcriptText)
            .then(() => {
              updateButtonText("Copied!");
            })
            .catch(err => {
                console.error('Failed to copy transcript:', err);
                if (copyButton) {
                    updateButtonText("Copy Failed");
                    copyButton.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
                }
            });
    }

    function updateButtonText(text) {
        if (copyButton && buttonTextNode) {
            buttonTextNode.textContent = text;
            if (text === "Copied!") {
                copyButton.style.backgroundColor = "rgba(40, 167, 69, 0.9)";
                  setTimeout(() => {
                        buttonTextNode.textContent = 'Copy Transcript';
                         copyButton.style.backgroundColor = 'rgba(0, 123, 255, 0.8)';

                         const timestampToggle = document.getElementById('timestamp-toggle');
                         timestampToggle.textContent = includeTimestamps ? ' (Time)' : ' (No Time)';
                         timestampToggle.style.color = includeTimestamps ? 'white' : 'rgba(255, 255, 255, 0.7)';
                         timestampToggle.style.borderColor = includeTimestamps ? 'white' : 'rgba(255, 255, 255, 0.3)';
                         timestampToggle.style.backgroundColor = includeTimestamps ? 'rgba(0,0,0, 0.4)' : 'rgba(0, 0, 0, 0.1)';

                    }, 1500);
            } else if (text.startsWith("Error") || text === "Copy Failed" || text === "Transcript Not Found") {
                 copyButton.style.backgroundColor = "rgba(220, 53, 69, 0.8)";
            }
        }
    }

    function injectStyles() {
        if (document.getElementById('yt-transcript-button-styles')) return;

        const style = document.createElement('style');
        style.id = 'yt-transcript-button-styles';
        style.textContent = `
            .yt-transcript-button {
                background-color: rgba(0, 123, 255, 0.8);
                border: none;
                color: white;
                padding: 10px 18px;
                text-align: center;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                font-size: 15px;
                margin: 4px 2px;
                cursor: pointer;
                border-radius: 24px;
                transition: all 0.2s ease;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                font-family: 'Roboto', sans-serif;
                font-weight: 500;
                position: relative;
                overflow: hidden;
                will-change: transform, box-shadow, background-color;
            }

            .yt-transcript-button:hover {
                background-color: rgba(0, 90, 180, 0.9);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
                transform: translateY(-1px);
            }

            .yt-transcript-button:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.3);
            }

            .yt-transcript-button:active {
                background-color: rgba(0, 60, 120, 0.9);
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                transform: translateY(1px);
            }

            .yt-transcript-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 0 0, rgba(255, 255, 255, 0.4) 10%, transparent 10.01%);
                background-size: 0 0;
                opacity: 0;
                pointer-events: none;
                transition: background-size 0.4s ease, opacity 0.4s ease, background-position 0.4s ease;
            }

            .yt-transcript-button:active::before {
                background-size: 200% 200%;
                opacity: 1;
                transition: background-size 0.4s ease, opacity 0.4s ease;
            }
        `;
        document.head.appendChild(style);

        copyButton.addEventListener('mousedown', function(event) {
            const rect = copyButton.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            copyButton.style.setProperty('--ripple-x', x + 'px');
            copyButton.style.setProperty('--ripple-y', y + 'px');
            copyButton.style.background = `radial-gradient(circle at var(--ripple-x) var(--ripple-y), rgba(255, 255, 255, 0.4) 10%, transparent 10.01%)`;
        });

        copyButton.addEventListener('mouseup', function(event){
            copyButton.style.background = null;
        });

        copyButton.addEventListener("mouseleave", function(event) {
            copyButton.style.background = null;
        });
    }

    function attemptButtonCreation() {
        insertionAttempts++;
        if (createTranscriptButton() || insertionAttempts >= maxAttempts) {
            clearInterval(retryInterval);
            retryInterval = null;
            if (insertionAttempts >= maxAttempts) {
                console.error('Could not insert the button after multiple attempts.');
            }
        }
    }

    function setupObserver() {
        if (observer) observer.disconnect();
        observer = new MutationObserver(handleMutations);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleMutations(mutations) {
        if (window.location.href !== currentURL) {
            currentURL = window.location.href;
            resetState();
            startProcess();
        }
    }

    function resetState() {
        if (document.getElementById('show-transcript-button')) {
            document.getElementById('show-transcript-button').remove();
        }
        insertionAttempts = 0;
        if (retryInterval) {
            clearInterval(retryInterval);
            retryInterval = null;
        }
        clearTimeout(transcriptPanelTimeout);
        clearTimeout(transcriptButtonTimeout);
        transcriptPanelTimeout = null;
        transcriptButtonTimeout = null;

        if (observer) {
          observer.disconnect();
          observer = null;
        }

        copyButton = null;
        buttonTextNode = null;
    }

    function startProcess() {
        if (!createTranscriptButton()) {
            retryInterval = setInterval(attemptButtonCreation, 500);
        }
        setupObserver();
    }

    startProcess();
})();
