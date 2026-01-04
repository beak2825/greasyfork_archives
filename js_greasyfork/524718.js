// ==UserScript==
// @name        Activate Dark Mode
// @description Activate dark mode using the context menu.
// @author      Schimon Jehudah, Adv.
// @namespace   i2p.schimon.dimmer-context-menu
// @homepageURL https://greasyfork.org/en/scripts/524718-activate-dark-mode
// @supportURL  https://greasyfork.org/en/scripts/524718-activate-dark-mode/feedback
// @copyright   2025, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5SFPC90ZXh0Pjwvc3ZnPgo=
// @match       *://*/*
// @exclude     devtools://*
// @version     25.01.24
// @require     https://unpkg.com/darkreader@4.9.58/darkreader.js
// @noframes
// @run-at      context-menu
// @grant       GM.getValue
// @grant       GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/524718/Activate%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/524718/Activate%20Dark%20Mode.meta.js
// ==/UserScript==

(async function () {
  DarkReader.setFetchMethod(window.fetch); // https://eligrey.com/
  DarkReader.enable({brightness: 100, contrast: 90, sepia: 10});
})();

// toggle mode
/*
(async function toggle() {
  if (await GM.getValue('dimmer')) {
    await GM.setValue('dimmer', false);
    // Disable
    DarkReader.disable({brightness: 100, contrast: 90, sepia: 10});
  } else {
    await GM.setValue('dimmer', true);
    // Enable
    DarkReader.setFetchMethod(window.fetch); // https://eligrey.com/
    DarkReader.enable({brightness: 100, contrast: 90, sepia: 10});
  }
})();
*/
