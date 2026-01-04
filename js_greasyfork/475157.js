// ==UserScript==
// @name         Sexy PoW
// @namespace    shadamity
// @version      1.1
// @description  Supa fast PoW
// @author       don_shadaman
// @match        https://diep.io/*
// @match        https://diep-io--two.rivet.game/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/475157/Sexy%20PoW.user.js
// @updateURL https://update.greasyfork.org/scripts/475157/Sexy%20PoW.meta.js
// ==/UserScript==

var win = typeof unsafeWindow == "undefined" ? window : unsafeWindow;

let first = true;

win.WebSocket = class extends WebSocket {
  constructor(ip) {
    super(ip);
    first = true;
  }
}

function sleep(ms) {
  return new Promise(function(resolve) {
    setTimeout(resolve, ms);
  });
}

const p = win.Worker.prototype;

p.postMessage = new Proxy(p.postMessage, {
  apply: function(to, what, args) {
    const [id, action, string, difficulty, debug] = args[0];
    if(action == "solve" && !debug) {
      const date = new Date().getTime();
      GM_xmlhttpRequest({
        method: "POST",
        url: "http://localhost:16384/",
        data: JSON.stringify({ string, difficulty }),
        headers: {
          "Content-Type": "application/json"
        },
        onload: async function(res) {
          if(!first) {
            const wait = 9000 - (new Date().getTime() - date);
            await sleep(wait);
          } else {
            first = false;
          }
          what.onmessage({ data: [id, res.responseText] });
        }
      });
    }
  }
});
