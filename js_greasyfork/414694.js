// ==UserScript==
// @name         京东手机分享链接自动转换
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  京东手机链接自动转换为电脑链接
// @author       schekey
// @icon         https://www.jd.com/favicon.ico
// @match        https://item.m.jd.com/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414694/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/414694/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.pathname;
    url = url.replace('/product','')
    var redirect = 'https://item.jd.com' + url;
    //console.log('this is redirect url '+redirect)
    window.location.href= redirect;
    // Your code here...
})();