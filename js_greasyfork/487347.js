// ==UserScript==
// @name         Double-click hyphenated word selection
// @namespace    https://greasyfork.org/en/users/1261421-colemeg
// @version      v1.1
// @description  In selecting a word by double click, it remove break separation by hyphen character (-). So that it will be considered as one word.
// @author       colemeg, based on code by @lexogram (https://github.com/lexogram) - (https://github.com/lexogram/select-with-hyphens/blob/main/selectWordsWithHyphens.js)
// @match        *://*/*
// @icon         none
// @grant        none
// @license      UNLICENSE - For more information, please refer to <https://unlicense.org> 
// @downloadURL https://update.greasyfork.org/scripts/487347/Double-click%20hyphenated%20word%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/487347/Double-click%20hyphenated%20word%20selection.meta.js
// ==/UserScript==

// Credit goes to @lexogram (https://github.com/lexogram) 
// Based on repo "selectWordsWithHyphens" (https://github.com/lexogram/select-with-hyphens/blob/main/selectWordsWithHyphens.js)
// 
// Tweak to make a double-click select words with hyphens or
// apostrophes.
//
// NOTE 1: It is not trivial to distinguish between a final
// apostrophe, which is an integral part of a word, that is used
// to indicate possession)...
//
//   She said, "Those books are Jodi's, but these are my kids'".
//
// ... from a closing single quote:
//
//   He said, "She said, 'Meet Jo and Di. These are my kids'".
//
// For simplicity, this script ignores both cases. As of 2023-04-12,
// all major browsers behave in exactly the same way.

"use strict"

document.body.addEventListener('dblclick', selectWord); // double-click events on the document body and triggers the selectWord function.

function selectWord(event) { 

  var selection = window.getSelection(); 
  var range = selection.getRangeAt(0); // Gets the range object for the current selection.

  if (event.target.isContentEditable || event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') { // Checks if the clicked element is editable (like an input or textarea).

    // Handling editable text
    var inputString = event.target.value; // Gets the value of the editable element.
    var cursorPos = event.target.selectionStart; // Retrieves the cursor position within the editable element.
    var start = cursorPos; // Sets the start position of the selection to the cursor position.
    var endPos = cursorPos; // Sets the end position of the selection to the cursor position.

    // Check for the word to the left of the cursor
    while (start > 0 && /[\w‑'’-]/g.test(inputString[start - 1])) { // Loops backward to find the beginning of a word.
        start--; // Decrements the start position 
    }
    // Check for the word to the right of the cursor
    while (endPos < inputString.length && /[\w‑'’-]/g.test(inputString[endPos])) { // Loops forward to find the end of a word.
        endPos++; // Increments the end position 
    }

    var ignoreRegexEditable = /^[\u00AD‑'’-]{2,}$/; // Regex to detect if the selection is just a series of join characters.
    var startRegexEditable = /(\w+[\u00AD‑'’-]?)+$/g; // Regex to find a word+join before the selected word. Examples: ad-|lib|  seven-o'|clock|
    var endRegexEditable = /^([\u00AD‑'’-]?\w+)+/; // Regex to find a join character after the selected word.
    var edgeRegexEditable = /\w|-|‑|'|’|\u00AD/; // Edge case: check if the selection contains no word characters or - or '.

    var chunkEditable = inputString.substring(start, endPos); // Retrieves the selected portion of text.
    var ignoreEditable = ignoreRegexEditable.test(chunkEditable) || !edgeRegexEditable.test(chunkEditable); // Checks if the selection should be ignored.

    if (ignoreEditable) { // If the selection should be ignored:
      return; // Exits the function.
    }

    event.target.setSelectionRange(start, endPos); // Sets the selection range to the determined start and end positions.

  } else {

    // Handling non-editable text
    var container = range.endContainer; // Retrieves the end container of the selection.
    var endOffset = range.endOffset; // Retrieves the end offset of the selection.
    var lastSelectedCharIsSpace = (container.textContent.substring(endOffset - 1, endOffset) === " "); // Checks if the last selected character is a space.
    endOffset -= lastSelectedCharIsSpace; // true → 1, false → 0

    if (!endOffset) { // If the end offset is zero:
      container = range.startContainer; // Sets range to the start container.
      endOffset = container.length; // Sets the end offset to the length of the container.
    }

    var string = container.textContent; // Retrieves the text content of the container.
    var startOffset = (container === range.startContainer) ? range.startOffset : 0; // Retrieves the start offset of the selection.

    // Regex definitions for non-editable text
    var ignoreRegexNonEditable = /^[\u00AD‑'’-]{2,}$/;
    var startRegexNonEditable = /(\w+[\u00AD‑'’-]?)+$/g; 
    var endRegexNonEditable = /^([\u00AD‑'’-]?\w+)+/;
    var edgeRegexNonEditable = /\w|-|‑|'|’|\u00AD/;
    
    var chunkNonEditable = string.substring(startOffset, endOffset); // Retrieves the selected portion of text.
    var ignoreNonEditable = ignoreRegexNonEditable.test(chunkNonEditable) || !edgeRegexNonEditable.test(chunkNonEditable); // Checks if the selection should be ignored.

    if (ignoreNonEditable) { // If the selection should be ignored:
      return; // Exits the function.
    }
    
    extendSelectionBackBeforeWord(string, startOffset); // Extends the selection backward before the word.
    extendSelectionForwardAfterWord(string, endOffset); // Extends the selection forward after the word.
    
    selection.removeAllRanges(); // Removes all existing ranges from the selection.
    selection.addRange(range); // Adds the updated range to the selection.
  }

  // Function to extend the selection backward before the word
  function extendSelectionBackBeforeWord(string, offset) {
    var lastIndex = 0;
    var result, index;
    string = string.substring(0, offset);
    
    while ((result = startRegexNonEditable.exec(string))) {
      index = result.index;
      lastIndex = startRegexNonEditable.lastIndex;
    }
    
    if (lastIndex === offset) {
      range.setStart(container, index);
    }
  }

  // Function to extend the selection forward after the word
  function extendSelectionForwardAfterWord(string, offset) {
    if (!offset) {
      return;
    }
    
    string = string.substring(offset);
    var result = endRegexNonEditable.exec(string);
    
    if (result) {
      endOffset = offset + result[0].length;
      range.setEnd(container, endOffset);
    }
  }

}
