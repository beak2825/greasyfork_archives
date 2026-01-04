// ==UserScript==
// @name         Niconico 1080p Selector
// @description  ニコニコ動画で1080pを自動的に選択する
// @version      0.3
// @license      MIT License
// @match        *://www.nicovideo.jp/watch/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/315899
// @downloadURL https://update.greasyfork.org/scripts/387236/Niconico%201080p%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/387236/Niconico%201080p%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('play', function(e) {
        if (e.target.parentElement.id !== 'MainVideoPlayer') return;

        const item = document.querySelector('.VideoQualityMenuItem .PlayerOptionDropdownItem-inner');
        console.log(item);

        if (item.innerText.indexOf('1080p') !== -1) {
            item.click();
        }
    }, true);
})();