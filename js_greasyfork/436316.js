// ==UserScript==
// @name        Infinite Time
// @description Adds infinite time option for games
// @namespace   https://greasyfork.org/users/846553
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      Stal
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/436316/Infinite%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/436316/Infinite%20Time.meta.js
// ==/UserScript==
const option = document.createElement('option'); 
option.textContent = "infinite";
document.querySelector("#gameSettingsDrawingTime").appendChild(option);