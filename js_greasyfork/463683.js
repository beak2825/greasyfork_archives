// ==UserScript==
// @name         移除拼多多广告
// @namespace    https://zjy.name/
// @version      1.0
// @description  移除 B 站动态拼多多广告
// @author       Zhang Visper
// @match        https://t.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463683/%E7%A7%BB%E9%99%A4%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/463683/%E7%A7%BB%E9%99%A4%E6%8B%BC%E5%A4%9A%E5%A4%9A%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const list = document.getElementsByClassName('bili-dyn-list__items')[0];

    const walk = () => {
        Array.from(list.children).forEach(i => {
            if (i.textContent.includes('拼多多') && i.textContent.includes('百亿补贴') && i.textContent.includes('展开')) {
                i.style.display = 'none'
            }
        })
    }

    const observer = new MutationObserver(walk)
    observer.observe(list, { childList: true });
})();