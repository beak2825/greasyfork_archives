// ==UserScript==
// @name         Kanka Summernote HTML Beautifier
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      5
// @description  Automatically "beautifies" the HTML in Summernote's code view to make it more legible
// @author       Salvatos
// @match        https://app.kanka.io/*
// @match        https://marketplace.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.0/beautify-html.js
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430043/Kanka%20Summernote%20HTML%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/430043/Kanka%20Summernote%20HTML%20Beautifier.meta.js
// ==/UserScript==

// Wait for Summernote to initialize
$('.html-editor').on('summernote.init', function() {
    GM_addStyle(`
    .html-editor + div:not(.codeview) .cleanUpButton {
    	display: none;
    }
    `);

    // Locate toolbar
    const toolbar = document.getElementsByClassName('note-toolbar')[0];

    // Create button
    var cleanUpButton = `
    <div class="note-btn-group btn-group note-extensions cleanUpButton">
        <button type="button" class="note-btn btn btn-default btn-sm note-codeview-keep" tabindex="-1" title="Clean up HTML">
            <i class="fas fa-broom" aria-hidden="true" aria-label="Clean up HTML"></i>
        </button>
    </div>`;
    toolbar.insertAdjacentHTML("beforeend", cleanUpButton);

     // Add click event to button
    cleanUpButton = document.getElementsByClassName('cleanUpButton')[0];
    cleanUpButton.addEventListener('click', beautifyCodeView);

    // Add event to code view toggle
    document.getElementsByClassName('btn-codeview')[0].addEventListener('click', beautifyCodeView);
});

function beautifyCodeView() {
        // Run only when in code view
        if ($('.html-editor + div').hasClass('codeview')) {
            // Beautify
            $('.html-editor + div').find('.note-codable').val(html_beautify($('.html-editor + div').find('.note-codable').val(), {
                "indent_size": "2",
                "indent_char": " ",
                "max_preserve_newlines": "-1",
                "preserve_newlines": false,
                "keep_array_indentation": false,
                "break_chained_methods": false,
                "indent_scripts": "normal",
                "brace_style": "collapse",
                "space_before_conditional": false,
                "unescape_strings": false,
                "jslint_happy": false,
                "end_with_newline": false,
                "wrap_line_length": "0",
                "indent_inner_html": false,
                "comma_first": false,
                "e4x": false,
                "indent_empty_lines": false
            }));
        }
    }