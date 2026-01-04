// ==UserScript==
// @name         My 12306
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://kyfw.12306.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404183/My%2012306.user.js
// @updateURL https://update.greasyfork.org/scripts/404183/My%2012306.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // https://kyfw.12306.cn/
    // Your code here...
    document.getElementById("audiojs_wrapper1").setAttribute("style", "display: none");
})();