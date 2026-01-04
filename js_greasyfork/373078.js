// ==UserScript==
// @name Remove Coursehero Monthly Limit
// @description Removes the Coursehero monthly document preview limit (originally 3).
// @author Luigi Agcaoili
// @include *coursehero.com/file/*
// @version 1.0.2
// @grant none
// @namespace https://greasyfork.org/users/208370
// @copyright 2019, luigia (https://github.com/luigia)
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/373078/Remove%20Coursehero%20Monthly%20Limit.user.js
// @updateURL https://update.greasyfork.org/scripts/373078/Remove%20Coursehero%20Monthly%20Limit.meta.js
// ==/UserScript==
window.addEventListener('load', () => {
  // pop-up modals
  if ( document.querySelector('.mfp-wrap') && document.querySelector('.mfp-bg') ) {
    let wrap = document.querySelector('.mfp-wrap'),
        bg = document.querySelector('.mfp-bg');
    wrap.remove();
    bg.remove();
  }

// remove dynamically added styles
document.body.className = '';
document.body.style.cursor = '';
// re-enable scrolling
document.body.style.setProperty ("overflow", "visible", "important");
document.body.click();
}, false);
