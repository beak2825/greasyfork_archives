// ==UserScript==
// @name         Enable Copy and Paste (科大奥瑞)
// @namespace    http://tampermonkey.net/
// @version      2024-04-27
// @description  Enable copy and paste on aryun.ustcori.com
// @author       ReekyStive
// @match        *://aryun.ustcori.com/ReportStudent/SLabSource/SReport
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ustcori.com
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493579/Enable%20Copy%20and%20Paste%20%28%E7%A7%91%E5%A4%A7%E5%A5%A5%E7%91%9E%29.user.js
// @updateURL https://update.greasyfork.org/scripts/493579/Enable%20Copy%20and%20Paste%20%28%E7%A7%91%E5%A4%A7%E5%A5%A5%E7%91%9E%29.meta.js
// ==/UserScript==

function hookInputTypeProperty() {
  if (typeof InputEvent === 'undefined') return;

  const originalGetter = Object.getOwnPropertyDescriptor(InputEvent.prototype, 'inputType').get;

  Object.defineProperty(InputEvent.prototype, 'inputType', {
    get: function () {
      const originalValue = originalGetter.call(this);
      const hookedValue = originalValue === 'insertFromPaste' ? 'insertText' : originalValue;
      console.log(
        '[userscript] getting InputEvent.inputType: %o, originalValue: %o, hookedValue: %o',
        this,
        originalValue,
        hookedValue
      );
      return hookedValue;
    },
    set: function (value) {
      console.warn('[userscript] attempt to set InputEvent.inputType, which is a read-only property.');
    },
    configurable: true,
    enumerable: true,
  });
}

function removeAttributeListeners(root, attributes) {
  console.log('[userscript] removing attributes from %o', root);
  function traverse(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      attributes.forEach((attribute) => {
        node.removeAttribute(attribute);
      });
      Array.from(node.childNodes).forEach(traverse);
    }
  }
  traverse(root);
}

(function () {
  'use strict';
  hookInputTypeProperty();
  removeAttributeListeners(document.body, ['oncontextmenu', 'oncopy', 'oncut', 'onpaste']);
})();
