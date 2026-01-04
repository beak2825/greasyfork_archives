// ==UserScript==
// @name        remove the logo of zhihu
// @namespace   remove the logo of zhihu
// @match       https://zhuanlan.zhihu.com/*
// @grant       none
// @version     1.0.7
// @author      -
// @description 2022/2/17 10:31:28
// @downloadURL https://update.greasyfork.org/scripts/440165/remove%20the%20logo%20of%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/440165/remove%20the%20logo%20of%20zhihu.meta.js
// ==/UserScript==
(function () {
    'use strict'; 
    document.getElementsByClassName("ColumnPageHeader-content")[0].getElementsByTagName("a")[0].style.opacity=0
    document.getElementsByClassName("ColumnPageHeader-content")[0].getElementsByClassName("ColumnPageHeader-WriteButton")[0].style.opacity=0
    document.getElementsByClassName("AppHeader-inner")[0].getElementsByTagName("a")[0].style.opacity=0
   
})();