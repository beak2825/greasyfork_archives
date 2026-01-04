// ==UserScript==
// @name         Mangalib Infinite Scroll
// @version      0.7.3
// @description  Infinite scroll on chat mangalib.me
// @author       reiwsan
// @match        https://mangalib.me/*
// @match        https://ranobelib.me/*
// @namespace    https://greasyfork.org/users/221048
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/385608/Mangalib%20Infinite%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/385608/Mangalib%20Infinite%20Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const preloadPos = 321;

    /**
     * @param {Element} chatMore
     * @returns {void}
     */
    const historyAutoload = function(chatMore) {
        let chatItems = document.querySelector('.chat__items'),
            historyLoad = false;

        /**
         * @param {Element} chatMore
         * @returns {boolean}
         */
        const chatMoreClick = function(chatMore) {
            chatMore.click();
            return true;
        }

        chatItems.addEventListener('scroll', _ => {
            let scrollPos = ((chatItems.scrollHeight - chatItems.clientHeight) - chatItems.scrollTop),
                scrollPreload = (scrollPos <= preloadPos);

            historyLoad = (scrollPreload && !historyLoad) ?
                chatMoreClick(chatMore) : scrollPreload;
        });
    }

    if (typeof _CHAT_INSTANCE !== 'undefined') {
        const chatInitInterval = setInterval(() => {
            let chatMore = document.querySelector('.chat__more');

            if (chatMore) {
                clearInterval(chatInitInterval);
                historyAutoload(chatMore);
            }
        }, 50);
    }
})();