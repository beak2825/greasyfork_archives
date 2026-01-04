// ==UserScript==
// @name         暗黑模式
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.ptwxz.com/html/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420894/%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/420894/%E6%9A%97%E9%BB%91%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("main").setAttribute("class","")
    document.body.style.backgroundColor="#000";
    document.body.style.color="#a9a9a9";
})();