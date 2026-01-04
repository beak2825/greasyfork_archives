// ==UserScript==
// @name         Kill counter
// @namespace    http://tampermonkey.net/
// @version      3
// @description  kill thingy
// @author       MI300#4401
// @match        https://diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475605/Kill%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/475605/Kill%20counter.meta.js
// ==/UserScript==
function hook(target, callback){
  const check = () => {
    window.requestAnimationFrame(check)
    const func = CanvasRenderingContext2D.prototype[target]

    if(func.toString().includes(target)){

      CanvasRenderingContext2D.prototype[target] = new Proxy (func, {
        apply (method, thisArg, args) {
          callback(thisArg, args)

          return Reflect.apply (method, thisArg, args)
        }
      });
    }
  }
  check()
}
let blacklist = new Array (0);
let killCounter = 0;
hook('fillText', function(thisArg, args){
    if (args[0].includes("You've killed ")) {
      if (blacklist.indexOf(args[0]) === -1) {
        killCounter+=1;
        blacklist.push (args[0])
        setTimeout (function() {
          blacklist.splice(blacklist.indexOf(args[0]), 1);
        },1000);

        setTimeout (function() {
          blacklist.push(args[0]);
        },4600);

        setTimeout (function() {
          blacklist.splice(blacklist.indexOf(args[0]), 1);
        },5000);
      }
    }
})
const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d');
setInterval(() => {
  let gui = () => {
    ctx.fillStyle = "white";
    ctx.lineWidth = 7;
    ctx.font = 3 + "em Ubuntu";
    ctx.strokeStyle = "black";
    ctx.strokeText(`Kills: ` + killCounter, canvas.width * 0.9, canvas.height * 0.7);
    ctx.fillText(`Kills: ` + killCounter, canvas.width * 0.9, canvas.height * 0.7);
    window.requestAnimationFrame(gui);
  }
  gui();
}, 1000);