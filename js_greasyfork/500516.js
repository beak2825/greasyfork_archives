// ==UserScript==
// @name         Reyre STB Auto Login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=forum.openwrt.org
// @version      0.2
// @description  AutoLogin script for Webui FW Reyre STB, you need to edit password credential to make it work
// @author       fafnirtelu
// @match        http://*.192.168.1.1/cgi-bin/luci/*
// @grant        none
// @license		 MIT
// @namespace https://greasyfork.org/users/1329196
// @downloadURL https://update.greasyfork.org/scripts/500516/Reyre%20STB%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/500516/Reyre%20STB%20Auto%20Login.meta.js
// ==/UserScript==


function login() {
    // Wait for the DOM to be fully loaded
    if (document.readyState !== 'complete') {
        return setTimeout(login, 100); // Try again in 100ms
    }

    let passwordField = document.getElementsByName("luci_password")[0];
    let loginButton = document.getElementsByClassName("btn cbi-button cbi-button-apply")[0];

    if (passwordField && loginButton) {
        passwordField.value = "";  // Replace with your password here
        loginButton.click();

        // Remove the event listener after clicking
        window.removeEventListener('load', login);
    } else {
        console.log("Login elements not found. This might not be the login page.");
    }
}

// Add the event listener
window.addEventListener('load', login);