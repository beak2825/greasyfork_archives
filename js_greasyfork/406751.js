// ==UserScript==
// @name  Test Script
// @description Repeated bullets. Correspond to Penta, spread shot, octopus, tri-angel, streamliner
// @version  1.4
// @include  http://diep.io/*
// @connect  diep.io
// @author Жижа
// @age 13
// @namespace    *://diep.io/
// @match        *://diep.io/
// @downloadURL https://update.greasyfork.org/scripts/406751/Test%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/406751/Test%20Script.meta.js
// ==/UserScript==

/*
English
 How to use
  Tank switching
   Shift+T so Penta Shot, Spread Shot, Octo Tank, Tri-Angle, Streamliner Can be switched.(As for the head tempo after switching, reload 7 premise)
  Shooting
   To shoot, hold the right mouse button.

Russian
 Как использовать мой скрипт
  Переключение между танками.
   Чтобы менять тип танка зажмите Shift + T. Тип танка показывается в левом верхнем углу. Типы танков: Octo Tank, Spread Shot, Penta Shot, Tri-Angle, Streamliner.
   (Чтобы все правильно работало вкачивайте перезарядку на максимум)
  Стрельба
   Чтобы стрелять, удерживайте правую кнопку мыши.
*/

(function(){//info
 if(window.updateInfo) return;


 var info = {};
 var info_container = document.createElement("div");
 info_container.style.position = "fixed";
 info_container.style.color = "white";
 info_container.style["pointer-events"] = "none";
 document.body.appendChild(info_container);

 function toggle_info_container(e){
  if(e.key == "i"){
   info_container.style.display = info_container.style.display=="block" ? "none" : "block";
  }
 }
 window.addEventListener("keyup", toggle_info_container);

 window.updateInfo = function(key, value){
  if(!value) delete info[key];
  else info[key] = value;
  var s = "";
  for(var _key in info){
   s += info[_key] + "\n";
  }
  info_container.innerText = s;
 };
})();

function MeasureCycle(){
 var canvas = document.getElementById("canvas");
 var ctx = canvas.getContext("2d");
 var real_arc = ctx.arc;
 var real_setTransform = ctx.setTransform;

 var a;
 var tx = 0, ty = 0;
 var a11 = 1;

 var state = false;
 var found = false;
 var inA = null;
 var direction = 1;

 var frameRequest;
 var intervalEMA = null; // ms

 function arc(){
  real_arc.apply(ctx, arguments);

  if(!found){
   var aimX = window.innerWidth / 2 + 50 * direction;
   var aimY = window.innerHeight / 2;
   found = (tx - a11 < aimX) && (tx + a11 > aimX) && (ty - a11 < aimY) && (ty + a11 > aimY);
  }
 }

 function setTransform(b11, b12, b21, b22, bx, by){
  real_setTransform.apply(ctx, arguments);
  tx = bx;
  ty = by;
  a11 = b11;
 }

 function onMouseEvent(e){
  e.stopPropagation();
 }

 this.start = function(_direction){
  _direction = _direction || 1;
  direction = _direction > 0 ? 1 : -1;
  inA = null;
  intervalEMA = null;
  state = found = false;

  ctx.setTransform = setTransform;
  ctx.arc = arc;

  var aimX = window.innerWidth / 2 + 50 * direction;
  var aimY = window.innerHeight / 2;
  canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: aimX, clientY: aimY}));
  canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: aimX, clientY: aimY}));

  window.addEventListener("mousemove", onMouseEvent, true);
  window.addEventListener("mouseup", onMouseEvent, true);
  window.addEventListener("mousedown", onMouseEvent, true);
  frameRequest = window.requestAnimationFrame(onFrame);

  window.updateInfo && window.updateInfo("measuring", "?????????");
 }

 this.terminate = function(){
  ctx.setTransform = real_setTransform;
  ctx.arc = real_arc;

  window.removeEventListener("mousemove", onMouseEvent, true);
  window.removeEventListener("mousedown", onMouseEvent, true);
  window.removeEventListener("mouseup", onMouseEvent, true);
  window.cancelAnimationFrame(frameRequest);

  canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: 10, clientY: 10}));

  window.updateInfo && window.updateInfo("measuring", null);
  return intervalEMA;
 }
};

