// ==UserScript==
// @name         kbin Keyboard Shortcuts
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds keyboard shortcuts for formatting and navigation
// @author       Artillect
// @match        https://kbin.social/*
// @match        https://fedia.io/*
// @match        https://kilioa.org/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468603/kbin%20Keyboard%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/468603/kbin%20Keyboard%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const Formats = {'bold': '**', 'italic': '*', 'underline': '__', 'strikethrough': '~~', 'code': '`', 'spoiler': '||', 'quote': '>'};

    // On page load, add keyboard shortcuts to the button hover text
    window.onload = function() {
        // Get all buttons in the markdown toolbar by tag name
        document.getElementsByTagName('md-bold')[0].title = "Ctrl + B";
        document.getElementsByTagName('md-italic')[0].title = "Ctrl + I";
        document.getElementsByTagName('md-header')[0].title = "Insert header";
        document.getElementsByTagName('md-quote')[0].title = "Ctrl + Shift + ,";
        document.getElementsByTagName('md-code')[0].title = "Insert code";
        document.getElementsByTagName('md-link')[0].title = "Insert link";
        document.getElementsByTagName('md-image')[0].title = "Insert image";
        document.getElementsByTagName('md-ordered-list')[0].title = "Insert ordered list";
        document.getElementsByTagName('md-unordered-list')[0].title = "Insert unordered list";

        // Add button for strikethrough
        document.getSelection('markdown-toolbar')[0].innerHTML += '<md-strikethrough><i class="fa-solid fa-strikethrough></i></md-strikethrough>';
    }

    document.onkeyup = function(e) {
        // If textarea is focused
        if (document.activeElement.tagName == "TEXTAREA") {
            var textarea = document.activeElement;


            if (e.ctrlKey && e.which == 66) { // Bold
                insertFormat('bold',textarea);
            } else if (e.ctrlKey && e.which == 73) {
                // Italicize selection
                insertFormat('italic',textarea);
            // TODO: Add header code
            // } else if (e.ctrlKey && e.which == 72) {
            //     // Insert header
            } else if (e.ctrlKey && e.which == 83) {
                // Strikethrough
                insertFormat('strikethrough',textarea);
            }
        }
    }

    function insertFormat(format,textarea) {
        var text = textarea.value;
        var start = textarea.selectionStart;
        var end = textarea.selectionEnd;
        var before = text.substring(0, start);
        var after  = text.substring(end, text.length);

        var symbol = Formats[format];


        if (format != 'quote') {
            if (text.substring(start - symbol.length, start) == symbol && text.substring(end, end + symbol.length) == symbol) {
                console.log("unbold")
                textarea.value = text.substring(0, start - symbol.length) + text.substring(start, end) + text.substring(end + symbol.length, text.length);
                textarea.selectionStart = start - symbol.length;
                textarea.selectionEnd = end - symbol.length;
                textarea.focus();
            } else {
                textarea.value = before + symbol + text.substring(start, end) + symbol + after;
                textarea.selectionStart = start + symbol.length;
                textarea.selectionEnd = end + symbol.length;
                textarea.focus();
            }
        }


    }
})();