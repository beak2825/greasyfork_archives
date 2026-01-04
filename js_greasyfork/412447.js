// ==UserScript==
// @name            Font Fingerprint Blocker
// @description     Random Font Fingerprint Generator
// @namespace    adguard
// @version         1.0.0.0
// @include         *
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/412447/Font%20Fingerprint%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/412447/Font%20Fingerprint%20Blocker.meta.js
// ==/UserScript==

(function () {
  var rand = {
    "noise": function () {
      var SIGN = Math.random() < Math.random() ? -1 : 1;
      return Math.floor(Math.random() + SIGN * Math.random());
    },
    "sign": function () {
      const tmp = [-1, -1, -1, -1, -1, -1, +1, -1, -1, -1];
      const index = Math.floor(Math.random() * tmp.length);
      return tmp[index];
    }
  };
  //
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    get () {
      const height = Math.floor(this.getBoundingClientRect().height);
      const valid = height && rand.sign() === 1;
      const result = valid ? height + rand.noise() : height;
      //
      if (valid && result !== height) {
        window.top.postMessage("font-fingerprint-defender-alert", '*');
      }
      //
      return result;
    }
  });
  //
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    get () {
      const width = Math.floor(this.getBoundingClientRect().width);
      const valid = width && rand.sign() === 1;
      const result = valid ? width + rand.noise() : width;
      //
      if (valid && result !== width) {
        window.top.postMessage("font-fingerprint-defender-alert", '*');
      }
      //
      return result;
    }
  });
  //
  document.documentElement.dataset.fbscriptallow = true;
})()