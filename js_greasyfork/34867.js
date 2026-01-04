// ==UserScript==
// @name         Pop-up to cornfirm refresh/exit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  confirm refresh/exit for moomoo.io
// @author       shii
// @match        moomoo.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34867/Pop-up%20to%20cornfirm%20refreshexit.user.js
// @updateURL https://update.greasyfork.org/scripts/34867/Pop-up%20to%20cornfirm%20refreshexit.meta.js
// ==/UserScript==

window.onbeforeunload = function() {
   return "";
};