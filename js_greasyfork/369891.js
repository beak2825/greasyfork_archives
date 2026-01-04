// ==UserScript==
// @name         NGA广告跳转
// @namespace    https://github.com/yrz1994
// @version      0.2
// @description  自动跳转NGA广告
// @include      /^https?:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn)/
// @author       Endward
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369891/NGA%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/369891/NGA%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var currentURL = window.location.href;
    var adRegex = /adpage_insert/;
    if(adRegex.test(currentURL)){
        var realRegex = [/https?:\/\/bbs.nga.cn\/read.*$/, /https?:\/\/bbs.ngacn.cc\/read.*$/, /https?:\/\/nga.178.com\/read.*$/, /https?:\/\/bbs.ngacn.cc\/thread.*$/, /https?:\/\/bbs.nga.cn\/thread.*$/, /https?:\/\/nga.178.com\/thread.*$/];
        for(var i = 0; i < realRegex.length; i++){
            var realUrl = realRegex[i].exec(currentURL);
            if(realUrl){
                window.location.href = realUrl;
            }
        }
    }
})();