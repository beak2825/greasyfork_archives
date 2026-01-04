// ==UserScript==
// @name         Sina Weibo external link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Ccl
// @match        http://t.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410753/Sina%20Weibo%20external%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/410753/Sina%20Weibo%20external%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var obj = document.querySelector("p.link");
    window.location.href= obj.innerText;
})();