// ==UserScript==
// @name         Hide YT Music mini-player
// @description  Simple script that Hides Youtube Music `player` whenever it enters "mini mode".
//               The script listent to attribute changes of the element `#player`.
// @namespace    http://tampermonkey.net/
// @version      2023-12-30
// @author       https://github.com/Zackysh
// @license MIT
// @match        https://music.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483450/Hide%20YT%20Music%20mini-player.user.js
// @updateURL https://update.greasyfork.org/scripts/483450/Hide%20YT%20Music%20mini-player.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const toggleMiniplayer = function (miniPlayer) {
    if (miniPlayer.getAttribute('player-ui-state') === 'MINIPLAYER') {
      miniPlayer.style.display = 'none';
    } else {
      miniPlayer.style.display = 'block';
    }
  };

  const observer = new MutationObserver(function (mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'player-ui-state') {
        toggleMiniplayer(mutation.target);
      }
    }
  });

  observer.observe(document.querySelector('#player'), { attributes: true });
})();
