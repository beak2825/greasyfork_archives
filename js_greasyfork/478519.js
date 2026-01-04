// ==UserScript==
// @name         bilibili纯净版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  让你的bilibili页面变得极简
// @author       cccake
// @license      MIT
// @match        *://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478519/bilibili%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478519/bilibili%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectorsToHide = [
        "#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__bar > ul.left-entry",
        "#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__banner > div.animated-banner",
        "#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__channel",
        "#i_cecream > div.bili-feed4 > main",
        "#i_cecream > div.bili-feed4 > div.header-channel",
        "#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__bar > div > div > div > div.trending",
        "#reco_list",
        "div.pop-live-small-mode",
        "div.ad-report",
        "a.ad-report"
    ];

    function hideElements() {
        selectorsToHide.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length) {
                elements.forEach(element => {
                    element.style.display = 'none';
                });
            }
        });
    }

    function checkElementsPeriodically() {
        hideElements();
        setTimeout(checkElementsPeriodically, 500);
    }

    // Start the process
    checkElementsPeriodically();
})();
