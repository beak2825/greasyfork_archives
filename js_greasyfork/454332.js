// ==UserScript==
// @name        Delete Add Blocker Warnings - lightnovelpub.com
// @namespace   Violentmonkey Scripts
// @match       https://www.lightnovelpub.com/
// @grant       none
// @version     1.1
// @author      -
// @license MIT
// @description Deletes all add blocker warnings and allows text selection.
// @downloadURL https://update.greasyfork.org/scripts/454332/Delete%20Add%20Blocker%20Warnings%20-%20lightnovelpubcom.user.js
// @updateURL https://update.greasyfork.org/scripts/454332/Delete%20Add%20Blocker%20Warnings%20-%20lightnovelpubcom.meta.js
// ==/UserScript==

window.onload = onload;

function onload() {
  // It takes a little bit until the add blocker
  // warnings appear, even after load of window.
  setTimeout(delete_add_blocker_warnings, 1000);

  // Allowing text selection
  let chapter = document.querySelector('#chapter-container');
  let user_select_auto = 'auto';
  set_css(chapter, {
    'user-select': user_select_auto,
    '-webkit-user-select': user_select_auto,
    '-moz-user-select': user_select_auto,
    '-ms-user-select': user_select_auto,
  });
}

function delete_add_blocker_warnings() {
  for (const h of document.querySelectorAll('h3')) {
      if (h.textContent.includes('ad-blocker')) {
      h.parentNode.parentNode.remove()
    }
  }
}

function set_css(element, style) {
    for (const property in style)
        element.style[property] = style[property];
}