// ==UserScript==
// @name         Just Click
// @description  Sadece Butona basar
// @author       ArdaG
// @version      v1
// @match        https://stake.com/tr/?drop=*
// @match        https://stake.com/?drop=*
// @match        https://stake.com/tr?drop=*
// @match        https://stake.com/tr/settings/offers?type=drop*
// @match        https://stake.com/settings/offers?type=drop*
// @run-at       document-idle
// @namespace https://greasyfork.org/users/824858
// @downloadURL https://update.greasyfork.org/scripts/482542/Just%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/482542/Just%20Click.meta.js
// ==/UserScript==

setInterval(function() {
document.querySelectorAll("button[type='submit']")[0].click()
}, 1500)

