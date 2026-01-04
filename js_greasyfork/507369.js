// ==UserScript==
// @name         Typing Accented Characters in Oveleaf (for macOS only)
// @namespace    https://github.com/alberti42/
// @version      1.8
// @description  Block dead keys in Overleaf to allow for typing of accented letters. It also allows typing ß. It blocks undesired key combinations.
// @author       Andrea Alberti
// @match        https://www.overleaf.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507369/Typing%20Accented%20Characters%20in%20Oveleaf%20%28for%20macOS%20only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507369/Typing%20Accented%20Characters%20in%20Oveleaf%20%28for%20macOS%20only%29.meta.js
// ==/UserScript==
//
// This script is designed for macOS users working in Overleaf who encounter issues
// with typing accented letters due to dead keys. It blocks dead key events to allow
// proper input of accented characters when using dead keys. To install this script
// in Greasemonkey (for Firefox) or Violentmonkey (for Chrome/Firefox/Edge),
// simply copy and paste it into a new userscript in your userscript manager.
// For more information on how to use dead keys to type accented characters on a Mac,
// please refer to the official Apple guide: https://support.apple.com/en-ph/guide/mac-help/mh27474/mac
//


(function() {
  'use strict';

  // Global debug variable
  const debug = false;  // Set to true for logging, false to disable logs

  // Function to log messages if debug is enabled
  function logDebug(message, ...optionalParams) {
    if (debug) {
      console.log(message, ...optionalParams);
    }
  }

  // Function to insert text into a contenteditable element at the cursor position
  function insertTextInContentEditable(text) {

    // Get the active element and check if it's contenteditable
    var activeElement = document.activeElement;
    if (!activeElement || !activeElement.getAttribute('contenteditable')) {
      console.error("Active element is not contenteditable or not found");
      return;
    }

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);  // Get the range at the current cursor position
    range.deleteContents();  // Remove any selected text
    const textNode = document.createTextNode(text);  // Create a text node for the 'ß' character
    range.insertNode(textNode);  // Insert the 'ß' character at the current position
    range.setStartAfter(textNode);  // Move the cursor after the inserted character
    range.setEndAfter(textNode);
    selection.removeAllRanges();  // Clear all current selections
    selection.addRange(range);  // Add the new range (after the inserted character)
  }

  // Event listener to block dead keys and accented letters
  function handleKeydown(e) {
    // Log the event details for debugging
    if(debug) {
      console.log("Event Triggered:");
      console.log("Key: ", e.key);
      console.log("Code: ", e.code);
      console.log("Alt Key: ", e.altKey);
      console.log("Key Code: ", e.keyCode);
      console.log("Shift Key: ", e.shiftKey);
      console.log("Ctrl Key: ", e.ctrlKey);
      console.log("Meta Key: ", e.metaKey);
    }

    // Block dead keys
    if (e.key === 'Dead') {
      e.preventDefault();  // Block the key
      logDebug("Blocked dead key");
    }
    // Block Alt + ArrowDown and Alt + ArrowUp combinations
    else if (e.altKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();  // Block the key
      logDebug("Blocked arrow up/down keys");
    }
    // Block <0xa0> character
    else if (e.altKey && e.shiftKey && e.keyCode === 32) {
      e.preventDefault();  // Block the key
      logDebug("Blocked <0xa0> character");
    }
    // Allow Alt + S for typing the character 'ß'
    else if (e.altKey && e.keyCode === 83 && e.key === 'ß') {
      e.preventDefault();  // Prevent the default action
      logDebug("Alt+S Detected: allow typing 'ß'");
      insertTextInContentEditable('ß');  // Insert 'ß' at the current cursor position
    }
    // Allow Alt + Shift + 2 for typing the character '€'
    else if (e.altKey && e.shiftKey && e.keyCode === 50 && e.key === '€') {
      e.preventDefault();  // Prevent the default action
      logDebug("Alt+Shift+2 Detected: allow typing '€'");
      insertTextInContentEditable('€');  // Insert 'ß' at the current cursor position
    }
  }

  // Attach the event listener to the document
  document.addEventListener('keydown', handleKeydown, true);

})();