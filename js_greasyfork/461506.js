// ==UserScript==
// @name         知乎去弹窗登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  免除打开知乎网页弹登录提示
// @author       fantasy
// @match        *://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461506/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%BC%B9%E7%AA%97%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/461506/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%BC%B9%E7%AA%97%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function close(){
        const btn = document.querySelector('.Modal-closeButton')
        btn.click()
    }
    while(!document.querySelector(".signFlowModal")){
        setTimeout(close, 100)
        break
    }
})();