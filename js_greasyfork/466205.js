// ==UserScript==
// @name         Hide mouse cursor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  when scroll webpage, the cursor automatically hide.
// @author       artlan a
// @license MIT
// @match         *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466205/Hide%20mouse%20cursor.user.js
// @updateURL https://update.greasyfork.org/scripts/466205/Hide%20mouse%20cursor.meta.js
// ==/UserScript==

(function() {
  let hidden = false;

  const styleEl = document.createElement("style");
  // Use some poop clowns to get a high selector specificity so we can override
  // other selectors in case they also use !important.
  const poopClowns = ":not(#💩🤡)".repeat(20);
  styleEl.textContent = `${poopClowns} {cursor: none !important}`;

  function hideHandler() {
    if (hidden) return;
    hidden = true;
    document.head.append(styleEl);
  }

  function showHandler() {
    if (!hidden) return;
    hidden = false;
    styleEl.remove();
  }

  const scrollEl = document.scrollingElement;
  const hideEvents = ["scroll", "wheel"];
  const showEvents =
    "PointerEvent" in window
      ? ["pointerdown", "pointermove"]
      : ["mousedown", "mousemove", "touchstart", "touchmove"];
  const options = {capture: true, passive: true};

  for (const event of hideEvents) {
    scrollEl.addEventListener(event, hideHandler, options);
  }

  for (const event of showEvents) {
    scrollEl.addEventListener(event, showHandler, options);
  }
})();
