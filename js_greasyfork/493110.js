
// ==UserScript==
// @name         THide twitter replies
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Hide twitter replies. Does not hide them if made by same author as current tweet, so threads should still work
// @author       Fernando
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493110/THide%20twitter%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/493110/THide%20twitter%20replies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElements() {
        const cells = document.querySelectorAll('[aria-label="Timeline: Conversation"] [data-testid="cellInnerDiv"]');
        let mainTweetNotFound = true;
        let srcProfilePic;
        cells.forEach((cell) => {
            if (cell.querySelector('[data-testid="tweetButtonInline"]')) {
                mainTweetNotFound = false;
                srcProfilePic = cell.querySelector('.css-9pa8cd')?.src;
            } else if ( mainTweetNotFound ) {
                //does nothing, since its a tweet above the main twitter
            } else {
                let srcInCurrent = cell.querySelector('.css-9pa8cd')?.src;
                if ( srcInCurrent === srcProfilePic ) {
                    // does nothing
                } else {
                    cell.style.display = 'none';
                }
            }
        });
    }

    document.addEventListener('DOMContentLoaded', hideElements);

    const observer = new MutationObserver(hideElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();