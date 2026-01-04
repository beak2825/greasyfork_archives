// ==UserScript==
// @name         Keyboard Media Keys Support for Firefox
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Add support for Play/Pause and Stop keyboard media keys to control HTML5 Video/Audio playback on Firefox or other browsers which do not support media keys.
// @match        *:///*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392586/Keyboard%20Media%20Keys%20Support%20for%20Firefox.user.js
// @updateURL https://update.greasyfork.org/scripts/392586/Keyboard%20Media%20Keys%20Support%20for%20Firefox.meta.js
// ==/UserScript==

(() => {
  addEventListener("keydown", (ev, e) => {
    switch (ev.key) {
      case "MediaPlayPause":
        if (e = document.querySelector("video,audio")) {
          if (e.paused) {
            e.play();
          } else e.pause();
        }
        break;
      case "MediaStop":
        if (e = document.querySelector("video,audio")) {
          if (!e.paused) e.pause();
        }
        break;
    }
  });
})();
