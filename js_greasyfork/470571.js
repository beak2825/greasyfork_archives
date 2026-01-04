// ==UserScript==
// @name         Wordlebot Unblocker
// @version      0.1
// @description  remove popup message in wordle, working in 2023
// @author       alst
// @match        https://www.nytimes.com/interactive/2022/upshot/wordle-bot.html
// @grant        none
// @namespace https://greasyfork.org/users/1123652
// @downloadURL https://update.greasyfork.org/scripts/470571/Wordlebot%20Unblocker.user.js
// @updateURL https://update.greasyfork.org/scripts/470571/Wordlebot%20Unblocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const todelete = document.getElementById('standalone-footer');
    if (todelete) { todelete.remove(); }
    
})();