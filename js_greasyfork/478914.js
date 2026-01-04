// ==UserScript==
// @name        Copy URL Link
// @namespace   https://github.com/nickburrows/userscript-copy-link
// @description 一個用來複製連結網址的userscript
// @match       *://*/*
// @inject-into content
// @version     0.0.44
// @author      Nick Lin
// @icon        https://raw.githubusercontent.com/nickburrows/userscript-copy-link/e8f248af59bea72aeb08ded7743765ac1d6801ef/static/icon_32.png
// @grant       GM.setClipboard
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/478914/Copy%20URL%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/478914/Copy%20URL%20Link.meta.js
// ==/UserScript==

(function () {
'use strict';

window.addEventListener('load', () => {
  const evOpts = {
    capture: true,
    passive: true
  };
  let hoveredLink = null;
  const linkElements = document.getElementsByTagName('a');
  for (const link of linkElements) {
    link.addEventListener('mouseenter', () => {
      hoveredLink = link;
    }, evOpts);
    link.addEventListener('mouseleave', () => {
      hoveredLink = null;
    }, evOpts);
  }
  function eventKeyDown(ev) {
    if (hoveredLink && (ev.metaKey || ev.ctrlKey) && ev.key === 'c') {
      const linkUrl = hoveredLink.href;
      if (linkUrl !== null) {
        GM_setClipboard(linkUrl);
      }
    }
  }
  window.addEventListener('keydown', eventKeyDown, evOpts);
});

})();
