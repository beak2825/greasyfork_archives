// ==UserScript==
// @name        Remove YouTube Propaganda
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @author      Rip Ryness
// @license MIT
// @description Removes YouTube's propaganda box added to videos they find disagreeable.
// @downloadURL https://update.greasyfork.org/scripts/453498/Remove%20YouTube%20Propaganda.user.js
// @updateURL https://update.greasyfork.org/scripts/453498/Remove%20YouTube%20Propaganda.meta.js
// ==/UserScript==

function removeClarifyBox(box) {
  if (!box) {
    setTimeout(() => {
      removeClarifyBox(document.getElementById('clarify-box'))
    }, 250)
    return;
  }
  box.remove();
  console.log('youtube propaganda removed')
}

setTimeout(() => {
  removeClarifyBox(document.getElementById('clarify-box'))
}, 250)
