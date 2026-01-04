// ==UserScript==
// @name         Disable "Alt/Option + Click" shortcut
// @namespace    https://vighnesh153.dev/
// @version      2024-08-08
// @description  Disables "Alt/Option + Click" shortcut combo that downloads the link on Chrome
// @author       vighnesh153
// @match        *://*/*
// @icon         https://raw.githubusercontent.com/vighnesh153/vighnesh153-monorepo/main/nodejs-tools/nodejs-chrome-extensions/disable-alt-click-download/images/logo_48x48.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503012/Disable%20%22AltOption%20%2B%20Click%22%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/503012/Disable%20%22AltOption%20%2B%20Click%22%20shortcut.meta.js
// ==/UserScript==

(function () {
  "use strict";

  document.addEventListener("click", (e) => {
    // not clicked on anchor tag
    const closestAnchor = e.target?.closest("a");
    if (!closestAnchor) {
      return;
    }
    // not clicked on alt or option key
    if (!e.altKey) {
      return;
    }

    // disable the "alt/option + click" download shortcut combo
    e.preventDefault();
    console.log(
      `Disabled "alt/option + click" download shortcut combo for link: ${closestAnchor.innerText}`,
    );
  });
})();
