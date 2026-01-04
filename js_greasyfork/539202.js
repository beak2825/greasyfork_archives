// ==UserScript==
// @name         Hide/Show YouTube Comments Button
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  A button to show or hide YouTube comments.
// @author       Thnh01
// @license      GPL-3.0
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539202/HideShow%20YouTube%20Comments%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/539202/HideShow%20YouTube%20Comments%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* This is the key rule: Hide the #comments element when this class is on the body */
            body.yt-comments-hidden #comments {
                display: none;
            }

            /* Styling for our toggle button to match YouTube's look */
            .yt-toggle-comments-button {
                background-color: #d9d9d9;
                color: var(--yt-spec-brand-button-text);
                border: none;
                border-radius: 18px;
                padding: 9px 16px;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                margin-top: 12px;
                margin-bottom: 16px; /* A little more space at the bottom */
            }

            /* Make sure the button looks good in dark mode */
            html[dark="true"] .yt-toggle-comments-button {
                 background-color: var(--yt-spec-button-chip-background-hover);
                 color: var(--yt-spec-text-primary);
            }
        `;
        document.head.appendChild(style);
    }

    function setupCommentToggleButton() {
        const commentsSection = document.querySelector("#comments");
        if (!commentsSection || document.querySelector('.yt-toggle-comments-button')) {
            return;
        }

        const toggleButton = document.createElement('button');
        toggleButton.className = 'yt-toggle-comments-button';

        document.body.classList.add('yt-comments-hidden');
        toggleButton.textContent = 'Show Comments';

        toggleButton.addEventListener('click', () => {
            const isHidden = document.body.classList.toggle('yt-comments-hidden');

            toggleButton.textContent = isHidden ? 'Show Comments' : 'Hide Comments';
        });

        commentsSection.parentNode.insertBefore(toggleButton, commentsSection);
    }

    function observeForComments() {
        const observer = new MutationObserver((mutationsList, obs) => {
            if (document.querySelector("#comments")) {
                setupCommentToggleButton();
                obs.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    injectStyles();

    window.addEventListener('yt-navigate-finish', observeForComments);

    observeForComments();

})();