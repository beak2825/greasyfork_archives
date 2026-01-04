// ==UserScript==
// @name        EE:DB 500 Error Redirect
// @description Works around a bug in HabboUK's EE:DB code to redirect to the log in page if signed out.
// @namespace   NDYC
// @homepageURL https://github.com/noahc500
// @match       https://habbouk.com/eedb
// @version     1.1
// @author      NDYC
// @license    GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/516119/EE%3ADB%20500%20Error%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/516119/EE%3ADB%20500%20Error%20Redirect.meta.js
// ==/UserScript==
if (document.getElementsByTagName('div')[2].innerText == "Server Error") {
  document.getElementsByTagName('div')[2].innerHTML = "Restricted Page<br/>Redirecting to Login"
  window.location.replace("https://habbouk.com/login")
}