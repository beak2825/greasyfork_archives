// ==UserScript==
// @name        Toyhouse External Link "Continue" Button Presser
// @namespace   Violentmonkey Script for toyhou.se
// @match       https://toyhou.se/~r?q=*
// @grant       none
// @version     1.0
// @author      GMSuerte & Hum
// @description Bypasses having to click "Continue" upon clicking an off-site link.
// @downloadURL https://update.greasyfork.org/scripts/472960/Toyhouse%20External%20Link%20%22Continue%22%20Button%20Presser.user.js
// @updateURL https://update.greasyfork.org/scripts/472960/Toyhouse%20External%20Link%20%22Continue%22%20Button%20Presser.meta.js
// ==/UserScript==

window.location.replace($('.btn.btn-success.form-control').attr('href'))