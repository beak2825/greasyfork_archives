// ==UserScript==
// @name         維基百科優先香港中文
// @version      0.13-hk
// @description  Wikipedia 維基百科優先香港中文
// @author       Erimus
// @match        https://zh.wikipedia.org/*
// @match        http://zh.wikipedia.org/*
// @grant        none
// @namespace http://erimus.cc/
// @downloadURL https://update.greasyfork.org/scripts/31384/%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E5%84%AA%E5%85%88%E9%A6%99%E6%B8%AF%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/31384/%E7%B6%AD%E5%9F%BA%E7%99%BE%E7%A7%91%E5%84%AA%E5%85%88%E9%A6%99%E6%B8%AF%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var url = window.location.href;
    console.log(url);
    if(url.indexOf("zh.wikipedia.org/wiki") != -1){
        console.log("進入中文頁面");
        url = url.replace("/wiki/","/zh-hk/");
        console.log(url);
        window.location=url;
    }
})();