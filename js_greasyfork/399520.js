// ==UserScript==
// @name         无敌反吊丧
// @namespace    https://www.baijifeilong.com
// @version      1.1
// @description  禁用网页吊丧模式
// @author       BaiJiFeiLong@gmail.com
// @include      http://*/*
// @include      https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399520/%E6%97%A0%E6%95%8C%E5%8F%8D%E5%90%8A%E4%B8%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/399520/%E6%97%A0%E6%95%8C%E5%8F%8D%E5%90%8A%E4%B8%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => document.querySelectorAll("*").forEach(x => {
        window.getComputedStyle(x).filter.includes("grayscale") && x.style.setProperty("filter", "grayscale(0)", "important");
    }),1000);
})();