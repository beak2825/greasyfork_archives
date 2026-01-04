// ==UserScript==
// @name         电子书阅读器在线阅读页面净化
// @namespace    http://tampermonkey.net/
// @description  去除http://reader.epubee.com网站底部开通VIP的广告，净化页面
// @version      1.00
// @include      http://reader.epubee.com/*
// @include      http://cn.epubee.com/*
// @require      http://code.jquery.com/jquery-1.8.2.js
// @author       lhp
// @grant        GM.xmlHttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/397177/%E7%94%B5%E5%AD%90%E4%B9%A6%E9%98%85%E8%AF%BB%E5%99%A8%E5%9C%A8%E7%BA%BF%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/397177/%E7%94%B5%E5%AD%90%E4%B9%A6%E9%98%85%E8%AF%BB%E5%99%A8%E5%9C%A8%E7%BA%BF%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeAd(){
        var adTable = document.getElementsByClassName("vipNoteBar");
        let i=0;
        Object.keys(adTable).forEach(function(key){
            console.log("i="+i);
            adTable[0].remove();
        });
    }

    removeAd();
})();
