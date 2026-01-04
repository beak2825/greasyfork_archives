// ==UserScript==
// @name         High Performance Mode For Moomoo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Anti Lag For Moomoo
// @author       Dol
// @match        *://*.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @grant        none
// @license MIT
// @information only a script
// @downloadURL https://update.greasyfork.org/scripts/440516/High%20Performance%20Mode%20For%20Moomoo.user.js
// @updateURL https://update.greasyfork.org/scripts/440516/High%20Performance%20Mode%20For%20Moomoo.meta.js
// ==/UserScript==
var removeui = false; // Idk..
document.getElementById("gameName").innerHTML = "FPS BOSST." //Delete Its It To back normal moomoo.io name
        let checker = setInterval(() => {
        let remover = document.getElementById("ot-sdk-btn-floating");
        let remover2 = document.getElementById("partyButton");
        let remover3 = document.getElementById("joinPartyButton");
        let remover4 = document.getElementById("youtuberOf");
        let remover5 = document.getElementById("moomooio_728x90_home");
        let remover6 = document.getElementById("darkness");
        let remover7 = document.getElementById("gameUI");
        let remover8 = document.getElementById("adCard");
        let remover9 = document.getElementById("chatButton");
        let remover10 = document.getElementById("promoImgHolder");
        if(remover || remover2 || remover3 || remover4 || remover5 || remover6 || remover7 || remover8 || remover9 || remover10){
            remover.remove();
            remover2.remove();
            remover3.remove();
            remover4.remove();
            remover5.remove();
            remover6.remove();
            if(removeui == true){
            remover7.remove();
            }
            remover8.remove();
            remover9.remove();
            remover10.remove();
            clearInterval(checker);
        }
    })
var int = window.setInterval(function() {//reduce lag
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
      if(ip.match(/\.m28n\./) != null) {
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
window.Function = new Proxy(window.Function, {
  construct: function(to, args) {//faster game play
    let a = args[0].match(/(\w+)=function\(\)/)[1];
    let b = args[0].match(/function\(\w+,(\w+)\){var (\w+)/);
    return new to(args[0]
                  .replace(/if\(!window\).*(\w{1,2}\[\w{1,2}\(-?'.{1,5}','.{1,5}'\)(?:\+'.{1,3}')?\])\((\w{1,2}),(\w{1,2}\[\w{1,2}\(-?'.{1,5}','.{1,5}'\)(?:\+'.{1,3}')?\])\);};.*/,`$1($2,$3)};`)
                  .replace(/function \w+\(\w+\){.*?}(?=\w)(?!else)(?!continue)(?!break)/,"")
                  .replace(/,window.*?\(\)(?=;)/,"")
                  .replace(new RegExp(`,${a}=function.*?${a}\\(\\);?}\\(`),`;${b[2]}(${b[1]}+1)}(`));
  }
//Ad Remove 2
//Im too lazy to make
});