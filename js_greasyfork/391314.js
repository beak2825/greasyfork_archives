// ==UserScript==
// @name     Auto meta viewport
// @namespace https://github.com/NateScarlet/Scripts/tree/master/user-script
// @description Use <meta name="viewport" content="width=device-width, initial-scale=1"> as default.
// @run-at   document-end
// @include	 *
// @version   2023.08.27+66b8f8ff
// @downloadURL https://update.greasyfork.org/scripts/391314/Auto%20meta%20viewport.user.js
// @updateURL https://update.greasyfork.org/scripts/391314/Auto%20meta%20viewport.meta.js
// ==/UserScript==

"use strict";
(() => {
  // src/auto-meta-viewport.user.ts
  function main() {
    if (document.querySelector('meta[name="viewport"]')) {
      return;
    }
    const el = document.createElement("meta");
    el.name = "viewport";
    el.content = "width=device-width, initial-scale=1";
    document.head.append(el);
  }
  main();
})();
