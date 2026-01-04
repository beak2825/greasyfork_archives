// ==UserScript==
// @name         删除bing搜索出来的广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除带有‘广告’标识的元素
// @author       Xian
// @match        https://cn.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405308/%E5%88%A0%E9%99%A4bing%E6%90%9C%E7%B4%A2%E5%87%BA%E6%9D%A5%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/405308/%E5%88%A0%E9%99%A4bing%E6%90%9C%E7%B4%A2%E5%87%BA%E6%9D%A5%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lev = document.getElementsByTagName('li');
    for (var i=0;i<lev.length+1;i++) {
        if(lev[i].className == 'b_ad'||lev[i].className == 'b_adLastChild'){
            lev[i].remove();
        }
    }
    // Your code here...
})();