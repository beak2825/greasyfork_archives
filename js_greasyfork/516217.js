// ==UserScript==
// @name         Block Mouse Leave
// @namespace    https://t.me/mycutcbot
// @version      0.1
// @description  Block Mouse Leave Popup Improved
// @author       ziqs
// @match        *://*/*
// @license      GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516217/Block%20Mouse%20Leave.user.js
// @updateURL https://update.greasyfork.org/scripts/516217/Block%20Mouse%20Leave.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定義一個阻止事件的函數
    function preventEvent(e) {
        e.stopImmediatePropagation();
        e.preventDefault();
    }

    // 監聽 `mouseleave`, `mouseout`, 和 `blur` 事件
    ['mouseleave', 'mouseout', 'blur'].forEach(eventType => {
        window.addEventListener(eventType, preventEvent, true);
        document.addEventListener(eventType, preventEvent, true);
    });

    // 定時移除動態新增的事件監聽器
    const observer = new MutationObserver(() => {
        document.querySelectorAll('*').forEach(element => {
            try {
                element.onmouseleave = null;
                element.onmouseout = null;
                element.onblur = null;
            } catch (error) {
                console.error(`Error clearing event listeners on ${element}`, error);
            }
        });
    });

    // 開始監聽 DOM 變化
    observer.observe(document.body, { childList: true, subtree: true });

})();
