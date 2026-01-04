// ==UserScript==
// @name         FlyFF Universe Disable Auto Login
// @description  FlyFF Universe Disable Auto Login.
// @version      1.0
// @namespace    none
// @match        https://universe.flyff.com/play*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513341/FlyFF%20Universe%20Disable%20Auto%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/513341/FlyFF%20Universe%20Disable%20Auto%20Login.meta.js
// ==/UserScript==

let settings = localStorage.getItem('game_client_settings').split('\n');
settings[4] = '0';
localStorage.setItem('game_client_settings', settings.join('\n'));
