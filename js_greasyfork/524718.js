// ==UserScript==
// @name        Activate Dimmer
// @description Activate dark mode using the context menu.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.dimmer-context-menu
// @homepageURL https://greasyfork.org/scripts/524718-activate-dimmer
// @supportURL  https://greasyfork.org/scripts/524718-activate-dimmer/feedback
// @copyright   2025 - 2026, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5SFPC90ZXh0Pjwvc3ZnPgo=
// @match       *://*/*
// @exclude     devtools://*
// @version     26.01.13
// @require     https://unpkg.com/darkreader@4.9.58/darkreader.js
// @noframes
// @run-at      context-menu
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/524718/Activate%20Dimmer.user.js
// @updateURL https://update.greasyfork.org/scripts/524718/Activate%20Dimmer.meta.js
// ==/UserScript==

DarkReader.setFetchMethod(window.fetch); // https://eligrey.com/
DarkReader.enable({brightness: 100, contrast: 90, sepia: 10});

/*

(async function () {
  if (await GM.getValue("dimmer", false)) {
    await GM.setValue("dimmer", false);
    DarkReader.disable({brightness: 100, contrast: 90, sepia: 10});
  } else {
    await GM.setValue("dimmer", true);
    DarkReader.enable({brightness: 100, contrast: 90, sepia: 10});
  }
})();

*/
