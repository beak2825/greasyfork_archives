// ==UserScript==
// @name         ditto 谷歌翻译地址重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ditto 重定向翻译
// @author       白水
// @match        https://translate.google.com/?tl=en*
// @run-at       document-start
// @icon         https://translate.google.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419797/ditto%20%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%9C%B0%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/419797/ditto%20%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%9C%B0%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* 旧案
    //https://translate.google.com/?tl=en#auto/en/MyCollection
    //match 出问题
    var str = window.location.href;
    //var res = str.split("https://translate.google.com/?tl=en#auto/en/");
    var res = str.replace("https://translate.google.com/?tl=en#auto/en/","https://translate.google.com/?text=");
    window.location.href = res




    //window.location.hash;

    //console.log(res[0]);//前缀 replace
    //console.log(res[1]);//后缀 关键词
    //window.location.href = "https://translate.google.com/?text=" + res[1];

    */

    window.location.href = window.location.href.replace("?tl=en#auto/en/","?text=");
})();