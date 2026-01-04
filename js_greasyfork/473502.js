// ==UserScript==
// @name         hega notepad
// @name:de      hega notizen
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  Simple notepad for Hidden Empire - Galaxy Adventures. Toggle by clicking the second separator in the right menu (above the "interactive radar" or profile pic).
// @description:de Einfaches Notizfeld für Hidden Empire - Galaxy Adventures. An-/Ausschalten über klick auf den zweiten Separator im rechten Menü (über dem "interaktiven Radar" oder Profilbild).
// @author       holycrumb
// @license      MIT
// @match        https://scarif.hiddenempire.de/game.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hiddenempire.de
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473502/hega%20notepad.user.js
// @updateURL https://update.greasyfork.org/scripts/473502/hega%20notepad.meta.js
// ==/UserScript==
'use strict';
let ogNode;

window.addEventListener("load", function(){
    console.log("notepad load called");

    document.querySelectorAll(".mright .sidebar-nohover")[1].onclick = toggleNotepad;

    if (localData.getStatus()){
        localData.setStatus(0);
        toggleNotepad();
    }
});

const localData = {
    getStatus: () => {
        let status = parseInt(localStorage.getItem("localNoteStatus"), 10);
        if (isNaN(status)){
            localStorage.setItem("localNoteStatus", status = 0);
            console.log("localNoteStatus created: " + status);
        }
        return status;
    },
    setStatus: (status) => {
        localStorage.setItem("localNoteStatus", status);
    },
    getNote: () => {
        let note = localStorage.getItem("localNote");
        if (note == null){
            note = "Your notes here!";
            localStorage.setItem("localNote", note);
        }
        return note;
    },
    setNote: (note) => {
        localStorage.setItem("localNote", note);
    }
}

function toggleNotepad(){
    if (!localData.getStatus()){
        ogNode = $(".txt_c.heMenuInfo").children();

        let notepad = $('<textarea id="notepad" style="width: 95%" rows="10" cols="16" spellcheck="false"></textarea>');
        $(".txt_c.heMenuInfo").children().replaceWith(notepad);

        notepad.val(localData.getNote());
        notepad.on("input", () => {
            localData.setNote(notepad.val());
        });
        localData.setStatus(1);
    }
    else{
        $(".txt_c.heMenuInfo").children().replaceWith(ogNode);
        localData.setStatus(0);
    }
}