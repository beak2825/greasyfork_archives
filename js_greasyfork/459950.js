// ==UserScript==
// @name         Hide Mouse Cursor
// @namespace    https://greasyfork.org/users/45933
// @version      0.0.2
// @author       Fizzfaldt
// @license      MIT
// @description  Hide Mouse cursor when not in use/Show when in use
// @run-at       document-end
// @grant        none
// @noframes
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/459950/Hide%20Mouse%20Cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/459950/Hide%20Mouse%20Cursor.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
(function () {
  let hidden = false;

  const styleEl = document.createElement("style");
  // Use some poop clowns to get a high selector specificity so we can override
  // other selectors in case they also use !important.
   const poopClowns = ":not(#💩🤡)".repeat(20);

  // Height 100% sometimes needed for firefox to hide cursor
styleEl.textContent = `
html, body {
  height: 100%;
}
${poopClowns} {
   cursor: none !important ;
}
`;

  function hideHandler() {
    if (hidden) return;
    if (document.activeElement.tagName == "TEXTAREA") {
        // Do nothing when inside a text field.
        return;
    }
    hidden = true;
    document.head.append(styleEl);
  }

  function showHandler() {
    if (!hidden) return;
    hidden = false;
    styleEl.remove();
  }

  const scrollEl = document.scrollingElement;
  const hideEvents = ["scroll", "keyup"];
  const showEvents =
    (
        "PointerEvent" in window
    ) ? ["pointerdown", "pointermove"]
      : ["mousedown", "mousemove", "touchstart", "touchmove", "wheel"];
  const options = {capture: true, passive: true};

  for (const event of hideEvents) {
    scrollEl.addEventListener(event, hideHandler, options);
  }

  for (const event of showEvents) {
    scrollEl.addEventListener(event, showHandler, options);
  }
})();
