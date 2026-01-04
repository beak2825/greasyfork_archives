// ==UserScript==
// @name         Threads ausblenden
// @namespace    https://forym.de
// @version      0.1
// @description  Entfernt Threads mit dem angegebenen Titel
// @author       Magrat
// @match        https://www.forym.de/*
// @icon         https://www.google.com/s2/favicons?domain=forym.de
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440806/Threads%20ausblenden.user.js
// @updateURL https://update.greasyfork.org/scripts/440806/Threads%20ausblenden.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // KONFIGURATION
    // Hier Threadtitel eingeben!
    var threadtitel = ['Threadtitel 1', 'Threadtitel 2'];


    /********************************************************/
    var threads = document.querySelectorAll("tr.threadrow span.ttitle span.d-none");

    if (threads.length > 0) {
      threads.forEach(thread => {

          if (threadtitel.includes(thread.textContent)) {
              thread.parentElement.parentElement.parentElement.parentElement.remove();
          }
      });
    }
})();