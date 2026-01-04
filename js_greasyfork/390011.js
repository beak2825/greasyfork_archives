// ==UserScript==
// @name         淘宝考试
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ur.taobao.com/exam/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390011/%E6%B7%98%E5%AE%9D%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/390011/%E6%B7%98%E5%AE%9D%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('.question-item h3').each(function(){$(this).append('<a target="_blank" href="https://www.baidu.com/s?ie=utf-8&wd='+encodeURI(this.childNodes[2].nodeValue)+'%20site%3Akaitao.cn" style="color:red;">百度</a>');});
})();