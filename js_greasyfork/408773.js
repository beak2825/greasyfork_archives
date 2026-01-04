// ==UserScript==
// @name         Old Reddit (only if in new reddit)
// @namespace    https://www.reddit.com/
// @version      1.3
// @description  Forces usage of the old reddit version if new reddit is detected
// @match        https://www.reddit.com/*
// @match        https://reddit.com/r/*
// @match        https://www.reddit.com/
// @match        https://reddit.com/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/408773/Old%20Reddit%20%28only%20if%20in%20new%20reddit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/408773/Old%20Reddit%20%28only%20if%20in%20new%20reddit%29.meta.js
// ==/UserScript==

if ((document.getElementById("2x-container") != null) || (document.getElementById("acceptabletest") != null) || (document.getElementById("adblocktest") != null) || (document.getElementById("popular-posts") != null) || (document.getElementById("navbar-menu-button") != null)) {
    window.location.replace("https://old.reddit.com" + window.location.pathname);
}