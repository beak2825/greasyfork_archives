// ==UserScript==
// @name         屏蔽Bilibili观看人数
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  有一天看视频的时候特别讨厌 哔哩哔哩观看人数于是写了一个脚本屏蔽他
// @author       yudao123
// @match        *://www.bilibili.com/*
// @grant        none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/529249/%E5%B1%8F%E8%94%BDBilibili%E8%A7%82%E7%9C%8B%E4%BA%BA%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/529249/%E5%B1%8F%E8%94%BDBilibili%E8%A7%82%E7%9C%8B%E4%BA%BA%E6%95%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function hideElement() {
        let xpath = '//*[@id="bilibili-player"]/div/div/div[1]/div[2]/div/div[1]/div[1]/b';
        let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        let targetElement = result.singleNodeValue;

        if (targetElement) {
            targetElement.style.display = 'none';
            console.log('Bilibili 屏蔽脚本：成功隐藏');
        } else {
            console.log('Bilibili 屏蔽脚本：未找到');
        }
    }
    let observer = new MutationObserver(hideElement);
    observer.observe(document.body, { childList: true, subtree: true });
    hideElement();
})();
