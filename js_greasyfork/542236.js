// ==UserScript==
// @name         FiveGuard Notes (Fixed # Edited coderbirisi)
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Add notes column with Save Note button nicely spaced (identifier | notes | action)
// @author       R4Z0R - edited @coderbirisi
// @contributor  coderbirisi - edited & fixed v1.8
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542236/FiveGuard%20Notes%20%28Fixed%20%20Edited%20coderbirisi%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542236/FiveGuard%20Notes%20%28Fixed%20%20Edited%20coderbirisi%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = `
        td.note-cell {
            min-width: 250px;
            white-space: nowrap;
        }
        .note-input {
            width: calc(100% - 80px);
            padding: 3px 6px;
            font-size: 13px;
            border: 1px solid #ccc;
            border-radius: 4px;
            vertical-align: middle;
            box-sizing: border-box;
        }
        .save-note-btn {
            margin-left: 8px;
            padding: 4px 8px;
            font-size: 12px;
            cursor: pointer;
            border: 1px solid #007bff;
            background-color: #007bff;
            color: white;
            border-radius: 3px;
            vertical-align: middle;
            white-space: nowrap;
        }
        .save-note-btn:hover {
            background-color: #0056b3;
            border-color: #0056b3;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = style;
    document.head.appendChild(styleSheet);

    function loadNote(id) {
        return GM_getValue(id, '');
    }

    function saveNote(id, note) {
        GM_setValue(id, note);
    }

    function fixTableHeader() {
        const table = document.getElementById("Permissions_AlternativePermissions");
        if (!table) return;

        const headerRow = table.querySelector("thead tr");
        if (!headerRow) return;

        const ths = headerRow.querySelectorAll("th");
        if (ths.length === 2) {
            const notesTh = document.createElement("th");
            notesTh.textContent = "Notes";
            headerRow.insertBefore(notesTh, ths[1]);
        }
    }

    function updateNotesUI() {
        const rows = document.querySelectorAll('tr[id^="Permissions_AlternativePermissions_"]');
        rows.forEach(row => {
            const id = row.id;
            const cells = row.children;

            if (cells.length === 2) {
                const actionCell = cells[1];
                const noteCell = document.createElement('td');
                noteCell.className = 'note-cell';

                const noteInput = document.createElement('input');
                noteInput.className = 'note-input';
                noteInput.type = 'text';
                noteInput.placeholder = 'Enter note...';
                noteInput.value = loadNote(id);

                function saveCurrentNote() {
                    saveNote(id, noteInput.value);
                    noteInput.blur();
                }

                noteInput.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        saveCurrentNote();
                    }
                });

                const saveBtn = document.createElement('button');
                saveBtn.className = 'save-note-btn';
                saveBtn.textContent = 'Save Note';
                saveBtn.type = 'button';
                saveBtn.addEventListener('click', saveCurrentNote);

                noteCell.appendChild(noteInput);
                noteCell.appendChild(saveBtn);

                const identifierCell = cells[0];
                row.innerHTML = '';
                row.appendChild(identifierCell);
                row.appendChild(noteCell);
                row.appendChild(actionCell);
            }
        });
    }

    const observer = new MutationObserver(() => {
        fixTableHeader();
        updateNotesUI();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    fixTableHeader();
    updateNotesUI();
})();
