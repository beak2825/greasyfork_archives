// ==UserScript==
// @name         没事看举报
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  支持随机查看举报, 以及上一条和下一条举报
// @author       mininb666
// @match        *://greasyfork.org/*/reports/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441635/%E6%B2%A1%E4%BA%8B%E7%9C%8B%E4%B8%BE%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/441635/%E6%B2%A1%E4%BA%8B%E7%9C%8B%E4%B8%BE%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("上一条",()=>{
        location.href=+location.href.substr(location.href.indexOf("reports/")+8)-1
    })
    GM_registerMenuCommand("下一条",()=>{
        location.href=+location.href.substr(location.href.indexOf("reports/")+8)+1
    })
    GM_registerMenuCommand("试试手气",()=>{
        location.href=Math.floor(Math.random()*24000);
    })
})();