// ==UserScript==
// @name         YouTube Video Notes
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds a note-taking feature on YouTube videos, storing notes per video using localStorage and Tampermonkey storage.
// @author       You
// @match        https://www.youtube.com/*
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/526200/YouTube%20Video%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/526200/YouTube%20Video%20Notes.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastVideoId = null;

    function saveNote(id, note) {
        localStorage.setItem(id, note);
        GM_setValue(id, note);
    }

    function deleteNote(id) {
        localStorage.removeItem(id);
        GM_deleteValue(id);
    }

    function createButton(id, text, displayStyle, clickHandler, customStyles = '') {
        const button = document.createElement('button');
        button.id = id;
        button.innerText = text;
        button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--filled yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-s';
        button.style.cssText = `margin-top: 10px; display: ${displayStyle}; ${customStyles}`;
        button.addEventListener('click', clickHandler);
        return button;
    }

    function createNoteUI(videoId, existingNote) {
        const container = document.createElement('div');
        container.className = 'yt-note-container item style-scope ytd-watch-metadata';
        container.style.cssText = `
          background: var(--yt-spec-badge-chip-background);
          width: 100%;
          border-radius: 12px;
          font-size: 14px;
          padding: 8px;
          box-sizing: border-box;
        `;

        const noteArea = document.createElement('textarea');
        noteArea.id = `yt-note-textarea-${videoId}`;
        noteArea.style.cssText = `
            width: 100%;
            height: 80px;
            font-family: inherit;
            resize: vertical;
            display: ${existingNote ? 'block' : 'none'};
            box-sizing: border-box;
            padding: 4px;
            color: #fff;
            background: transparent;
            border-radius: 4px;
            border: 1px solid white;
        `;
        noteArea.value = existingNote || '';
        noteArea.disabled = !existingNote;

        const button = createButton(`yt-note-button-${videoId}`, existingNote ? 'Edit Note' : 'Write Note', 'inline-block', () => {
            noteArea.style.display = 'block';
            noteArea.disabled = false;
            saveButton.style.display = 'inline-block';
            deleteButton.style.display = 'inline-block';
            button.style.display = 'none';
        });

        const saveButton = createButton(`yt-note-save-${videoId}`, 'Save', existingNote ? 'none' : 'inline-block', () => {
            const noteText = noteArea.value.trim();
            if (noteText) {
                saveNote(`yt-note-${videoId}`, noteText);
                button.innerText = 'Edit Note';
                button.style.display = 'inline-block';
                saveButton.style.display = 'none';
                deleteButton.style.display = 'inline-block';
                noteArea.disabled = true;
            }
        }, 'margin-left: 6px;');

        const deleteButton = createButton(`yt-note-delete-${videoId}`, 'Delete Note', existingNote ? 'inline-block' : 'none', () => {
            deleteNote(`yt-note-${videoId}`);
            noteArea.value = '';
            button.innerText = 'Write Note';
            button.style.display = 'inline-block';
            saveButton.style.display = 'none';
            deleteButton.style.display = 'none';
            noteArea.disabled = true;
        }, 'margin-left: 6px;');

        const fetchAllNotesButton = createButton('yt-fetch-notes', 'Show All Notes', 'block', fetchAllNotes, 'margin-top: 10px; width: 100%;');

        container.appendChild(noteArea);
        container.appendChild(button);
        container.appendChild(saveButton);
        container.appendChild(deleteButton);
        container.appendChild(fetchAllNotesButton);

        return container;
    }

    function insertNoteUI() {
        const videoId = new URL(window.location.href).searchParams.get('v');
        if (!videoId || videoId === lastVideoId) return;

        lastVideoId = videoId;

        const existingNote = localStorage.getItem(`yt-note-${videoId}`) || '';
        const commentSection = document.getElementById('comments');
        if (!commentSection) {
            setTimeout(insertNoteUI, 2000);
            return;
        }

        const oldNote = document.querySelector('.yt-note-container');
        if (oldNote) oldNote.remove();

        const noteUI = createNoteUI(videoId, existingNote);
        commentSection.parentNode.insertBefore(noteUI, commentSection);
    }

    function fetchAllNotes() {
        const allNotes = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('yt-note-')) {
                allNotes[key.replace('yt-note-', '')] = localStorage.getItem(key);
            }
        }
        console.log(JSON.stringify(allNotes, null, 2));
    }

    function observeNavigationChanges() {
        document.addEventListener('yt-navigate-finish', () => {
            setTimeout(insertNoteUI, 2000);
        });

        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                insertNoteUI();
            }
        }, 1000);
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            insertNoteUI();
            observeNavigationChanges();
        }, 2000);
    });

})();
