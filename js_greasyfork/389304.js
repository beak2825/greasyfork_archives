// ==UserScript==
// @name            HDRezka Player Ads Disabler
// @namespace       https://github.com/bostonaqua
// @description     Disables ads in the video player on the HDRezka website
// @description:ru  Отключает рекламу в видео плеере на сайте HDRezka
// @copyright       2019, BostonAqua (https://openuserjs.org/users/BostonAqua)
// @license         GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon            data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAC+0lEQVRo3u2YLYiiQRjHtxhcMZjW4jaxu8kqdovBcCIYNgkmF7sgtsOyUdkkC4dhPQyXDi1e8ZJgstnEcMHjTte5+cl4rK/vOy5+rArzwB91Z57Z+c88n3N1ZcSIESNGjBg5sQgh7iSKEp8teJC42aJX1unJT4/Evc0cHdhLWq3v2bZ5l8Rzr9dbVKtVscLT05MYjUZ/5VhWo/el2+0KnZ78jI3H4z/1en1tnhOY12q1BPuZTCZjqf9NIulIRA5cM6lQKAh+ruByuUSz2RScsIMeJ/s9l8s56RXVvORgMHj1+/1r83RgDZ/PJyKRiKhUKqsDqdlawzkSsCIajS5vBEvZIHEJBEA4HBb9fv9V+Yfr5AQCgYBIJBIb4LQZsyPB+HQ6Hck1IycnkEqlxGw2+z2fzweLxeIn4DsbZD778Xq9azput1s0Gg2h/MF1cgJsWo6HJHzYtgK/sxDJ5/O6WwjtS+D6QAR8DutnsXmrObGO8oXkewnUVEKJWBBjA0ckcItJceLW9ZUZlbcSICmRhGQc/mUHxjKZzLEIkCi/lkqlDTPibyTRpR84EVhdVzAY1IKEcwwCSveR7GzdF7eO+S51dQR2wYEJlDEX1nTQvTl3AkXqIjsC+Ad+oiVAHMZEdLAufugbYK2dbgAlCilCFnWIE+yixCF9gECi8QHPe8LoiypnrUhzjUcMo0Shl52j0Bkksv3zwAeVEk4E7tE7RCb+cALUOYzZmc8ha6G9CahQGFEFXEiVLJ/k5n8QPq06rE1iU43NaatRTpJShL73LZhL9LPrCWgxVXsZP3k/QA6hy7KCjVvj/ionKed9XmvwL6GlpJHBH5TJ3V1UT8yNYFLKcePaVwn+OWwBV4YjbSNA1+Sgt0aAynU1Rwf0IYs5sSeyPU5N/6F72HocDoei3W6LTqfzHzgZGVejV9umR5Th9HgAs86zA/OI8zi02vjDsmjb8jp3S/hST4BvEdc97Sm9tE5PEY3ZzNEhqUKqzzz8GjFixIgRI+cs/wDugYdHEUnwsQAAAABJRU5ErkJggg==
// @homepageURL     https://github.com/bostonaqua/rezka-userjs
// @version         1.0.5
// @match           https://streamguard.cc/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/389304/HDRezka%20Player%20Ads%20Disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/389304/HDRezka%20Player%20Ads%20Disabler.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author          BostonAqua
// ==/OpenUserJS==

(function () {
  'use strict';
  if (window.top === window.self) {}
  else {
    video_balancer.onPlayButtonClick = function () {
      document.getElementById("play_button").remove();
      video_balancer.adv_loader = function () {
        console.log("AdsRemoved");
      };
      video_balancer.onAdvLoaderDone();
    };
    document.getElementById("play_button").remove();
    video_balancer.createPlayButton();
  }
})();
