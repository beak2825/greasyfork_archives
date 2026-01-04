// ==UserScript==
// @name          Stubborn
// @description   In case of DB error, refresh page.
// @description:pl Automatycznie odświeża popsute strony.
// @version       2
// @namespace     https://github.com/skalee/ssc-grease
// @author        me
// @license       Unlicense
// @homepageURL   https://github.com/skalee/ssc-grease
// @supportURL    https://www.skyscrapercity.com/showthread.php?t=2017475
// @grant         none
// @run-at        document-end
// @include       https://www.skyscrapercity.com/showthread.php?*
// @include       https://www.skyscrapercity.com/showpost.php?*
// @include       https://www.skyscrapercity.com/member.php?*
// @include       https://www.skyscrapercity.com/usercp.php
// @downloadURL https://update.greasyfork.org/scripts/383658/Stubborn.user.js
// @updateURL https://update.greasyfork.org/scripts/383658/Stubborn.meta.js
// ==/UserScript==

(function() {
  let refreshDelay = 3000; // miliseconds
  let pageTitle = document.querySelector("title").innerText.trim();
  if (pageTitle !== "Database Error") return;
  setTimeout("document.location.reload()", refreshDelay);
})();
