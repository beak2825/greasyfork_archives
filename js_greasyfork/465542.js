// ==UserScript==
// @name         Points Patch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Patches ws connection to hook set-word-points rpc
// @author       EnergoStalin
// @match        https://meme-police.ru/bg/alias
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meme-police.ru
// @license      GPL3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465542/Points%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/465542/Points%20Patch.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let change = 0;
  let enable = true;
  let enableOnEnd = true;
  let state = null;
  window.addEventListener('keydown', function(e) {
      if(e.keyCode === 37) { // ARROWLEFT
          change = 0;
      } else if(e.keyCode === 39) { // ARROWRIGHT
          change = 1;
      } else if(e.keyCode === 220) { // BACKSLASH
          enable = !enable;
      } else if(e.key === "|") {
          enableOnEnd = !enableOnEnd;
      }
  });
  const hookMethods = {
    'set-word-points': function(data) {
        if(!enable) return data;

        for(let i = 0; i < data.length; i++) {
            data[i].points = change;
        }

        return data;
    }
  }
  const listeners = {
    'timer-end': function(ws) {
        if(!enableOnEnd) return;

        const words = JSON.parse(JSON.stringify(state.currentWords))
        for(let i = 0; i < words.length; i++) {
            words[i].points = 0;
        }

        sendRpc(ws, 'set-word-points', words);
    },
    'state': function(_, data) {
        state = data;
    }
  }
  WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
    apply: function (target, scope, args) {
      if(!scope.hooked) { // Apply listeners
          scope.addEventListener('message', (msg) => {
              const data = JSON.parse(msg.data);
              listeners[data.a[0]]?.(scope, data.a[1]);
          })
          scope.hooked = true;
      }

      if (typeof (args[0]) === 'string') {
        let json = JSON.parse(args[0]);
        json.a[1] = hookMethods[json.a[0]]?.(json.a[1]) ?? json.a[1];

        return target.apply(scope, [JSON.stringify(json), ...args.splice(0, 1)])
      }

      return target.apply(scope, args);
    }
  });

  const sendRpc = function(ws, method, payload) {
      ws.send(JSON.stringify({ a: { 0: method, 1: payload }, c: '/bg/alias' }))
  }
})();