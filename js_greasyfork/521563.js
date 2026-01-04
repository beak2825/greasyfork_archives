// ==UserScript==
// @name         FiveGuard Notes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add notes to FiveGuard license entries
// @author       R4Z0R
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521563/FiveGuard%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/521563/FiveGuard%20Notes.meta.js
// ==/UserScript==

(function() {
   'use strict';

   const style = `
       .note-textarea {
           width: 100%;
           padding: 5px;
           margin: 2px;
           border: 1px solid #ccc;
       }

       .license-note-cell {
           min-width: 150px;
       }
   `;

   const styleSheet = document.createElement("style");
   styleSheet.textContent = style;
   document.head.appendChild(styleSheet);

   function loadNote(licenseId) {
       return GM_getValue(licenseId, '');
   }

   function saveNote(licenseId, note) {
       GM_setValue(licenseId, note);
   }

   function addNotesToTable() {
       const rows = document.querySelectorAll('tr[id^="Permissions_AlternativePermissions_license_"]');

       rows.forEach(row => {
           const licenseId = row.id.replace('Permissions_AlternativePermissions_license_', '');

           const existingNotes = row.querySelectorAll('.license-note-cell');
           if (existingNotes.length > 0) {
               existingNotes.forEach((note, index) => {
                   if (index > 0) note.remove();
               });
               return;
           }

           const noteCell = document.createElement('td');
           noteCell.className = 'license-note-cell';

           const noteInput = document.createElement('input');
           noteInput.type = 'text';
           noteInput.placeholder = 'Add note here';
           noteInput.className = 'note-textarea';

           const savedNote = loadNote(licenseId);
           noteInput.value = savedNote;

           noteInput.addEventListener('change', () => {
               saveNote(licenseId, noteInput.value);
           });

           noteInput.addEventListener('keyup', (event) => {
               if (event.key === 'Enter') {
                   saveNote(licenseId, noteInput.value);
                   noteInput.blur();
               }
           });

           noteCell.appendChild(noteInput);

           const actionCell = row.querySelector('.d-flex')?.parentElement;
           if (actionCell) {
               row.insertBefore(noteCell, actionCell);
           } else {
               row.appendChild(noteCell);
           }
       });
   }

   function addNotesHeader() {
       const table = document.querySelector('table[id="Permissions_AlternativePermissions"]');
       if (table && !table.querySelector('th.notes-header')) {
           const headerRow = table.querySelector('thead tr');
           const noteHeader = document.createElement('th');
           noteHeader.className = 'notes-header';
           noteHeader.textContent = 'Notes';
           headerRow.insertBefore(noteHeader, headerRow.lastElementChild);
       }
   }

   addNotesHeader();
   addNotesToTable();

   function debounce(func, wait) {
       let timeout;
       return function executedFunction(...args) {
           const later = () => {
               clearTimeout(timeout);
               func(...args);
           };
           clearTimeout(timeout);
           timeout = setTimeout(later, wait);
       };
   }

   const debouncedInit = debounce(() => {
       addNotesHeader();
       addNotesToTable();
   }, 250);

   const observer = new MutationObserver(() => {
       debouncedInit();
   });

   observer.observe(document.body, {
       childList: true,
       subtree: true
   });
})();