// ==UserScript== 
// @name        Switch Page Direction
// @description Switch Page Direction from LTR to RTL and vice versa, using the Greasemonkey menu.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.direction-command
// @homepageURL https://greasyfork.org/en/scripts/490275-switch-page-direction-command
// @supportURL  https://greasyfork.org/en/scripts/490275-switch-page-direction-command/feedback
// @copyright   2024, Schimon Jehudah (http://schimon.i2p)
// @license     Public Domain
// @grant       GM.registerMenuCommand
// @exclude     devtools://*
// @match       file:///*
// @match       *://*/*
// @version     24.03
// @run-at      document-end
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7ihpTvuI88L3RleHQ+PC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/490275/Switch%20Page%20Direction.user.js
// @updateURL https://update.greasyfork.org/scripts/490275/Switch%20Page%20Direction.meta.js
// ==/UserScript==

function switchPageDirection() {
  if (document.dir == 'ltr' || !document.dir) {
    document.dir = 'rtl';
  } else {
    document.dir = 'ltr';
  }
}

(async function registerMenuCommand(){
  await GM.registerMenuCommand(`Switch Page Direction`, () => switchPageDirection());
})();
