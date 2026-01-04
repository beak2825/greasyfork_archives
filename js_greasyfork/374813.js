// ==UserScript==
// @name         Pearson Fix
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Fix Pearson website malfunction when you also have adblocker enabled
// @run-at      document-start
// @author       liushuyu
// @match        https://portal.mypearson.com/course-home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374813/Pearson%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/374813/Pearson%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var node = document.createElement('script');
    node.type = 'text/javascript';
    node.textContent = 'window.ga = function() {return;}';
    var target = document.getElementsByTagName('head')[0];
    target.appendChild(node);
})();
