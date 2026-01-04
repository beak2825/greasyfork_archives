// ==UserScript==
// @name        Don't mess with paste
// @namespace   urn://https://www.georgegillams.co.uk/api/greasemonkey/dont-mess-with-paste
// @include     *
// @exclude     none
// @version     0.0.1
// @description:en	Re-enables paste on all websites
// @grant    		none
// @description Re-enables paste on all websites
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540416/Don%27t%20mess%20with%20paste.user.js
// @updateURL https://update.greasyfork.org/scripts/540416/Don%27t%20mess%20with%20paste.meta.js
// ==/UserScript==

const forceBrowserDefault = function (e) {
  e.stopImmediatePropagation();
  return true;
};

(function () {
  'use strict';

  document.addEventListener('copy', forceBrowserDefault, true);
  document.addEventListener('cut', forceBrowserDefault, true);
  document.addEventListener('paste', forceBrowserDefault, true);
})();
