// ==UserScript==
// @name         Idlescape Animation Killer
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  This script kills the following animations in idlescape to save up CPU usage while having the game open:
// * Combat progress bars
// * Skill progress bars
// * XP Scrolling text
// @author       Holychikenz/Sponsorn
// @match        http*://*idlescape.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420328/Idlescape%20Animation%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/420328/Idlescape%20Animation%20Killer.meta.js
// ==/UserScript==

(function() {
    setInterval(()=>{
        document.querySelectorAll(".combat-fight-attack-speed").forEach(e=>e.parentNode.removeChild(e));
        document.querySelectorAll(".MuiLinearProgress-root").forEach(e=>e.parentNode.removeChild(e));
        document.querySelectorAll(".scrolling-text").forEach(e=>e.parentNode.removeChild(e));
    }, 1000)
})();