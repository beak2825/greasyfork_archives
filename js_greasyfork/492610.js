// ==UserScript==
// @name        Auto AWS SSO CLI - Login
// @namespace   https://greasyfork.org/users/1009418
// @match       https://*.awsapps.com/start/*
// @grant       none
// @version     1.0
// @author      Bernd VanSkiver
// @description Automatically presses the "Allow access" button and closes the window
// @downloadURL https://update.greasyfork.org/scripts/492610/Auto%20AWS%20SSO%20CLI%20-%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/492610/Auto%20AWS%20SSO%20CLI%20-%20Login.meta.js
// ==/UserScript==

window.onload = function() {
  setTimeout(() => {
    const loginButton = document.getElementById('cli_login_button');
    if (loginButton) {
      loginButton.click();
      setInterval(() => {
        window.close();
      }, 1000);
    }
  }, 1000);
}