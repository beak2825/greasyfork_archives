// ==UserScript==
// @name         Bilibili Purify
// @namespace    https://repobor.top/
// @version      0.1
// @description  Bilibili Remove VipTips
// @author       Repobor
// @match        *://www.bilibili.com/bangumi/play/*
// @match        *://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403007/Bilibili%20Purify.user.js
// @updateURL https://update.greasyfork.org/scripts/403007/Bilibili%20Purify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(function(){
        var vippaybar = document.getElementById('paybar_module');
        if (vippaybar != null){
            vippaybar.style.setProperty('display','none')
        //vippaybar.parentNode.removeChild(vippaybar)
        }
        document.getElementsByClassName("nav-link-item")[7].style.setProperty('display','none')//去除下载APP
        document.getElementsByClassName("mini-vip van-popover__reference")[0].style.setProperty('display','none')//去除头像旁边的大会员
    } ,1000)
})();