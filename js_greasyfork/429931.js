// ==UserScript==
// @name         [Deprecated] Kanka Marketplace Plugin HTML Inserter for Summernote
// @namespace    http://tampermonkey.net/
// @version      4
// @description  Adds a button to Summernote that inserts HTML snippets required by Marketplace themes.
// @author       Salvatos
// @match        https://kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429931/%5BDeprecated%5D%20Kanka%20Marketplace%20Plugin%20HTML%20Inserter%20for%20Summernote.user.js
// @updateURL https://update.greasyfork.org/scripts/429931/%5BDeprecated%5D%20Kanka%20Marketplace%20Plugin%20HTML%20Inserter%20for%20Summernote.meta.js
// ==/UserScript==

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {

    // Prepare to check for supported themes in the campaign
    var rootFlags = getComputedStyle(document.documentElement);

    // Define our supported code snippets
    let snippets = [];
    // Build list items for our supported code snippets
    let themes = [];

    // Figure Box and Floats by Ornstein
    if (rootFlags.getPropertyValue('--summernote-insert-figure-box') || 1 === 1) { // Temporary bypass for initial release
        snippets.push('<div class="figure">Insert image and caption here</div>');
        snippets.push('<div class="figure r clear">Insert image and caption here</div>');
        themes.push('<li aria-label="Figure Box and Floats (no float)"><a href="#">Figure Box (no float)</a></li>');
        themes.push('<li aria-label="Figure Box and Floats (float right + clear)"><a href="#">Figure Box (float right + clear)</a></li>');
    }

    // Responsive Image Gallery by Salvatos
    if (rootFlags.getPropertyValue('--summernote-insert-autogallery') || 1 === 1) { // Temporary bypass for initial release
        snippets.push('<div class="autogallery">Insert gallery images here</div>');
        themes.push('<li aria-label="Responsive Image Gallery"><a href="#">Responsive Image Gallery</a></li>');
    }

    // Simple Tooltips by KeepOnScrollin
    if (rootFlags.getPropertyValue('--summernote-insert-simple-tooltip') || 1 === 1) { // Temporary bypass for initial release
        snippets.push('<span class="simple-tooltip">Tooltip trigger<span class="simple-tooltip-text top">Tooltip content</span></span>');
        themes.push('<li aria-label="Simple Tooltip (top)"><a href="#">Simple Tooltip (top)</a></li>');
    }
    // Tip Box by Critter
    if (rootFlags.getPropertyValue('--summernote-insert-tip-box') || 1 === 1) { // Temporary bypass for initial release
        snippets.push('<div class="tipbox-small">Small Tip Box text.</div>');
        snippets.push('<div class="tipbox-big">Big Tip Box text.</div>');
        themes.push('<li aria-label="Tip Box (small)"><a href="#">Tip Box (small)</a></li>');
		themes.push('<li aria-label="Tip Box (big)"><a href="#">Tip Box (big)</a></li>');
    }

    var themeList = themes.join("");

    // Locate toolbar and insert our dropdown button
    const toolbar = document.getElementsByClassName('note-toolbar')[0];
    var customButton = `
<div class="note-btn-group btn-group note-style">
	<div class="note-btn-group btn-group">
		<button type="button" class="note-btn btn btn-default btn-sm dropdown-toggle note-codeview-keep" tabindex="-1" data-toggle="dropdown" title="Marketplace theme HTML snippets" aria-expanded="false">
			<i class="fas fa-puzzle-piece"></i> <span class="note-icon-caret"></span>
		</button>
		<ul class="note-dropdown-menu dropdown-menu dropdown-snippets" aria-label="Marketplace theme HTML snippets">
			` + themeList + `
		</ul>
	</div>
</div>`;
    toolbar.insertAdjacentHTML("beforeend", customButton);

    // Grab our completed dropdown
    const dropdown = document.getElementsByClassName('dropdown-snippets')[0];

    // Make sure we have at least one supported theme enabled
    if (dropdown.children[0]) {
        // Add click events to editor
        for (let i = 0; i < dropdown.children.length; i++) {
            var currentButton = dropdown.children[i];

            currentButton.addEventListener('click', ()=>{
                // Code editor, not supported by Summernote functions so we're making our own
                if ($('#entry + div').hasClass('codeview')) {
                    const codeEditor = $('#entry + div').find('.note-codable');
                    var cursorPos = codeEditor.prop('selectionStart');
                    var editorValue = codeEditor.val();
                    var textBefore = editorValue.substring(0, cursorPos);
                    var textAfter  = editorValue.substring(cursorPos, editorValue.length);
                    var newPos = cursorPos + snippets[i].length + 1;
                    codeEditor.val(textBefore + '\n' + snippets[i] + textAfter);

                    // Return focus to textarea and select newly inserted string to make it clear to the user
                    codeEditor[0].focus();
                    codeEditor[0].setSelectionRange(cursorPos, newPos);

                    // Update Summernote’s hidden textarea in case of immediate saving
                    $('#entry').val(codeEditor.val());
                }
                // Visual editor, API has us covered here
                else {
                    var insertNode = $.parseHTML(snippets[i])[0];
                    $('#entry').summernote('insertNode', insertNode);
                }
            });
        }
    }
    else {
        dropdown.insertAdjacentHTML("beforeend", "<li><a href='#'><em>No supported theme found</em></a></li>");
    }
});

/*
* TODO: A different script (or button + function) should be used for themes that only need to add classes to any element, such as Redacted Text, Context-Aware Classes and .boxquote.
* Those would only work in the visual editor since there I can target those elements as objects and manipulate their classes.
* The question is how we would identify the node that corresponds to the cursor position.
*/

/* Reference for a single button (consider using the API instead: https://summernote.org/deep-dive/#custom-button )

// Wait for Summernote to initialize
$('#entry').on('summernote.init', function() {

    const toolbar = document.getElementsByClassName('note-toolbar')[0];
    var customButton = `
    <div class="note-btn-group btn-group note-extensions custom-summernote-button">
    <button type="button" class="note-btn btn btn-default btn-sm note-codeview-keep" tabindex="-1" title="Custom button">
    <i class="fas fa-file-import" aria-hidden="true"></i>
    </button>
    </div>`;
    toolbar.insertAdjacentHTML("beforeend", customButton);

    // Add input event to code editor
    customButton = document.getElementsByClassName('custom-summernote-button')[0];
    customButton.addEventListener('click', ()=>{
        // your actions here
    });
}*/