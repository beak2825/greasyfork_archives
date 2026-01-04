// ==UserScript==
// @name         Baidu Translation Optimizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simplify Baidu Translate！
// @author       lihaji
// @match        https://fanyi.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490807/Baidu%20Translation%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/490807/Baidu%20Translation%20Optimizer.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 隐藏多余元素
    document.getElementById("side-nav").style.display = "none";
    document.getElementById("header").style.display = "none";
    document.getElementById("left-result-container").remove()
    document.querySelector(".footer").remove()
    document.querySelector(".trans-operation-wrapper").style.display = "none";

})();