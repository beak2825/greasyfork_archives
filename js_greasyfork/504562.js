// ==UserScript==
// @name         游民星空互动地图去app广告
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  通过点击实现去除游民星空互动地图app广告
// @author       NoWorld
// @match        *://www.gamersky.com/tools/map/*
// @icon         https://www.gamersky.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504562/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E4%BA%92%E5%8A%A8%E5%9C%B0%E5%9B%BE%E5%8E%BBapp%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/504562/%E6%B8%B8%E6%B0%91%E6%98%9F%E7%A9%BA%E4%BA%92%E5%8A%A8%E5%9C%B0%E5%9B%BE%E5%8E%BBapp%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 点击实现
    function clickElements(selector) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            if (element) {
                element.click();
            }
        });
    }
    // 点击按钮
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                clickElements('div.pcWuKongCodeClose');
                clickElements('i.pcPopupAd-close');
            }
        });
    });

    // 加载内容
    observer.observe(document.body, { childList: true, subtree: true });
})();