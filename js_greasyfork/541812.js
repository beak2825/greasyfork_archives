// ==UserScript==
// @name         Comment Blocker
// @author       Mane
// @version      1.0
// @license      MIT
// @description  Blocks all comments on every website, by using the shutup.css.
// @match        *://*/*
// @resource     shutupCSS https://raw.githubusercontent.com/panicsteve/shutup-css/master/shutup.css
// @grant        GM_getResourceText
// @run-at       document-start
// @namespace https://greasyfork.org/users/1491313
// @downloadURL https://update.greasyfork.org/scripts/541812/Comment%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/541812/Comment%20Blocker.meta.js
// ==/UserScript==

;(function() {
  'use strict';

  // injects a <style> block into the document
  function inject(css) {
    const s = document.createElement('style');
    s.textContent = css;
    (document.head || document.documentElement).appendChild(s);
  }

  // 1) Try the GM resource API (Tamper/Violent/GM3)
  if (typeof GM_getResourceText === 'function') {
    try {
      const css = GM_getResourceText('shutupCSS');
      inject(css);
      return;
    } catch (e) {
      // fall through to fetch
    }
  }

  // 2) Fallback: fetch raw GitHub file (requires CORS)
  fetch('https://raw.githubusercontent.com/panicsteve/shutup-css/master/shutup.css')
    .then(res => res.ok && res.text())
    .then(css => css && inject(css))
    .catch(() => {
      /* if both methods fail, nothing is injected */
    });
})();
