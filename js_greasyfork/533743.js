// ==UserScript==
// @name         ESPN - play off multi
// @namespace    http://tampermonkey.net//
// @version      1.1
// @description  Maže problémový řádek
// @author       Michal
// @match        https://www.espn.com/nba/schedule
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533743/ESPN%20-%20play%20off%20multi.user.js
// @updateURL https://update.greasyfork.org/scripts/533743/ESPN%20-%20play%20off%20multi.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeGameNotes() {
    const notes = document.querySelectorAll('.gameNote');
    notes.forEach(note => {
      const tr = note.closest('tr');
      if (tr) {
        tr.remove();
        console.log('🧹 Odstraněn řádek s poznámkou:', note.textContent.trim());
      }
    });
  }


  removeGameNotes();


  setInterval(removeGameNotes, 1000);
})();