// ==UserScript==
// @name         水源社区自动去除水印
// @license      MIT
// @version      0.3
// @namespace    http://tampermonkey.net/
// @description  水源社区自动去除水印，直接安装即可
// @author       shuiyuan
// @match        https://shuiyuan.sjtu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473206/%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/473206/%E6%B0%B4%E6%BA%90%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%8E%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var watermark = document.getElementById("ember7");
    watermark.innerHTML = "";
    var elms = document.querySelectorAll("*[style]");

  // Loop through them
    Array.prototype.forEach.call(elms, function(elm) {
    // Get the color value
    var clr = elm.style.opacity || "";

    // Remove all whitespace, make it all lower case
    if(clr != ""){
        elm.style = "";
    }


  });
})();