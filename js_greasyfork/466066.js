// ==UserScript==
// @name        Toggle CSS Style
// @namespace   i2p.schimon.toggle-style
// @description Toggle CSS Stylesheets. Hotkey: Command + Shift + F3
// @homepageURL https://greasyfork.org/en/scripts/466066-toggle-css-style
// @supportURL  https://greasyfork.org/en/scripts/466066-toggle-css-style/feedback
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn5SbPC90ZXh0Pjwvc3ZnPgo=
// @match       *://*/*
// @version     23.06
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/466066/Toggle%20CSS%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/466066/Toggle%20CSS%20Style.meta.js
// ==/UserScript==

var docHead, styleSheets = [];
document.addEventListener('keyup', hotkey, false);

function hotkey(e) {
  // set hotkey Command + Shift + F3
  if (e.metaKey && e.shiftKey && e.which == 114) {
    toggleStylesheets();
    //toggleHead();
  }
}

function toggleStylesheets() {
  if (document.head.querySelector('link[rel="stylesheet"]') ||
      document.head.querySelector('style')) {
    for (const style of document.head.querySelectorAll('link[rel="stylesheet"]')) {
      styleSheets.push(style);
      style.remove();
    }
    for (const style of document.head.querySelectorAll('style')) {
      styleSheets.push(style);
      style.remove();
    }
  } else {
    for (const style of styleSheets) {
      document.head.append(style);
    }
  }
}

function toggleHead() {
  if (document.head) {
    docHead = document.head;
    document.head.remove();
  } else {
    document.documentElement.prepend(docHead);
  }
}
