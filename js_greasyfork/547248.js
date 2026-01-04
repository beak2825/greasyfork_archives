// ==UserScript==
// @name         Auto Login on AdminPortal
// @version      1.0.0
// @description  Auto-login to AdminPortal after full page load
// @author       https://github.com/sitien173
// @match        *://*/:44331/Account/LogOn*
// @match        *://*/:44332/Account/LogOn*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1508709
// @downloadURL https://update.greasyfork.org/scripts/547248/Auto%20Login%20on%20AdminPortal.user.js
// @updateURL https://update.greasyfork.org/scripts/547248/Auto%20Login%20on%20AdminPortal.meta.js
// ==/UserScript==

(function() {
    const USERNAME = 'tien_ad';
    const PASSWORD = '123';

    const usernameInput = document.querySelector('input[name="Username"], input#Username, input[name="username"], input[name="UserName"]');
    const passwordInput = document.querySelector('input[name="Password"], input#Password, input[name="password"]');
    const submitButton = document.querySelector('button[type="submit"], input[type="submit"]');

    if (usernameInput && passwordInput && submitButton) {
        usernameInput.value = USERNAME;
        passwordInput.value = PASSWORD;

        // Trigger input events in case the app listens for them
        usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Optional small delay for better compatibility
        setTimeout(() => {
            submitButton.click();
        }, 300);
    }
})();
