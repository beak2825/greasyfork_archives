// ==UserScript==
// @name         Show Music Info on Netease Cloud Music Player
// @namespace    http://ft2.club/
// @version      2024-05-18
// @description  show the information of the music when listening to music via Netease Cloud Music Web.
// @author       Sheng Fan
// @match        https://music.163.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495337/Show%20Music%20Info%20on%20Netease%20Cloud%20Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/495337/Show%20Music%20Info%20on%20Netease%20Cloud%20Music%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => { document.title = document.querySelector("#g_player > div.play > .words").innerText }, 200);
    // Your code here...
})();