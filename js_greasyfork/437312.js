// ==UserScript==
// @name         Pcbeta 去除广告屏蔽弹窗
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  远景论坛去除广告屏蔽弹窗
// @author       萌萌哒の小妍妍
// @match        *://*.pcbeta.com/*
// @icon         https://bbs.pcbeta.com/favicon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437312/Pcbeta%20%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/437312/Pcbeta%20%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(window.onload=function() {
    'use strict';
    var popup=document.getElementById("append_parent");
    document.getElementById("fwin_dialog_submit").click();
    //popup.style.display = "none";
    window.alert = function(str){
return;
}
    // Your code here...
})();