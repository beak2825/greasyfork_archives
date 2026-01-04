// ==UserScript==
// @name         大米星球去广告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  去广告!
// @author       宠儿
// @match        https://dami6.vip/*
// @match        https://c1dm2r3.com/*
// @match        https://d4m5q6r.com/*
// @match        https://1dm2x3y.com/*
// @match        https://2dm3v4w.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dami6.vip
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477001/%E5%A4%A7%E7%B1%B3%E6%98%9F%E7%90%83%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/477001/%E5%A4%A7%E7%B1%B3%E6%98%9F%E7%90%83%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let a1 = document.getElementsByClassName('is_pc')
    for (var i=0;i<a1.length;i=i+1) {
        a1[i].style.display="none"
    }
    let a2 = document.getElementsByClassName('is_pc_flex')
    for (var n=0;n<a2.length;n=n+1) {
        a2[0].children[0].style.display = 'none'
        a2[0].children[1].style.display = 'none'
    }
})();