// ==UserScript==
// @name         Center horizontal scroll bar
// @version      0.2.0
// @description  Auto center the horizontal scroll bar
// @author       dragonish
// @namespace    https://github.com/dragonish
// @license      GNU General Public License v3.0 or later
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489161/Center%20horizontal%20scroll%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/489161/Center%20horizontal%20scroll%20bar.meta.js
// ==/UserScript==

(function () {
  const debounced = {
    timer: {},
    debounce(key, func, delay, immediate) {
      window.clearTimeout(this.timer[key]);
      if (immediate) {
        if (this.timer[key] === undefined) {
          func();
        }
      }
      this.timer[key] = window.setTimeout(() => {
        func();
        this.timer[key] = undefined;
      }, delay);
      return {
        cancel: () => {
          window.clearTimeout(this.timer[key]);
          this.timer[key] = undefined;
        }
      };
    }
  };
  function scroll(msg) {
    console.log(msg);
    window.scrollTo({
      left: (document.documentElement.scrollWidth - document.documentElement.clientWidth) / 2
    });
  }
  window.addEventListener('load', () => {
    setTimeout(() => {
      scroll('window loaded, try rolling.');
    }, 0);
  });
  window.addEventListener('resize', () => {
    debounced.debounce('scroll', () => {
      scroll('window resized, try rolling.');
    }, 250);
  });
})();
