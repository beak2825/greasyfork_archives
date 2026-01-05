// ==UserScript==
// @name         Speedrun.com SSL Redirect
// @version      1.0
// @description  Redirect from HTTP to HTTPS when visiting http://www.speedrun.com/
// @author       satanch
// @match        http://www.speedrun.com/*
// @grant        none
// @namespace https://greasyfork.org/users/119240
// @downloadURL https://update.greasyfork.org/scripts/29248/Speedruncom%20SSL%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/29248/Speedruncom%20SSL%20Redirect.meta.js
// ==/UserScript==

window.location.protocol = 'https:';