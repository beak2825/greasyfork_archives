// ==UserScript==
// @name  MyMHClaimLarry
// @namespace  https://greasyfork.org/en/users/39779
// @version  1.0.1
// @description  mh claim larry
// @author  Elie
// @match  https://www.mousehuntgame.com/claimgift.php*
// @license  GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @grant  unsafeWindow
// @run-at  document-end
// @downloadURL https://update.greasyfork.org/scripts/502688/MyMHClaimLarry.user.js
// @updateURL https://update.greasyfork.org/scripts/502688/MyMHClaimLarry.meta.js
// ==/UserScript==

/**
 * Indicate if show debug log or not
 */
const debug = true;

(function () {
  'use strict';

  // Your code here...
  test();
  const giftLinkContainer = document.getElementsByClassName(
    'claimGiftPage__giftLinkContainer'
  );
  logging('How about gift link container? ', giftLinkContainer);
  if (giftLinkContainer.length > 0)
    giftLinkContainer[0].getElementsByTagName('a')[0].click();
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
