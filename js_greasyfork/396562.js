// ==UserScript==
// @name         关闭腾讯课堂正在观看弹幕
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  关闭***正在观看直播弹幕 2020-2-18 有效
// @author       SDchao
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @require      https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/396562/%E5%85%B3%E9%97%AD%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/396562/%E5%85%B3%E9%97%AD%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E6%AD%A3%E5%9C%A8%E8%A7%82%E7%9C%8B%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

var intervalFlag;

(function() {
    'use strict';

    // Your code here...
    intervalFlag = setInterval(clearDamu,300);
})();

function clearDamu() {
    var marquee = document.getElementById("marquee");
    if(marquee) {
        marquee.firstElementChild.innerHTML = "";
        // clearInterval(intervalFlag);
    }

    $("div[class^='player-marquee']").remove();
}