// ==UserScript==
// @name         m.YouTube.com allow background play TEST SCRIPT
// @namespace    m-youtube-com-allow-background-play
// @version      1.0
// @description  Allows m.YouTube.com background play, especially useful for iPhone users
// @author       hlorand.hu
// @match        https://m.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      https://creativecommons.org/licenses/by-nc-sa/4.0/
// @downloadURL https://update.greasyfork.org/scripts/486666/mYouTubecom%20allow%20background%20play%20TEST%20SCRIPT.user.js
// @updateURL https://update.greasyfork.org/scripts/486666/mYouTubecom%20allow%20background%20play%20TEST%20SCRIPT.meta.js
// ==/UserScript==
 
// Original code: https://addons.mozilla.org/en-US/android/addon/video-background-play-fix/
 
(function() {
    //'use strict';
 
    const IS_YOUTUBE = window.location.hostname.search(/(?:^|.+\.)youtube\.com/) > -1 ||
                   window.location.hostname.search(/(?:^|.+\.)youtube-nocookie\.com/) > -1;
    const IS_MOBILE_YOUTUBE = window.location.hostname == 'm.youtube.com';
    const IS_DESKTOP_YOUTUBE = IS_YOUTUBE && !IS_MOBILE_YOUTUBE;
    const IS_VIMEO = window.location.hostname.search(/(?:^|.+\.)vimeo\.com/) > -1;

    const IS_ANDROID = window.navigator.userAgent.indexOf('Android') > -1;

    // Page Visibility API
    if (IS_ANDROID || !IS_DESKTOP_YOUTUBE) {
      Object.defineProperties(document.wrappedJSObject,
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
      loop(pressKey, 60 * 1000, 10 * 1000); // every minute +/- 5 seconds
    }

    function pressKey() {
      const keyCodes = [18];
      let key = keyCodes[getRandomInt(0, keyCodes.length)];
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