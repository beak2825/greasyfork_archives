// ==UserScript==
// @name        谷歌翻译格式问题
// @namespace    https://translate.google.cn/*
// @version      0.1
// @description  press F5
// @author       XMAN
// @include      https://*translate.google.*/*
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32821/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/32821/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E6%A0%BC%E5%BC%8F%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //you can change what you want
    var txt = "";  
    txt = document.getElementById("source").value;
    for (var i=0;i<txt.length;i++)
    {
        if(txt.indexOf("\n"))txt = txt.replace("\n"," ");     
    }
    document.getElementById("source").value = txt; 
})();