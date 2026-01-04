// ==UserScript==
// @name     Crunchyroll Hide the Dubs
// @namespace   yattoz
// @description Hides dubs from crunchyroll release calendar
// @include	 https://*.crunchyroll.com/simulcastcalendar*
// @version  2
// @license GNU GPLv3
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/481883/Crunchyroll%20Hide%20the%20Dubs.user.js
// @updateURL https://update.greasyfork.org/scripts/481883/Crunchyroll%20Hide%20the%20Dubs.meta.js
// ==/UserScript==


let a = document.querySelectorAll("ol > li > article > div > h1");
a.forEach(b => {
  if (b.textContent.includes(" Dub)")) {
    b.parentElement.parentElement.style.display = "none";
  }
});