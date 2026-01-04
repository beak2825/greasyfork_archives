// ==UserScript==
// @name         中国知网重定向到海外版页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  中国知网硕博论文定向到海外版页面可以直接下载PDF格式的文章
// @author       Fireooout
// @match        *://kns.cnki.net/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445206/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E6%B5%B7%E5%A4%96%E7%89%88%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/445206/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E6%B5%B7%E5%A4%96%E7%89%88%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var myHost = window.location.host;
    var myFullLink = window.location.href;
    if (myHost.split('.')[0] == 'kns') {
        myFullLink = myFullLink.replace('kns', "chn.oversea");
    }
    console.log(myFullLink);
    window.location.href = myFullLink;

})();