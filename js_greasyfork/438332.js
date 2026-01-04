// ==UserScript==
// @name         A-t.nu fix
// @namespace    https://ikke.github.io/
// @version      1.0
// @description  Remove annoying selection and copying prevention
// @author       Ikke
// @match        https://a-t.nu/novel/*
// @icon         https://a-t.nu/wp-content/uploads/2021/06/cropped-AT-LOGO-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438332/A-tnu%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/438332/A-tnu%20fix.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const text = document.querySelectorAll("p span");

  for (const el of text) {
    let before = getComputedStyle(el, ":before").content.replace(/^"|"$/g, "");
    let after = getComputedStyle(el, ":after").content.replace(/^"|"$/g, "");

    el.insertAdjacentText("afterbegin", before);
    el.insertAdjacentText("beforeend", after);
  }

  let stylesheet = document.styleSheets[0];
  stylesheet.insertRule("span:before, span:after, p:before { content: none !important }");
  stylesheet.insertRule("p { user-select: auto !important }");
})();
