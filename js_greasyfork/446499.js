// ==UserScript==
// @name         复制文本小尾巴去除
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站专栏、csdn复制文本小尾巴去除
// @author       申月
// @match        *://blog.csdn.net/*
// @match        *://www.bilibili.com/read/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446499/%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E5%B0%8F%E5%B0%BE%E5%B7%B4%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/446499/%E5%A4%8D%E5%88%B6%E6%96%87%E6%9C%AC%E5%B0%8F%E5%B0%BE%E5%B7%B4%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("去除小尾巴工具已启用！！！");
    var domain = window.location.host;
    if(domain=="blog.csdn.net"){
        csdn.copyright.textData=""
    }else if(domain=="www.bilibili.com"){
        HTMLDivElement.prototype.realAddEventListener = HTMLAnchorElement.prototype.addEventListener;
        HTMLDivElement.prototype.addEventListener = function(a,b,c){
            if(a =="copy") return;
            return this.realAddEventListener(a,b,c);
        };
    }
    // Your code here...
})();
