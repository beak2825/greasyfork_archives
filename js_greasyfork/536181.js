// ==UserScript==
// @name         Force Ctrl-click or Middle-click into a new tab
// @description  Force Ctrl-click or Middle-click into a new tab to load it in the background
// @namespace    3xploiton3.scripts
// @author       3xploiton3
// @version      1.1
// @license      MIT License
// @grant        GM_openInTab
// @run-at       document-start
// @match        *://www.tokopedia.com/*
// @downloadURL https://update.greasyfork.org/scripts/536181/Force%20Ctrl-click%20or%20Middle-click%20into%20a%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/536181/Force%20Ctrl-click%20or%20Middle-click%20into%20a%20new%20tab.meta.js
// ==/UserScript==

var suppressing = false, clickedElement;

window.addEventListener('mousedown', function (e) {
  clickedElement = e.target;
}, true);

window.addEventListener('mouseup', function (e) {
  if (e.target !== clickedElement) return;

  const link = e.target.closest('a');
  if (!link ||
      (link.getAttribute('href') || '').match(/^(javascript:|#|$)/) ||
      link.href.replace(/#.*/, '') === location.href.replace(/#.*/, '')
  ) {
    return;
  }

  // Middle click (button === 1) OR Ctrl + Left click
  if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
    GM_openInTab(link.href, {
      active: false,
      setParent: true,
      insert: true,
    });
    suppressing = true;
    setTimeout(() => {
      window.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    });
    prevent(e);
  }
  // Left click without Ctrl – do nothing, allow default behavior (normal navigation)
}, true);

window.addEventListener('click', prevent, true);
window.addEventListener('auxclick', prevent, true);

function prevent(e) {
  if (!suppressing) return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  setTimeout(() => {
    suppressing = false;
  }, 100);
}
