// ==UserScript==
// @name Sticky Note
// @namespace https://greasyfork.org/en/scripts/475201-sticky-note
// @homepage https://github.com/Rainman69/Sticky-note-for-browser/
// @version 1.8.1
// @description sticky note to the browser for taking quick notes
// @match https://*/*
// @match http://*/*
// @icon  data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAV1BMVEVBQUH/5AA7PEJ2bjj/6wD/6ACxoCq2pS40N0I+PkF5cDg9P0U4O0Xgyy42OUZNSz//8gDkzywwM0Ldxh69rCt2bz0kKkQvNEbn0irdyS8pMEdzbD58cjancakPAAABjklEQVR4nO3c207CQBiFUQSKDGcRtSrv/5wSxcih0CaSDPNnrWtC8qWz27vp9QAAAAAAAAAAAAAAAAAAAAD+o387uVOaLSeDW5ksc8c06U9Ww1tZTe7xKfYHw4dbGQ4U5qBQocL8FCpUmJ9ChQrzU6hQYX4KFSrMT6FChfkpVKgwP4UKFeancK/qYlVwYfU86mDzknLnNOhYOHodt1m/1duCn+HjuO2P0qwu+pS2FqZ+XZX8pmktTOmpKvpd2laYprvAyIW7De4CAxfuA+MWfm8wcuHPBgMX/h7RsIUHgTEL/45o0MKjwIiFh0c0ZOFJYLzC4yMasDBN58eB0QrT4uQJRitMi/o0MFbh2QajFZ5vMFhhWjQFBips2mCowsYNRips3mCgwgsbjFPY8KGPVXhxg1EKL28wSGGaXQsMUHhtgyEKr24wQuH1DQYoTIv3lsDCC9eXP/RBCj/aA++1sNOdCqvNvMPP7vNOhY73Ynxui70Xo+PdJqngu00AAAAAAAAAAAAAAAAAAACAYnwB4rYpAiTInEoAAAAASUVORK5CYII=
// @grant GM_addStyle
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @license      CC BY-NC-ND 4.0
// @licenseURL   https://github.com/Rainman69/Sticky-note-for-browser/blob/main/LICENSE
// @downloadURL https://update.greasyfork.org/scripts/475201/Sticky%20Note.user.js
// @updateURL https://update.greasyfork.org/scripts/475201/Sticky%20Note.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Create the sticky note element
  var note = document.createElement('div');
  note.id = 'sticky-note';
  note.contentEditable = true;
  note.spellcheck = false;
  note.style.display = 'none';
  note.style.position = 'fixed';
  note.style.top = '10px';
  note.style.right = '10px';
  note.style.width = '7em';
  note.style.height = '8em';
  note.style.padding = '10px';
  note.style.backgroundColor = 'rgba(255, 215, 0, 0.9)'; // Set opacity to 90%
  note.style.color = '#000000';
  note.style.fontFamily = 'Arial, sans-serif';
  note.style.fontSize = '14px';
  note.style.zIndex = '9999';
  note.style.borderRadius = '10px'; // Rounded corners
  note.style.boxShadow =
    '0px -3px 10px rgba(0, 0, 0, 0.3), 0px 0px 10px rgba(255, 215, 0, 0.5)'; // Upper shadow and glow shadow
  note.style.overflow = 'auto'; // Enable scrollbars when content exceeds the box height

  // Append the note to the document
  document.body.appendChild(note);

  // Show or hide the note when Tab key is pressed
  var isNoteVisible = false;

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Tab') {
      isNoteVisible = !isNoteVisible;
      note.style.display = isNoteVisible ? 'block' : 'none';
      event.preventDefault(); // Prevents the default tab behavior
    }
  });

  // Save note content when it's changed
  note.addEventListener('input', function () {
    var content = note.innerText; // Use innerText to get plain text without HTML tags
    GM_setValue('stickyNoteContent', content);
    resizeNote();
  });

  // Remove note when the page is unloaded
  window.addEventListener('beforeunload', function () {
    GM_deleteValue('stickyNoteContent'); // Delete the stored note content
    document.body.removeChild(note);
  });

  // Resize the note based on content length
  function resizeNote() {
    var content = note.innerText; // Use innerText to get plain text without HTML tags
    note.style.height = ''; // Reset the height to recalculate the scrollable height

    // Determine text direction based on the note content
    if (isRTLText(content)) {
      note.style.direction = 'rtl';
    } else {
      note.style.direction = 'ltr';
    }
  }

  // Check if text contains right-to-left (RTL) characters
  function isRTLText(text) {
    var rtlRegex = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/;
    return rtlRegex.test(text);
  }

  // Retrieve note content if available
  var storedContent = GM_getValue('stickyNoteContent');
  if (storedContent) {
    note.innerText = storedContent;
  }

  // Resize the note when it becomes visible
  note.addEventListener('transitionend', function () {
    if (isNoteVisible) {
      resizeNote();
    }
  });
})();