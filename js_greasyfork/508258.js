// ==UserScript==
// @name Delink on Touch
// @version 0.1.2
// @description Stop showing context menu when long-pressing a link, enable text selection.
// @homepageURL https://github.com/eight04/delink-on-touch
// @supportURL https://github.com/eight04/delink-on-touch/issues
// @license MIT
// @author eight04 <eight04@gmail.com>
// @namespace https://github.com/eight04
// @match *://*/*
// @grant GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/508258/Delink%20on%20Touch.user.js
// @updateURL https://update.greasyfork.org/scripts/508258/Delink%20on%20Touch.meta.js
// ==/UserScript==

/* global GM_registerMenuCommand */

let id;

register();

function register() {
  id = GM_registerMenuCommand("Enable", init, {id});
}

function init() {
  const links = new Map();
  GM_registerMenuCommand("Disable", uninit, {id});

  document.addEventListener("touchstart", onTouchStart);
  document.addEventListener("touchend", onTouchEnd);

  let timeoutId;

  function onTouchStart(e) {
    clearTimeout(timeoutId);
    // add a delay so users can still tap the link without triggering this
    timeoutId = setTimeout(() => {
      const a = e.target.closest("a");
      if (a && a.getAttribute("href") && e.target.textContent) {
        links.set(a, a.href);
        a.href = "";
      }
    }, 150);
  }

  function onTouchEnd() {
    clearTimeout(timeoutId)
    for (const [a, href] of links) {
      a.href = href;
    }
    links.clear();
  }

  function uninit() {
    register();
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchend", onTouchEnd)
  }
}
