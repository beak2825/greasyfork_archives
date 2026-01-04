// ==UserScript==
// @name         Auto live chat replay
// @namespace    https://github.com/KoPlayz/userscripts/
// @version      1.1
// @description  Clicks on the YouTube live chat replay button automatically
// @author       https://github.com/KoPlayz
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491046/Auto%20live%20chat%20replay.user.js
// @updateURL https://update.greasyfork.org/scripts/491046/Auto%20live%20chat%20replay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function clickLiveChatButton() {
        var liveChatButton = document.querySelector('.ytd-live-chat-frame.style-scope > yt-button-shape > .yt-spec-button-shape-next--size-m.yt-spec-button-shape-next--mono.yt-spec-button-shape-next--outline.yt-spec-button-shape-next > yt-touch-feedback-shape > .yt-spec-touch-feedback-shape--touch-response.yt-spec-touch-feedback-shape > .yt-spec-touch-feedback-shape__fill');
        if (liveChatButton) {
            liveChatButton.click();
        }
    }

    function observePageChanges() {
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    clickLiveChatButton();
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Start observing page changes
    observePageChanges();
})();
