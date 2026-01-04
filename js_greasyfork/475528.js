// ==UserScript==
// @name         MooMoo.io AutoGG
// @namespace    https://greasyfork.org/users/1064285-vcrazy-gaming
// @version      0.2
// @description  Auto "gg" on kill in MooMoo.io
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @author       _VcrazY_
// @grant        none
// @icon         data:image/webp;base64,UklGRi4CAABXRUJQVlA4WAoAAAAQAAAAHwAAHwAAQUxQSEcBAAANkCvbtmlb4xjXtm9k27azWze0bUWIbNvP72Wv3h/Ytm1jH58z9x9ExARAd32XdF/Tv9+vnL79DaTFpXoyQKDnE8tbWtKFy4XdDDSL3Bvs6u9qY+0V4m5uAO3Tmzd3NYibE/7IoLtj5bS6vAHQ3uiAqqDVB6Syw/NQFffLQPpr/CbUlkhA+r1GALUelaDV03+mhn8A6qGJlyqVMjLJYCMAaSzoY17dAWxNWbByOC+D9w8WOCFnGVjJ2LB+zcAEbFq+lYHDCv8fwHDZ+CMEPhpxWXgrAJ6Y6dHJHvKAa5aWdP/OAXj7zJ/u+RsAv04VcskOQfXAPoLq9YIa5BwW0vxvhPqPFSt6JMPQfOJsp55u/9aeayGbPD+jp1PfN2jLHGs4Gqzdq1To+jHVrcjHXMIFZL8/3T6zDcK9Y6/trYyFzLvPDyUcaAsAVlA4IMAAAADwBQCdASogACAAPt1kq0+opaQiKAqpEBuJbAC2+tqOAv/yo3pecQ1SQ38K5j1X4+D/7cw7/qVYgAD+8qOSIfqkS9a1lb6tEUU3vveBinOVdjPzUwth1t1Chw7D4CrZ5Naml0zrhLXC7P6Pzg2S9IRetxpXmem9ECxakv1JjYillR67TTKNMrgrs0z8UscOT49KzAEg5Vfk0ydfc/guvgT1t0NC16MURvoeRfej7JgO/Zj1yQsXi7520/2kDgfHgAA=
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475528/MooMooio%20AutoGG.user.js
// @updateURL https://update.greasyfork.org/scripts/475528/MooMooio%20AutoGG.meta.js
// ==/UserScript==

// Constants
const msgpack5 = window.msgpack;

// Variables
let ws,
  prevCount = 0;

// Functions

/**
 * Attach an event listener to the WebSocket object
 * @param {WebSocket} e - The WebSocket object
 */
const attachWebSocketListener = e => {
  e.addEventListener("message", hookWS);
};

/**
 * WebSocket message hook function
 * @param {MessageEvent} e - The WebSocket message event
 */
const hookWS = e => {
  // You can add actions related to WebSocket messages here
};

/**
 * Send a packet on the WebSocket
 * @param {Array} e - The packet to send
 */
const sendPacket = e => {
  if (ws) {
    ws.send(msgpack5.encode(e));
  }
};

/**
 * Send a chat message
 * @param {string} e - The message to send
 */
const chat = e => {
  sendPacket(["6", [e]]);
};

// Override WebSocket's send method
WebSocket.prototype.oldSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (e) {
  if (!ws) {
    [document.ws, ws] = [this, this];
    attachWebSocketListener(this);
  }
  this.oldSend(e);
};

// Mutation Observer
/**
 * Handle observed mutations
 * @param {MutationRecord[]} mutationsList - List of observed mutations
 */
const handleMutations = mutationsList => {
  for (const mutation of mutationsList) {
    if (mutation.target.id === "killCounter") {
      const count = parseInt(mutation.target.innerText, 10) || 0;
      if (count > prevCount) {
        chat("gg - autoGG");
        prevCount = count;
      }
    }
  }
};
const observer = new MutationObserver(handleMutations);
observer.observe(document, {
  subtree: true,
  childList: true
});