// ==UserScript==
// @name         哈哈的学习速成
// @namespace    http://tampermonkey.net/
// @version      2024-12-19
// @description  快速学习
// @license MIT
// @author       You
// @match        *://zyjs.21train.cn/play/play.aspx*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=21train.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521219/%E5%93%88%E5%93%88%E7%9A%84%E5%AD%A6%E4%B9%A0%E9%80%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/521219/%E5%93%88%E5%93%88%E7%9A%84%E5%AD%A6%E4%B9%A0%E9%80%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
"use strict";
var intervalId;
var start = function () {
    intervalId = setInterval(function () {
        try {
            var v = document.querySelectorAll("iframe")[0].contentDocument.querySelectorAll("video")[0]
            if (v && intervalId) {
              v.playbackRate = 16;
              clearInterval(intervalId);
              intervalId = null;
            }
        } catch (e) {
        }
  }, 1000);
};
start();
    // Your code here...
})();