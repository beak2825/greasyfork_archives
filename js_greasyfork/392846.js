// ==UserScript==
// @name         javbus页面去广告
// @namespace    http://tampermonkey.net/
// @description  去除www.javbus.com网站中的广告，净化页面
// @version      1.11
// @include      http://www.javbus.com/*
// @include      https://www.javbus.com/*
// @require      http://code.jquery.com/jquery-1.8.2.js
// @author       lhp
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/392846/javbus%E9%A1%B5%E9%9D%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/392846/javbus%E9%A1%B5%E9%9D%A2%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeAd(){
        var adTable = document.getElementsByClassName("ad-table");
        if(adTable) adTable.remove();
    }
})();
