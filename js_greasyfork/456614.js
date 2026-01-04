// ==UserScript==
// @name         CSDN防复制解除
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  解除CSDN blog的复制限制
// @author       BaiYe1123
// @match        https://blog.csdn.net/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456614/CSDN%E9%98%B2%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/456614/CSDN%E9%98%B2%E5%A4%8D%E5%88%B6%E8%A7%A3%E9%99%A4.meta.js
// ==/UserScript==

function remove_css() {
    const code_block = document.getElementsByTagName("code");
    const pre_block = document.getElementsByTagName("pre");
    for (var i = 0; i < code_block.length; i++) {
        code_block[i].style.webkitTouchCallout = "text";
        code_block[i].style.webkitUserSelect = "text";
        code_block[i].style.khtmlUserSelect = "text";
        code_block[i].style.mozUserSelect = "text";
        code_block[i].style.msUserSelect = "text";
        code_block[i].style.userSelect = "text";
    }
    for (var k = 0; k < pre_block.length; k++) {
        pre_block[k].style.webkitTouchCallout = "text";
        pre_block[k].style.webkitUserSelect = "text";
        pre_block[k].style.khtmlUserSelect = "text";
        pre_block[k].style.mozUserSelect = "text";
        pre_block[k].style.msUserSelect = "text";
        pre_block[k].style.userSelect = "text";
    }
}

(function() {
    'use strict';
    remove_css();

    // Your code here...
})();