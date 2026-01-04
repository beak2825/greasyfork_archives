// ==UserScript==
// @name        Switch Page Direction
// @description Switch Page Direction from LTR to RTL and vice versa, using context menu.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.direction-menu
// @homepageURL https://greasyfork.org/en/scripts/467249-switch-page-direction-menu
// @supportURL  https://greasyfork.org/en/scripts/467249-switch-page-direction-menu/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     Public Domain
// @exclude     devtools://*
// @match       file:///*
// @match       *://*/*
// @version     23.06
// @run-at      context-menu
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7ihpTvuI88L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/467249/Switch%20Page%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/467249/Switch%20Page%20Direction.meta.js
// ==/UserScript==

(function switchPageDirection() {
  if (document.dir == 'ltr' || !document.dir) {
    document.dir = 'rtl';
  } else {
    document.dir = 'ltr';
  }
  return switchPageDirection;
})();