// ==UserScript==
// @name         腾讯视频去掉logo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       pobc
// @license      GPL License
// @match        https://v.qq.com/x/cover/5s6jjhvb15xrm59.html?ptag=10528
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394036/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E6%8E%89logo.user.js
// @updateURL https://update.greasyfork.org/scripts/394036/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E5%8E%BB%E6%8E%89logo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.hideLogTryTimes = 0;
    waitForElementToDisplay('.txp_waterMark_pic',2000);
    // Your code here...
})();


function waitForElementToDisplay(selector, time) {
    if(document.querySelector(selector)!=null ||window.hideLogTryTimes>=3) {
        document.querySelectorAll(".txp_waterMark_pic").forEach(function(item,index,arr){item.style.display='none';});
        return;
    }
    else {
        window.hideLogTryTimes++;
        setTimeout(function() {
            waitForElementToDisplay(selector, time);
        }, time);
    }
}