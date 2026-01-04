// ==UserScript==
// @name     AO3: [Wrangling] Paste Tag into Char Field + pad separators for search
// @description  Adds a button to fill the tag text in the character field, to search for characters to canonize a rel + Pads common tag separators when actually pasting text into Characters field to fix autocomplete, this allows the names on either side to be recognizable to autocomplete
// @version  1.1
// @author   Ebonwing (Main paste script), Derpinaz (char paste modif), NexiDava (Pad Separators for Character Autocomplete)
// @grant    none
// @license  GPL-3.0 <https://www.gnu.org/licenses/gpl.html>
// @match        *://*.archiveofourown.org/tags/*/edit
// @namespace https://greasyfork.org/en/users/1365489-derpinaz
// @downloadURL https://update.greasyfork.org/scripts/507726/AO3%3A%20%5BWrangling%5D%20Paste%20Tag%20into%20Char%20Field%20%2B%20pad%20separators%20for%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/507726/AO3%3A%20%5BWrangling%5D%20Paste%20Tag%20into%20Char%20Field%20%2B%20pad%20separators%20for%20search.meta.js
// ==/UserScript==


function copyTagChar(){

  var text = document.getElementById("tag_name");

  var syn = document.getElementById("tag_character_string_autocomplete");

  syn.value = text.value.replace(/(?<=[^\s])[/&|]/g, " $&").replace(/[/&|](?=[^\s])/g, "$& ");

}
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

  const button = document.createElement("button")
  button.type = "button";
  button.innerText = "Copy tag into char field"
  button.addEventListener("click", copyTagChar);
  var chartext = document.getElementById("tag_character_string").parentNode;
  chartext.appendChild(button)

