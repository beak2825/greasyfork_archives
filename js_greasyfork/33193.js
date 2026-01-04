// ==UserScript==
// @name         Extended SPACE Key Page Scroller
// @namespace    ExtendedSpaceKeyPageScroller
// @version      1.0.3
// @description  By default the SPACE key scrolls the page down by full height of browser view. With this script, pressing SHIFT+SPACE will scroll half of the view height. Page scroll by a quarter view height can be done using either LEFTSHIFT+RIGHTSHIFT+SPACE or SHIFT+CAPSLOCK+SPACE (configurable via variable).
// @author       jcunews
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/33193/Extended%20SPACE%20Key%20Page%20Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/33193/Extended%20SPACE%20Key%20Page%20Scroller.meta.js
// ==/UserScript==


// *** Configuration Start ***

// QuarterScrollKey: Determine what key combination to use for scrolling page by a quarter height of view.
// 0      = Use both SHIFT keys. i.e. LeftShift+RightShift+Space
// 1/else = Use CAPSLOCK key. i.e. Shift+CapsLock+Space
var QuarterScrollKey = 1;

// *** Configuration End ***


var shiftKeys = 0, capsLock = false;

addEventListener("keydown", function(ev) {
  switch (ev.which) {
    case 16: //SHIFT
      shiftKeys |= ev.location;
      break;
    case 20: //CAPSLOCK
      capsLock = true;
  }
}, true);

addEventListener("keyup", function(ev) {
  switch (ev.which) {
    case 16: //SHIFT
      shiftKeys &= ~ev.location;
      break;
    case 20: //CAPSLOCK
      capsLock = false;
  }
}, true);

addEventListener("keypress", function(ev, delta) {
  if (!ev.shiftKey) {
    shiftKeys = 0;
  } else if (!shiftKeys) {
    shiftKeys = 1;
  }
  if ((ev.which === 32) && !ev.altKey && (["INPUT", "TEXTAREA"].indexOf(document.activeElement.tagName) < 0)) {
    if (((shiftKeys === 3) && !capsLock && !QuarterScrollKey) || //with both SHIFT key
        (shiftKeys && (shiftKeys < 3) && capsLock && QuarterScrollKey)) { //with SHIFT+CAPSLOCK key
      delta = 4;
    } else if (shiftKeys) { //with one SHIFT key
      delta = 2;
    } else delta = 0;
    if (delta) {
      scrollBy(0, innerHeight / delta);
      ev.preventDefault();
      ev.stopPropagation();
      ev.stopImmediatePropagation();
    }
  }
}, true);
