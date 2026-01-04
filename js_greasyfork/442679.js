// ==UserScript==
// @name         Kanka Lightbox Creator
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      2
// @description  Changes a standard image in a Kanka entry into a thumbnail-and-lightbox combo
// @author       Salvatos
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/442679/Kanka%20Lightbox%20Creator.user.js
// @updateURL https://update.greasyfork.org/scripts/442679/Kanka%20Lightbox%20Creator.meta.js
// ==/UserScript==


GM_addStyle(`
#entry + div:not(.codeview) .lightboxButton {
   	display: none;
}
`);

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {

    // Locate toolbar
    const toolbar = document.getElementsByClassName('note-toolbar')[0];

    // Create button
    var lightboxButton = `
    <div class="note-btn-group btn-group note-extensions lightboxButton">
        <button type="button" class="note-btn btn btn-default btn-sm note-codeview-keep" tabindex="-1" title="Convert image to lightbox">
            <i class="fas fa-images" aria-hidden="true" aria-label="Convert image to lightbox"></i>
        </button>
    </div>`;
    toolbar.insertAdjacentHTML("beforeend", lightboxButton);

    // Add click event to button
    lightboxButton = document.getElementsByClassName('lightboxButton')[0];
    lightboxButton.addEventListener('click', (e)=>{
        //e.preventDefault();
        // Check that we are in code editor
        if ($('#entry + div').hasClass('codeview')) {
            // Grab selection from editor
            const codeEditor = document.getElementsByClassName('note-codable')[0];
            var selectedText = codeEditor.value.substring(codeEditor.selectionStart, codeEditor.selectionEnd);
            var initialStart = codeEditor.selectionStart;
            var initialEnd = codeEditor.selectionEnd;
            var initialLength = codeEditor.value.length;

            // Make (reasonably) sure we are holding a single image tag
            if (selectedText.slice(0, 4) == '<img' && selectedText.slice(-1) == '>' && selectedText.match(/</g).length == 1 && selectedText.match(/>/g).length == 1) {
                // Turn selection into node for easier handling
                var targetNode = $(selectedText);
                // Grab the image’s source
                let imgSrc = $(targetNode).attr('src');
                // If it has a title, grab that too
                let imgTitle = $(targetNode).attr('title') || "";

                // Make a presumably unique ID based on timestamp
                let tsID = "lightbox-" + Date.now();

                // Wrap the image in the lightbox markup
                let replacementText = `<a href="#` + tsID + `">` + selectedText + `</a><a href="#_" id="` + tsID + `" class="lightbox" title="` + imgTitle + `"><img src="` + imgSrc + `"></a>`;

                // Replace selection with modified markup
                codeEditor.focus();
                codeEditor.setRangeText(replacementText, codeEditor.selectionStart, codeEditor.selectionEnd, 'select');

                // Apply changes to master copy in case of immediate save
                $('#entry').val($('#entry + div').find('.note-codable').val());

                // Return focus to textarea and select newly inserted string to make it clear to the user
                var lengthDiff = $('#entry + div').find('.note-codable').val().length - initialLength;
                var newEnd = initialEnd + lengthDiff;/*
                    console.log(initialStart);
                    console.log(initialEnd);
                    console.log(initialLength);
                    console.log(lengthDiff);
                    console.log(newEnd);*/
                codeEditor.setSelectionRange(initialStart, newEnd);
            }
            else {
                alert("To create a lightbox, you must first select the target image tag (e.g. <img...>).");
            }

        }
    });
});