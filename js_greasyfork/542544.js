// ==UserScript==
// @name         Unich Bearer Token Extractor (Bypass Safe)
// @namespace    https://unich.com/
// @version      3.0
// @description  Capture Bearer Token via XHR safely without triggering unsafe header errors (By forestarmy) 🛡️
// @author       forestarmy
// @match        https://unich.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542544/Unich%20Bearer%20Token%20Extractor%20%28Bypass%20Safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542544/Unich%20Bearer%20Token%20Extractor%20%28Bypass%20Safe%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let tokenCaptured = false;

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;
  const originalSetHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.open = function (...args) {
    this._url = args[1];
    return originalOpen.apply(this, args);
  };

  XMLHttpRequest.prototype.setRequestHeader = function (key, value) {
    if (!tokenCaptured && key.toLowerCase() === 'authorization' && value.startsWith('Bearer ')) {
      const token = value.replace('Bearer ', '');
      tokenCaptured = true;
      showCopyButton(token);
      console.log('%c✅ Bearer Token Captured:', 'color: green; font-weight: bold;');
      console.log('Bearer ' + token);
    }
    return originalSetHeader.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (...args) {
    return originalSend.apply(this, args);
  };

  function showCopyButton(token) {
    const btn = document.createElement('button');
    btn.innerText = '📋 Copy Token';
    Object.assign(btn.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      padding: '10px 16px',
      backgroundColor: '#28a745',
      color: '#fff',
      fontSize: '14px',
      border: 'none',
      borderRadius: '6px',
      zIndex: 99999,
      cursor: 'pointer'
    });

    btn.onclick = () => {
      navigator.clipboard.writeText(token).then(() => {
        btn.innerText = '✅ Copied!';
        setTimeout(() => {
          btn.innerText = '📋 Copy Token';
        }, 1500);
      });
    };

    document.body.appendChild(btn);
  }

  console.log('%c🔍 Waiting for Bearer token via XHR...', 'color: blue; font-weight: bold;');
})();