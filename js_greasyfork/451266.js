// ==UserScript==
// @name         CSDN免登录复制代码
// @namespace    https://blog.csdn.net/*/article/details/*
// @version      1.1
// @description  CSDN不用登录复制代码
// @author       SmallFish
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @downloadURL https://update.greasyfork.org/scripts/451266/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/451266/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let codes = document.querySelectorAll('code')

codes.forEach((c) => {
    c.contentEditable = "true"
})
    

    // Your code here...
})();