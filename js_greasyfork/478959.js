// ==UserScript==
// @name     Remove Threads link and red badge on instagram.com
// @version  1.0
// @description  Removes the div with the href https://www.threads.net/ on instagram.com without using the class xdy9tzy
// @author    Jonathan Woolf
// @match    https://www.instagram.com/*
// @grant    none
// @license  Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
// @namespace https://greasyfork.org/users/1008047
// @downloadURL https://update.greasyfork.org/scripts/478959/Remove%20Threads%20link%20and%20red%20badge%20on%20instagramcom.user.js
// @updateURL https://update.greasyfork.org/scripts/478959/Remove%20Threads%20link%20and%20red%20badge%20on%20instagramcom.meta.js
// ==/UserScript==

(function() {
'use strict';

// Get the div to remove
var divToRemove = document.querySelector('a[href="https://www.threads.net/"]').parentNode.parentNode;

// Remove the div if it exists
if (divToRemove) {
divToRemove.parentNode.removeChild(divToRemove);
}
})();