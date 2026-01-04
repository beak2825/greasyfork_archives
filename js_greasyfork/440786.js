// ==UserScript==
// @name         老烤鸭去广告
// @namespace    http://tampermonkey.net/
 
// @version      0.2
// @description  remove ads in www.laokaoya.com
// @author       HitLittleFox
// @license      AGPL-3.0
// @match        *://www.laokaoya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440786/%E8%80%81%E7%83%A4%E9%B8%AD%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/440786/%E8%80%81%E7%83%A4%E9%B8%AD%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    var removeads1= document.querySelector(".laoka-before-content-4")
    removeads1.hidden=true

    var removeads2= document.querySelector(".textwidget")
    removeads2.hidden=true

    var removeads3= document.querySelector(".laoka-after-content_3")
    removeads3.hidden=true


})();