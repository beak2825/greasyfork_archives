// ==UserScript==
// @name         falcon focus
// @description  Completely disables focus without blocking clicks or other events
// @match        https://chat.falconllm.tii.ae/*
// @run-at       document-start
// @version 0.0.1.20250531065554
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/537781/falcon%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/537781/falcon%20focus.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 1. No-op focus function
  const noop = () => {};

  // 2. Override focus methods on all elements
  [Element.prototype, HTMLElement.prototype, HTMLInputElement.prototype, HTMLTextAreaElement.prototype].forEach(proto => {
    Object.defineProperty(proto, 'focus', {
      value: noop,
      writable: false,
      configurable: false
    });
  });

  // 3. Always report no active element
  Object.defineProperty(document, 'activeElement', {
    get: () => null,
    configurable: false
  });

  // 4. As a fallback, blur anything that somehow gains focus
  /*window.addEventListener('focus', e => {
    if (e.target && typeof e.target.blur === 'function') {
      e.target.blur();
    }
  }, true);*/

  // 5. Strip any HTML autofocus attributes as they're added
  new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          if (node.hasAttribute('autofocus')) {
            node.removeAttribute('autofocus');
          }
          node.querySelectorAll && node.querySelectorAll('[autofocus]')
             .forEach(el => el.removeAttribute('autofocus'));
        }
      }
    }
  }).observe(document, { childList: true, subtree: true });
})();