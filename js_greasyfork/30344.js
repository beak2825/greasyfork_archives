// ==UserScript==
// @name        Pause/Mute HTML5 Audio/Video On Leaving Tab
// @namespace   PauseMuteHTML5AudioVideoAudioOnLeavingTab
// @version     1.0.5
// @license     AGPL v3
// @author      jcunews
// @description Pause or mute HTML5 audio/video on leaving a tab and restore them back on returning.
// @website     https://greasyfork.org/en/users/85671-jcunews
// @include     *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/30344/PauseMute%20HTML5%20AudioVideo%20On%20Leaving%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/30344/PauseMute%20HTML5%20AudioVideo%20On%20Leaving%20Tab.meta.js
// ==/UserScript==

(() => {

  //=== Configuration Start ===

  var muteInsteadOfPause = false; //set to `true` to mute instead of pause

  //=== Configuration End ===

  var sHidden, sVisibilityChange;

  if ("undefined" !== typeof document.hidden) {
    sHidden = "hidden";
    sVisibilityChange = "visibilitychange";
  } else if ("undefined" !== typeof document.webkitHidden) {
    sHidden = "webkitHidden";
    sVisibilityChange = "webkitvisibilitychange";
  } else if ("undefined" !== typeof document.msHidden) {
    sHidden = "msHidden";
    sVisibilityChange = "msvisibilitychange";
  }

  function checkStatus() {
    if (!document[sHidden]) {
      document.querySelectorAll("audio, video").forEach(function(v) {
        if (!v.off) return;
        if (muteInsteadOfPause) {
          v.muted = false;
        } else if (v.play_) {
          v.play = v.play_;
          delete v.play_;
          v.play();
        } else v.play();
        delete v.off;
      });
    } else {
      document.querySelectorAll("audio, video").forEach(
        function(v) {
          if (muteInsteadOfPause) {
            if (!v.muted) {
              v.off = true;
              setTimeout(() => v.muted = true, 0);
            }
          } else if (!v.paused) {
            v.off = true;
            setTimeout(() => {
              v.play_ = v.play;
              v.play = () => {};
              v.pause();
            }, 0);
          }
        }
      );
    }
  }

  function init() {
    document.removeEventListener(sVisibilityChange, checkStatus);
    document.addEventListener(sVisibilityChange, checkStatus);
  }

  //Support for Structured Page Fragments. For e.g. YouTube
  addEventListener("spfdone", init);

  init();
})();
