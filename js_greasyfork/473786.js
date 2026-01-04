// ==UserScript==
// @name         小cj
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简单test
// @author       Dj
// @match        *://v.qq.com/*
// @icon         https://trademark.zbjimg.com/pattern-prod/20191009/image_3/40885990.jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473786/%E5%B0%8Fcj.user.js
// @updateURL https://update.greasyfork.org/scripts/473786/%E5%B0%8Fcj.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.getElementById("header-logo");
    a.href = 'https://jx.xmflv.com/?url='+window.location.href;
})();