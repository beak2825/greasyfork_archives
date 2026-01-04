// ==UserScript==
// @name         Auto Respawn
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Auto Respawn.
// @author       surp331
// @match        fanix.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426886/Auto%20Respawn.user.js
// @updateURL https://update.greasyfork.org/scripts/426886/Auto%20Respawn.meta.js
// ==/UserScript==

setInterval(() => {
document.getElementsByClassName("fas fa-play")[0].click()
}, 1000);