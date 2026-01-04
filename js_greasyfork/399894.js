// ==UserScript==
// @name         ReloadPage 2.5min
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://freebitco.in/
// @match        http://example.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399894/ReloadPage%2025min.user.js
// @updateURL https://update.greasyfork.org/scripts/399894/ReloadPage%2025min.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){ location.reload(); }, 2000*10*6);
})();