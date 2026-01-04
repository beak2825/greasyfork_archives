// ==UserScript==
// @name         BitcoinTalk User Notes
// @version      0.3.1
// @description  Adds an note field to each user on BitcoinTalk
// @author       TryNinja
// @match        https://bitcointalk.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointalk.org
// @grant GM.setValue
// @grant GM.getValue
// @grant GM_setValue
// @grant GM_getValue
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/465800/BitcoinTalk%20User%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/465800/BitcoinTalk%20User%20Notes.meta.js
// ==/UserScript==

const enableModal = 1;

(async function() {
    'use strict';

    const addStyle = (css) => {
        const style = document.getElementById("GM_addStyleBy8626") || (() => {
        const style = document.createElement('style');
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
        })();
        const sheet = style.sheet;
        sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
    }

    if (enableModal) {
        addStyle(`.modal {
            position: fixed;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }`);

        addStyle(`.modal-bg {
            position: absolute;
            width: 100%;
            height: 100%;
        }`);

        addStyle(`.modal-container {
            min-width: 30vh;
            border-radius: 10px;
            background: #fff;
            position: relative;
            padding: 10px;
        }`);

        addStyle(`.modal-close {
            position: absolute;
            right: 15px;
            top: 15px;
            outline: none;
            appearance: none;
            color: red;
            background: none;
            border: 0px;
            font-weight: bold;
            cursor: pointer;
        }`);
    };

    const getValue = typeof GM_getValue === 'undefined' ? GM.getValue : GM_getValue;
    const setValue = typeof GM_setValue === 'undefined' ? GM.setValue : GM_setValue;

    const getParentNodeNth = (element, num) => {
        let parent = element;
        for (let i = 0; i < num; i++) {
            if (parent.parentNode) {
                parent = parent.parentNode;
            }
        }
        return parent;
    };

    const getNotes = async () => {
        let notes;
        try {
            notes = JSON.parse(await getValue('notes') ?? '{}');
        } catch (error) {
            notes = {};
        };
        return notes;
    };

    const setNotes = async notes => {
        if (typeof notes === 'string') {
            try {
                JSON.parse(notes);
                await setValue('notes', notes);
            } catch (error) {
                console.error('Notes value is an invalid JSON format')
            };
        } else if (typeof notes === 'object') {
            await setValue('notes', JSON.stringify(notes ?? {}));
        };
    };

    const getUserNote = async user => {
        const notes = await getNotes();
        if (!notes) {
            return null;
        }
        return notes[user];
    };

    const setUserNote = async (user, note) => {
        const notes = await getNotes();
        notes[user] = note;
        await setNotes(notes)
    };

    const texts = {
        addNote: '<a style="cursor: pointer; font-weight: bold" href="javascript:;">📜 Add Note</a>',
        withNote: note => `<a style="cursor: pointer; font-weight: bold" href="javascript:;"><b>📜</b> ${note}</a>`
    };

    const addNote = async (user, element) => {
        const note = prompt('Input the note (empty to remove):');
        if (note) {
            element.innerHTML = texts.withNote(note);
            await setUserNote(user, note);
        } else if (note !== null) {
            element.innerHTML = texts.addNote;
            await setUserNote(user, note);
        }
    };

    const exportNotesToInput = async () => {
        const notesInput = document.querySelector('#notesInput');
        const notesImportExportDiv = document.querySelector('#notesImportExportDiv');
        const doneImportButton = document.querySelector('#doneImportButton');
        const notes = await getNotes();
        const notesJsonString = JSON.stringify(Object.keys(notes)
            .filter(user => notes[user]).reduce((obj, user) => ({...obj, [user]: notes[user]}), {}));

        notesInput.value = notesJsonString;
        notesImportExportDiv.querySelector('span').innerText = 'Export (copy the code)';
        notesImportExportDiv.style.display = 'flex';
        doneImportButton.style.display = 'none';
    };

    const importNotesFromInput = async () => {
        const notesInput = document.querySelector('#notesInput');
        const notesImportExportDiv = document.querySelector('#notesImportExportDiv');
        const doneImportButton = document.querySelector('#doneImportButton');

        notesInput.value = '';
        notesImportExportDiv.querySelector('span').innerText = 'Import (paste the code)';
        notesImportExportDiv.style.display = 'flex';
        doneImportButton.style.display = 'inline-block';
    };

    const importNotesFromInputDone = async () => {
        const notesInput = document.querySelector('#notesInput');
        const confirmImport = confirm('Are you sure you want to override your local notes?');

        if (confirmImport && notesInput.value) {
            setNotes(notesInput.value);
            loadUserNotesList();
        }
    };

    const insertNotesModal = async () => {
        let notesModal = document.querySelector('#userNotesModal');

        if (!notesModal) {
            const moreMenuBtn = document.querySelector('body');
            notesModal = document.createElement('div');

            notesModal.innerHTML = `
                <div class="modal" id="modal-one">
                    <div class="modal-bg modal-exit"></div>
                    <div class="modal-container">
                        <div style="margin-bottom: 5px;">
                            <b style="font-size: 2rem;">User Notes</b>
                            <button class="modal-close modal-exit">X</button>
                        </div>

                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <button id="exportUserNotes">Export</button>
                            <button id="importUserNotes">Import</button>
                        </div>

                        <div>
                            <div style="display: none; flex-direction: column;" id="notesImportExportDiv">
                                <span id="notesInputText"></span>
                                <input id="notesInput" />
                                <button id="doneImportButton" style="display: none;">Done</button>
                            </div>

                        </div>

                        <div id="userNotesList" />
                    </div>
                </div>`;
            notesModal.classList.add('modal');
            notesModal.style.visibility = 'hidden';
            notesModal.setAttribute('id', 'userNotesModal');

            moreMenuBtn.after(notesModal);

            const exportButton = document.querySelector('#exportUserNotes');
            const importButton = document.querySelector('#importUserNotes');
            const doneImportButton = document.querySelector('#doneImportButton');

            exportButton.addEventListener('click', () => exportNotesToInput());
            importButton.addEventListener('click', () => importNotesFromInput());
            doneImportButton.addEventListener('click', () => importNotesFromInputDone());
        };

        return notesModal;
    };

    const loadUserNotesList = async () => {
        const userNotesList = document.querySelector('#userNotesList');

        const notes = await getNotes();

        if (Object.keys(notes).length) {
            userNotesList.innerHTML = Object.keys(notes)
            .filter(user => notes[user])
            .map((user) => `<a href="https://bitcointalk.org/index.php?action=profile;u=${user}" target="_blank">${user}</a>: ${notes[user]}`).join('<br/>');
        } else {
            userNotesList.innerHTML = 'No notes...';
        };
    };

    const insertUserNotesMenuButton = async () => {
        let notesBtn = document.querySelector('#userNotesMenuBtn');
        const modal = await insertNotesModal();
        const modalExit = modal.querySelectorAll('.modal-exit');

        if (!notesBtn) {
            const moreMenuBtn = document.querySelector(`a[href='/more.php']`).parentNode;
            notesBtn = document.createElement('td');

            notesBtn.innerHTML = '<td><a href="javascript:;" id="openUserNotes">User Notes</a></td>';
            notesBtn.classList.add('maintab_back');
            notesBtn.setAttribute('id', 'userNotesMenuBtn');
            moreMenuBtn.after(notesBtn);

            const openUserNotes = document.querySelector('#openUserNotes')
            const notesImportExportDiv = document.querySelector('#notesImportExportDiv');
            const notesInput = document.querySelector('#notesInput');

            openUserNotes.addEventListener('click', () => {
                modal.style.visibility = 'visible';
                modal.style.opacity = 1;
                notesImportExportDiv.style.display = 'none';
                notesInput.value = '';
                loadUserNotesList();
            });
            modalExit.forEach(el => el.addEventListener('click', () => {
                modal.style.visibility = 'hidden';
                modal.style.opacity = 0;
            }));
        }

        return notesBtn;
    };

    if (enableModal) {
        insertNotesModal();
        insertUserNotesMenuButton();
    };

    if (window.location.href.match(/topic=\d+/)) {
        const targets = [...document.querySelectorAll('td.poster_info div a:last-child')]
        .filter(e => window.getComputedStyle(getParentNodeNth(e, 11)).display !== 'none');

        targets.map(async target => {
            const [_, userId] = [...target.parentNode.parentNode.childNodes].find(childNode => childNode.innerHTML).innerHTML.match(/u=(\d+)/);
            const noteDiv = document.createElement('div');
            const note = await getUserNote(userId);
            if (!note) {
                noteDiv.innerHTML = texts.addNote;
            } else {
                noteDiv.innerHTML = texts.withNote(note);
            }
            target.before(noteDiv);
            noteDiv.addEventListener('click', () => addNote(userId, noteDiv), false);
        });
    } else if (window.location.href.match(/profile;u=\d+$/)) {
        const [_, userId] = window.location.href.match(/u=(\d+)/);
        const target = getParentNodeNth(document.querySelector('#bodyarea table tr td tbody tr:nth-child(2) tr:last-child').parentNode, 1);
        const noteDiv = document.createElement('div');
        const note = await getUserNote(userId);
        if (!note) {
            noteDiv.innerHTML = texts.addNote;
        } else {
            noteDiv.innerHTML = texts.withNote(note);
        }
        target.before(noteDiv);
        noteDiv.addEventListener('click', () => addNote(userId, noteDiv), false);
    }
})();