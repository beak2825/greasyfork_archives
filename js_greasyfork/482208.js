// ==UserScript==
// @name          YouTube: disable rolling numbers count up animation
// @description   Remove the annoying count up animation for likes and video views on YouTube
// @author        Konf
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?sz=64&domain=www.youtube.com
// @version       2.0.0
// @match         https://www.youtube.com/*
// @compatible    Chrome
// @compatible    Opera
// @compatible    Firefox
// @run-at        document-idle
// @grant         unsafeWindow
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/482208/YouTube%3A%20disable%20rolling%20numbers%20count%20up%20animation.user.js
// @updateURL https://update.greasyfork.org/scripts/482208/YouTube%3A%20disable%20rolling%20numbers%20count%20up%20animation.meta.js
// ==/UserScript==

/**
 * Hi! Don't change (or even resave) anything here because
 * by doing this in Tampermonkey you will turn off updates
 * of the script (idk about other script managers).
 * This could be restored in settings but it might be hard to find,
 * so better to reinstall the script if you're not sure
 */

/* jshint esversion: 8 */

(function() {
  'use strict';

  setTimeout(() => {
    const AnimationCopy = unsafeWindow.Animation;

    unsafeWindow.Animation = function(effect, timeline, ...otherArgs) {
      if (effect.target.localName === 'animated-rolling-character') {
        effect.activeDuration = 0;
        effect.timing._duration = 0;
        effect._timingInput.duration = 0;
      }

      return new AnimationCopy(effect, timeline, ...otherArgs);
    };
  }, 3000);
})();