(function(){
 var cycleRate = 0.003125; // ms^-1
 var maxAngle = Math.PI * 45 / 180;
 var NCANNON = 3;
 var angleUnit = maxAngle / (NCANNON - 1);

 var block = "Yes";

 var tankData = [
  {name: "Penta", cycleRate: 0.003125, maxAngle: Math.PI * 45 / 180, NCANNON: 3},
  {name: "SpreadShot", cycleRate: 0.001555, maxAngle: Math.PI * 75 / 180, NCANNON: 6},
  {name: "Octo", cycleRate: 0.003125, maxAngle: Math.PI * 45 / 180, NCANNON: 2},
  {name: "Tri-Angel", cycleRate: 0.003125, maxAngle: Math.PI * 180 / 180, NCANNON: 2},
  {name: "Streamliner", cycleRate: 0.0625, maxAngle: Math.PI * 19 / 180, NCANNON: 9},
 ];
 var tankIndex = 0;

 var measure = new MeasureCycle();
 var measuring = false;

 var effective = false;
 var frameRequest;

 var canvas = window.document.getElementById("canvas");

 var mouseX;
 var mouseY;
 var a = 0;
 var startA = 0;
 var artificialMouseMove = false;

 var disabled = false;

 function onMouseDown(e){
  if(block == "No"){
   if(e.button == 2){
    if(!effective){
     startA = a - 50;
     mouseX = e.clientX;
     mouseY = e.clientY;
     canvas.dispatchEvent(new MouseEvent("mousedown", {clientX: mouseX, clientY: mouseY}));
    }
    effective = true;
   }
  }
 }

 function onMouseUp(e){
  if(e.button == 2){
   if(effective){
    canvas.dispatchEvent(new MouseEvent("mouseup", {clientX: mouseX, clientY: mouseY}));
   }
   effective = false;
  }
 }

 function onMouseMove(e){
  if(effective){
   if(!artificialMouseMove){
    e.stopPropagation();
    mouseX = e.clientX;
    mouseY = e.clientY;
   }
  }else{
   mouseX = e.clientX;
   mouseY = e.clientY;
  }
 }

 function update(_a){
  frameRequest = window.requestAnimationFrame(update);
  a = _a;

  if(effective){
   var da = a - startA;
   var state = Math.floor(cycleRate * da * NCANNON) % (NCANNON * 2);
   var state1 = state % NCANNON;
   var state2 = Math.floor(state / NCANNON);
   var angle = angleUnit * state1 * (state1 % 2 == state2 ? 1 : -1);

   var cx = window.innerWidth / 2;
   var cy = window.innerHeight / 2;
   var sin = Math.sin(angle);
   var cos = Math.cos(angle);

   var x = mouseX - cx;
   var y = mouseY - cy;
   var _x = cos * x - sin * y;
   var _y = sin * x + cos * y;
   x = _x + cx;
   y = _y + cy;

   artificialMouseMove = true;
   canvas.dispatchEvent(new MouseEvent("mousemove", {clientX: x, clientY: y}));
   artificialMouseMove = false;
  }
 }

 function blockShoot(){
  if(block == "Yes"){
   block = "No";
   window.updateInfo && window.updateInfo("blockShoot", "Block shoot: " + block);
  }else if(block == "No"){
   block = "Yes";
   window.updateInfo && window.updateInfo("blockShoot", "Block shoot: " + block);
  }
 }

 function onKeyUp(e){
  if(e.key == "T"){
   changeTank((tankIndex + 1) % tankData.length);
  }else if(e.key == "B"){
   blockShoot();
  }
 }

 function changeTank(index){
  var data = tankData[index];
  tankIndex = index;

  cycleRate = data.cycleRate; // ms^-1
  maxAngle = data.maxAngle;
  NCANNON = data.NCANNON;
  angleUnit = maxAngle / (NCANNON - 1);
  window.updateInfo && window.updateInfo("changeTank", "Tank: " + data.name);
 }

 function init(){
  window.addEventListener("keyup", onKeyUp);
  start();
  blockShoot();
  changeTank(0);
  window.updateInfo && window.updateInfo("author", "Made by Жижа");
 }

 function start(){
  canvas.addEventListener("mousedown", onMouseDown);
  canvas.addEventListener("mouseup", onMouseUp);
  window.addEventListener("mousemove", onMouseMove, true);
  frameRequest = window.requestAnimationFrame(update);
 }

 function stop(){
  canvas.removeEventListener("mousedown", onMouseDown);
  canvas.removeEventListener("mouseup", onMouseUp);
  window.removeEventListener("mousemove", onMouseMove, true);
  window.cancelAnimationFrame(frameRequest);
  effective = false;
 }


 init();

})();