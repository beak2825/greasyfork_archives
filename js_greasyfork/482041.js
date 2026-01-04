// ==UserScript==
// @name         Vikacg Newtab Ads Auto-Close
// @version      2.0
// @description  Newtab Ads Auto-Close
// @author       Uber-Eins
// @match        *://*/*
// @icon         https://icons.duckduckgo.com/ip2/vikacg.com.ico
// @license MIT
// @namespace https://greasyfork.org/users/957139
// @downloadURL https://update.greasyfork.org/scripts/482041/Vikacg%20Newtab%20Ads%20Auto-Close.user.js
// @updateURL https://update.greasyfork.org/scripts/482041/Vikacg%20Newtab%20Ads%20Auto-Close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.opener) {
        //console.log('Page opened by script, closing window...');
        window.close();
    } else {
        console.log('Page opened by user');
    }
})();