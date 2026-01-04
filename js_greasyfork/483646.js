
// ==UserScript==
// @name         dragndropper
// @name:en      dragndropperen
// @namespace    dragndropper
// @version      1.5.1
// @description  dragndropperen
// @author       jh1575
// @match        dragndropperen
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483646/dragndropper.user.js
// @updateURL https://update.greasyfork.org/scripts/483646/dragndropper.meta.js
// ==/UserScript==

window.onload = function() {
  // find the element that you want to drag.
  var box = document.getElementById('box');
  
  /* listen to the touchMove event,
  every time it fires, grab the location
  of touch and assign it to box */
  
  box.addEventListener('touchmove', function(e) {
    // grab the location of touch
    var touchLocation = e.targetTouches[0];
    
    // assign box new coordinates based on the touch.
    box.style.left = touchLocation.pageX + 'px';
    box.style.top = touchLocation.pageY + 'px';
  })
  
  /* record the position of the touch
  when released using touchend event.
  This will be the drop position. */
  
  box.addEventListener('touchend', function(e) {
    // current box position.
    var x = parseInt(box.style.left);
    var y = parseInt(box.style.top);
  })
  
}