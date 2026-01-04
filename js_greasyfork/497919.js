// ==UserScript==
// @name         Hide avatars in duels
// @namespace    alienperfect
// @version      2024-06-14
// @description  Hide avatars in duels (and possibly other places, disable if don't need it)
// @author       Alien Perfect
// @match        https://www.geoguessr.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geoguessr.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/497919/Hide%20avatars%20in%20duels.user.js
// @updateURL https://update.greasyfork.org/scripts/497919/Hide%20avatars%20in%20duels.meta.js
// ==/UserScript==

GM_addStyle(`
  [class*="animated-player-item_avatarContainer__"],
  [class*="health-bar_avatarContainer__"],
  [class*="health-bar_playerContainer__"] {
    display: none !important;
  }
`);