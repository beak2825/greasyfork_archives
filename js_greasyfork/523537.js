// ==UserScript==
// @name         Show Diep.io Coordinates
// @namespace    https://discord.com/invite/v4zauPKkzt
// @version      2025-01-12
// @description  https://discord.com/invite/v4zauPKkzt Join my discord server for more scripts
// @author       Mi300
// @match        https://diep.io/*
// @match        https://staging.diep.io/*
// @match        https://mobile.diep.io/*
// @match        https://diep-io.rivet.game/*
// @match        https://diep.io/?p=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523537/Show%20Diepio%20Coordinates.user.js
// @updateURL https://update.greasyfork.org/scripts/523537/Show%20Diepio%20Coordinates.meta.js
// ==/UserScript==
const c = CanvasRenderingContext2D.prototype;
const scalingFactor = 100; // how large the arena is
let playerX;
let playerY;

let arrowPos = [0, 0];
let minimapPos = [0, 0];
let minimapSize = [0, 0];

let position = 0;
let vertex = [];

c.strokeRect = new Proxy(c.strokeRect, {
  apply: function(method, context, args){
    const t = context.getTransform();
    minimapPos = [t.e, t.f];
    minimapSize = [t.a, t.d];
    return Reflect.apply(method, context, args);
  }
});
c.beginPath = new Proxy(c.beginPath, {
  apply: function(method, context, args){
    position = 0;
    vertex = [];
    return Reflect.apply(method, context, args);
  }
});
c.moveTo = new Proxy(c.moveTo, {
  apply: function(method, context, args){
    position = 1;
    vertex.push(args);
    return Reflect.apply(method, context, args);
  }
});
c.lineTo = new Proxy(c.lineTo, {
  apply: function(method, context, args){
    position++;
    vertex.push(args);
    return Reflect.apply(method, context, args);
  }
});
c.fill = new Proxy(c.fill, {
  apply: function(method, context, args){
    if(context.fillStyle == "#000000" && context.globalAlpha > 0.949 && position === 3){
      arrowPos = getAverage(vertex);
      setPlayerPos();
    }

    return Reflect.apply(method, context, args);
  }
});
Object.freeze(c);

function getAverage(points){
  let tx = 0, ty = 0;
  points.forEach(point => {
    tx += point[0];
    ty += point[1];
  });
  return [tx / points.length, ty / points.length]
}
function setPlayerPos(){
  const dx = (arrowPos[0] - minimapPos[0]);
  const dy = ((arrowPos[1] - minimapPos[1]));

  playerX = (dx / minimapSize[0]) * scalingFactor;
  playerY = (1 - dy / minimapSize[1]) * scalingFactor;
}
function onFrame(){
  window.requestAnimationFrame(onFrame);
  if(!window.extern || !window.extern.doesHaveTank() || typeof playerX === 'undefined' || typeof playerY === 'undefined')return;

  const ctx = window.canvas.getContext("2d");

  ctx.strokeStyle = "#000000";
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "20px sans-serif";
  ctx.lineWidth = "3";

  const x = (window.canvas.width - ctx.measureText(`X: ${playerX.toFixed(1)}  Y: ${playerY.toFixed(1)}`).width) / 2;

  ctx.strokeText(`X: ${playerX.toFixed(1)}  Y: ${playerY.toFixed(1)}`, x, 100);
  ctx.fillText(`X: ${playerX.toFixed(1)}  Y: ${playerY.toFixed(1)}`, x, 100);
}
setTimeout(onFrame, 1000);