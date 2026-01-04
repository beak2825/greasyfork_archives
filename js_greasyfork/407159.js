// ==UserScript==
// @name         bilibili 去除禁止复制
// @namespace    https://www.yffjglcms.com/
// @version      0.1
// @description  try to take over the world!
// @author       yffjglcms
// @match        https://www.bilibili.com/read/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407159/bilibili%20%E5%8E%BB%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/407159/bilibili%20%E5%8E%BB%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload=function(){
        document.getElementsByClassName("unable-reprint")[0].style.userSelect="auto"
        document.getElementsByClassName("unable-reprint")[0].style["-webkit-user-select"]="auto"
    }
    
})();