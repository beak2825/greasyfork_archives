// ==UserScript==
// @name         Show Music Info on QQ Music Player
// @namespace    http://ft2.club/
// @version      2024-05-18
// @description  show the information of the music when listening to music via QQ Music Web.
// @author       Sheng Fan
// @match        https://y.qq.com/n/ryqq/player
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495331/Show%20Music%20Info%20on%20QQ%20Music%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/495331/Show%20Music%20Info%20on%20QQ%20Music%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(() => {
        window.document.title = document.querySelector("#app > div.mod_player > div.player__ft > div.player_music > div.player_music__info").innerText;
    }, 200)
    // Your code here...
})();