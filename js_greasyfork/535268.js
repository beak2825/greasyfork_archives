// ==UserScript==
// @name         Hide avatars and names in duels
// @namespace    BMO
// @version      v1.0
// @description  Hide avatars and player names in duels
// @author       BMO (modified by ChatGPT)
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535268/Hide%20avatars%20and%20names%20in%20duels.user.js
// @updateURL https://update.greasyfork.org/scripts/535268/Hide%20avatars%20and%20names%20in%20duels.meta.js
// ==/UserScript==

GM_addStyle(`
  [class*="animated-player-item_avatarContainer__"],
  [class*="health-bar_avatarContainer__"],
  [class*="health-bar_playerContainer__"],
  [class*="animated-player-item_username__"],
  [class*="health-bar_username__"],
  [class*="player-score_username__"],
  [class*="player-score_player__"],
  [class*="game-summary_player__"],
  [class*="game-finished_player__"] {
    display: none !important;
  }
`);