// ==UserScript==
// @name         mjai parse
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  make it so you can directly paste links gotten using the copy feature in mjs logs
// @author       Potatft
// @match        https://mjai.ekyu.moe/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494122/mjai%20parse.user.js
// @updateURL https://update.greasyfork.org/scripts/494122/mjai%20parse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var textBox = document.querySelector('input[name="log-url"]');
    var dropdown = document.querySelector('select[name="ui"]');
    var checkbox = document.querySelector('input[name="show-rating"]');
    textBox.addEventListener('paste', function(event) {
        // Prevent default paste behavior
        event.preventDefault();

        // Get pasted text
        var pastedText = (event.clipboardData || window.clipboardData).getData('text');

        // Modify the pasted text: remove "Mahjong Soul Game Log:"
        var modifiedText = pastedText.replace('Mahjong Soul Game Log:', '').trim();

        // Insert modified text into the text box
        document.execCommand('insertText', false, modifiedText);

        // Use classic UI
        var classicOption = dropdown.querySelector('option[value="classic"]');
        if (classicOption) {
            classicOption.selected = true;
        }
        // Show rating
        if (checkbox) {
            checkbox.checked = true;
        }
    });
})();
