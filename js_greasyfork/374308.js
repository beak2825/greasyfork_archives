// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://weibo.com/u/1860563805?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374308/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/374308/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
     setTimeout(function () {
        window.location.reload();
     } ,5000);
})();