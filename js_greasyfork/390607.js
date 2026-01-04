// ==UserScript==
// @name         简书去除重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简书外链免跳转，去除重定向，直接访问源地址
// @author       tianyunperfect@gmail.com
// @match        *://*.jianshu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390607/%E7%AE%80%E4%B9%A6%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/390607/%E7%AE%80%E4%B9%A6%E5%8E%BB%E9%99%A4%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    var pre = "https://links.jianshu.com/go?to=";
    var as = document.getElementsByTagName("a");
    for(var i = 0; i < as.length; i++){
        var a = as[i];
        var link = a.href;
        if(link.startsWith(pre)){
            link = link.replace(pre,"");
            link = decodeURIComponent(link);
            a.href = link;
        }
    }
})();