// ==UserScript==
// @name         Moonwalk ads remove
// @version      1.0
// @match        *://*/*/*/iframe?*
// @match        *://*/video/*/iframe*
// @description:en No Ads Moonwalk
// @namespace https://greasyfork.org/users/161736
// @description No Ads Moonwalk
// @downloadURL https://update.greasyfork.org/scripts/35946/Moonwalk%20ads%20remove.user.js
// @updateURL https://update.greasyfork.org/scripts/35946/Moonwalk%20ads%20remove.meta.js
// ==/UserScript==

player_helpers = null;
var real_resume = null;

var load_wait = setInterval(function() {
  if (player_helpers)
  {
      player_helpers.freeze_player = function() {};
      player_helpers.unfreeze_player();
      real_resume = player.vast.resume;
      player.vast.resume = function() {};
      var run_video = setInterval(function() {
          real_resume();
          if (document.getElementsByClassName('fp-engine hlsjs-engine')[0])
              clearInterval(run_video);
      }, 100);
      clearInterval(load_wait);
  }
}, 100);