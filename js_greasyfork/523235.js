// ==UserScript==
// @name         Quick Notes Anywhere
// @namespace    https://itzmehuman000.github.io/
// @version      1.0
// @description  Adds a floating notepad on any website to jot down ideas or reminders.
// @author       DUSTIN
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523235/Quick%20Notes%20Anywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/523235/Quick%20Notes%20Anywhere.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const notesContainer = document.createElement('div');
    notesContainer.style.position = 'fixed';
    notesContainer.style.bottom = '10px';
    notesContainer.style.right = '10px';
    notesContainer.style.width = '300px';
    notesContainer.style.height = '200px';
    notesContainer.style.backgroundColor = '#fefefe';
    notesContainer.style.border = '1px solid #ccc';
    notesContainer.style.borderRadius = '5px';
    notesContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notesContainer.style.padding = '10px';
    notesContainer.style.zIndex = '9999';
    notesContainer.style.resize = 'both';
    notesContainer.style.overflow = 'auto';

    const textarea = document.createElement('textarea');
    textarea.style.width = '100%';
    textarea.style.height = '100%';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.fontFamily = 'Arial, sans-serif';
    textarea.style.fontSize = '14px';
    textarea.placeholder = 'Type your notes here...';


    textarea.value = localStorage.getItem('quickNotes') || '';


    textarea.addEventListener('input', () => {
        localStorage.setItem('quickNotes', textarea.value);
    });

    notesContainer.appendChild(textarea);
    document.body.appendChild(notesContainer);
})();
