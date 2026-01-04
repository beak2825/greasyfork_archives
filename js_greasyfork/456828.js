// ==UserScript==
// @name         Access Private Server ShellShockers
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Infinite Ammo and Low Gravity
// @author       gallpopro
// @match        *://shellshock.io/*
// @grant        none
// @license      CDDL-1.0
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/456828/Access%20Private%20Server%20ShellShockers.user.js
// @updateURL https://update.greasyfork.org/scripts/456828/Access%20Private%20Server%20ShellShockers.meta.js
// ==/UserScript==

(function() {
  const addScript = () => {
    document.title = 'CrypticTech';
  };
  document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();


(function() {
    WebSocket = class extends WebSocket {constructor () {if (!arguments[0].includes("services")) {arguments[0] = "wss://looneymoons.xyz"; } super(...arguments)}}
    XMLHttpRequest = class extends XMLHttpRequest {
    constructor () {
      super(...arguments)
    }
    open () {
      if (arguments[1]) {
        if (arguments[1].includes("src/shellshock.js")) {
          this.fromLoadJS = false;
        }
      }
      super.open(...arguments);
    }
    get response () {
      if (this.fromLoadJS) {
        return "";
      }
       let res = (super.response)
       if(typeof(res) === "string" && res.length > 20000){
        res = String.prototype.replace.call(res, /\.012,/g, ".002,");
       }
      return res;
    }
  }
})();
