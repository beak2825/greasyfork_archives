// ==UserScript==
// @name         AO3 Hide Author's Notes
// @namespace    ao3-remove-authors-notes
// @version      1.1
// @description  Hides all author's notes on AO3 works.
// @author       yuube
// @match        http*://*.archiveofourown.org/works/*
// @match        http*://*.archiveofourown.org/collections/*/works/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389367/AO3%20Hide%20Author%27s%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/389367/AO3%20Hide%20Author%27s%20Notes.meta.js
// ==/UserScript==

// Work preface note.
var preface = document.querySelector('#workskin .preface');
var prefaceNote = preface.querySelector('.notes')

// If there are no gifts or other associations, hide whole preface note section.
var associations = preface.querySelector('.associations')
if (!associations && prefaceNote) {
    prefaceNote.style.display = 'none'

// Otherwise, just hide the author note.
} else if (prefaceNote) {
    var userstuff = prefaceNote.querySelector('.userstuff')
    if (userstuff) {
        userstuff.style.display = 'none'
    }

    // Also hide the jump to end notes.
    var jump = prefaceNote.querySelector('.jump')
    if (jump) {
        jump.style.display = 'none'
    }
}

// If there's a work end note, hide it.
var endNote = document.querySelector('#work_endnotes')
if (endNote) {
   endNote.style.display = 'none'
}

// For chapters, hide all note sections.
var chapters = document.querySelector('#chapters');
chapters.querySelectorAll('.notes').forEach(function (note) {
   note.style.display = 'none';
});
