// ==UserScript==
// @name         YouTube Comment to Twitter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a button to YouTube watch pages to easily tweet a comment with the video link.
// @author       torch
// @match        *://www.youtube.com/watch*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535571/YouTube%20Comment%20to%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/535571/YouTube%20Comment%20to%20Twitter.meta.js
// ==/UserScript==

(function() {
    'use_strict';

    // --- Configuration ---
    const BUTTON_TEXT = "🐦 Твитнуть комментарий";
    const POPUP_TITLE = "Написать твит о видео";
    const TWITTER_MAX_LENGTH = 280; // Standard Twitter limit
    const TWITTER_URL_LENGTH = 23; // Standard length consumed by a t.co URL

    // --- Styles ---
    GM_addStyle(`
        #yt-comment-to-twitter-btn {
            background-color: #1DA1F2;
            color: white;
            border: none;
            padding: 8px 12px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 20px;
            font-weight: bold;
        }
        #yt-comment-to-twitter-btn:hover {
            background-color: #0c85d0;
        }
        .twitter-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .twitter-popup-content {
            background-color: #1e1e1e; /* Darker theme for YouTube dark mode */
            color: #e0e0e0;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
            width: 400px;
            max-width: 90%;
            z-index: 9999;
        }
        .twitter-popup-content h3 {
            margin-top: 0;
            color: #1DA1F2;
        }
        .twitter-popup-content textarea {
            width: calc(100% - 20px);
            height: 100px;
            margin-bottom: 10px;
            padding: 10px;
            border: 1px solid #555;
            border-radius: 4px;
            background-color: #2a2a2a;
            color: #e0e0e0;
            resize: vertical;
        }
        .twitter-popup-content .char-counter {
            text-align: right;
            font-size: 0.9em;
            color: #aaa;
            margin-bottom: 10px;
        }
        .twitter-popup-content button {
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 10px;
        }
        .twitter-popup-content .tweet-btn {
            background-color: #1DA1F2;
            color: white;
        }
        .twitter-popup-content .tweet-btn:hover {
            background-color: #0c85d0;
        }
        .twitter-popup-content .cancel-btn {
            background-color: #555;
            color: white;
        }
        .twitter-popup-content .cancel-btn:hover {
            background-color: #777;
        }
    `);

    let popupOverlay = null;

    // getVideoTitle is not needed for the tweet content anymore, but kept in case it's useful for other features later.
    // function getVideoTitle() {
    //     const titleElement = document.querySelector('h1.ytd-video-primary-info-renderer yt-formatted-string, h1.title.ytd-video-primary-info-renderer');
    //     return titleElement ? titleElement.textContent.trim() : "YouTube Video";
    // }

    function getVideoUrl() {
        return window.location.href;
    }

    function createPopup() {
        if (popupOverlay) {
            popupOverlay.style.display = 'flex'; // Show if already created
            if (popupOverlay.querySelector('textarea')) {
                popupOverlay.querySelector('textarea').focus();
            }
            return;
        }

        popupOverlay = document.createElement('div');
        popupOverlay.className = 'twitter-popup-overlay';
        popupOverlay.onclick = function(e) {
            if (e.target === popupOverlay) {
                closePopup();
            }
        };

        const popupContent = document.createElement('div');
        popupContent.className = 'twitter-popup-content';

        const title = document.createElement('h3');
        title.textContent = POPUP_TITLE;

        const textarea = document.createElement('textarea');
        textarea.placeholder = "Ваш комментарий...";

        const charCounter = document.createElement('div');
        charCounter.className = 'char-counter';
        const updateCharCounter = () => {
            // The tweet will consist of the comment, a space, and the URL.
            // Twitter uses t.co to shorten URLs, which takes up a fixed number of characters.
            const lengthOfComment = textarea.value.length;
            const lengthOfSpaceAndUrl = (lengthOfComment > 0 ? 1 : 0) + TWITTER_URL_LENGTH; // Add space only if comment exists
            const remaining = TWITTER_MAX_LENGTH - lengthOfComment - lengthOfSpaceAndUrl;
            charCounter.textContent = `${remaining} символов осталось`;
            charCounter.style.color = remaining < 0 ? 'red' : '#aaa';
        };
        textarea.addEventListener('input', updateCharCounter);


        const tweetButton = document.createElement('button');
        tweetButton.textContent = "Твитнуть";
        tweetButton.className = 'tweet-btn';
        tweetButton.onclick = function() {
            const comment = textarea.value.trim();
            // Comment can be empty, in which case only the URL is tweeted via the 'url' parameter.
            // Twitter usually pre-fills the text field with the URL if the text parameter is empty.

            const videoUrl = getVideoUrl();

            // Construct tweet text: only the comment.
            // The videoUrl will be passed in the 'url' parameter of the Twitter intent.
            // Twitter will append the URL to the comment text.
            let tweetText = comment;

            const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(videoUrl)}`;

            window.open(twitterIntentUrl, '_blank');
            closePopup();
        };

        const cancelButton = document.createElement('button');
        cancelButton.textContent = "Отмена";
        cancelButton.className = 'cancel-btn';
        cancelButton.onclick = closePopup;

        popupContent.appendChild(title);
        popupContent.appendChild(textarea);
        popupContent.appendChild(charCounter);
        popupContent.appendChild(tweetButton);
        popupContent.appendChild(cancelButton);
        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);

        // Initialize counter
        updateCharCounter();
        textarea.focus();
    }

    function closePopup() {
        if (popupOverlay) {
            // Clear textarea for next time
            const textarea = popupOverlay.querySelector('textarea');
            if (textarea) {
                textarea.value = '';
            }
            popupOverlay.style.display = 'none';
        }
    }

    function addButton() {
        // More robust selectors for YouTube's dynamic layout
        const commonActionSelectors = [
            '#actions-inner #menu', // Older layout under video
            '#menu-container.ytd-watch-metadata', // Older layout alternative
            'ytd-video-actions #actions', // Newer layout for like/dislike etc.
            '#actions.ytd-watch-flexy' // Common actions row
        ];
        const fallbackSelectors = [
            '#info-contents #top-row.ytd-watch-info-text',
            '#meta-contents #info-contents',
            '#meta-contents #info',
            '#owner #subscribe-button' // As a last resort, place it near subscribe
        ];

        let actionsContainer = null;
        for (const selector of commonActionSelectors) {
            actionsContainer = document.querySelector(selector);
            if (actionsContainer) break;
        }

        if (!actionsContainer) {
            for (const selector of fallbackSelectors) {
                actionsContainer = document.querySelector(selector);
                if (actionsContainer) break;
            }
        }

        if (actionsContainer) {
            if (actionsContainer.querySelector('#yt-comment-to-twitter-btn')) {
                return; // Button already exists
            }

            const twitterButton = document.createElement('button');
            twitterButton.id = 'yt-comment-to-twitter-btn';
            twitterButton.textContent = BUTTON_TEXT;
            twitterButton.onclick = createPopup;

            // Attempt to insert it in a reasonable place
            if (actionsContainer.id === 'actions' && actionsContainer.parentElement?.tagName === 'YTD-VIDEO-ACTIONS') {
                // Preferred: Add next to like/share buttons
                 actionsContainer.insertBefore(twitterButton, actionsContainer.children[Math.min(2, actionsContainer.children.length)]);
            } else if (actionsContainer.firstChild) {
                 actionsContainer.insertBefore(twitterButton, actionsContainer.firstChild.nextSibling);
            } else {
                actionsContainer.appendChild(twitterButton);
            }
            // console.log("YouTube Comment to Twitter button added to:", actionsContainer);
        } else {
            // console.warn("Could not find a suitable container for the Twitter button after multiple attempts.");
        }
    }

    // YouTube uses dynamic loading, so we need to observe DOM changes
    function observeDOM() {
        const targetNode = document.body;
        const config = { childList: true, subtree: true };
        let lastPathname = window.location.pathname;
        let debounceTimer;

        const handleMutation = () => {
            // Try to add the button if it's not there
            if (!document.querySelector('#yt-comment-to-twitter-btn')) {
                addButton();
            }
        };

        const callback = function(mutationsList, observer) {
            // Check if navigation has happened to a new watch page
            if (window.location.pathname !== lastPathname && window.location.pathname.includes("/watch")) {
                lastPathname = window.location.pathname;
                // Wait a bit for the new page to load elements
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(handleMutation, 1000);
                return;
            }

            // General check for dynamic content loading on the current page
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if a potential container is now available
                    if (document.querySelector('#actions-inner #menu, #menu-container.ytd-watch-metadata, ytd-video-actions #actions, #actions.ytd-watch-flexy') && !document.querySelector('#yt-comment-to-twitter-btn')) {
                        clearTimeout(debounceTimer);
                        debounceTimer = setTimeout(handleMutation, 300); // Debounce to avoid multiple rapid adds
                        break;
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);

        // Initial attempt in case the element is already there
        if (window.location.pathname.includes("/watch")) {
           setTimeout(addButton, 1000); // Initial delay for page load
        }
    }

    // Make sure the script runs after the page is mostly loaded
    if (document.readyState === "complete" || document.readyState === "interactive") {
        observeDOM();
    } else {
        window.addEventListener('DOMContentLoaded', observeDOM);
    }

})();