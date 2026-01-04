// ==UserScript==
// @name         沪江小D清爽器
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  沪江小D页面广告杀手
// @author       乃木流架
// @match        https://dict.hjenglish.com/*
// @icon         https://dict.hjenglish.com/favicon.ico
// @grant        none
// @license      GPL-3.0 License
// @downloadURL https://update.greasyfork.org/scripts/440591/%E6%B2%AA%E6%B1%9F%E5%B0%8FD%E6%B8%85%E7%88%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/440591/%E6%B2%AA%E6%B1%9F%E5%B0%8FD%E6%B8%85%E7%88%BD%E5%99%A8.meta.js
// ==/UserScript==

(() => {
    'use strict';

    var feedback = document.querySelector('.feedback-link');
    if(feedback) feedback.remove();

    var ad5 = document.querySelector("body > div:nth-child(16)");
    var home = document.querySelector('.home');

    document.querySelectorAll('.ad').forEach(function(item){item.style.display = 'none'});
    if(home) document.querySelector('.search-wrapper').style.padding = '125px 0 200px';
    document.querySelector('.word-details-ads-placeholder').style.display = 'none';

    function adremove() {
        // document.querySelector("body > div:nth-child(16)").remove();
        document.querySelector("body > div:nth-child(17)").remove();
    }

    setTimeout(adremove, 200);
    setTimeout(adremove, 500);

    // Your code here...
})();