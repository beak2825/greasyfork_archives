// ==UserScript==
// @name         调试时阻止页面跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       dingjz
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418977/%E8%B0%83%E8%AF%95%E6%97%B6%E9%98%BB%E6%AD%A2%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418977/%E8%B0%83%E8%AF%95%E6%97%B6%E9%98%BB%E6%AD%A2%E9%A1%B5%E9%9D%A2%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onbeforeunload = function(event) {
        console.log(event);
        debugger
        return false;
    }
    // Your code here...
})();