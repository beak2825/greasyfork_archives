// ==UserScript==
// @name         My iocoder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://www.iocoder.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395418/My%20iocoder.user.js
// @updateURL https://update.greasyfork.org/scripts/395418/My%20iocoder.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // http://www.iocoder.cn/
    // Your code here...
    document.getElementById("locker").setAttribute("style", "none");
    document.getElementById("post-body").setAttribute("style", "none");
})();