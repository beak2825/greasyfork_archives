// ==UserScript==
// @name         CSDN 全文阅读你大爷
// @namespace    http://www.cnblogs.com/Chary/
// @version      0.1
// @description  把阅读更多的那个啥玩意儿给干掉
// @author       CharyGao
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @icon         https://csdnimg.cn/public/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/370730/CSDN%20%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E4%BD%A0%E5%A4%A7%E7%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/370730/CSDN%20%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%E4%BD%A0%E5%A4%A7%E7%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ef = document.querySelector('.hide-article-box');
    if (ef) {
        ef.remove();
        document.querySelector('#article_content').style.height='auto';
    }

    var btnMore = document.getElementById("btn-readmore");
    if (btnMore != undefined) {
        btnMore.click();
    } else {
        console.log("No button found.");
    }
})();
