// ==UserScript==
// @name         避免洛谷提示Request Blocked
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  在使用洛谷时，如果回退页面或前进页面经常会遇到`Request Blocked`的情况，这个脚本能检测并自动刷新页面。
// @author       gandyli
// @match        *://*.luogu.org/*
// @exclude      *://*.luogu.org/login/logout?uid=*
// @exclude      *://*.luogu.org/ide
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382915/%E9%81%BF%E5%85%8D%E6%B4%9B%E8%B0%B7%E6%8F%90%E7%A4%BARequest%20Blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/382915/%E9%81%BF%E5%85%8D%E6%B4%9B%E8%B0%B7%E6%8F%90%E7%A4%BARequest%20Blocked.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var reg1 = new RegExp("^((?!blog).)*https://www.luogu.org((?!blog).)*$"), reg2 = new RegExp("^((?!blog).)*http://www.luogu.org((?!blog).)*$"), reg3= new RegExp("^((?!blog).)*https://www2.luogu.org((?!blog).)*$"), reg4=new RegExp("^((?!blog).)*http://www2.luogu.org((?!blog).)*$");
    var str = window.location.href;
    if (reg1.test(str) || reg2.test(str) || reg3.test(str) || reg4.test(str)){
     if (document.getElementById("app-header")===null)
     {
            location.reload();
     }}
})();