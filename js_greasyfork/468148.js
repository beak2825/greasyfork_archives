// ==UserScript==
// @name         Update Cookies
// @namespace    http://example.com/
// @version      1.0
// @description  Updates the inviteNumber and tier cookies with new values on website startup
// @match        *://*/*
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/468148/Update%20Cookies.user.js
// @updateURL https://update.greasyfork.org/scripts/468148/Update%20Cookies.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set new values for the cookies
    document.cookie = "inviteNumber=100; path=/";
    document.cookie = "tier=5; path=/";

    // Store the updated cookie values in the browser's storage
    GM_setValue("updatedCookies", document.cookie);

    // Verify that the values have been updated
    console.log(document.cookie);
})();
