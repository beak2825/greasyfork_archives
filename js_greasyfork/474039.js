// ==UserScript==
// @name         NitroType Login Automation
// @namespace    https://singdev.wixsite.com/sing-developments/
// @version      12.0
// @description  Automate NitroType login actions using Google Login. Works well with AutoKey and Nitro Typer.
// @author       Sing Developments
// @match        https://www.nitrotype.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474039/NitroType%20Login%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/474039/NitroType%20Login%20Automation.meta.js
// ==/UserScript==

(function() {
    // Function to check the current URL and perform actions accordingly
    function checkURL() {
        if (window.location.href.includes('https://www.nitrotype.com/login')) {
            // Redirect to the Google Login page.
            window.location.href = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=530728710703.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.nitrotype.com%2Foauth%3Ftype%3Dgoogle&scope=openid%20profile%20email&response_type=code&service=lso&o2v=1&flowName=GeneralOAuthFlow';
            console.log('Logging In.');
            // Wait until the login page loads again
            var loginInterval = setInterval(function() {
                if (window.location.href.includes('https://www.nitrotype.com/login')) {
                    clearInterval(loginInterval); // Stop checking
                    // Redirect to the Google Login page again
                    window.location.href = 'https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=530728710703.apps.googleusercontent.com&redirect_uri=https%3A%2F%2Fwww.nitrotype.com%2Foauth%3Ftype%3Dgoogle&scope=openid%20profile%20email&response_type=code&service=lso&o2v=1&flowName=GeneralOAuthFlow';
                    console.log('Logging In Again.');
                }
            }, 1000); // Check every second
        } else if (window.location.href.includes('https://www.nitrotype.com/garage')) {
            // If on the garage page, redirect to the race page.
            window.location.href = 'https://www.nitrotype.com/race';
            console.log('Going to race from garage.');
        }
    }

    // Repeat the loop every 2 seconds
    setInterval(checkURL, 2000);
})();
