// ==UserScript==
// @name        Auto AWS SSO CLI - Authorize Device
// @namespace   https://greasyfork.org/users/1009418
// @match       https://device.sso.us-east-1.amazonaws.com/?user_code=*
// @grant       none
// @version     1.0
// @author      Bernd VanSkiver
// @description Automatically presses the "Confirm and continue" button
// @downloadURL https://update.greasyfork.org/scripts/492611/Auto%20AWS%20SSO%20CLI%20-%20Authorize%20Device.user.js
// @updateURL https://update.greasyfork.org/scripts/492611/Auto%20AWS%20SSO%20CLI%20-%20Authorize%20Device.meta.js
// ==/UserScript==

window.onload = function() {
  document.getElementById('cli_verification_btn').click()
}