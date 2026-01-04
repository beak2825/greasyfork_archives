// ==UserScript== 
// @name        Switch Page Direction
// @description Switch Page Direction from LTR to RTL and vice versa. Hotkey: Command + Shift + D.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.direction
// @homepageURL https://greasyfork.org/en/scripts/467248-switch-page-direction-hotkey
// @supportURL  https://greasyfork.org/en/scripts/467248-switch-page-direction-hotkey/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     Public Domain
// @match       file:///*
// @exclude     devtools://*
// @match       *://*/*
// @version     23.06
// @run-at      document-end
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7ihpTvuI88L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/467248/Switch%20Page%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/467248/Switch%20Page%20Direction.meta.js
// ==/UserScript==

document.onkeyup = function(e) {
  // Command + Shift + D
  if (e.metaKey && e.shiftKey && e.which == 68) {
    switchPageDirection();
  }
};

function switchPageDirection() {
  if (document.dir == 'ltr' || !document.dir) {
    document.dir = 'rtl';
  } else {
    document.dir = 'ltr';
  }
  return switchPageDirection;
}

/*

NOTE In case we can use context-menu and document-end in same userscript

// @run-at context-menu
// @run-at document-end


var switchPageDirection = (function switchPageDirection() {
  if (!document.dir) {
    document.dir = 'rtl';
  } else if (document.dir == 'ltr') {
    document.dir = 'rtl';
  } else if (document.dir == 'rtl') {
    document.dir = 'ltr';
  }
  return switchPageDirection;
})();

*/
