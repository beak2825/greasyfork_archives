// ==UserScript==
// @name        Auto claim channel point
// @namespace   https://greasyfork.org/fr/users/11667-hoax017
// @match       https://www.twitch.tv/*
// @grant       none
// @version     1.0
// @author      Hoax017
// @description Auto claim channel point on chat
// @downloadURL https://update.greasyfork.org/scripts/477130/Auto%20claim%20channel%20point.user.js
// @updateURL https://update.greasyfork.org/scripts/477130/Auto%20claim%20channel%20point.meta.js
// ==/UserScript==

setInterval(() => document.querySelector(".claimable-bonus__icon").click(), 1000)