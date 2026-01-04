// ==UserScript==
// @name         uploadhaven.com premium/skip
// @namespace    https://greasyfork.org/en/scripts/433004-uploadhaven-com-premium-skip
// @version      0.1
// @description  Unrestricted Uploadhaven Download Speeds + Shortened Download Time
// @author       me
// @match        ://.uploadhaven.com/*
// @run-at       document-end
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527336/uploadhavencom%20premiumskip.user.js
// @updateURL https://update.greasyfork.org/scripts/527336/uploadhavencom%20premiumskip.meta.js
// ==/UserScript==
setTimeout(function() {

jQuery('#submitFree').html('<button class="btn btn-submit-free" type="submit" name="type" value="free" id="submitFree">Free Download</button>')

}, 5000); //Five seconds will elapse and Code will execute.