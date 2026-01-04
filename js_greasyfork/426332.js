// ==UserScript==
// @name          Deviantart.com: always redirect to Gallery ALL
// @description   When you land on a user page, instantly go to the user's Gallery/All page.
// @author        Konf, dhaden
// @namespace     https://greasyfork.org/users/424058
// @icon          https://www.google.com/s2/favicons?domain=deviantart.com&sz=32
// @version       1.0.1
// @include       /^https?:\/\/www\.deviantart\.com\/[a-zA-Z0-9\-\_]+(?:\/gallery)?$/
// @run-at        document-start
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/426332/Deviantartcom%3A%20always%20redirect%20to%20Gallery%20ALL.user.js
// @updateURL https://update.greasyfork.org/scripts/426332/Deviantartcom%3A%20always%20redirect%20to%20Gallery%20ALL.meta.js
// ==/UserScript==

(function() {
  const userName = location.pathname.split('/')[1];

  window.location.href = location.origin + '/' + userName + '/gallery/all';
})();