// ==UserScript==
// @name                YouTube - Mute Ads
// @name:de             YouTube - Mute Ads
// @version             2.0.0
// @description         Automatically mutes VideoAds
// @description:de      Schaltet Werbung auf YouTube automatisch stumm
// @autor               VVind0wM4ker
// @namespace           https://github.com/VVind0wM4ker/Userscripts
// @homepageURL         https://github.com/VVind0wM4ker/Userscripts/tree/master/YouTube_Mute_Ads
// @license             MIT License
// @grant               none
// @noframes
// @include             http*://*.youtube.com/watch*
// @downloadURL https://update.greasyfork.org/scripts/13340/YouTube%20-%20Mute%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/13340/YouTube%20-%20Mute%20Ads.meta.js
// ==/UserScript==

var adHandled = false;
var playerMutedBefore;

// ----- Setters and Getters -----
// Getter functions instead of vars to prevent getting old elements
// in case of navigation for example
function getVideo() {
  return document.getElementsByClassName("video-stream html5-main-video")[0];
}
function getPlayer() {
  return document.getElementsByClassName("html5-video-player")[0];
}
function getMuteBtn() {
  if (getPlayer()) {
    return getPlayer().querySelector("button.ytp-mute-button");
  }
  return null;
}
function isAdInterrupting() {
  if (getPlayer()) {
    return getPlayer().className.indexOf("ad-interrupting");
  }
  return null;
}
// -------------------------------

function hook() {
  // add eventlistener if userscript started before the site finished loading
  if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", function() {hook();});
    return;
  }
  // site loaded

  // detect navigation on the site
  document.body.addEventListener("yt-navigate-finish", function() {setup();});
  setup();
}

function setup() {
  // prevent mess if setup() is called more than once
  if (getVideo().onplay === null) {
    getVideo().onplay = function() {analVideo();};
  }
}

// ( ͡° ͜ʖ ͡°)
function analVideo() {
  if (isAdInterrupting() !== -1 && adHandled === false ) {
    adHandled = true;
    playerMutedBefore = getPlayer().isMuted();
    getPlayer().mute();
  }
  else if (isAdInterrupting() === -1 && adHandled === true) {
      adHandled = false;
      if (playerMutedBefore === false) {
        getPlayer().unMute();
      } else {
        getPlayer().mute();
      }
  }
}

hook();