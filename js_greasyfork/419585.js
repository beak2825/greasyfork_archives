// ==UserScript==
// @name         bing自动转跳[简化chrometana Pro]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bing自动转跳,重构 chrometana Pro.crx 的代码
// @author       白水
// @match        https://cn.bing.com/search?*
// @run-at       document-start
// @icon         https://cn.bing.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419585/bing%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%B7%B3%5B%E7%AE%80%E5%8C%96chrometana%20Pro%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/419585/bing%E8%87%AA%E5%8A%A8%E8%BD%AC%E8%B7%B3%5B%E7%AE%80%E5%8C%96chrometana%20Pro%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //var getUrl = window.location.href
    //window.location.href = "about:blank"
    //if(window.location.href.includes("https://cn.bing.com/search?"))
    //{
        //window.location.href = ""
        /* 案例
        var str = document.getElementById("demo").innerHTML;
        var txt = str.replace(/microsoft/i,"W3Schools");
        document.getElementById("demo").innerHTML = txt;
        */
   //var nextUrl = getUrl.replace(/cn.bing.com/i,"www.google.com");
   //window.location.href = nextUrl;
   window.location.host = "www.google.com";//也可以实现不保存历史
   //window.location.replace = nextUrl;//不保存历史
    //}
})();