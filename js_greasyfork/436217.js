// ==UserScript==
// @name         B站新版首页去除推广栏和游戏广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除新版B站首页的推广栏
// @author       Yesionio
// @include        /https:\/\/www.bilibili.com\/\??/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436217/B%E7%AB%99%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%8E%A8%E5%B9%BF%E6%A0%8F%E5%92%8C%E6%B8%B8%E6%88%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/436217/B%E7%AB%99%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%E5%8E%BB%E9%99%A4%E6%8E%A8%E5%B9%BF%E6%A0%8F%E5%92%8C%E6%B8%B8%E6%88%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let a = window.onload;
    window.onload = (e)=> {
        if (a instanceof Function) {
            a(e);
        }
        document.querySelector('.eva-extension-area').remove();
        //document.querySelector('section.bili-grid:nth-child(3)').remove();
        document.querySelector('.eva-banner').remove();
    };

    const blockAD = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
            for (const target of mutation.addedNodes) {
                if (target.nodeType != 1) return
                if (target.className === 'eva-banner') {
                    target.hidden = true;
                }
                if (target.className === 'eva-extension-area') {
                    target.hidden = true;
                }
                let tnod = document.querySelector('.eva-extension-area');
                let unod = document.querySelector('.eva-banner');
                if (!!tnod && !tnod.hidden) {
                    tnod.hidden = true;
                }
                if (!!unod && !unod.hidden) {
                    tnod.hidden = true;
                }
            }
        }
    };
    const observer = new MutationObserver(blockAD);
    observer.observe(document, { childList: true, subtree: true })
})();