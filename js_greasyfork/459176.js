// ==UserScript==
// @name         YIDA Admin SidePanel Width Fix
// @namespace    https://greasyfork.org/zh-CN/scripts/459176-yida-admin-sidepanel-width-fix
// @version      0.3
// @description  宜搭应用管理页面左侧边栏宽度修改
// @author       Patchouli_Go_
// @run-at       document-end
// @match        *://cmymzk.aliwork.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=aliwork.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459176/YIDA%20Admin%20SidePanel%20Width%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/459176/YIDA%20Admin%20SidePanel%20Width%20Fix.meta.js
// ==/UserScript==

(function() {
    setTimeout( function(){
        var wid1 = document.querySelectorAll("#App > section > section > aside > div")
        if(wid1.length > 0) wid1[0].style.width = "300px";
        var wid2 = document.querySelectorAll("#App > section > section > aside > div > div > ul > div")
        if(wid2.length > 0) wid2[0].style.width = "284px";
        var common = document.getElementById("yida-admin-common");
        common.style.display = "none";
    }, 1000)
})();