// ==UserScript==
// @name         Glar.io Websocket Decoder
// @name:ru      Декодировщик WebSocket-сообщений в Glar.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  You can decode messages from WebSocket Server by the Hooks.Protocol.decode or window.SocketProtocol.decode
// @description:ru   Вы можете декодировать сообщения от WebSocket-сервера обращаясь к Hooks.Protocol.decode или window.SocketProtocol.decode
// @author       Dekudo#1414
// @match        *://glar.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463429/Glario%20Websocket%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/463429/Glario%20Websocket%20Decoder.meta.js
// ==/UserScript==

(() => {
  class Utils {
    static createHook(target, property, callback) {
      const symbol = Symbol(property);

      Object.defineProperty(target, property, {
        get() {
          return this[symbol];
        },

        set(value) {
          this[symbol] = value;

          callback(this, symbol);
        }
      })
    }
  }

  Utils.createHook(Object.prototype, "Protocol", (_this, _symbol) => {
    Reflect.set(window, "SocketProtocol", _this[_symbol]);
  })

  window.WebSocket = new Proxy(WebSocket, {
    construct(Target, args) {
      const socket = new Target(...args);

      socket.addEventListener("message", message => {
        const data = new Uint8Array(message.data);

        console.log(window.SocketProtocol.decode(data));
      })

      return socket;
    }
  })
})();
