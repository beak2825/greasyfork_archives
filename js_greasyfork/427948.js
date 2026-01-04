// ==UserScript==
// @name        Preserve focus
// @include        *
// @namespace   myfonj
// @grant       none
// @version     1.0
// @author      myf
// @description When re-focusing page content, return focus to element that was active before blur, instead of root element.
// @downloadURL https://update.greasyfork.org/scripts/427948/Preserve%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/427948/Preserve%20focus.meta.js
// ==/UserScript==

// https://greasyfork.org/en/scripts/427948/versions/new

var lastFocusedElement = document.activeElement;

window.addEventListener('blur', saveFocus, false);
window.addEventListener('focus', loadFocus, false);

function saveFocus(){
  // console.info('saving active element', {lastFocusedElement});
  lastFocusedElement = document.activeElement;
}

function loadFocus(){
  if(!lastFocusedElement) {
    // console.info('no lastFocusedElement');
    return
  }
  if(lastFocusedElement == document.activeElement) {
    // console.info('focus is already on right element', lastFocusedElement);
    return
  }
  // console.info('focusing', lastFocusedElement);
  lastFocusedElement.focus();
}
