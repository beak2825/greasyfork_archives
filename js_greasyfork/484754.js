// ==UserScript==
// @name         Hide note counts on Tumblr
// @description  This is a script that hides how many notes posts have on Tumblr.
// @author       Tako
// @match        https://www.tumblr.com/*
// @grant        GM_addStyle
// @grant        window.onurlchange
// @run-at       document-start
// @version 0.0.1.20240113164145
// @namespace https://greasyfork.org/users/1247555
// @downloadURL https://update.greasyfork.org/scripts/484754/Hide%20note%20counts%20on%20Tumblr.user.js
// @updateURL https://update.greasyfork.org/scripts/484754/Hide%20note%20counts%20on%20Tumblr.meta.js
// ==/UserScript==

// Tampermonkey provides this useful utility for detecting URL changes
// (for single-page applications):
// https://www.tampermonkey.net/documentation.php?locale=en#api:window.onurlchange

window.addEventListener('urlchange', urlCheck);

function urlCheck() {
    if (window.location.href.indexOf("tumblr.com/tagged/") != -1) {
        // If you want to hide notes everywhere on Tumblr, you can delete
        // ^ this URL check and delete the "else" below as well.
        // Otherwise, only on tag pages, hides the notes number
        GM_addStyle('.xu5ZG { display:none !important; }');
    }
    else {
        // Restore note count when switching to non-tag pages
        GM_addStyle('.xu5ZG { display:inline !important; }');
    }
}