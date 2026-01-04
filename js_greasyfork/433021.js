// ==UserScript==
// @name         logosc去水印
// @namespace    http://lzskyline.com/
// @version      0.1
// @description  简单的周期去水印
// @author       LzSkyline
// @match        https://www.logosc.cn/*
// @icon         https://www.google.com/s2/favicons?domain=logosc.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433021/logosc%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/433021/logosc%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){$(".watermarklayer").hide()}, 1000);
    // Your code here...
})();