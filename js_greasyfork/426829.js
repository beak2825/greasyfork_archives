// ==UserScript==
// @name        Auto AWS SSO CLI - Login
// @namespace   Violentmonkey Scripts
// @match       https://*.awsapps.com/start/user-consent/authorize.html?clientId=*
// @grant       none
// @version     1.0
// @author      Nicholas Hawkes
// @description Automatically presses the "Sign in to AWS CLI" button
// @homepage    https://gist.github.com/hawkesn/ae9fc22fc5d17ac250f6376b0591161c 
// @downloadURL https://update.greasyfork.org/scripts/426829/Auto%20AWS%20SSO%20CLI%20-%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/426829/Auto%20AWS%20SSO%20CLI%20-%20Login.meta.js
// ==/UserScript==

window.onload = function() {
  document.getElementById('cli_login_button').click()
}