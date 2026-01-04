// ==UserScript==
// @name         Summernote to Markdown for Kanka
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1
// @description  Adds bidirectional Markdown conversion to Kanka editors
// @author       Salvatos
// @match        https://app.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @require      https://cdnjs.cloudflare.com/ajax/libs/showdown/2.1.0/showdown.min.js
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502637/Summernote%20to%20Markdown%20for%20Kanka.user.js
// @updateURL https://update.greasyfork.org/scripts/502637/Summernote%20to%20Markdown%20for%20Kanka.meta.js
// ==/UserScript==

// Wait for Summernote to initialize
$('.html-editor').on('summernote.init', function() {

    // Set up Showdown converter
    // To customize your preferences, see https://github.com/showdownjs/showdown/wiki/Showdown-options
    var converter = new showdown.Converter({
        simpleLineBreaks: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tables: true,
        underline: true
    });

    // Add HTML (add the "open" attribute to the <details> tag to have it expanded by default, i.e. <details open>)
    var mdInput = `<details>
    <summary class="text-center text-lg cursor-pointer">Markdown Editor <sup style="font-variant: all-small-caps;font-weight: 600">Experimental!</sup></summary>
    <p>The following field converts the Summernote entry above to Markdown in real time. Changes made to it are also reflected back to the editor.</p>
    <textarea id="markdown-input" name="markdown" rows="5" class="w-full html-editor"></textarea>
    </details>`;
    document.querySelector(".note-editor").insertAdjacentHTML("afterend", mdInput);
    mdInput = document.getElementById("markdown-input");
    document.querySelector(".note-editor").style.marginBottom = "0";

    // Populate MD on load
    mdInput.value = converter.makeMarkdown(document.getElementById("entry").value);

    // Add change event to textarea
    mdInput.addEventListener('input', function( e ) {
        document.querySelector(".html-editor").value = document.querySelector(".note-editable").innerHTML = document.querySelector(".note-codable").value = converter.makeHtml(mdInput.value);
    });

    // Add change event to Summernote (only need to watch the HTML version to keep it simple)
    $('.html-editor').on('summernote.change.codeview', function(we, contents, $editable) {
        mdInput.value = converter.makeMarkdown(contents);
    });
});