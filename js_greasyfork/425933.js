// ==UserScript==
// @name         CNKI知网重定向到海外页面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  CNKI海外页面可以下载PDF格式的文章
// @author       https://greasyfork.org/zh-CN/users/744513-xmj
// @match        *://kns.cnki.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425933/CNKI%E7%9F%A5%E7%BD%91%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E6%B5%B7%E5%A4%96%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/425933/CNKI%E7%9F%A5%E7%BD%91%E9%87%8D%E5%AE%9A%E5%90%91%E5%88%B0%E6%B5%B7%E5%A4%96%E9%A1%B5%E9%9D%A2.meta.js
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