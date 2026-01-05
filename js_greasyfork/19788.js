// ==UserScript==
// @name          Backspace goes back
// @include       *
// @description   Backspace key = "go back" as it was before Chrome 52. And Shift+Backspace goes forward.
// @version       2.0.0
// @author        wOxxOm
// @namespace     wOxxOm.scripts
// @license       MIT License
// @run-at        document-start
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/19788/Backspace%20goes%20back.user.js
// @updateURL https://update.greasyfork.org/scripts/19788/Backspace%20goes%20back.meta.js
// ==/UserScript==

addEventListener('keyup', e => {
  if (e.which !== 8 || e.altKey || e.metaKey || e.ctrlKey) {
    return;
  }
  let el = document;
  while (el && (el = el.activeElement)) {
    if (el.isContentEditable ||
        el.localName == 'input' &&
          /^(text|color|date*|email|month|number|password|range|search|tel|time|url|week)$/.test(el.type) ||
        el.localName == 'textarea') {
      return;
    }
    el = el.shadowRoot;
  }
  e.preventDefault();
  el = e.shiftKey ? 'forward' : 'back';
  if (window === top) history[el]();
  else top.postMessage(GM_info.script.name + el, '*');
}, true);

if (window === top) {
  addEventListener('message', e => {
    if (`${e.data}`.startsWith(GM_info.script.name)) {
      e.stopPropagation();
      e.stopImmediatePropagation();
      history[e.data.slice(GM_info.script.name.length)]();
    }
  }, true);
}
