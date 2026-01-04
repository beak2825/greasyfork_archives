// ==UserScript==
// @name         b站直播马赛克去除
// @namespace    http://msnets.com/
// @version      2024-10-27
// @description  remove live mosaic mask
// @author       MeteorSky
// @match        https://live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/514321/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/514321/b%E7%AB%99%E7%9B%B4%E6%92%AD%E9%A9%AC%E8%B5%9B%E5%85%8B%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElementsByClassNames(classNames) {
        classNames.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(element => element.remove());
        });
    }

    const classNamesToRemove = ['web-player-module-area-mask', 'web-player-module-area-mask-panel'];

    removeElementsByClassNames(classNamesToRemove);

    const observer = new MutationObserver(() => {
        removeElementsByClassNames(classNamesToRemove);
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();