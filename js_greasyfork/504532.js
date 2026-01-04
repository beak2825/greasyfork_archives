// ==UserScript==
// @name         Leader Arrow and Minimap Arrow
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  change their colors and track their position
// @author       h3llside
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504532/Leader%20Arrow%20and%20Minimap%20Arrow.user.js
// @updateURL https://update.greasyfork.org/scripts/504532/Leader%20Arrow%20and%20Minimap%20Arrow.meta.js
// ==/UserScript==

let leader_arrow = {ctx: null, xm: null, ym: null, xl: null, yl: null, color: "green"};
let minimap_arrow = {ctx: null, xm: null, ym: null, xl: null, yl: null, color: "purple"};

let container = [];
let last_length = -1;
let ingamescreen = document.getElementById("in-game-screen");
let crx = CanvasRenderingContext2D.prototype;
let minimap_calls = 0;

function proxyMoveToAndLineTo(methodName) {
    return new Proxy(crx[methodName], {
        apply(f, _this, args) {
            if (_this.fillStyle === '#000000' && _this.globalAlpha != 0) {
              if(methodName === "moveTo"){
                switch (_this.strokeStyle){
                    case "#172631":
                        minimap_calls = 0;
                        leader_arrow.ctx = _this.ctx;
                        leader_arrow.xm = args[0];
                        leader_arrow.ym = args[1];
                        _this.fillStyle = leader_arrow.color
                        _this.globalAlpha = 1;
                        window.l_arrow = leader_arrow;
                        break
                    case "#000000":
                       if(args[0] > canvas.width/1.5 && args[1] > canvas.height/1.5){
                         minimap_calls += 1;
                         if(minimap_calls > 10){
                             leader_arrow.xm = null;
                             leader_arrow.ym = null;
                         }
                         minimap_arrow.ctx = _this.ctx;
                         minimap_arrow.xm = args[0];
                         minimap_arrow.ym = args[1];
                         _this.fillStyle = minimap_arrow.color
                         window.m_arrow = minimap_arrow;
                       }
                        break
                }
              }else if(methodName === "lineTo"){
                  switch (_this.strokeStyle){
                    case "#172631":
                        minimap_calls = 0;
                        leader_arrow.ctx = _this.ctx;
                        leader_arrow.xl = args[0];
                        leader_arrow.yl = args[1];
                        _this.fillStyle = leader_arrow.color
                        _this.globalAlpha = 1;
                        window.l_arrow = leader_arrow;
                        break
                    case "#000000":
                       if(args[0] > canvas.width/1.5 && args[1] > canvas.height/1.5){
                         minimap_calls += 1;
                         if(minimap_calls > 10){
                             leader_arrow.xl = null;
                             leader_arrow.yl = null;
                         }
                         minimap_arrow.ctx = _this.ctx;
                         minimap_arrow.xl = args[0];
                         minimap_arrow.yl = args[1];
                         _this.fillStyle = minimap_arrow.color
                         window.m_arrow = minimap_arrow;
                       }
                        break
                }
              }
              container.push(Math.floor(args[0]));
            }

            return f.apply(_this, args);
        }
      });
}

function check_when_update(){
if(ingamescreen.classList.contains("screen") && ingamescreen.classList.contains("active")){
    console.log(minimap_calls);
    let current_length = container.length;
    if(current_length === last_length){
        container = [];
        last_length = -1;
        //crx.moveTo = proxyMoveToAndLineTo('moveTo');
        crx.lineTo = proxyMoveToAndLineTo('lineTo');
    }else if(last_length < current_length){
        last_length = current_length;
    }
 }
}
setInterval(check_when_update, 100);