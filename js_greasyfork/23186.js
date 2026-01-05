// ==UserScript==
// @name        Tp-Link Autologin
// @description Tp-Link Autologin Form Filler
// @include     http://192.168.1.1/
// @version     1
// @grant       none
// @run-at      document-end
// @namespace https://greasyfork.org/users/59738
// @downloadURL https://update.greasyfork.org/scripts/23186/Tp-Link%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/23186/Tp-Link%20Autologin.meta.js
// ==/UserScript==

{document.getElementById('userName').value="YOURUSERNAME";document.getElementById('pcPassword').value="YOURPASSWORD";document.getElementById('loginBtn').click();void(0)}