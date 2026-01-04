// ==UserScript==
// @name         屏蔽知乎登录弹窗
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动关闭知乎强制弹出的登录弹窗
// @author       buling
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445893/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/445893/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%99%BB%E5%BD%95%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const timer = setTimeout(() => {
        const close = document.querySelector('.Modal-closeButton')

        if(close) {
            close.click()
            clearTimeout(timer)
        }
    }, 100)

})();