// ==UserScript==
// @name        HTML Animation Frame Request Limiter
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.1
// @license     AGPL v3
// @author      jcunews
// @description Limits HTML animation frame request. Practically limits FPS of JavaScript controlled animation such as in canvas. Designed to lower CPU usage.
// @match       *://*/*
// @include     *:*
// @grant       GM_registerMenuCommand
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/469902/HTML%20Animation%20Frame%20Request%20Limiter.user.js
// @updateURL https://update.greasyfork.org/scripts/469902/HTML%20Animation%20Frame%20Request%20Limiter.meta.js
// ==/UserScript==

(() => {
  var fps = 0, tfps, pt, raf = unsafeWindow.requestAnimationFrame;
  function nraf(f) {
    if (fps && !f.f_ujs) {
      var nf = function(t) {
        if ((t - pt) >= tfps) {
          pt = t;
          return nf.f_ujs.apply(this, arguments)
        } else setTimeout(() => raf(nf), tfps - (t - pt))
      };
      nf.f_ujs = f;
      f = nf;
    } else if (!fps && f.f_ujs) f = f.f_ujs;
    return raf.apply(this, arguments)
  }
  GM_registerMenuCommand("Set FPS", a => {
    a = fps;
    while (true) {
      a = prompt(`Context: [${window.top === window ? "Host" : "Frame"}]\n${location.href}\n\nFPS limiter is currently ${fps ? "set to: " + fps : "disabled"}.\nEnter new FPS rate (e.g.: 20), or zero to disable limiter.`, a);
      if (a === null) return;
      if (!isNaN(a = parseFloat(a.trim())) && (a >= 0)) {
        if (fps = a) {
          tfps = 1000 / fps;
          pt = 0;
          unsafeWindow.requestAnimationFrame = nraf
        } else unsafeWindow.requestAnimationFrame = raf;
        return
      }
    }
  })
})()
