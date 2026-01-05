// ==UserScript==
// @name        Venue Quality Scroll Down
// @namespace   http://userscripts.org/users/537476
// @description Scrolls to bottom of VQ HIT
// @include     https://www.mturk.com/mturk/previewandaccept?groupId=20NENHMVHVKCOFQJ5EY4O79SQ1C24B
// @include     https://www.mturk.com/mturk/submit
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       none
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/2553/Venue%20Quality%20Scroll%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/2553/Venue%20Quality%20Scroll%20Down.meta.js
// ==/UserScript==

setTimeout(window.scrollTo(0, document.body.offsetHeight),250);