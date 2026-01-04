// ==UserScript==
// @name         no 29 april
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  pro script
// @author       alyona fan
// @match        *://agma.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @grant        unsafeWindow
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530661/no%2029%20april.user.js
// @updateURL https://update.greasyfork.org/scripts/530661/no%2029%20april.meta.js
// ==/UserScript==

let idkbro = "i love big dicks";

function start() {
  const originalPush = Array.prototype.push;
  Array.prototype.push = function (...args) {
    if (this?.length > 0 && args?.[0]?.message !== undefined) {
      const messages = this.filter(c => c.message);
      messages.forEach(msg => {
        if (msg.message.includes("29 april")) {
          msg.cache.ie = ": " + idkbro;
          msg.message = idkbro;
        }
      })
    }

    return originalPush.apply(this,args);
  }
}

document.readyState === "complete" ? setTimeout(start, 1) : document.addEventListener("DOMContentLoaded", start);