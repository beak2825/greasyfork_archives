// ==UserScript==
// @name         URL.canParse Polyfill
// @version      0.1.0
// @description  Polyfill for URL.canParse() in older browsers
// @author       dragonish
// @namespace    https://github.com/dragonish
// @license      GNU General Public License v3.0 or later
// @match        *://*/*
// @compatible   chrome version < 120
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521972/URLcanParse%20Polyfill.user.js
// @updateURL https://update.greasyfork.org/scripts/521972/URLcanParse%20Polyfill.meta.js
// ==/UserScript==

(function () {
  if (typeof URL.canParse !== 'function') {
    URL.canParse = function (url, base) {
      try {
        const _fullUrl = base ? new URL(url, base) : new URL(url);
        return true;
      } catch (e) {
        return false;
      }
    };
  }
})();
