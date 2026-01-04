// ==UserScript==
// @name        Remove Youtube Autoplay
// @namespace   https://gitlab.com/helq
// @description Remove autoplay from video suggestions on youtube
// @include     http://www.youtube.com/*
// @include     https://www.youtube.com/*
// @version     1.0.1
// @grant       none
// @author      helq
// @license     CC0
// @downloadURL https://update.greasyfork.org/scripts/369979/Remove%20Youtube%20Autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/369979/Remove%20Youtube%20Autoplay.meta.js
// ==/UserScript==

// Script based from:
// http://greasyfork.org/scripts/7893 by @wxc (https://greasyfork.org/en/users/8868-wxc)

let button_id = 'improved-toggle';
let deactivated = false;

let clickButton = function(node) {
  "use strict";
  
  node.click();
  document.body.removeEventListener('DOMSubtreeModified', f, false);
  console.log("It has been turned off :D");
}

let f = function() {
  "use strict";
  
  if (!deactivated) {
    //console.log("Detecting autoplay");
    let node = document.getElementById(button_id);
    if (node !== null && node.hasAttribute('active')) {
      console.log("Autoplay on. Trying to turn it off");
      setTimeout(clickButton, 150, node);
      deactivated = true;
    }
  }
}

//f();
document.body.addEventListener('DOMSubtreeModified', f, false);
setTimeout(f, 400);