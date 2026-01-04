// ==UserScript==
// @name Starve.io Zoom Fix
// @description Fix the zoom of starve.io
// @version 0.1
// @license MIT
// @run-at document-start
// @match  https://starve.io*
// @grant none
// @namespace https://greasyfork.org/users/1349814
// @downloadURL https://update.greasyfork.org/scripts/524291/Starveio%20Zoom%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/524291/Starveio%20Zoom%20Fix.meta.js
// ==/UserScript==

  var _scr = {};
  for (const key in screen) {
    switch (key) {
      case "width":
        _scr[key] = 3840;
        break;
      case "height":
        _scr[key] = 2160;
        break;
      default:
        _scr[key] = screen[key];
        break;
    }
  }
  window.screen = _scr;