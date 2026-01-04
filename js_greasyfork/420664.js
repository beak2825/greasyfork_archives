// ==UserScript==
// @name         Takepoint.io - gamefact/leaderboard script
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  updates the leaderboard and gamefact automatically
// @author       You
// @match        https://takepoint.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420664/Takepointio%20-%20gamefactleaderboard%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/420664/Takepointio%20-%20gamefactleaderboard%20script.meta.js
// ==/UserScript==



setInterval(function(){gameStateRequest.open("GET","https://stats.takepoint.io/gameState",!0),gameStateRequest.send();},2000)
