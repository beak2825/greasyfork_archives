// ==UserScript==
// @name         Auto Focus
// @namespace    https://hrry.xyz
// @version      0.1
// @description  focus the youtube player if you press any of the player keys
// @author       bluescorpian
// @match        https://www.youtube.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462196/Auto%20Focus.user.js
// @updateURL https://update.greasyfork.org/scripts/462196/Auto%20Focus.meta.js
// ==/UserScript==

const PLAYER_KEYS = ["ArrowUp", "ArrowDown", "Space", "Comma", "Period"];

(function() {
    'use strict';
    let _player;
    // checks if cached player exists if not find it
    const player = () => _player && _player.parentNode ? _player : _player = document.querySelector('.html5-video-player'); /* eslint-disable-line */

    const listener = (event) => {
        if (document.activeElement != player && PLAYER_KEYS.includes(event.code)) {
            event.preventDefault();
            player().focus()
        }
    }

    document.addEventListener('keydown', listener);
})();