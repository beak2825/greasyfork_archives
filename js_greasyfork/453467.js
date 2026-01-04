// ==UserScript==
// @name         去除honeyhunterworld广告
// @namespace    http://tampermonkey.net/
// @version      0.13
// @description  去掉honeyhunterworld中烦人的广告
// @author       monokuro
// @match        https://genshin.honeyhunterworld.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453467/%E5%8E%BB%E9%99%A4honeyhunterworld%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/453467/%E5%8E%BB%E9%99%A4honeyhunterworld%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    let ad1 = document.querySelector('.ad_sidebar_left')
    let ad2 = document.querySelector('.ad_sidebar_right')
    let ad3 = document.querySelector('.ad_header_top')
    let ad4 = document.querySelector('.sidebar_cont.ad_content_bottom')
    ad1.parentElement.removeChild(ad1)
    ad2.parentElement.removeChild(ad2)
    ad3.parentElement.removeChild(ad3)
    ad4.parentElement.removeChild(ad4)
})();