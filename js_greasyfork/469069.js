// ==UserScript==
// @name     CCDCS Keyboard Shortcuts - Firefox Version
// @version  1
// @grant    none
// @description This is a simple script (for Firefox) to add keyboard shortcuts to some common functions on the Crown Court Digital Case System.
// @include  https://crowncourtdcs.caselines.co.uk/Case/Review*
// @namespace https://greasyfork.org/users/1107168
// @downloadURL https://update.greasyfork.org/scripts/469069/CCDCS%20Keyboard%20Shortcuts%20-%20Firefox%20Version.user.js
// @updateURL https://update.greasyfork.org/scripts/469069/CCDCS%20Keyboard%20Shortcuts%20-%20Firefox%20Version.meta.js
// ==/UserScript==
document.onkeyup = function(e) {
// Update Bundle: Ctrl-Alt-B
    if (e.ctrlKey && e.altKey && e.which == 66) {
    unsafeWindow.updateBundle();
// Go to PTPH Form: Ctrl-Alt-P
  } else if (e.ctrlKey && e.altKey && e.which == 80) {
    unsafeWindow.gotoPtphForm();
// Download Current Document: Ctrl-Alt-D
  } else if (e.ctrlKey && e.altKey && e.which == 68) {
    unsafeWindow.downloadCurrentDocument();
// Copy Link to current page: Ctrl-Alt-L
  } else if (e.ctrlKey && e.altKey && e.which == 76) {
    unsafeWindow.copyLink();
// Search: Ctrl-Alt-S
  } else if (e.ctrlKey && e.altKey && e.which == 83) {
    unsafeWindow.search();
// Show Case Information: Ctrl-Alt-I
  } else if (e.ctrlKey && e.altKey && e.which == 67) {
    unsafeWindow.showInformationDisplay();
// Shrink: Ctrl Alt - (minus)
  } else if (e.ctrlKey && e.altKey && e.which == 173) {
    unsafeWindow.shrink();
// Grow: Ctrl Alt + (plus)
  } else if (e.ctrlKey && e.altKey && e.which == 61) {
    unsafeWindow.grow();
// Rotate right: Ctrl-Alt-R
  } else if (e.ctrlKey && e.altKey && e.which == 82) {
    unsafeWindow.rotateRight();
  }
};
