// ==UserScript==
// @name         YouTube Transcript Copier
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  Adds a 'Copy Transcript' button to the action bar (Like/Dislike/Share) and copies YouTube video transcripts with timestamps. Auto-expands description.
// @author       MrPickleMna
// @match        https://www.youtube.com/watch*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534523/YouTube%20Transcript%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/534523/YouTube%20Transcript%20Copier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const OUR_BUTTON_ID = 'pragmatic-copy-transcript-button';
    const ACTION_BUTTONS_CONTAINER_SELECTOR = '#top-level-buttons-computed';
    const LIKE_DISLIKE_SELECTOR = 'segmented-like-dislike-button-view-model';
    const SHOW_TRANSCRIPT_SELECTOR = 'ytd-video-description-transcript-section-renderer button[aria-label="Show transcript"]';
    const EXPAND_DESC_SELECTOR = '#description-inline-expander #expand';
    const TRANSCRIPT_PANEL_SELECTOR = 'ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]';
    const OBSERVER_TARGET_SELECTOR = '#below';

    console.log('YouTube Transcript Copier: Script initiated (v1.3.0 - Action Bar Button).');

    function copyTranscript() {
        console.log('Copy Transcript button clicked.');

        const showTranscriptButtonOriginal = document.querySelector(SHOW_TRANSCRIPT_SELECTOR);

        if (!showTranscriptButtonOriginal) {
            console.error("[Copy Transcript] Could not find the *original* 'Show transcript' button in the description area to open the panel.");
            alert("Error: Could not find the 'Show transcript' button in the description section. Ensure the description is expanded and the button exists.");
            return;
        }

        showTranscriptButtonOriginal.click();
        console.log("[Copy Transcript] 'Show transcript' button (original in description) clicked programmatically.");

        const maxAttempts = 20;
        let attempts = 0;
        const intervalId = setInterval(() => {
            const transcriptPanel = document.querySelector(TRANSCRIPT_PANEL_SELECTOR);
            if (transcriptPanel && transcriptPanel.querySelector('ytd-transcript-segment-list-renderer')) {
                clearInterval(intervalId);
                console.log('[Copy Transcript] Transcript panel found and appears loaded:', transcriptPanel);
                let transcriptText = '';
                const segments = transcriptPanel.querySelectorAll('ytd-transcript-segment-renderer');
                if (segments && segments.length > 0) {
                    segments.forEach(segment => {
                        const timestampEl = segment.querySelector('.segment-timestamp');
                        const textEl = segment.querySelector('yt-formatted-string.segment-text');
                        if (timestampEl && textEl) {
                            const timestamp = timestampEl.innerText.trim();
                            const text = textEl.innerText.trim();
                            transcriptText += `${timestamp} ${text}\n`;
                        } else {
                            transcriptText += `${segment.innerText.trim()}\n`;
                        }
                    });
                    transcriptText = transcriptText.trim();
                    console.log(`[Copy Transcript] Extracted text from ${segments.length} segments.`);
                } else {
                    console.warn("[Copy Transcript] Could not find transcript segments, falling back to innerText of the panel.");
                    transcriptText = transcriptPanel.innerText.trim();
                }

                if (transcriptText) {
                    GM_setClipboard(transcriptText, 'text');
                    console.log('[Copy Transcript] Transcript copied to clipboard.');
                    alert('Transcript copied to clipboard!');
                } else {
                    console.error('[Copy Transcript] Transcript panel found, but no text content detected after processing.');
                    alert('Error: Transcript panel loaded but appears empty or could not extract text.');
                }
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    console.error('[Copy Transcript] Timed out waiting for transcript panel to load content.');
                    alert('Error: Timed out waiting for transcript panel.');
                }
            }
        }, 500);
    }

    function addCopyButtonIfMissing() {
        if (document.getElementById(OUR_BUTTON_ID)) {
            return;
        }

        const expandButton = document.querySelector(EXPAND_DESC_SELECTOR);
        if (expandButton && expandButton.offsetParent !== null) {
            console.log('[Add Button] Found "...more" description button. Clicking it.');
            expandButton.click();
            return;
        }

        const actionButtonsContainer = document.querySelector(ACTION_BUTTONS_CONTAINER_SELECTOR);
        const likeDislikeGroup = actionButtonsContainer?.querySelector(LIKE_DISLIKE_SELECTOR);

        if (actionButtonsContainer && likeDislikeGroup) {
            if (document.getElementById(OUR_BUTTON_ID)) {
                return;
            }
            console.log('[Add Button] Found action buttons container and like/dislike group. Preparing to insert button.');

            const copyButton = document.createElement('button');
            copyButton.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading';
            copyButton.id = OUR_BUTTON_ID;
            copyButton.title = 'Copy video transcript';
            copyButton.style.marginLeft = '8px';
            copyButton.style.marginRight = '8px';

            const textDiv = document.createElement('div');
            textDiv.className = 'yt-spec-button-shape-next__button-text-content';
            const textSpan = document.createElement('span');
            textSpan.className = 'yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap';
            textSpan.setAttribute('role', 'text');
            textSpan.innerText = 'Copy Transcript';
            textDiv.appendChild(textSpan);
            copyButton.appendChild(textDiv);

            copyButton.addEventListener('click', copyTranscript);

            likeDislikeGroup.parentNode.insertBefore(copyButton, likeDislikeGroup.nextSibling);
            console.log('[Add Button] "Copy Transcript" button inserted into action bar.');

        } else {

        }
    }

    console.log('YouTube Transcript Copier: Setting up MutationObserver.');
    let observer = null;

    function startObserver() {
        if (observer) {
            observer.disconnect();
        }

        const targetNode = document.querySelector(OBSERVER_TARGET_SELECTOR);
        if (targetNode) {
            observer = new MutationObserver((mutationsList, obs) => {
                window.requestAnimationFrame(addCopyButtonIfMissing);
            });
            observer.observe(targetNode, {
                childList: true,
                subtree: true
            });
            window.requestAnimationFrame(addCopyButtonIfMissing);
        } else {
            console.log(`[Observer] Target node '${OBSERVER_TARGET_SELECTOR}' not found. Retrying in 1 second...`);
            setTimeout(startObserver, 1000);
        }
    }

    setTimeout(startObserver, 1000);

    document.addEventListener('yt-navigate-finish', (event) => {
        console.log('[Navigation] Detected yt-navigate-finish event. Re-running setup.');
        setTimeout(startObserver, 500);
    });

    window.addEventListener('popstate', () => {
        console.log('[Navigation] Detected popstate event. Re-running setup.');
        setTimeout(startObserver, 500);
    });

})();