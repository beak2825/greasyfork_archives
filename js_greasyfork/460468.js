// ==UserScript==
// @name        Auto-login to Fitradio
// @namespace   Violentmonkey Scripts
// @match       https://fitradio.com/login
// @grant       none
// @version     1.2
// @author      -
// @license     MIT
// @description automatically clicks login on fitradio.com/login
// @downloadURL https://update.greasyfork.org/scripts/460468/Auto-login%20to%20Fitradio.user.js
// @updateURL https://update.greasyfork.org/scripts/460468/Auto-login%20to%20Fitradio.meta.js
// ==/UserScript==

function click() {
  document.getElementById("btn_login").click()
}

window.addEventListener('load', function() {
    setInterval(click, 2000)
}, false);