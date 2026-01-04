// ==UserScript==
// @name         GB Server Connection Display
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Display the GoBattle server when connected with WS | Join us! - https://discord.gg/3xDbJ8QD8f
// @author       GoBattle Hacks Official
// @match        *://gobattle.io/*
// @match        *://*.gobattle.io/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546857/GB%20Server%20Connection%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/546857/GB%20Server%20Connection%20Display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const OriginalWS = window.WebSocket;

  const SERVER_NAMES = {
    'wss://france2.gobattle.io:10116/': 'France',
    'wss://us-west.gobattle.io:10116/': 'USA West',
    'wss://singapore2.gobattle.io:10116/': 'Singapore',
  };

  function getServerName(url) {
    if (url.endsWith('/')) url = url.slice(0, -1);
    return SERVER_NAMES[url + '/'] || url;
  }

  function showServerNotice(name) {
    const notice = document.createElement('div');
    notice.textContent = `Connected to: ${name}`;
    Object.assign(notice.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0,0,0,0.7)',
      color: 'yellow',
      padding: '10px 15px',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      zIndex: 999999,
      opacity: '1',
      transition: 'opacity 1s ease-out',
    });
    document.body.appendChild(notice);

    setTimeout(() => {
      notice.style.opacity = '0';
      setTimeout(() => notice.remove(), 1000);
    }, 5000);
  }

  const WSProxy = new Proxy(OriginalWS, {
    construct(target, args, newTarget) {
      const ws = Reflect.construct(target, args, newTarget);

      ws.addEventListener("open", () => {
        const serverName = getServerName(ws.url);
        showServerNotice(serverName);
      });

      return ws;
    },
    apply(target, thisArg, args) {
      return new target(...args);
    }
  });

  window.WebSocket = WSProxy;
})();
