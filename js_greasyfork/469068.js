// ==UserScript==
// @name     CCDCS Keyboard Shortcuts - Chrome Version
// @version  1
// @grant    none
// @description This is a simple script (for Google Chrome) to add keyboard shortcuts to some common functions on the Crown Court Digital Case System.
// @include  https://crowncourtdcs.caselines.co.uk/Case/Review*
// @namespace https://greasyfork.org/users/1107168
// @downloadURL https://update.greasyfork.org/scripts/469068/CCDCS%20Keyboard%20Shortcuts%20-%20Chrome%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/469068/CCDCS%20Keyboard%20Shortcuts%20-%20Chrome%20Version.meta.js
// ==/UserScript==
document.onkeyup = function(e) {
// Update Bundle: Ctrl-Alt-B
    if (e.ctrlKey && e.altKey && e.which == 66) {
    updateBundle();
// Go to PTPH Form: Ctrl-Alt-P
  } else if (e.ctrlKey && e.altKey && e.which == 80) {
    gotoPtphForm();
// Download Current Document: Ctrl-Alt-D
  } else if (e.ctrlKey && e.altKey && e.which == 68) {
    downloadCurrentDocument();
// Copy Link to current page: Ctrl-Alt-L
  } else if (e.ctrlKey && e.altKey && e.which == 76) {
    copyLink();
// Search: Ctrl-Alt-S
  } else if (e.ctrlKey && e.altKey && e.which == 83) {
    search();
// Show Case Information: Ctrl-Alt-I
  } else if (e.ctrlKey && e.altKey && e.which == 67) {
    showInformationDisplay();
// Shrink: Ctrl Alt - (minus)
  } else if (e.ctrlKey && e.altKey && e.which == 173) {
    shrink();
// Grow: Ctrl Alt + (plus)
  } else if (e.ctrlKey && e.altKey && e.which == 61) {
    grow();
// Rotate right: Ctrl-Alt-R
  } else if (e.ctrlKey && e.altKey && e.which == 82) {
    rotateRight();
  }
};
