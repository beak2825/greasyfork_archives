// ==UserScript==
// @name         NGA无法看到回复 跳转nga.178.com
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  针对 'ngabbs.com','g.nga.cn' 这几个跳转到 nga.178.com
// @author       You
// @match        https://ngabbs.com/*
// @match        https://g.nga.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ngabbs.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453741/NGA%E6%97%A0%E6%B3%95%E7%9C%8B%E5%88%B0%E5%9B%9E%E5%A4%8D%20%E8%B7%B3%E8%BD%ACnga178com.user.js
// @updateURL https://update.greasyfork.org/scripts/453741/NGA%E6%97%A0%E6%B3%95%E7%9C%8B%E5%88%B0%E5%9B%9E%E5%A4%8D%20%E8%B7%B3%E8%BD%ACnga178com.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...

    var url = window.location.href;  //获取当前url
    var urlAry = ['ngabbs.com','g.nga.cn','bbs.nga.cn']
    var hasUrl
var al
   al = (url.indexOf(urlAry[0]) !== -1) ? (hasUrl=urlAry[0]):''
   al =  (url.indexOf(urlAry[1]) !== -1) ? (hasUrl=urlAry[1]):''
//   al =  (url.indexOf(urlAry[2]) !== -1) ? (hasUrl=urlAry[2]):''
   url =  url.replace(hasUrl,'nga.178.com')
    window.location.href = url
//alert(url)
})();