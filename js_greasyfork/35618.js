// ==UserScript==
// @name         remove Kami ad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://web.kamihq.com/web/viewer.html*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/35618/remove%20Kami%20ad.user.js
// @updateURL https://update.greasyfork.org/scripts/35618/remove%20Kami%20ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById("outerContainer").className="ng-scope";
})();