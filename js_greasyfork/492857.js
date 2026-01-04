// ==UserScript==
// @name         Enable Hidden Go To Link Button on byteswifts.com/{any_page}
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable and unhide the button with ID "gotolink" on byteswifts.com/{any_page} -> if it exists!
// @author       You
// @match        https://sl.byteswifts.com/*
// @grant        none
// @license      GMT
// @downloadURL https://update.greasyfork.org/scripts/492857/Enable%20Hidden%20Go%20To%20Link%20Button%20on%20byteswiftscom%7Bany_page%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/492857/Enable%20Hidden%20Go%20To%20Link%20Button%20on%20byteswiftscom%7Bany_page%7D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove 'hidden' class and 'disabled' attribute from the button
    function enableButton() {
        var button = document.getElementById("gotolink");
        if (button) {
            button.classList.remove("hidden");
            button.removeAttribute("disabled");
        }
    }

    // Call enableButton function
    enableButton();

})();
