// ==UserScript==
// @name        Disable Orion kagi user-script on YouTube Ad blocking
// @namespace   kagi.com/orion
// @match       https://www.youtube.com/*
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames   true
// @grant       none
// @version     0.1.1
// @author      -
// @description 1/11/2025, 6:34:10 PM
// @downloadURL https://update.greasyfork.org/scripts/523446/Disable%20Orion%20kagi%20user-script%20on%20YouTube%20Ad%20blocking.user.js
// @updateURL https://update.greasyfork.org/scripts/523446/Disable%20Orion%20kagi%20user-script%20on%20YouTube%20Ad%20blocking.meta.js
// ==/UserScript==

try {

  if (typeof kagi !== 'undefined' && window?.dev === false && window?.constructor?.prototype?.dev !== false) {
    let val = false;
    delete window.dev;
    if (window.dev === undefined) {
      Object.defineProperty(window, 'dev', {
        get() {
          const err = new Error('Disable kagi user-script on YouTube Ad blocking.');
          if (`${err.stack}`.includes('log@user-script:')) throw err;
          return val;
        },
        set(nv) {
          val = nv;
          return true;
        },
        enumerable: true,
        configurable: true
      });
    }
  }

} catch (e) { }