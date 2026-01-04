// ==UserScript==
// @name         Remove mouse restrictions and automatically close pop-up windows in moxueyuan
// @namespace    https://mbt.jd.com/cards/ffksimple/home.html?channelName=wdqb_sy_icon&do_not_click_on_me
// @namespace    https://t.me/mycutcbot
// @version      0.22
// @description  Auto Close Popups for Learning Site & Block Mouse Leave Popup Improved
// @author       ziqs
// @match        *://*.study.moxueyuan.com/*
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/516215/Remove%20mouse%20restrictions%20and%20automatically%20close%20pop-up%20windows%20in%20moxueyuan.user.js
// @updateURL https://update.greasyfork.org/scripts/516215/Remove%20mouse%20restrictions%20and%20automatically%20close%20pop-up%20windows%20in%20moxueyuan.meta.js
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



(function() {
    'use strict';

    // 監聽 <body> 的類別名稱變化
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const bodyClass = document.body.className;

                // 檢查是否包含 el-popup-parent--hidden 類
                if (bodyClass.includes('el-popup-parent--hidden')) {
                    console.log('Popup detected, attempting to click "I am here" button after delay');

                    // 延遲 5 秒點擊按鈕
                    setTimeout(() => {
                        // 尋找所有符合條件的按鈕
                        const buttons = document.querySelectorAll('.dialog-footer-cancel');
                        for (const button of buttons) {
                            if (button.textContent.includes('我在')) {
                                button.click();
                                console.log('"I am here" button clicked after 5 seconds');
                                break;
                            }
                        }
                    }, 5000); // 5秒延遲（5000毫秒）
                }
            }
        }
    });

    // 開始監聽 <body> 的屬性變化
    observer.observe(document.body, { attributes: true });

})();