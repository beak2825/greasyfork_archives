// ==UserScript==
// @name         Crunchyroll Simulcast Calendar Dub Hider
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Hide dubs from Crunchyroll Simulcast Calendar
// @author       myklosbotond
// @license      MIT
// @match        https://www.crunchyroll.com/simulcastcalendar*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510936/Crunchyroll%20Simulcast%20Calendar%20Dub%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/510936/Crunchyroll%20Simulcast%20Calendar%20Dub%20Hider.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.querySelectorAll(".releases li").forEach((li) => {
    if (/dub/i.test(li.textContent)) {
      li.style.display = "none";
    }
  });
})();
