// ==UserScript==
// @name         Prevent Search and Copy Popup on ScienceDirect
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  阻止弹出“Search”和“Copy”弹窗，仅在包含sciencedirect或science-direct的网站上运行
// @author       YourName
// @match        *://*.sciencedirect.com/*
// @match        https://www-sciencedirect-com.uitm.sjlib.cn/*
// @match        *://*.science-direct.com/*
// @match        *://*sciencedirect*/*
// @match        *://*science-direct*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=example.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509643/Prevent%20Search%20and%20Copy%20Popup%20on%20ScienceDirect.user.js
// @updateURL https://update.greasyfork.org/scripts/509643/Prevent%20Search%20and%20Copy%20Popup%20on%20ScienceDirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 阻止触发弹窗的事件
    function preventPopupEvents(event) {
        event.stopPropagation();  // 阻止事件冒泡
        console.log('Popup event prevented:', event.type);
    }

    // 阻止选中文本后的事件，防止弹窗
    document.addEventListener('mouseup', preventPopupEvents, true);
    document.addEventListener('selectionchange', preventPopupEvents, true);

    // 如果弹窗已经存在，移除它
    function removePopup() {
        const popup = document.querySelector('.search-for-selected-text');
        if (popup) {
            popup.remove();
            console.log('Search and Copy popup removed.');
        }
    }

    // 页面加载时移除已经存在的弹窗
    window.addEventListener('load', function() {
        // 初次移除弹窗
        removePopup();

        // 设置定时器，确保弹窗不再出现
        setInterval(removePopup, 500);
    });
})();
