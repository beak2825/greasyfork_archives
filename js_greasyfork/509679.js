// ==UserScript==
// @name         鲨鱼TV
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  tv
// @author       You
// @match        https://www.danmutv.com/*
// @icon         https://sports3.gtimg.com/community/a2173c75a5bb42ab91c17fb723b44c43.webp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509679/%E9%B2%A8%E9%B1%BCTV.user.js
// @updateURL https://update.greasyfork.org/scripts/509679/%E9%B2%A8%E9%B1%BCTV.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    sleep(5000); // 等待 3 秒
    let ar = document.getElementById("coupletright");
    let al = document.getElementById("coupletleft");
    let am = document.getElementById("PERxrR");
    ar.remove();
    al.remove();
    am.remove();
    let aaa = document.getElementsByClassName('am-with-fixed-navbar');
    if (aaa[0].children[26].nodeName == "DIVZ") {
        aaa[0].children[26].remove()
    }
    if (aaa[0].children[24].nodeName == "DIVZ") {
        aaa[0].children[24].remove()
    }
})();