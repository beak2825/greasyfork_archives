// ==UserScript==
// @name         淘寶主圖遮罩清除器
// @namespace    https://bshadow.pixnet.net/blog
// @version      1.1
// @description  自動移除淘寶商品圖片的遮罩容器，保留圖片可點擊與操作
// @author       ken cyue
// @license      MIT
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540637/%E6%B7%98%E5%AF%B6%E4%B8%BB%E5%9C%96%E9%81%AE%E7%BD%A9%E6%B8%85%E9%99%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/540637/%E6%B7%98%E5%AF%B6%E4%B8%BB%E5%9C%96%E9%81%AE%E7%BD%A9%E6%B8%85%E9%99%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cleanMainPicMask() {
        const allDivs = document.querySelectorAll('div');

        allDivs.forEach(div => {
            const className = div.className || '';
            const style = getComputedStyle(div);

            // 判斷有 "mainPicWrap" 關鍵字、position 為 relative
            if (
                typeof className === 'string' &&
                className.includes('mainPicWrap') &&
                style.position === 'relative'
            ) {
                // 遮罩容器本身不再擋點擊
                div.style.pointerEvents = 'none';
                div.style.background = 'transparent';
                div.style.opacity = '1';

                // 裡面的 <img> 要能點擊
                const imgs = div.querySelectorAll('img');
                imgs.forEach(img => {
                    img.style.pointerEvents = 'auto';
                });
            }
        });
    }

    // 首次執行
    cleanMainPicMask();

    // 動態載入監聽
    const observer = new MutationObserver(cleanMainPicMask);
    observer.observe(document.body, { childList: true, subtree: true });
})();
