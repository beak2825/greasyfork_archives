// ==UserScript==
// @name           Fix Outlook Mac Hotkeys Hijacking
// @description    Disables Outlook from highjacking Mac keyboard shortcuts
// @copyright      2024, phonique (https://github.com/phonique/userscript-stop-outlook-hijack/)
// @homepageURL    https://github.com/phonique/userscript-stop-outlook-hijack
// @version        0.1.0
// @run-at         document-start
// @match          https://outlook.office.com/*
// @match          https://outlook.office365.com.mcas.ms/mail/*
// @grant          none
// @license        MPL-2.0
// @namespace https://greasyfork.org/users/1381446
// @downloadURL https://update.greasyfork.org/scripts/512765/Fix%20Outlook%20Mac%20Hotkeys%20Hijacking.user.js
// @updateURL https://update.greasyfork.org/scripts/512765/Fix%20Outlook%20Mac%20Hotkeys%20Hijacking.meta.js
// ==/UserScript==

// event codes for arrow keys.
var eventCodes = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"];

// Possible events: keypress, keyup, keydown
// currently Outlook seems to only require keydown and keyup.
// Only `keypress` is not enough to disable Alt-key hijacking.


// We enable useCapture here, because we want to capture the event while
// it's trickling down the DOM and then ignore other Listeners that hijack
// our default Alt functionality with our cancelBubble() and
// stopImmediatePropagation() calls.

window.addEventListener('keydown', handler, true); // useCapture true, i.e. we are capturing the event while it's trickling down
window.addEventListener('keyup', handler, true); // useCapture true
// window.addEventListener('keypress', handler, true); // we don't currently need this.

function handler (e) {
     // alert("eventCode: " + e.code + " eventKey: " + e.key); // debug here

     // If you want to completely disable Alt hijacking, not just in textboxes
     // uncomment the next and also comment out (or remove) the line following it.
     // if (e.code === "AltRight" || e.code === "AltLeft" || e.key === "Alt") {
     if ((e.code === "AltRight" || e.code === "AltLeft" || e.key === "Alt") && typeof(document.activeElement.role) !== 'undefined' && document.activeElement.role == 'textbox') {
         e.cancelBubble = true;
         e.stopImmediatePropagation();
     }
   /* // including previous UX-fixes
     if (eventCodes.indexOf(e.code) != -1 && e.shiftKey && e.altKey) {
         e.cancelBubble = true;
         e.stopImmediatePropagation();
     }
     if (eventCodes.indexOf(e.code) != -1 && e.altKey) {
         e.cancelBubble = true;
         e.stopImmediatePropagation();
     }
     if (eventCodes.indexOf(e.code) != -1 && e.shiftKey && e.metaKey) {
         e.cancelBubble = true;
         e.stopImmediatePropagation();
     }
     if (eventCodes.indexOf(e.code) != -1 && e.shiftKey && e.ctrlKey) {
         e.cancelBubble = true;
         e.stopImmediatePropagation();
     }
   */
}
