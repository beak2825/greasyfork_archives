// ==UserScript==
// @name        Edinburgh Learn Auto-login
// @namespace   Violentmonkey Scripts
// @match       https://www.learn.ed.ac.uk/
// @match       https://www.ease.ed.ac.uk/cosign.cgi
// @match       https://www.ease.ed.ac.uk/login/
// @grant       none
// @version     1.0
// @author      -
// @description 12/8/2022, 11:41:57 AM
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/456268/Edinburgh%20Learn%20Auto-login.user.js
// @updateURL https://update.greasyfork.org/scripts/456268/Edinburgh%20Learn%20Auto-login.meta.js
// ==/UserScript==

console.log("Edinburgh Learn Auto-login loaded")

// Delay function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Detect which page we're on using regex, allowing for the possibility of query parameters
if (window.location.href.match(/https:\/\/www\.learn\.ed\.ac\.uk\/\??.*/)) {
    // If we're on the main Learn page, click the login button
    window.document.getElementsByClassName("easelogin-bt")[0].click()
}

if (window.location.href.match(/https:\/\/www\.ease\.ed\.ac\.uk\/cosign\.cgi\??.*/)) {
    // Wait for the auto-fill to happen
    sleep(50).then(() => {
        // Check if id="login" has non-empty value
        if (window.document.getElementById("login").value != "") {
            // If it does not, click the login button
            window.document.getElementById("submit").click()
        }
    })
}

if (window.location.href.match(/https:\/\/www\.ease\.ed\.ac\.uk\/login\/\??.*/)) {
    // Wait for the auto-fill to happen
    sleep(50).then(() => {
        // Check if id="login" has non-empty value
        if (window.document.getElementById("login").value != "" && window.document.getElementById("password").value != "") {
            // If it does not, click the login button
            window.document.getElementById("submit").click()
        }
    })
}