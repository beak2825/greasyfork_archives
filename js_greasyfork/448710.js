// ==UserScript==
// @name        Countdown Bypass for uploadhaven.com
// @namespace   Violentmonkey Scripts
// @match       *://*.uploadhaven.com/*
// @grant       none
// @version     1.1
// @author      Reddiepoint
// @description Bypasses 15 second timer and continues to download page
// @run-at      document-end
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/448710/Countdown%20Bypass%20for%20uploadhavencom.user.js
// @updateURL https://update.greasyfork.org/scripts/448710/Countdown%20Bypass%20for%20uploadhavencom.meta.js
// ==/UserScript==
setTimeout(function() {
    // Create the button
    jQuery('#submitFree').html('<button class="btn btn-submit-free" type="submit" name="type" value="free" id="submitFree">Free Download</button>');
 
    // Click the button
    document.getElementById("submitFree").firstChild.click();
}, 4000); // Lowering the time too low will cause an error: "Session expired, please try again"


