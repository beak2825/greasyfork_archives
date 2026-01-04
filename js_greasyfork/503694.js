// ==UserScript==
// @name         远景论坛宽屏
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-08-15
// @description  将远景论坛中的内容宽度改大
// @author       chen.com
// @match        https://bbs.pcbeta.com/*
// @icon         https://bbs.pcbeta.com/data/attachment/common/8e/common_563_icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503694/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/503694/%E8%BF%9C%E6%99%AF%E8%AE%BA%E5%9D%9B%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
        var toptb = document.querySelector("#toptb > .wp");
        toptb.style.width='90%';
        var wap = document.querySelector("#hd > .wp");
        wap.style.width='90%';
        var wp = document.getElementById('wp');
        wp.style.width='90%';
        var scbar = document.getElementById('scbar');
        scbar.style.width='100%';


    // Your code here...
})();