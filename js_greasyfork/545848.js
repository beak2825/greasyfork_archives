// ==UserScript==
// @name        Invert All Colors
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description Inverts all colors on newgrounds.
// @match       *://*.newgrounds.com/*
// @grant       none
// @license     none
// @downloadURL https://update.greasyfork.org/scripts/545848/Invert%20All%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/545848/Invert%20All%20Colors.meta.js
// ==/UserScript==
(function () {
  document.head.appendChild(Object.assign(
    document.createElement('style'),
    {textContent: `
      html { filter: invert(100%) !important; }
      img,video { filter: invert(0%) !important; }
    `}
  ));
})();
