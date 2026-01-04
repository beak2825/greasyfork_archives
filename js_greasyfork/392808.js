// ==UserScript==
// @name         破除哔哩哔哩专栏文本复制限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  破除哔哩哔哩专栏无法复制
// @author       Jelly
// @match        https://www.bilibili.com/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392808/%E7%A0%B4%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/392808/%E7%A0%B4%E9%99%A4%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E6%96%87%E6%9C%AC%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var x = document.getElementsByClassName("unable-reprint");
    var i;
    for(i = 0; i < x.length; i++){
         x[i].classList.remove("unable-reprint");
    }
    // Your code here...
})();