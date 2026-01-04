// ==UserScript==
// @name         把 aicnn 积分使用情况放到套餐选取前面
// @namespace    https://myuan.fun/
// @version      2025-03-27
// @description  把积分使用情况放到套餐选取前面，以及自动签到
// @author       myuan
// @match        https://aicnn.cn/pay
// @match        https://aicnn.xyz/pay
// @match        https://open.aicnn.cn/pay

// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/527281/%E6%8A%8A%20aicnn%20%E7%A7%AF%E5%88%86%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5%E6%94%BE%E5%88%B0%E5%A5%97%E9%A4%90%E9%80%89%E5%8F%96%E5%89%8D%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/527281/%E6%8A%8A%20aicnn%20%E7%A7%AF%E5%88%86%E4%BD%BF%E7%94%A8%E6%83%85%E5%86%B5%E6%94%BE%E5%88%B0%E5%A5%97%E9%A4%90%E9%80%89%E5%8F%96%E5%89%8D%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow.console.clear = function() {};

    const BUTTON_SELECTOR = 'button.signBtn1'; // 签到按钮选择器
    const STORAGE_KEY = 'LAST_SIGN_DATE';      // 本地存储的键名

    function trySignin() {
        function shouldClick() {
            const lastDate = GM_getValue(STORAGE_KEY, '');
            const today = new Date().toISOString().slice(0, 10); // 格式：YYYY-MM-DD
            return lastDate !== today;
        }

        const btn = document.querySelector(BUTTON_SELECTOR);
        console.log(btn, '签到')
        if (btn) {
            if (shouldClick()) {
                btn.click();
                GM_setValue(STORAGE_KEY, new Date().toISOString().slice(0, 10));
                console.log('签到成功');
            }
        } else {
            setTimeout(trySignin, 1000);
        }

    }
    function reorderElements() {
        const firstElem = document.querySelector('.mousewheel');
        const payRecordElem = document.querySelector('.pay-containertheme.overflow-y-auto.bg-white.m-dialog');
        console.log('start reorder', firstElem, payRecordElem)

        if (payRecordElem) {
            payRecordElem.parentNode.insertBefore(payRecordElem, firstElem);
            console.log('元素顺序已调整');
        } else {
            setTimeout(reorderElements, 1000);
        }
    }

    if (document.readyState === 'complete') {
        reorderElements();
        trySignin();
    } else {
        window.addEventListener('load', reorderElements);
        window.addEventListener('load', trySignin);

    }


})();