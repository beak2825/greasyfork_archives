// ==UserScript==
// @name              VIPCore.js
// @namespace         https://i.imgur.com/tdC3R86.png
// @version           1.0.1
// @description       Core Library for VIP BOT
// @author            CryptHowl
// @license           MIT
// @run-at            document-start
// ==/UserScript==

class VIPCore {
  constructor() {
    console.log("VIPCore Başlatıldı!");
  }

  log(message) {
    console.log(`[VIPCore]: ${message}`);
  }

  error(message) {
    console.error(`[VIPCore ERROR]: ${message}`);
  }
}

window.VIPCore = VIPCore;