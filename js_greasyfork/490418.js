// ==UserScript==
// @name         1point3acres ads remover
// @namespace    http://tampermonkey.net/
// @version      v0.1
// @description  Clean the ads on the 1point3acres.com 移除一亩三分地上的广告
// @author       phy
// @match        www.1point3acres.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490418/1point3acres%20ads%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/490418/1point3acres%20ads%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove the ads on the top
    Array.prototype.forEach.call(
         document.querySelectorAll("#ad-container"),
         function(element) {
             element.remove();
         });

    // Remove the ads on the right side
    Array.prototype.forEach.call(
         document.querySelectorAll(".sd"),
         function(element) {
             element.remove();
         });

    // Remove the ads inside user's comments
    Array.prototype.forEach.call(
         document.querySelectorAll(".mx-auto"),
         function(element) {
             //element.style.display = "none";
             element.remove();
         });

    // Remove the ads below user's comments
    Array.prototype.forEach.call(
         document.querySelectorAll("td.plc.plm"),
         function(element) {
             element.remove();
         });
})();