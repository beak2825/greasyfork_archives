// ==UserScript==
// @name         没事找用户
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  支持随机查看用户, 以及上一个和下一个用户
// @author       mininb666
// @match        *://greasyfork.org/*/users/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441636/%E6%B2%A1%E4%BA%8B%E6%89%BE%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/441636/%E6%B2%A1%E4%BA%8B%E6%89%BE%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("上一条",()=>{
        location.href=+location.href.substr(location.href.indexOf("users/")+6,(location.href.substr(location.href.indexOf("users/")+6)).indexOf("-"))-1
    })
    GM_registerMenuCommand("下一条",()=>{
        location.href=+location.href.substr(location.href.indexOf("users/")+6,(location.href.substr(location.href.indexOf("users/")+6)).indexOf("-"))+1
    })
    GM_registerMenuCommand("试试手气",()=>{
        location.href=Math.floor(Math.random()*900000);
    })
})();