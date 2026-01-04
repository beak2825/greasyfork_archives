// ==UserScript==
// @name         Import Jquery
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add jquery to websites for console debugging
// @author       Jerome Scott
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        *://*/*
// @run-at       document-end
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/438483/Import%20Jquery.user.js
// @updateURL https://update.greasyfork.org/scripts/438483/Import%20Jquery.meta.js
// ==/UserScript==

// access jquery object using $ in developer console
var $ = window.jQuery

