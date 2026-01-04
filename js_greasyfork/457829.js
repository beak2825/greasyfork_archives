// ==UserScript==
// @name         bonk skins - SSB
// @namespace    https://bonk.io/
// @version      0.1
// @description  bonk skins, MC edition.
// @author       You
// @match        https://bonk.io/*
// @run-at       document-idle
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bonk.io
// @unwrap
// @downloadURL https://update.greasyfork.org/scripts/457829/bonk%20skins%20-%20SSB.user.js
// @updateURL https://update.greasyfork.org/scripts/457829/bonk%20skins%20-%20SSB.meta.js
// ==/UserScript==

let ctx;
let Players = [];
let shield = [];
let plrIndex = 0;
let limit = {x: 0,y: 0};
let lastCall = Date.now();
let lastDt = 1;
let dragonDelay = 0;

let particles = {
    dragon: []
};

function buildImg(src){
 let img = document.createElement("img");
 img.src = src;
 return img;
}

const skin = buildImg('https://BonkClans.itsdawildshadow.repl.co/file/sword.png');
const skin2 = buildImg('https://BonkClans.itsdawildshadow.repl.co/file/shield.png');
const skin3 = buildImg('https://BonkClans.itsdawildshadow.repl.co/file/wing.png');

setTimeout(() => {
const Context2D = CanvasRenderingContext2D.prototype;

Context2D.arc = new Proxy( Context2D.arc, {
	apply( target, thisArgs, args ) {
        Reflect.apply( ...arguments );
        const { a, b,d, e, f } = thisArgs.getTransform();
        if (ctx !== undefined){
        if ( ctx.globalAlpha <= 0.3 && ctx.globalAlpha >= 0.1 && (ctx.fillStyle == 'black' || ctx.fillStyle == '#000000')){
            plrIndex += 1;
            let vx = 0;
            let vy = 0;
            let plr = Players[plrIndex];
            if (plr){
             vx = ((e-plr.x)*3)/lastDt;
             vy = ((f-plr.y)*3)/lastDt;
            }
           Players[plrIndex] = {expire: 2,x: e,y: f,r: args[2]*1.4,vx: vx,vy: vy};
        }
        }
}});

function draw(){
    let i = -1;
 for (let plr of Players){
     i += 1;
     if (!plr.shield){
     let side = 1;
     let w = 0;
     if ((plr.vx < 0 || side < 0)){
         side = -1;
         w = plr.r*2;
     }
     let s = skin;
       ctx.fillStyle = 'purple';
         for (let i = particles.dragon.length; i > 1; i--){
          if (particles.dragon[i-1].time > 5000){
           particles.dragon.splice(i-1,1);
          }
         }
      for (let p of particles.dragon){
       if (p.init){
           for (let i = 0; i < 25; i++){
               ctx.fillRect(p.x+((Math.random()*90)-45),p.y+((Math.random()*30)-5),5,5);
           }
           p.time += lastDt;
       }else{
        p.x += (p.sx-p.x)/150;
        p.y += (p.sy-p.y)/150;
           for (let i = 0; i < 5; i++){
               ctx.fillRect(p.x+((Math.random()*30)-15),p.y+((Math.random()*30)-15),5,5);
           }
        let a = p.x-p.sx;
        let b = p.y-p.sy;
        let dist = Math.sqrt(a*a+b*b);
        if (dist < 30){
         p.init = true;
        }
       }
      }
      for (let pl of Players){
          let a = pl.x-plr.x;
          let b = pl.y-plr.y;
          let dist = Math.sqrt(a*a+b*b);
          if (dist < plr.r*3 && dist > plr.r){
              s = skin2;
              break;
          }
      }
      if (i == 0){
          dragonDelay += lastDt;
          if (dragonDelay > 15000){
             let p = Players[Math.floor(Math.random()*Players.length)];
             particles.dragon.push({init: false,time: 0,x: plr.x,y: plr.y,sx: p.x,sy: p.y});
             dragonDelay = 0;
          }
       s = skin3;
      }
     ctx.save();
     ctx.scale(side,1);
   ctx.drawImage(s,(w+(plr.x-plr.r))*side,plr.y-plr.r,plr.r*2,plr.r*2);
     ctx.restore();
 }
 }
}
window.requestAnimationFrame = new Proxy( window.requestAnimationFrame, {
	apply( target, thisArgs, args ) {
        lastDt = Date.now()-lastCall;
        lastCall = Date.now();
Reflect.apply( ...arguments );
        if (ctx !== undefined){
            draw();
        }
        for (let i = Players.length-1; i >= 0; i--){
         let plr = Players[i]
         if (plr.expire > 0){
          plr.expire -= 1;
         }else{
          Players.splice(i,1);
         }
        }
        shield = [];
        plrIndex = -1;
                     let gmr = document.getElementById("gamerenderer")
             if (gmr){
                 if (gmr.children.length > 0){
              ctx = gmr.children[0].getContext("2d")
              let canvas = gmr.children[0];
                     if (limit.y !== canvas.height || limit.x !== canvas.width){
              limit.x = canvas.width;
              limit.y = canvas.height;
                     }
                 }
             }
   } });
},1000)