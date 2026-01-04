// ==UserScript==
// @name        Remove annoying right column youtube
// @namespace   https://gitlab.com/helq
// @description Removing the very time grabbing right column of youtube
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     1.0.1
// @grant       none
// @author      helq
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/369978/Remove%20annoying%20right%20column%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/369978/Remove%20annoying%20right%20column%20youtube.meta.js
// ==/UserScript==

var removed = false;
var timer;

let column_id = 'ytd-watch-next-secondary-results-renderer.style-scope';

remover = function() {
  "use strict";
  
  let column = document.querySelector(column_id);
  column.parentNode.removeChild( column );
  document.body.removeEventListener('DOMSubtreeModified', timer, false);
}

timer = function () {
  if(!removed) {
    let column = document.querySelector(column_id);
    if(column !== null) {
      setTimeout(remover, 600); // wait for 50ms (hoping it's enough for other scripts to process in the column)
      removed = true;
    }
  }
}

console.log("Youtube right column remover started");
document.body.addEventListener('DOMSubtreeModified', timer, false);