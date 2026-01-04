// ==UserScript==
// @name         格力入职刷课
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       止于至善
// @match        https://lexiangla.com/classes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408181/%E6%A0%BC%E5%8A%9B%E5%85%A5%E8%81%8C%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/408181/%E6%A0%BC%E5%8A%9B%E5%85%A5%E8%81%8C%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function(){
        document.getElementsByClassName("vjs-button-icon")[0].click();
        var buts = document.getElementsByTagName("button");
        for (var i = 0; i < buts.length; i++) {
            //console.log(buts[i].innerHTML);
            if (buts[i].innerHTML == "确认打卡" || buts[i].innerHTML == "<!---->  确定") {
                buts[i].click();
            }
        }
    },1000);
    // Your code here...
})();