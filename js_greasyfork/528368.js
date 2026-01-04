// ==UserScript==
// @name         Legacy Mode | Shell Shockers
// @version      3.0
// @author       Infinite Smasher
// @description  Go back in time with the old in-game sound effects (2018/2019) and legacy default gun skins!
// @icon         https://raw.githubusercontent.com/InfiniteSmasher/Legacy-Mode/main/ico_egg.png
// @match        *://*shellshock.io/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/1262866
// @downloadURL https://update.greasyfork.org/scripts/528368/Legacy%20Mode%20%7C%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/528368/Legacy%20Mode%20%7C%20Shell%20Shockers.meta.js
// ==/UserScript==

(function() {
    let script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/gh/InfiniteSmasher/Legacy-Mode@latest/legacy1.js';
    document.head.appendChild(script);
})();