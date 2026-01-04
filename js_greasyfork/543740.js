// ==UserScript==
// @name         secure-eval-blocker-enhanced
// @namespace    https://github.com/secure-scripting
// @version      2.0.0
// @description  强化版：阻止 eval、Function、WASM、动态脚本注入，保护隐私，支持 HTTP/HTTPS 自动适配，防篡改，多层防御结构。
// @author       anonymous
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543740/secure-eval-blocker-enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/543740/secure-eval-blocker-enhanced.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const $win = window, $doc = document, $obj = Object;
  const WHITELIST = ['trusted.com', 'example.com']; // ⬅️ 可自定义可信域名
  const isTrusted = WHITELIST.includes($doc.location.hostname);

  const BLOCK = (reason) => {
    const msg = `⚠️ Blocked: ${reason}`;
    console.warn(msg);
    throw new Error(msg);
  };

  // 🔐 拦截动态执行
  const blockDynamicCode = () => {
    const stub = () => BLOCK('Dynamic code execution (eval or Function)');
    $obj.defineProperty($win, 'eval', { value: stub, writable: false, configurable: false });
    $obj.defineProperty($win, 'Function', { value: stub, writable: false, configurable: false });
  };

  // ⏲️ 拦截字符串形式的定时器
  ['setTimeout', 'setInterval'].forEach((fn) => {
    const original = $win[fn];
    $win[fn] = function(arg, delay) {
      if (typeof arg === 'string' && !isTrusted) BLOCK(`${fn} with string argument`);
      return original(arg, delay);
    };
  });

  // 🧱 拦截 WebAssembly 和 Worker
  const blockWasmWorker = () => {
    $obj.defineProperty($win, 'WebAssembly', {
      value: { compile() { BLOCK('WebAssembly.compile'); } },
      writable: false,
      configurable: false
    });
    $obj.defineProperty($win, 'Worker', {
      value: function() { BLOCK('Web Worker'); },
      writable: false,
      configurable: false
    });
  };

  // 🔐 拦截本地存储与 cookie
  ['localStorage', 'sessionStorage', 'cookie'].forEach((key) => {
    try {
      $obj.defineProperty($win, key, {
        get: () => BLOCK(`Access to ${key}`),
        set: () => BLOCK(`Modification of ${key}`),
        configurable: false
      });
    } catch (_) {}
  });

  // 🧬 清洗 innerHTML/outerHTML
  const sanitizer = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<svg[^>]*>.*?<\/svg>/gi, '')
      .replace(/\bon\w+\s*=/gi, '');
  };

  ['innerHTML', 'outerHTML'].forEach((prop) => {
    const original = $obj.getOwnPropertyDescriptor(Element.prototype, prop);
    $obj.defineProperty(Element.prototype, prop, {
      set: function(val) {
        if (!isTrusted) return original.set.call(this, sanitizer(val));
        return original.set.call(this, val);
      },
      get: original.get,
      configurable: false
    });
  });

  // 🧾 禁用 document.write
  const originalWrite = $doc.write;
  $doc.write = function(html) {
    if (!isTrusted) BLOCK('document.write usage');
    return originalWrite.call($doc, html);
  };

  // 📜 拦截 script 标签注入
  const originalCreateElement = $doc.createElement;
  $doc.createElement = function(tag, ...args) {
    const el = originalCreateElement.call(this, tag, ...args);
    if (tag.toLowerCase() === 'script' && !isTrusted) {
      $obj.defineProperty(el, 'innerHTML', {
        set: function() { BLOCK('Dynamic <script> injection'); }
      });
    }
    return el;
  };

  // 🧲 监控全页面 meta 标签 CSP 篡改
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((m) => {
      m.addedNodes.forEach((node) => {
        if (node.tagName === 'META' && node.getAttribute('http-equiv') === 'Content-Security-Policy') {
          node.remove();
          BLOCK('CSP override attempt');
        }
      });
    });
  });
  observer.observe($doc.documentElement, { childList: true, subtree: true });

  // 🎯 设置 Content-Security-Policy（支持 HTTP / HTTPS）
  const meta = $doc.createElement('meta');
  meta.setAttribute('http-equiv', 'Content-Security-Policy');
  meta.setAttribute('content', "default-src 'none'; script-src 'self'; object-src 'none'; img-src 'self'; connect-src 'self'; style-src 'self';");
  $doc.head.appendChild(meta);

  // 🧪 自毁机制
  if (!$win.secureEvalBlocker) {
    $obj.defineProperty($win, 'secureEvalBlocker', { value: true, writable: false });
    blockDynamicCode();
    blockWasmWorker();
  }
})();
