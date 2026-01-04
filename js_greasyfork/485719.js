// ==UserScript==
// @name         关闭知乎和CSDN的登录弹窗
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  自动关闭知乎和CSDN的登录弹窗
// @author       Jiang
// @match        *://*.zhihu.com/*
// @match        *://*.csdn.net/*
// @icon         https://foruda.gitee.com/avatar/1676959947996164615/1275123_jzp979654682_1578947912.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485719/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E5%92%8CCSDN%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/485719/%E5%85%B3%E9%97%AD%E7%9F%A5%E4%B9%8E%E5%92%8CCSDN%E7%9A%84%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.querySelector('body');

    const observe = new MutationObserver(zhihuMutation)

    observe.observe(body, { subtree: true, childList: true });

    function zhihuMutation(mutations) {
        if (mutations) {
            mutations.forEach(item => {
                const zhihuModal = item.target.querySelector('.Modal-wrapper');
                const csdnModal = item.target.querySelector('#passportbox');
                if (zhihuModal) {
                    document.querySelector('.Modal-closeButton').click();
                    observe.disconnect();
                }
                if (csdnModal) {
                    document.querySelector('#passportbox > img').click();
                    observe.disconnect();
                }
            })
        }
    }

})();