// ==UserScript==
// @name         知乎去除回答页登录提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除知乎烦人的登录提示
// @author       Leenus
// @match        https://www.zhihu.com/question/*/answer*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469987/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%9B%9E%E7%AD%94%E9%A1%B5%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/469987/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%9B%9E%E7%AD%94%E9%A1%B5%E7%99%BB%E5%BD%95%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const timer = setInterval(() => {
        const closeBtn = document.querySelector("div.Modal.Modal--default.signFlowModal > button")

        if (closeBtn) {
            closeBtn.click()
            clearInterval(timer)
        }

    }, 100)
})();