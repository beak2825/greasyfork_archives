// ==UserScript==
// @name        Larger Twitch squad player
// @description Removes the title bar in Twitch squad streams to increase the player size
// @namespace   https://github.com/Sv443/larger-twitch-squad-player
// @match       *://www.twitch.tv/*/squad
// @grant       none
// @license     MIT
// @version     1.2
// @author      Sv443
// @run-at      document-start
// @icon        https://icons.duckduckgo.com/ip3/twitch.tv.ico
// @require     https://update.greasyfork.org/scripts/472956/1279362/UserUtils.js
// @downloadURL https://update.greasyfork.org/scripts/450213/Larger%20Twitch%20squad%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/450213/Larger%20Twitch%20squad%20player.meta.js
// ==/UserScript==

"use strict";

document.addEventListener("DOMContentLoaded", removeBar);

function removeBar() {
  try {
    const obs = new UserUtils.SelectorObserver(document.body);
    obs.enable();

    obs.addListener(".squad-stream-top-bar__container", {
      listener: (bar) => {
        bar.remove();
        console.info("Removed title bar.\nUserscript by Sv443: https://github.com/Sv443/larger-twitch-squad-player");
      }
    });
  }
  catch(err) {
    console.error("Couldn't remove title bar:", err);
  }
}
