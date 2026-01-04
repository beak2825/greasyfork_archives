// ==UserScript==
// @name        Login
// @namespace   Login to account
// @match       https://fap.fpt.edu.vn/Default.aspx
// @grant       none
// @version     1.0
// @author      -Eric Anti Code
// @description 22:09:36 16/12/2024
// @downloadURL https://update.greasyfork.org/scripts/520921/Login.user.js
// @updateURL https://update.greasyfork.org/scripts/520921/Login.meta.js
// ==/UserScript==
(function() {
    'use strict';

    setTimeout(() => {
        // Tìm dropdown campus
        const campusDropdown = document.getElementById("ctl00_mainContent_ddlCampus");
        const selectedValue = campusDropdown.value;

        if (selectedValue === "4") {
            clickLoginButton();
        } else {
            campusDropdown.value = "4";
            __doPostBack('ctl00$mainContent$ddlCampus', '');
        }
    }, 2000);

    function clickLoginButton() {
        const intervalId = setInterval(() => {
            const googlePlusButton = document.querySelector('span.fa.fa-google-plus');

            if (googlePlusButton) {
                googlePlusButton.click();
                clearInterval(intervalId);
            }
        }, 1000);
    }
})();