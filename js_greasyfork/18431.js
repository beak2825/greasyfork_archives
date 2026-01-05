// ==UserScript==
// @name         Google Chrome new tab page clean up
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Removes all the clutter from Chrome's new tab page - most visited pages thumbnails and the Google search box and logo
// @author       You
// @match        
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18431/Google%20Chrome%20new%20tab%20page%20clean%20up.user.js
// @updateURL https://update.greasyfork.org/scripts/18431/Google%20Chrome%20new%20tab%20page%20clean%20up.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';


// Removes thumbnails
var div = document.getElementById("most-visited");
if (div) {
    div.parentNode.removeChild(div);
}


// Removes search box
var div = document.getElementById("fkbx");
if (div) {
    div.parentNode.removeChild(div);
}


// Hides Google logo
var div = document.getElementById("lga");
if (div) {
    div.style.display = "none";
}