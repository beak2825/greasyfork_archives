// ==UserScript==
// @name         Trakt.Tv Personnal Notes
// @namespace    http://tampermonkey.net/
// @version      2024-10-18
// @description  Add personnal notes to trakt.tv shows and movies
// @author       Arthur Takase
// @match        https://trakt.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=trakt.tv
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513115/TraktTv%20Personnal%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/513115/TraktTv%20Personnal%20Notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // if url does not contain /shows/ or /movies/ return
    if (!window.location.pathname.includes('/shows/')
        && !window.location.pathname.includes('/movies/')) return;

    const privateNotesContainer = document.querySelector('.section.private-notes');
    if (!privateNotesContainer) return;

    // ---- Remove useless elements ----

    const originalPrivateNotes = document.querySelectorAll('.section.private-notes .notable-launcher');
    for (let i = 0; i < originalPrivateNotes.length; i++) originalPrivateNotes[i].remove();

    const ad = document.querySelector('.add-bottom');
    if (ad) ad.remove();

    const vip = document.querySelector('.btn-vip');
    if (vip) vip.remove();

    const watchNow = document.querySelectorAll('.btn-watch-now');
    for (let i = 0; i < watchNow.length; i++) watchNow[i].remove();

    const streaming = document.querySelectorAll('.streaming-links');
    for (let i = 0; i < streaming.length; i++) streaming[i].remove();

    // ---- Add textarea and save button ----

    const type = window.location.pathname.includes('/shows/') ? 'shows' : 'movies';
    const traktId = window.location.pathname.split('/')[2];

    const notes = localStorage.getItem('traktNotes') || '{"shows": {}, "movies": {}}';
    const parsedNotes = JSON.parse(notes);

    var currentNotes = '';
    try { currentNotes = parsedNotes[type][traktId] || ''; }
    catch (e) { currentNotes = '';}

    const parent = document.createElement('div');
    parent.classList.add('personnal-notes-container');

    const textArea = document.createElement('textarea');
    textArea.value = currentNotes;
    textArea.placeholder = 'Add your personnal notes here';
    textArea.classList.add('personnal-notes-textarea');

    const btnsParents = document.createElement('div');
    btnsParents.classList.add('personnal-notes-btns-parents');

    // Save button

    const saveButton = document.createElement('button');
    saveButton.innerText = 'Save';
    saveButton.classList.add('personnal-notes-save-button');

    saveButton.addEventListener('click', () => {
        parsedNotes[type][traktId] = textArea.value;
        localStorage.setItem('traktNotes', JSON.stringify(parsedNotes));
    });

    // Export button

    const exportButton = document.createElement('button');
    exportButton.innerText = 'Export';
    exportButton.classList.add('personnal-notes-export-button');

    exportButton.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(parsedNotes));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "traktNotes.json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    });

    // Import button

    const importButton = document.createElement('button');
    importButton.innerText = 'Import';
    importButton.classList.add('personnal-notes-export-button');

    importButton.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const importedNotes = JSON.parse(reader.result);
                localStorage.setItem('traktNotes', JSON.stringify(importedNotes));
                window.location.reload();
            };
            reader.readAsText(file);
        });
        input.click();
    });

    // Append elements

    parent.appendChild(textArea);
    parent.appendChild(btnsParents);
    btnsParents.appendChild(saveButton);
    btnsParents.appendChild(exportButton);
    btnsParents.appendChild(importButton);
    privateNotesContainer.appendChild(parent);

    // ---- Styles ----

    const styles = `
.personnal-notes-container {
    display: flex;
    flex-direction: column;
    gap: .5rem;
}

.personnal-notes-textarea {
    width: 100%;
    border-radius: .5rem;
    padding: .7rem;
    resize: vertical;
}

.personnal-notes-btns-parents {
    display: flex;
    gap: .5rem;
    width: 100%;
}

.personnal-notes-btns-parents button {
    border: none;
    border-radius: .7rem;
    padding: 1rem;
}

.personnal-notes-export-button {
    background: #6e7a83;
    color: white;
    flex: 1;
}

.personnal-notes-save-button {
    background: #a93aaf;
    color: white;
    flex: 10;
}
    `;

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
})();