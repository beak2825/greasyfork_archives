// ==UserScript==
// @name         csdn 阅读全文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除 CSDN 阅读全文次数限制，自动展开全文
// @author       lousuan
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393444/csdn%20%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/393444/csdn%20%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    localStorage.removeItem('anonymousUserLimit');
    document.getElementById("btn-readmore").click();
})();