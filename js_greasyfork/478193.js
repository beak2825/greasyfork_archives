// ==UserScript==
// @name         Replace Monospace Font Family With Brower Default Font
// @namespace    https://github.com/yahweh042
// @version      1
// @description  Replace Monospace Font Family With Brower Default Font In All Webpage
// @author       Merlin Hsu
// @match        *://*/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478193/Replace%20Monospace%20Font%20Family%20With%20Brower%20Default%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/478193/Replace%20Monospace%20Font%20Family%20With%20Brower%20Default%20Font.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // add tag css
  const css = `code, pre { font-family: monospace !important; }`
  GM_addStyle(css)

  const pattern = new RegExp("(monospace|SourceCodeProMac)");
  const monospaceFont = "monospace";
  const observer = new MutationObserver(() => {
    // console.log("Replace Font Family Begin")
    const elements = document.querySelectorAll("*");
    // console.log(`elements length = ${elements.length}`)
    for (const element of elements) {
      let style = window.getComputedStyle(element);
      let fontFamily = style.getPropertyValue("font-family");
      if (fontFamily === monospaceFont) {
          continue;
      }
      if (pattern.test(fontFamily)) {
        element.style.fontFamily = monospaceFont;
      }
      let font = style.getPropertyValue("font");
      if (pattern.test(font) !== -1) {
        element.style.font = monospaceFont;
      }
    }
  });
  const body = document.body;
  observer.observe(body, {
    childList: true,
    subtree: true,
  });
})();
