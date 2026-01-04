// ==UserScript==
// @name         Toolss.net Bypass
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Decode the value of the input field named "newwpsafelink" and redirect to the decoded URL after "safelink_redirect="
// @author       You
// @match        toolss.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492893/Toolssnet%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/492893/Toolssnet%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to decode the base64 value and extract the URL after "safelink_redirect="
    function decodeAndRedirect() {
        // Get the input element with name "newwpsafelink"
        var inputElement = document.querySelector('input[name="newwpsafelink"]');
        if (inputElement) {
            var base64Value = inputElement.value;
            // Decode the base64 value
            var decodedValue = atob(base64Value);
            // Find the index of "safelink_redirect="
            var index = decodedValue.indexOf("safelink_redirect=");
            if (index !== -1) {
                // Extract the URL after "safelink_redirect="
                var urlStartIndex = index + "safelink_redirect=".length;
                var redirectUrl = decodedValue.substring(urlStartIndex).split('"')[0];
                // Redirect to the decoded URL
                window.location.href = "https://toolss.net?safelink_redirect=" + redirectUrl;
            }
        }
    }

    // Call the decodeAndRedirect function when the page loads
    window.addEventListener('load', decodeAndRedirect);

})();
