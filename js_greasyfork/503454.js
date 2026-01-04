// ==UserScript==
// @name         MyMHKeepActive
// @namespace    https://greasyfork.org/en/users/39779
// @version      0.0.2
// @description  mh keep active
// @author       Elie
// @match        https://www.mousehuntgame.com/profile.php*
// @license      GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/503454/MyMHKeepActive.user.js
// @updateURL https://update.greasyfork.org/scripts/503454/MyMHKeepActive.meta.js
// ==/UserScript==

/**
 * Indicate if show debug log or not
 */
const debug = true;

(function () {
  'use strict';

  // Your code here...
  // test();
  const shift = Math.random() - 0.5;
  logging('shift random in keep-active', shift);
  setTimeout(() => {
    // eslint-disable-next-line no-self-assign
    window.location.href = window.location.href;
  }, parseInt(1800000 + 900000 * shift));
})();

/**
 * Test scope of ().
 */
function test() {
  logging('test scope of ()');
}

/**
 * logging function.
 * Invoke console.log with customization.
 */
function logging(...data) {
  if (debug) {
    console.groupCollapsed(new Date(), ...data);
    console.log(Error().stack);
    // console.trace();
    console.groupEnd();
    /* console.groupCollapsed(...arguments);
      // console.trace.apply(console, arguments);
      console.trace();
      console.groupEnd(); */
  }
}
