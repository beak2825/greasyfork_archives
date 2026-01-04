// ==UserScript==
// @name         bilibili封面提取
// @namespace    https://greasyfork.org/scripts/491192
// @version      1.4
// @description  bilibili封面提取，點按鈕開啟大圖
// @author       fmnijk
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491192/bilibili%E5%B0%81%E9%9D%A2%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/491192/bilibili%E5%B0%81%E9%9D%A2%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
	function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 3000)).observe(document.body, { childList: true });
	}
	function addButton() {
        const metaElement = document.querySelector('meta[itemprop="image"]');
        const imageUrl = metaElement ? metaElement.getAttribute('content').split('@')[0] : null;

        const targetDiv = document.querySelector('#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main');

        if (targetDiv && imageUrl) {
            const linkId = 'bilibili-cover-image-extract';
            const existingLink = targetDiv.querySelector(`#${linkId}`);

            // 移除具有相同 ID 的元素(如果存在)
            if (existingLink) {
                existingLink.remove();
            }

            // 創建按鈕
            const link = document.createElement('a');
            link.id = linkId;
            link.href = imageUrl;
            link.textContent = '封面提取';
            link.target = '_blank'; // 在新分頁中開啟

            // 添加 CSS 樣式
            link.style.fontSize = '14px';

            targetDiv.appendChild(link);
        }
	}
	onDomChange(addButton);
})();
