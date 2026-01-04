// ==UserScript==
// @name         Bloxflip Spam Blocker
// @version      1.0
// @description  Block repeated messages in the bloxflip chat
// @author       noahcoolboy
// @match        https://bloxflip.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxflip.com
// @run-at       document-start
// @grant        unsafeWindow
// @license      MIT
// @namespace https://greasyfork.org/users/725966
// @downloadURL https://update.greasyfork.org/scripts/447509/Bloxflip%20Spam%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/447509/Bloxflip%20Spam%20Blocker.meta.js
// ==/UserScript==

let prevMessage = {}
function isSpam(message) {
    if (prevMessage[message.bloxFlipUser.robloxUsername] == message.content) {
        return true
    } else if (["/", "BALANCE"].some(v => message.content.startsWith(v))) {
        return true
    } else if (["v", "me"].some(v => message.content.toLowerCase() == v)) {
        return true
    }
    prevMessage[message.bloxFlipUser.robloxUsername] = message.content
    return false
}

// Credits to https://stackoverflow.com/questions/70205816/intercept-websocket-messages
const OriginalWebsocket = unsafeWindow.WebSocket
const ProxiedWebSocket = function() {
  console.log("Intercepting web socket creation")

  const ws = new OriginalWebsocket(...arguments)

  const originalAddEventListener = ws.addEventListener
  const proxiedAddEventListener = function() {
    if (arguments[0] === "message") {
      const cb = arguments[1]
      arguments[1] = function() {
        if(arguments[0].data.startsWith('42/chat,["new-chat-message",')) {
            const message = JSON.parse(arguments[0].data.slice(28, -1))
            if(isSpam(message)) {
                return console.log("Blocked spam: " + message.content)
            }
        }
        return cb.apply(this, arguments)
      }
    }
    return originalAddEventListener.apply(this, arguments)
  }
  ws.addEventListener = proxiedAddEventListener

  Object.defineProperty(ws, "onmessage", {
    set(func) {
      return proxiedAddEventListener.apply(this, [
        "message",
        func,
        false
      ]);
    }
  });
  return ws;
};

unsafeWindow.WebSocket = ProxiedWebSocket;