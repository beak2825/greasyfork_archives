// ==UserScript==
// @name         Kanka Summernote Code View to the Top
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Sets the cursor position to the start of the input field rather than the end when switching to Code View in Kanka
// @author       Salvatos
// @match        https://app.kanka.io/*
// @match        https://marketplace.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430685/Kanka%20Summernote%20Code%20View%20to%20the%20Top.user.js
// @updateURL https://update.greasyfork.org/scripts/430685/Kanka%20Summernote%20Code%20View%20to%20the%20Top.meta.js
// ==/UserScript==

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {
    // Add event to code view toggle
    document.getElementsByClassName('btn-codeview')[0].addEventListener('click', cursorToTop);
});

function cursorToTop() {
    // Run only when in code view
    if ($('#entry + div').hasClass('codeview')) {
        // Find editor
        const codeEditor = document.getElementsByClassName('note-codable')[0];
        // Selection to 0
        codeEditor.setSelectionRange(0,0);
    }
}