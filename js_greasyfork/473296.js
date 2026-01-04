// ==UserScript==
// @name         Bandcamp: Wishlist Auto Play
// @name:ru      Bandcamp: Автовоспроизведение на Wishlist
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Auto-playing tracks on https://bandcamp.com/wishlist" page
// @description:ru Автоматическое воспроизведение треков на странице https://bandcamp.com/wishlist
// @author       Grihail
// @match        https://bandcamp.com/*wishlist
// @icon         https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @grant        none
// @license       CC-BY
// @downloadURL https://update.greasyfork.org/scripts/473296/Bandcamp%3A%20Wishlist%20Auto%20Play.user.js
// @updateURL https://update.greasyfork.org/scripts/473296/Bandcamp%3A%20Wishlist%20Auto%20Play.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    let playingIndex = null;
    let isNotificationShown = false;
 
    const clickNextItem = (item) => {
        const nextItem = item.nextElementSibling;
        if (nextItem !== null) {
            const img = nextItem.querySelector('img');
            img.click();
        }
    };
 
    const checkPlaying = () => {
        const items = document.querySelectorAll('#wishlist-items > ol > li');
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.classList.contains('playing')) {
                if (playingIndex !== i) {
                    playingIndex = i;
                }
                return;
            }
        }
        if (playingIndex !== null) {
            const progressBar = document.querySelector('#carousel-player > div > div.col.col-7-15.progress-transport > div.info-progress > div.progress-bar > div.progress');
            const width = parseFloat(progressBar?.style.width || '0');
            if (width >= 100) {
                clickNextItem(items[playingIndex]);
            }
        }
    };
 
    setInterval(checkPlaying, 500);
})();