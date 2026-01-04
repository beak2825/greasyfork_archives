// ==UserScript==
// @name         隐藏fundebug
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏过期弹窗
// @author       SPM
// @match        https://www.fundebug.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388447/%E9%9A%90%E8%97%8Ffundebug.user.js
// @updateURL https://update.greasyfork.org/scripts/388447/%E9%9A%90%E8%97%8Ffundebug.meta.js
// ==/UserScript==
(function () {
    "use strict";
    setTimeout(function () {
        (document.getElementsByClassName("Modal")[0]).style.display = "none";
    }, 1000);
    // Your code here...
})();
