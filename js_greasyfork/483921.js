// ==UserScript==
// @name         CloudPivot Debug Variable ScrollBar
// @namespace    https://greasyfork.org/zh-CN/scripts/483921-cloudpivot-debug-variable-scrollbar
// @version      0.3
// @description  云枢业务规则变量滑动条激活。。
// @author       Patchouli_Go_
// @match        *://test1.ztdh.xyz:*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483921/CloudPivot%20Debug%20Variable%20ScrollBar.user.js
// @updateURL https://update.greasyfork.org/scripts/483921/CloudPivot%20Debug%20Variable%20ScrollBar.meta.js
// ==/UserScript==

(function() {
    setTimeout( function(){
        var wid1 = document.querySelectorAll(".debug_service_variable");
        //console.log("wid1",wid1);
        if(wid1.length > 0) wid1[0].style.overflow = "auto";
    }, 10000)
})();