// ==UserScript==
// @name        Twitch Pause Video by Click
// @description Click on the Twitch video to pause it.
// @match       https://www.twitch.tv/videos/*
// @namespace   https://www.bugbugnow.net/
// @author      toshi (https://github.com/k08045kk)
// @license     MIT License | https://opensource.org/licenses/MIT
// @version     1
// @since       1 - 20211225 - First edition
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/437562/Twitch%20Pause%20Video%20by%20Click.user.js
// @updateURL https://update.greasyfork.org/scripts/437562/Twitch%20Pause%20Video%20by%20Click.meta.js
// ==/UserScript==

window.addEventListener('click', (event) => {
  if (event.target?.dataset.aTarget == 'player-overlay-click-handler') {
    document.querySelector('video')?.pause();
  }
});
