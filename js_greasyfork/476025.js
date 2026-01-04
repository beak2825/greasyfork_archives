// ==UserScript==
// @name         Pi-hole Autologin
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      GPLv3
// @description  Autologin to Pi-hole
// @author       xdpirate
// @match        *://pi.hole/admin/login.php
// @match        *://pi.hole/admin/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pi-hole.net
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476025/Pi-hole%20Autologin.user.js
// @updateURL https://update.greasyfork.org/scripts/476025/Pi-hole%20Autologin.meta.js
// ==/UserScript==
document.getElementById("current-password").value = "your password here";
document.querySelector(".btn-primary").click();