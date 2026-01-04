// ==UserScript==
// @name         Remove spaces from links in the clipboard
// @version      0.1.0
// @description  Remove spaces
// @author       dragonish
// @namespace    https://github.com/dragonish
// @license      GNU General Public License v3.0 or later
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532161/Remove%20spaces%20from%20links%20in%20the%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/532161/Remove%20spaces%20from%20links%20in%20the%20clipboard.meta.js
// ==/UserScript==

(function () {
  document.addEventListener('paste', evt => {
    const clipboardData = evt.clipboardData;
    if (clipboardData) {
      const target = document.activeElement;
      if (target && (target.tagName === 'INPUT' || target?.tagName === 'TEXTAREA')) {
        let text = clipboardData.getData('text/plain');
        if (text.startsWith('http:') || text.startsWith('https:') || text.startsWith('magnet:') || text.startsWith('ed2k:') || text.startsWith('torrent:') || text.startsWith('thunder:') || text.startsWith('thunderx:')) {
          evt.preventDefault();
          text = text.replace(/\s+/g, '');
          target.value = text;
        }
      }
    }
  }, true);
})();
