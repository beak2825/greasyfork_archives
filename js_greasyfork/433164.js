// ==UserScript==
// @name        Anti Snoop
// @namespace   https://greasyfork.org/en/users/85671-jcunews
// @version     1.0.6
// @license     AGPLv3
// @author      jcunews
// @description Conceal information about network type (e.g. cellular/broadband), number of CPU cores (or Hyper Threads), and video adapter brand & model.
// @match       *://*/*
// @inject-into page
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/433164/Anti%20Snoop.user.js
// @updateURL https://update.greasyfork.org/scripts/433164/Anti%20Snoop.meta.js
// ==/UserScript==

(() => {
  ["connection", "mozConnection", "webkitConnection", "hardwareConcurrency"].forEach((k, p) => {
    if (navigator[k] && (p = Object.getPrototypeOf(navigator, k))) {
      p.get = undefined;
      Object.defineProperty(navigator, k, p)
    }
  });
  [window.WebGL2RenderingContext, window.WebGLRenderingContext].forEach(fn => {
    if (fn && !fn.prototype.getParameter_) {
      fn.prototype.getParameter_ = fn.prototype.getParameter;
      fn.prototype.getParameter = function(n) {
        if ([37445, 37446].includes(n)) return "";
        return fn.prototype.getParameter_.apply(this, arguments)
      }
    }
  })
})();
