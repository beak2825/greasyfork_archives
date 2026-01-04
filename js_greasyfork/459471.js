// ==UserScript==
// @name         Unlag
// @version      2.0
// @description  Gives free performance. Like indian scams, but real.
// @author       Shädam
// @match        https://scenexe.io/*
// @grant        none
// @namespace https://greasyfork.org/users/719520
// @licence MIT
// @downloadURL https://update.greasyfork.org/scripts/459471/Unlag.user.js
// @updateURL https://update.greasyfork.org/scripts/459471/Unlag.meta.js
// ==/UserScript==
 
var int = window.setInterval(function() {
  if(window.input != null) {
    window.clearInterval(int);
    onready();
  }
}, 100);
 
function onready() {
  let ping = false;
  let t;
  let samples = new Array(500);
  let m;
  let h = 0;
  function getMax() {
    let max = 0;
    for(let i = 0; i < 500; ++i) {
      if(samples[i] != null) {
        if(samples[i] > max) {
          max = samples[i];
        }
      } else {
        break;
      }
    }
    m = max;
  }
  function sleep(time) {
    return new Promise(function(resolve) {
      setTimeout(resolve, time);
    });
  }
  WebSocket = class extends WebSocket {
    constructor(ip) {
      super(ip);
      if(ip.match(/\.hiss\.io/) != null) {
        samples = new Array(500);
        h = 0;
        ping = false;
        this.send = new Proxy(this.send, {
          apply: function(to, what, args) {
            if(args[0].length == 1) {
              ping = true;
              t = new Date().getTime();
            }
            return to.apply(what, args);
          }
        });
        let a = window.setInterval(function() {
          if(this.onmessage != null) {
            window.clearInterval(a);
            this.onmessage = new Proxy(this.onmessage, {
              apply: function(to, what, args) {
                if(new Uint8Array(args[0].data).length == 1 && ping == true) {
                  ping = false;
                  samples[h] = new Date().getTime() - t;
                  h = (h + 1) % 501;
                  getMax();
                }
                return to.apply(what, args);
              }
            });
          }
        }.bind(this), 100);
      }
    }
  }
  window.m28.pow.solve = new Proxy(window.m28.pow.solve, {
    apply: function(to, what, args) {
      const time = new Date().getTime();
      const f = args[2];
      return to.apply(what, [args[0], args[1], async function(...g) {
        if(args[1] == 17 && 10000 - m * 3 - new Date().getTime() + time > 0) {
          await sleep(10000 - m * 3 - new Date().getTime() + time);
        }
        return f(...g);
      }]);
    }
  });
}