// ==UserScript==
// @name         Advanced Automill - Sploop.io
// @namespace    http://tampermonkey.net/
// @version      2024-04-27
// @description  Automatically place windmills when you press the M key
// @author       fizzixww
// @match        https://sploop.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sploop.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494107/Advanced%20Automill%20-%20Sploopio.user.js
// @updateURL https://update.greasyfork.org/scripts/494107/Advanced%20Automill%20-%20Sploopio.meta.js
// ==/UserScript==
const fizzixwwSet = new Set();
WebSocket.prototype.fizzixwwOriginalSend = WebSocket.prototype.send;
WebSocket.prototype.send = function(data) {
  this.fizzixwwOriginalSend(data);
  fizzixwwSet.add(this);
};
window.addEventListener('beforeunload', () => {
  fizzixwwSet.clear();
});
(function() {
  'use strict';
  const fizzixwwFirst = 123;
  const fizzixwwSecond = 247;
  var fizzixwwKeysPressed = new Set();
  document.addEventListener("keydown", (event) => {
    if (event.key === "w" || event.key === "a" || event.key === "s" || event.key === "d") {
      fizzixwwKeysPressed.add(event.key);
    }
  });
  document.addEventListener("keyup", (event) => {
    if (event.key === "w" || event.key === "a" || event.key === "s" || event.key === "d") {
      fizzixwwKeysPressed.delete(event.key);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "m") {
      let fizzixwwAng;
      switch (Array.from(fizzixwwKeysPressed).sort().join("")) {
        case "w":
          fizzixwwAng = 270;
          break;
        case "a":
          fizzixwwAng = 180;
          break;
        case "s":
          fizzixwwAng = 90;
          break;
        case "d":
          fizzixwwAng = 0;
          break;
        case "aw":
          fizzixwwAng = 225;
          break;
        case "as":
          fizzixwwAng = 135;
          break;
        case "ds":
          fizzixwwAng = 45;
          break;
        case "dw":
          fizzixwwAng = 315;
          break;
        default:
          return;
      }
      var fizzixwwInterval = setInterval(() => {
        for (let fizzixwwSocket of fizzixwwSet) {
          fizzixwwSocket.send(new Uint8Array([2, 14]));
          let balls = 65535 * (((fizzixwwAng + fizzixwwFirst) % 360) * Math.PI/180 + Math.PI) / (2 * Math.PI);
          fizzixwwSocket.send(new Uint8Array([19, 255 & balls, balls >> 8 & 255]));
          setTimeout(() => {
            fizzixwwSocket.send(new Uint8Array([2, 14]));
            let sex = 65535 * (((fizzixwwAng + fizzixwwSecond) % 360) * Math.PI/180 + Math.PI) / (2 * Math.PI);
            fizzixwwSocket.send(new Uint8Array([19, 255 & sex, sex >> 8 & 255]));
          }, 110);
        }
      }, 380);
      setTimeout(() => {
        clearInterval(fizzixwwInterval);
      }, 1800);
      for (let fizzixwwSocket of fizzixwwSet) {
        fizzixwwSocket.send(new Uint8Array([18]));
      }
    }
  });
})();
