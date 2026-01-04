// ==UserScript==
// @name         Block Touchscreen Fingerprinting
// @namespace    https://example.com/
// @version      1.3
// @description  Force navigator.maxTouchPoints=0 on Firefox/LibreWolf.
// @match        *://*/*
// @run-at       document-start
// @all-frames   true
// @grant        none
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/547333/Block%20Touchscreen%20Fingerprinting.user.js
// @updateURL https://update.greasyfork.org/scripts/547333/Block%20Touchscreen%20Fingerprinting.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const inject = (fn) => {
    try {
      const s = document.createElement('script');
      s.textContent = `(${fn})();`;
      (document.documentElement || document.head || document.body).appendChild(s);
      s.remove();
    } catch {
      fn();
    }
  };
  const main = () => {
    try {
      const proto = (typeof Navigator === 'function' && Navigator.prototype) || Object.getPrototypeOf(navigator);
      if (!proto) return;

      const redefine = (target, prop, value) => {
        const d = Object.getOwnPropertyDescriptor(target, prop);
        if (!d) return false;
        if (typeof d.get === 'function') {
          const nativeSrc = Function.prototype.toString.call(d.get);
          const nativeName = d.get.name;
          const getter = function() { return value; };
          try { Object.defineProperty(getter, 'toString', { value: () => nativeSrc }); } catch {}
          try { if (nativeName) Object.defineProperty(getter, 'name', { value: nativeName }); } catch {}
          Object.defineProperty(target, prop, {
            get: getter,
            set: d.set,
            enumerable: d.enumerable,
            configurable: d.configurable
          });
          return true;
        } else if ('value' in d) {
          try {
            Object.defineProperty(target, prop, {
              value,
              writable: d.writable,
              enumerable: d.enumerable,
              configurable: d.configurable
            });
            return true;
          } catch { return false; }
        }
        return false;
      };

      let cur = 0;
      try { cur = navigator.maxTouchPoints; } catch {}
      if (cur !== 0) {
        if (!redefine(proto, 'maxTouchPoints', 0) &&
            !redefine(navigator, 'maxTouchPoints', 0)) {
          try { Object.defineProperty(navigator, 'maxTouchPoints', { value: 0, configurable: true }); } catch {}
        }
      }

      if (('msMaxTouchPoints' in proto) || ('msMaxTouchPoints' in navigator)) {
        if (!redefine(proto, 'msMaxTouchPoints', 0)) {
          redefine(navigator, 'msMaxTouchPoints', 0);
        }
      }
    } catch {}
  };
  inject(main);
})();