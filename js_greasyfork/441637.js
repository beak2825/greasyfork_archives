// ==UserScript==
// @name         没事找脚本
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  支持随机查看脚本, 以及上一个和下一个脚本
// @author       mininb666
// @match        *://greasyfork.org/*/scripts/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441637/%E6%B2%A1%E4%BA%8B%E6%89%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/441637/%E6%B2%A1%E4%BA%8B%E6%89%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("上一个",()=>{
        location.href="https://greasyfork.org/scripts/"+(+location.href.substr(location.href.indexOf("scripts/")+8,(location.href.substr(location.href.indexOf("scripts/")+8)).indexOf("-"))-1)
    })
    GM_registerMenuCommand("下一个",()=>{
        location.href="https://greasyfork.org/scripts/"+(+location.href.substr(location.href.indexOf("scripts/")+8,(location.href.substr(location.href.indexOf("scripts/")+8)).indexOf("-"))+1)
    })
    GM_registerMenuCommand("试试手气",()=>{
        location.href="https://greasyfork.org/scripts/"+(Math.floor(Math.random()*444444));
    })
})();