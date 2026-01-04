// ==UserScript==
// @name         imhentai翻页
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  在千页之内可点击图片翻页
// @author       SJXC
// @match        https://imhentai.xxx/*
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430367/imhentai%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/430367/imhentai%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {     
    var btn = document.getElementById("gimg");
    btn.onclick = function() {
    var url = window.location.href;
    var index = url.lastIndexOf("\/");
        if(Number.isFinite(Number(url.substring(index - 3,url.length-1))))
        {
            location.href= url.substring(0,index-3)+ (Number(url.substring(index - 3,url.length-1))+1);
        }
        else
        {
            if(Number.isFinite(Number(url.substring(index - 2,url.length-1))))
            {
                location.href= url.substring(0,index-2)+ (Number(url.substring(index - 2,url.length-1))+1);
            }
            else
            {
                location.href= url.substring(0,index-1)+ (Number(url.substring(index - 1,url.length-1))+1);
            }
        }
    };
})();