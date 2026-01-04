// ==UserScript==
// @name         AO3: [Wrangling] Pad Separators for Character Autocomplete
// @description  Pads common tag separators when pasting text into Characters field to fix autocomplete
// @version      1.2

// @author       Nexidava
// @namespace    https://greasyfork.org/en/users/725254

// @match        *://*.archiveofourown.org/tags/*/edit
// @grant        none
// @license      GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @downloadURL https://update.greasyfork.org/scripts/447901/AO3%3A%20%5BWrangling%5D%20Pad%20Separators%20for%20Character%20Autocomplete.user.js
// @updateURL https://update.greasyfork.org/scripts/447901/AO3%3A%20%5BWrangling%5D%20Pad%20Separators%20for%20Character%20Autocomplete.meta.js
// ==/UserScript==

(function() {
    let autocomplete = document.querySelector("input#tag_character_string_autocomplete");
    if (!autocomplete) { return; }

    autocomplete.addEventListener('paste', (event) => {
        event.preventDefault();

        let paste = (event.clipboardData || window.clipboardData).getData('text');
        paste = paste.replace(/(?<=[^\s])[/&|]/g, " $&").replace(/[/&|](?=[^\s])/g, "$& ");
        document.execCommand("insertText", false, paste);
    });
})();
