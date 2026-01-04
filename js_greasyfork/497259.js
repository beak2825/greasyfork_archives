// ==UserScript==
// @name         tapd超限提示隐藏
// @namespace    http://tampermonkey.net/
// @version      2024-07-09
// @description  try to take over the world!
// @author       You
// @match        https://www.tapd.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tapd.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497259/tapd%E8%B6%85%E9%99%90%E6%8F%90%E7%A4%BA%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/497259/tapd%E8%B6%85%E9%99%90%E6%8F%90%E7%A4%BA%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个观察器实例
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const dialog = document.querySelector(".company-renew-dialog");
                if (dialog) {
                    dialog.parentNode.removeChild(dialog)
                }
                const modal = document.querySelector(".v-modal");
                if (modal) {
                   modal.parentNode.removeChild(modal)
                }
            }
        }
    });

    // 开始观察目标节点
    observer.observe(document.body, { childList: true, subtree: true });
})();