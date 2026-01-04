// ==UserScript==
// @name         Telegram Deneme
// @description  Automatic reloads every 10 minutes. updated for latest Stake website. Will work forever!
// @author       ArdaG
// @version      2023.11.27
// @match        https://web.telegram.org*
// @match        https://web.telegram.org/a/#-1001356950325*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/1224395
// @downloadURL https://update.greasyfork.org/scripts/480896/Telegram%20Deneme.user.js
// @updateURL https://update.greasyfork.org/scripts/480896/Telegram%20Deneme.meta.js
// ==/UserScript==

(function() {
setInterval(function() {
  window.location.replace("https://web.telegram.org/a/#-1001356950325")
}, 25000)

setInterval(function() {
  document.querySelectorAll("span.Spoiler[type='submit']")[0].click()
}, 1500)
})();