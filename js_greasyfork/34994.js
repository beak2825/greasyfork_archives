// ==UserScript==
// @name         CSDN 阅读全文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  显示隐藏内容
// @author       Yang
// @match         http://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34994/CSDN%20%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/34994/CSDN%20%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('#article_content').css("height","");
    $("div.readall_box").hide();
})();