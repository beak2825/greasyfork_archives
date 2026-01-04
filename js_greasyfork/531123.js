// ==UserScript==
// @name         Ins视频默认音量降低
// @namespace    http://tampermonkey.net/
// @version      2025-03-28
// @description  instagram视频的声音真的好大，受不了了
// @author       Ryujo_Artist
// @match        https://www.instagram.com/*
// @icon         https://imgheybox.max-c.com/dev/bbs/2025/03/28/80f1ccdfc059de0b130810af1f0d799d.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531123/Ins%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%9F%B3%E9%87%8F%E9%99%8D%E4%BD%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/531123/Ins%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%9F%B3%E9%87%8F%E9%99%8D%E4%BD%8E.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function setVolume() {
        document.querySelectorAll('video').forEach(video => {
            if (video.volume !== 0.1) {
                video.volume = 0.1;
            }
        });
    }

    window.addEventListener('load', setVolume);
    document.addEventListener('DOMContentLoaded', setVolume);

    const observer = new MutationObserver(setVolume);
    observer.observe(document.body, { childList: true, subtree: true });

    setVolume();
})();