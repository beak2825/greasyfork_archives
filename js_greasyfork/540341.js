// ==UserScript==
// @name         height player Fix ukrmuz.net
// @name:ua      Збільшення висоти слайдера музичного плеєра
// @name:ru      увеличить высоту ползунка плеера
// @name:pl      Wysokość gracza Fix ukrmuz.net

// @namespace    ukrmuz-net-player-fixxx
// @version      0.0.1

// @description     Increasing the height of the music player slider on ukrmuz.net
// @description:ua  Збільшення висоти слайдера музичного плеєра на ukrmuz.net
// @description:ru  Увеличение высоты слайдера музыкального плеера на ukrmuz.net
// @description:pl  Zwiększanie wysokości suwaka odtwarzacza muzyki na ukrmuz.net

// @author       jawa1000rera
// @license      MIT
// @match        https://ukrmuz.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540341/height%20player%20Fix%20ukrmuznet.user.js
// @updateURL https://update.greasyfork.org/scripts/540341/height%20player%20Fix%20ukrmuznet.meta.js
// ==/UserScript==

/* lang eng - the standard value of 5px complicates playback control, replace the value 37 with any comfortable 5-50px */
/* lang rus - стандартное значение в 5px усложняет управление воспроизведением, замение значение 37 на любое комфортное 5-50px */

(function () {
    'use strict';

    const style = document.createElement('style');
    style.innerHTML = `
        .audioplayer-bar {
            height: 37px !important;
        }
    `;
    document.head.appendChild(style);
})();
