// ==UserScript==
// @name         CSDN免登陆自动加载更多
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不知道啥时候，csdn需要登录才能查看更多，很烦！！！
// @author       xiaoming
// @match        *://blog.csdn.net/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/375123/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/375123/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%BD%BD%E6%9B%B4%E5%A4%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("div.article_content").removeAttr("style");
    $("#btn-readmore").parent().remove();
})();