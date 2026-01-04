// ==UserScript==
// @name         ip138 auto focus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto focus ip textbox when access ip138.com
// @author       You
// @match        http://www.ip138.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368099/ip138%20auto%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/368099/ip138%20auto%20focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('ip').focus();
    // Your code here...
})();