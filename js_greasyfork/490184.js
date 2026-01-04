// ==UserScript==
// @name         Disable SMS Popup
// @namespace    http://your.namespace.com
// @version      1
// @description  Disables the annoying SMS popup.
// @author       Rob clayton
// @match        https://workplace.plus.net/tickets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490184/Disable%20SMS%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/490184/Disable%20SMS%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the onclick behavior with a simple function
    function disablePopup() {
        // This function does nothing, effectively disabling the popup
    }

    // Find the checkbox element by ID
    var checkbox = document.getElementById("sms_optin");

    // Check if the checkbox exists
    if (checkbox) {
        // Replace the onclick event with our function
        checkbox.onclick = disablePopup;
    }
})();
