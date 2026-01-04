// ==UserScript==
// @name         hideGoogleSearchAds
// @description  Hide ad results in google search
// @author       David K Johnson
// @license      MIT License
// @icon         https://www.google.com/favicon.ico
// @match        *://*.google.com/search*
// @grant        none
// @version      1.0
// @run-at       document-end
// @namespace    https://greasyfork.org/users/572366
// @downloadURL https://update.greasyfork.org/scripts/464703/hideGoogleSearchAds.user.js
// @updateURL https://update.greasyfork.org/scripts/464703/hideGoogleSearchAds.meta.js
// ==/UserScript==

document.getElementById("tvcap").remove();
document.getElementById("tadsb").remove();

var sideads = document.getElementsByClassName('cu-container');
for (let i = 0; i < sideads.length; i++) {
    sideads.item(i).remove();
}