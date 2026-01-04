// ==UserScript==
// @name         Simple HTTPS Anywhere
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  try to take over the world!
// @description:zh-CN 自动强制安全链接！
// @author       Gear
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419510/Simple%20HTTPS%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/419510/Simple%20HTTPS%20Anywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';
     if(window.location.href.replaceAll('http://','https://')!=window.location.href)
         window.location.href = window.location.href.replaceAll('http://','https://');
    // Your code here...
})();