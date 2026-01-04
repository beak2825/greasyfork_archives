// ==UserScript==
// @name         CSDN博客内容自动显示全文
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  进入CSDN博客时，自动点击“阅读更多”，显示全文
// @author       wgg243
// @match        https://*.csdn.net/*
// @match        http://*.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377907/CSDN%E5%8D%9A%E5%AE%A2%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/377907/CSDN%E5%8D%9A%E5%AE%A2%E5%86%85%E5%AE%B9%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function () {
    var readmore = document.getElementById("btn-readmore");
    if (readmore) {
        console.log("get readmore");
        readmore.click();
    } else {
        console.log("false");
    }
})();