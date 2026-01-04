// ==UserScript==
// @name         Kanka Preserve HTML Entities in Summernote
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Checks PRE and CODE tags in Summernote and ensures that their contents use HTML entities for proper display.
// @author       Salvatos
// @license      MIT
// @match        https://kanka.io/*
// @match        https://marketplace.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/456107/Kanka%20Preserve%20HTML%20Entities%20in%20Summernote.user.js
// @updateURL https://update.greasyfork.org/scripts/456107/Kanka%20Preserve%20HTML%20Entities%20in%20Summernote.meta.js
// ==/UserScript==

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {
    // Grab node tree from visual editor
    var masterNode = document.querySelector('#entry + .note-editor .note-editable');

    // Find CODEs and PREs
    masterNode.querySelectorAll(":is(pre, code)").forEach((domObject) => {
        domObject.replaceChildren(domObject.innerHTML);
        // Exclude ' < '  and ' > ' for CSS and comparison operators
        domObject.textContent = domObject.textContent.replace(/ &lt; /g, " < ").replace(/ &gt; /g, " > ");
    });

    // Apply changes to master copy in case of immediate save or switch to code view
    document.getElementById('entry').value = masterNode.innerHTML;
    // BUG: for some reason, this causes changes made in code view to be discarded if you don’t switch back to visual first, so let’s bring back our good old code view save fix...
    $('#entry').on('summernote.change.codeview', function(we, contents, $editable) {
        $(this).val(contents);
    });
});