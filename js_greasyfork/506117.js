// ==UserScript==
// @name         Auto unmute redgifs
// @namespace    https://greasyfork.org/en/users/1338370-codefeels
// @version      1.1.8
// @license      AGPLv3
// @author       codefeels
// @description  auto unmute redgifs videos, forked from jcunews
// @match        https://www.redgifs.com/ifr/*
// @match        https://www.redgifs.com/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506117/Auto%20unmute%20redgifs.user.js
// @updateURL https://update.greasyfork.org/scripts/506117/Auto%20unmute%20redgifs.meta.js
// ==/UserScript==

/* Note:
For embedded player, the video will be unmuted, but the player will think it's still muted
(the player's sound control is still in off state).
*/

((firstTime, setVolume) => {

  //config begin

  setVolume = -1; //0 to 1.0. or negative number to disable

  //config end

  firstTime = true;
  (function fn(a, b) {
    if (firstTime) {
      if (
        (a = document.querySelector(
          ':is(.sidebar,.sideBar,.Sidebar,.SideBar,.SIDEBAR) :is([class*="Sound"],[class*="sound"],[class*="SOUND"])',
        )) &&
        (b = document.querySelector(".Player video")) &&
        b.muted
      ) {
        //non embedded
        console.log("wow", { a, b });
        firstTime = false;
        a.click();
        b.muted = false;
        if (setVolume >= 0) b.volume = setVolume;
      } else if (
        (a = document.querySelector(".embeddedPlayer video")) &&
        a.muted
      ) {
        //enbedded
        firstTime = false;
        a.muted = false;
        if (setVolume >= 0) a.volume = setVolume;
      }
    }
    setTimeout(fn, 200);
  })();
})();
