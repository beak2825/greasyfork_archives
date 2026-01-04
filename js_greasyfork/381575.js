// ==UserScript==
// @name         BILIBILI收藏夹调转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bilibili跳转
// @author       Lost
// @match        https://www.bilibili.com/medialist/play/ml*/av*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381575/BILIBILI%E6%94%B6%E8%97%8F%E5%A4%B9%E8%B0%83%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/381575/BILIBILI%E6%94%B6%E8%97%8F%E5%A4%B9%E8%B0%83%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

     var iSite = window.location.href;
 var reg = /av[0-9]{1,20}/g;
 var numList = iSite.match(reg);
 var sUrl="";
 sUrl='https://www.bilibili.com/video/'+ numList;window.location.href =sUrl;

})();