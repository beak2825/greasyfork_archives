// ==UserScript==
// @name         Never touch the ground
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Jump to the extent of not touching the ground
// @author       You
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24234/Never%20touch%20the%20ground.user.js
// @updateURL https://update.greasyfork.org/scripts/24234/Never%20touch%20the%20ground.meta.js
// ==/UserScript==

function j() {
 playerJump(player);
}
setInterval(j,10);