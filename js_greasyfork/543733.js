// ==UserScript==
// @name         secure-eval-blocker 加强
// @namespace    https://github.com/secure-scripting
// @version      1.2.0
// @description  Self-contained script to block eval, dynamic code execution, and protect privacy without external dependencies.
// @author       anonymous
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543733/secure-eval-blocker%20%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543733/secure-eval-blocker%20%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Configuration: Whitelist for trusted domains
  const _0x1a = {
    whitelist: ['trusted.com', 'example.com'] // User-configurable trusted domains
  };

  // Module 1: Core variables and utilities
  const _0x2b = window, _0x3c = Object, _0x4d = document, _0x5e = 'eval', _0x6f = 'Function';
  const _0x7g = function(_0x8h) {
    const msg = 'Blocked: ' + _0x8h;
    console.warn(msg); // Log to console only
    throw new Error(msg);
  };

  // Module 2: Browser compatibility check
  if (!_0x3c.defineProperty) {
    console.warn('Browser lacks Object.defineProperty support. Using CSP fallback.');
    const _0x9i = _0x4d.createElement('meta');
    _0x9i.setAttribute('http-equiv', 'Content-Security-Policy');
    _0x9i.setAttribute('content', 'script-src \'self\'; object-src \'none\';');
    _0x4d.head.appendChild(_0x9i);
    return;
  }

  // Module 3: Block eval and Function
  if (!_0x1a.whitelist.includes(_0x4d.location.hostname)) {
    const _0x10j = function() { _0x7g('Dynamic code execution (eval/Function)'); };
    _0x3c.defineProperty(_0x2b, _0x5e, { value: _0x10j, writable: false, configurable: false });
    _0x3c.defineProperty(_0x2b, _0x6f, { value: _0x10j, writable: false, configurable: false });
  }

  // Module 4: Block WebAssembly and Worker
  if (!_0x1a.whitelist.includes(_0x4d.location.hostname)) {
    _0x3c.defineProperty(_0x2b, 'WebAssembly', {
      value: { compile: function() { _0x7g('WebAssembly.compile'); } },
      writable: false,
      configurable: false
    });
    _0x3c.defineProperty(_0x2b, 'Worker', {
      value: function() { _0x7g('Web Worker'); },
      writable: false,
      configurable: false
    });
  }

  // Module 5: Intercept setTimeout/setInterval
  ['setTimeout', 'setInterval'].forEach(function(_0x11k) {
    const _0x12l = _0x2b[_0x11k];
    _0x2b[_0x11k] = function(_0x13m, _0x14n) {
      if (typeof _0x13m === 'string' && !_0x1a.whitelist.includes(_0x4d.location.hostname)) {
        _0x7g(_0x11k + ' string-based code');
      }
      return _0x12l(_0x13m, _0x14n);
    };
  });

  // Module 6: Set CSP
  const _0x15o = _0x4d.createElement('meta');
  _0x15o.setAttribute('http-equiv', 'Content-Security-Policy');
  _0x15o.setAttribute('content', 'script-src \'self\'; object-src \'none\';');
  _0x4d.head.appendChild(_0x15o);

  // Module 7: Protect sensitive objects
  ['localStorage', 'sessionStorage', 'cookie'].forEach(function(_0x16p) {
    if (!_0x1a.whitelist.includes(_0x4d.location.hostname)) {
      try {
        _0x3c.defineProperty(_0x2b, _0x16p, {
          get: function() { _0x7g('Access to ' + _0x16p); },
          set: function() { _0x7g('Modification of ' + _0x16p); },
          configurable: false
        });
      } catch (_0x17q) {}
    }
  });

  // Module 8: Block dynamic script injection
  const _0x18r = _0x4d.createElement;
  _0x4d.createElement = function(_0x19s, ..._0x20t) {
    const _0x21u = _0x18r.call(_0x4d, _0x19s, ..._0x20t);
    if (_0x19s.toLowerCase() === 'script' && !_0x1a.whitelist.includes(_0x4d.location.hostname)) {
      _0x3c.defineProperty(_0x21u, 'innerHTML', {
        set: function() { _0x7g('Dynamic script injection'); }
      });
    }
    return _0x21u;
  };

  // Module 9: Prevent CSP override
  const _0x22v = new MutationObserver(function(_0x23w) {
    _0x23w.forEach(function(_0x24x) {
      if (_0x24x.addedNodes.length && _0x24x.addedNodes[0].tagName === 'META' &&
          _0x24x.addedNodes[0].getAttribute('http-equiv') === 'Content-Security-Policy') {
        _0x24x.addedNodes[0].remove();
        _0x7g('Attempted CSP override');
      }
    });
  });
  _0x22v.observe(_0x4d.head, { childList: true });

  // Module 10: Self-destruct mechanism
  const _0x25y = function() {
    _0x3c.defineProperty(_0x2b, 'secureEvalBlocker', { value: true, writable: false });
  };
  if (!_0x2b.secureEvalBlocker) _0x25y();
})();