// ==UserScript==
// @name         secure-eval-blocker
// @namespace    https://github.com/secure-scripting
// @version      1.1.0
// @description  Enhanced script to block eval and dynamic code execution, protect privacy, and prevent malicious scripts.
// @author       anonymous
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543720/secure-eval-blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/543720/secure-eval-blocker.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  // 混淆变量名
  const _0x1a = window, _0x2b = Object, _0x3c = 'eval', _0x4d = 'Function', _0x5e = document;
  
  // 禁用 eval 和 Function 构造函数
  const _0x6f = function() { throw new Error('Dynamic code execution is blocked for security.'); };
  _0x2b.defineProperty(_0x1a, _0x3c, { value: _0x6f, writable: false, configurable: false });
  _0x2b.defineProperty(_0x1a, _0x4d, { value: _0x6f, writable: false, configurable: false });

  // 拦截 setTimeout/setInterval 的字符串参数
  const _0x7g = ['setTimeout', 'setInterval'];
  _0x7g.forEach(function(_0x8h) {
    const _0x9i = _0x1a[_0x8h];
    _0x1a[_0x8h] = function(_0xa, _0xb) {
      if (typeof _0xa === 'string') {
        throw new Error('String-based code execution is blocked.');
      }
      return _0x9i(_0xa, _0xb);
    };
  });

  // 设置 CSP 禁用 eval 和内联脚本
  const _0x10j = _0x5e.createElement('meta');
  _0x10j.setAttribute('http-equiv', 'Content-Security-Policy');
  _0x10j.setAttribute('content', 'script-src \'self\'; object-src \'none\';');
  _0x5e.head.appendChild(_0x10j);

  // 保护敏感对象，防止通过 eval 访问
  const _0x11k = ['localStorage', 'sessionStorage', 'cookie'];
  _0x11k.forEach(function(_0x12l) {
    try {
      _0x2b.defineProperty(_0x1a, _0x12l, {
        get: function() { throw new Error('Access to ' + _0x12l + ' is restricted.'); },
        set: function() { throw new Error('Modification of ' + _0x12l + ' is restricted.'); },
        configurable: false
      });
    } catch (_0x13m) {}
  });

  // 监控动态脚本注入
  const _0x14n = _0x5e.createElement;
  _0x5e.createElement = function(_0x15o, ..._0x16p) {
    const _0x17q = _0x14n.call(_0x5e, _0x15o, ..._0x16p);
    if (_0x15o.toLowerCase() === 'script') {
      Object.defineProperty(_0x17q, 'innerHTML', {
        set: function() { throw new Error('Dynamic script injection is blocked.'); }
      });
    }
    return _0x17q;
  };

  // 自毁机制，确保脚本只运行一次
  const _0x18r = function() {
    _0x2b.defineProperty(_0x1a, 'secureEvalBlocker', { value: true, writable: false });
  };
  if (!_0x1a.secureEvalBlocker) _0x18r();
})();