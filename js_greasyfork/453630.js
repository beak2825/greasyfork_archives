// ==UserScript==
// @name         Pixel-Precision Wheel Scroll
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.3
// @license      AGPL v3
// @author       jcunews
// @description  Add pixel-precision wheel scrolling capability using CTRL+SHIFT+Wheel for vertical scroll, and CTRL+ALT+Wheel for horizontal scroll, for any scrollable element which can be scrolled at pixel level.
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/453630/Pixel-Precision%20Wheel%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/453630/Pixel-Precision%20Wheel%20Scroll.meta.js
// ==/UserScript==

addEventListener("wheel", (ev, ele) => {
  if (ev.ctrlKey) {
    ele = ev.target;
    while (ele && (ele.offsetWidth === ele.scrollWidth) && (ele.offsetHeight === ele.scrollHeight)) ele = ele.parentNode;
    ele = ele || window;
    if (ev.shiftKey && !ev.altKey) {
      ele.scrollBy(0, ev.deltaY > 0 ? 1 : -1);
      ev.stopPropagation();
      ev.preventDefault()
    } else if (ev.altKey && !ev.shiftKey) {
      ele.scrollBy(ev.deltaY > 0 ? 1 : -1, 0);;
      ev.stopPropagation();
      ev.preventDefault()
    }
  }
}, {capture: true, passive: false})
