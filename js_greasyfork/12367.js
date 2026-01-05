// ==UserScript==
// @name         Open links in new tab
// @description  Open links in new tab. Ctrl-click or Middle-click loads it in background
// @include      *
// @namespace    wOxxOm.scripts
// @author       wOxxOm
// @version      2.0.5
// @license      MIT License
// @grant        GM_openInTab
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/12367/Open%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/12367/Open%20links%20in%20new%20tab.meta.js
// ==/UserScript==

var suppressing, clickedElement;

window.addEventListener('mousedown', function (e) {
  clickedElement = e.target;
}, true);

window.addEventListener('mouseup', function (e) {
  if (e.button > 1 || e.altKey || e.target != clickedElement)
    return;
  var link = e.target.closest('a');
  if (!link ||
      (link.getAttribute('href') || '').match(/^(javascript|#|$)/) ||
      link.href.replace(/#.*/, '') == location.href.replace(/#.*/, '')
  )
    return;

  GM_openInTab(link.href, {
    active: !e.button && !e.ctrlKey,
    setParent: true,
    insert: true,
  });
  suppressing = true;
  setTimeout(function () {
    window.dispatchEvent(new MouseEvent('mouseup', {bubbles: true}));
  });
  prevent(e);
}, true);

window.addEventListener('click', prevent, true);
window.addEventListener('auxclick', prevent, true);

function prevent(e) {
  if (!suppressing)
    return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  setTimeout(function () {
    suppressing = false;
  }, 100);
}
