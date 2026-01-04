// ==UserScript==
// @name         Note Taker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Crea note su una pagina web
// @author       Magneto1
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508694/Note%20Taker.user.js
// @updateURL https://update.greasyfork.org/scripts/508694/Note%20Taker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Aggiungi uno stile per il pannello delle note
    GM_addStyle(`
        #notePanel {
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            padding: 10px;
            display: none;
        }
        #noteInput {
            width: 100%;
            height: 100px;
            margin-bottom: 10px;
        }
        #saveNote {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
        }
        #closePanel {
            background: red;
            color: white;
            border: none;
            padding: 10px;
            cursor: pointer;
        }
    `);

    // Crea il pannello delle note
    const notePanel = document.createElement('div');
    notePanel.id = 'notePanel';

    const noteInput = document.createElement('textarea');
    noteInput.id = 'noteInput';
    notePanel.appendChild(noteInput);

    const saveNoteButton = document.createElement('button');
    saveNoteButton.id = 'saveNote';
    saveNoteButton.innerText = 'Salva Nota';
    notePanel.appendChild(saveNoteButton);

    const closePanelButton = document.createElement('button');
    closePanelButton.id = 'closePanel';
    closePanelButton.innerText = 'Chiudi';
    notePanel.appendChild(closePanelButton);

    document.body.appendChild(notePanel);

    // Mostra il pannello delle note
    const showNotePanel = () => {
        noteInput.value = localStorage.getItem('userNote') || ''; // Carica la nota salvata
        notePanel.style.display = 'block';
    };

    // Nascondi il pannello delle note
    const hideNotePanel = () => {
        notePanel.style.display = 'none';
    };

    // Salva la nota nel localStorage
    const saveNote = () => {
        localStorage.setItem('userNote', noteInput.value);
        alert('Nota salvata!');
    };

    // Aggiungi un comando al menu di Violentmonkey per aprire il pannello delle note
    GM_registerMenuCommand("Apri Pannello Note", showNotePanel);

    // Event listeners
    closePanelButton.onclick = hideNotePanel;
    saveNoteButton.onclick = saveNote;
})();

