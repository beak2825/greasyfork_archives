// ==UserScript==
// @name         去除知乎登陆弹窗 remove stupid login window on zhihu.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fuck zhihu.com
// @author       mistwave
// @match        https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402655/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E9%99%86%E5%BC%B9%E7%AA%97%20remove%20stupid%20login%20window%20on%20zhihucom.user.js
// @updateURL https://update.greasyfork.org/scripts/402655/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E7%99%BB%E9%99%86%E5%BC%B9%E7%AA%97%20remove%20stupid%20login%20window%20on%20zhihucom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    new MutationObserver(function(mutations) {
        const button = document.querySelector('.signFlowModal button.Modal-closeButton')
        if (button) {
            button.click();
           //  this.disconnect();
        }
    }).observe(document, {childList: true, subtree: true});
    // Your code here...
})();