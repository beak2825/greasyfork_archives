// ==UserScript==
// @name         NoMouseWheelZoom
// @namespace    NoNameSpace
// @version      1.1
// @description  No Mouse Wheel Zoom -> https://chrome.google.com/webstore/detail/disable-scroll-wheel-zoom/mdpfkohgfpidohkakdbpmnngaocglmhl
// @author       You
// @include      *
// @match        *
// @downloadURL https://update.greasyfork.org/scripts/28539/NoMouseWheelZoom.user.js
// @updateURL https://update.greasyfork.org/scripts/28539/NoMouseWheelZoom.meta.js
// ==/UserScript==

document.addEventListener('wheel', function (e) {
  if (!e.ctrlKey)
    return;
  e.preventDefault();
  window.scrollBy(e.deltaX, e.deltaY);
}, {passive: false});
