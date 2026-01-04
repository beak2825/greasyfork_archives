// ==UserScript==
// @name         去你大爷的 CSDN 全文阅读
// @namespace    https://gqqnbig.me
// @version      0.1
// @description  把阅读更多的那个啥玩意儿给干掉
// @author       laobubu, gqqnbig
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @license      LGPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/367694/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%20CSDN%20%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/367694/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%20CSDN%20%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ef = document.querySelector('.hide-article-box');
    if (ef) {
        ef.remove();
        //document.querySelector('#article_content').style.height='auto';
    }
})();
