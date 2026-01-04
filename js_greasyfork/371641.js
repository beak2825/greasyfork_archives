// ==UserScript==
// @name         Video Background Play Fix
// @namespace    https://greasyfork.org/en/users/50-couchy
// @version      20220119
// @description  Prevents YouTube and Vimeo from pausing videos when minimizing or switching tabs. Cross-browser port of https://addons.mozilla.org/en-US/firefox/addon/video-background-play-fix/
// @author       Couchy
// @match        *://*.youtube.com/*
// @match        *://*.vimeo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/371641/Video%20Background%20Play%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/371641/Video%20Background%20Play%20Fix.meta.js
// ==/UserScript==

(function() {
'use strict';

const IS_YOUTUBE = window.location.hostname.search(/(?:^|.+\.)youtube\.com/) > -1 ||
                   window.location.hostname.search(/(?:^|.+\.)youtube-nocookie\.com/) > -1;
const IS_MOBILE_YOUTUBE = window.location.hostname == 'm.youtube.com';
const IS_DESKTOP_YOUTUBE = IS_YOUTUBE && !IS_MOBILE_YOUTUBE;
const IS_VIMEO = window.location.hostname.search(/(?:^|.+\.)vimeo\.com/) > -1;

const IS_ANDROID = window.navigator.userAgent.indexOf('Android') > -1;

// Page Visibility API
if (IS_ANDROID || !IS_DESKTOP_YOUTUBE) {
  Object.defineProperties(document,
    { 'hidden': {value: false}, 'visibilityState': {value: 'visible'} });
}

window.addEventListener(
  'visibilitychange', evt => evt.stopImmediatePropagation(), true);

// Fullscreen API
if (IS_VIMEO) {
  window.addEventListener(
    'fullscreenchange', evt => evt.stopImmediatePropagation(), true);
}

// User activity tracking
if (IS_YOUTUBE) {
  loop(pressKey, 60 * 1000, 10 * 1000); // every minute +/- 10 seconds
}

function pressKey() {
  const key = 18;
  sendKeyEvent("keydown", key);
  sendKeyEvent("keyup", key);
}

function sendKeyEvent (aEvent, aKey) {
  document.dispatchEvent(new KeyboardEvent(aEvent, {
    bubbles: true,
    cancelable: true,
    keyCode: aKey,
    which: aKey,
  }));
}

function loop(aCallback, aDelay, aJitter) {
  let jitter = getRandomInt(-aJitter/2, aJitter/2);
  let delay = Math.max(aDelay + jitter, 0);

  window.setTimeout(() => {
                      aCallback();
                      loop(aCallback, aDelay, aJitter);
                    }, delay);
}

function getRandomInt(aMin, aMax) {
  let min = Math.ceil(aMin);
  let max = Math.floor(aMax);
  return Math.floor(Math.random() * (max - min)) + min;
}

})();