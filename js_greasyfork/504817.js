// ==UserScript==
// @name        WikiSpeedruns Search Unlocker
// @namespace   https://greasyfork.org/users/1356534
// @match       https://wikispeedruns.com/play*
// @grant       none
// @version     1.0
// @license     GNU GPLv3 
// @author      https://greasyfork.org/users/1356534
// @description This script provides a solution for bypassing the search lock on wikispeedruns.com
// @downloadURL https://update.greasyfork.org/scripts/504817/WikiSpeedruns%20Search%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/504817/WikiSpeedruns%20Search%20Unlocker.meta.js
// ==/UserScript==


window.addEventListener("keydown", function(e) {
    if ([114, 191, 222].includes(e.keyCode) || (e.ctrlKey || e.metaKey) && (e.keyCode == 70 || e.keyCode == 71)) {
        e.stopImmediatePropagation();
    }
}, true);