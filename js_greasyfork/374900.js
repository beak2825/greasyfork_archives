// ==UserScript==
// @name         CSDN 免登陆查看全文内容
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  免登陆查看全文内容
// @author       Ex1t
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @downloadURL https://update.greasyfork.org/scripts/374900/CSDN%20%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/374900/CSDN%20%E5%85%8D%E7%99%BB%E9%99%86%E6%9F%A5%E7%9C%8B%E5%85%A8%E6%96%87%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict'
    var rm=document.getElementById("btn-readmore")
    if(rm){
        rm.parentNode.remove()
        document.getElementById('article_content').style='auto'
        document.getElementsByClassName('pulllog-box')[0].remove()
        setTimeout("document.getElementsByClassName('adblock')[0].remove()",1)
    }
})();