// ==UserScript==
// @name         PODEROSOITALIAV2
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  USEM COM SABEDORIA
// @author       PODEROSOITALIA
// @match        http://bloble.io/*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/465614/PODEROSOITALIAV2.user.js
// @updateURL https://update.greasyfork.org/scripts/465614/PODEROSOITALIAV2.meta.js
// ==/UserScript==

window.renderPlayer = function(a, d, c, b, g) {b.save();if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {var e = new Image;e.onload = function() {this.readyToDraw = !0;this.onload = null;g == currentSkin && changeSkin(0);};e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";skinSprites[a.skin] = e;};a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));    b.restore();};



window.ntx = function(dir, dst, uPath) {window.socket.emit("1", dir, dst, uPath)}
window.resolution = 1;
window.upgrInputsToIndex = {};
window.cameraSpd = 5.0;
window.joinEnabled = true;
window.cid = window.UTILS.getUniqueID();localStorage.setItem("cid",window.cid);
window.outlineWidth = 6;
window.darkColor = "#2125ff70";
window.playerColors = "#f9ff6099 #ff606099 #82ff6099 #607eff99 #60eaff99 #ff60ee99 #e360ff99 #ffaf6099 #a3ff6099 #ff609c99 #60ff8299 #cc60ff99 #c6595999 #404b7f99 #f2d95799 #c5525299 #c5525299 #498e5699 #c4515199 #c3545499 #c8575799 #c8595999 #5b74b699 #cd686899 #5c81bd99 #5bb14699 #d8c96399 #c5525299 #404b7f99 #c5525299 #c5525299 #c5525299 #c5525299 #404b7f99 #498e5699 #498e5699 #dbd24599 #ca514e99 #43427e99".split(" ");
window.backgroundColor = "#000";
window.indicatorColor = "#2125ff60";
window.redColor = "#fff";
window.outerColor = "#0a0a0a";
window.lanePad = 10;
window.playerSkins = 0;
window.SkinBots = 0;
window.playerBorderRot = undefined;
/*#2 COMANDOS DE CHAT*/
enterGame = function() {
socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]),
hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value),
mainCanvas.focus(),
grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
setTimeout(function() {frase();}, 1000);
socket.emit("spawn", {
name: ''+userNameInput.value,
skin: 26
}, a)}))}
function frase(){
socket.emit("ch", "")}
//===================Fim===================//
//base com casas e 9 gens//
addEventListener('keydown', a => {
a = a.keyCode;

function filterUnitsUp(unitType, uPath, typeUp) {
  const myUnits = window.units.filter(unit => unit.owner == window.player.sid && unit.type == unitType && unit.uPath == uPath);
  myUnits.forEach(unitID => {
    socket.emit("4", unitID.id, typeUp);
  });
}

function filterUnitsSell(unitType, uPath) {
  let Sell = [];
  const myUnits = window.units.filter(unit => unit.owner == window.player.sid && unit.type == unitType && unit.uPath == uPath);
  myUnits.forEach(unitID => {
    Sell.push(unitID.id);
    socket.emit("3", Sell);
  });
}

 if (a == 105){
setTimeout(function(){ gens()},1000);setTimeout(function(){ gens()},10000);setTimeout(function(){ gens()},20000);setTimeout(function(){ gens()},30000);setTimeout(function(){ gens()},50000);setTimeout(function(){ walls();},60000);setTimeout(function(){ walls()},63000);setTimeout(function(){ micro()},80000);setTimeout(function(){ micro()},95000);setTimeout(function(){ upgens()},100000);setTimeout(function(){ upgens();},130000);setTimeout(function(){ upgens();},155000);setTimeout(function(){ upgens()},160000);setTimeout(function(){ command()},170000);setTimeout(function(){ command()},180000);setTimeout(function(){ greatleadership()},185000);setTimeout(function(){ armory()},190000);setTimeout(function(){ barracks1()},195000);setTimeout(function(){ siege()},230000);setTimeout(function(){ siege()},234000);setTimeout(function(){ barracks2()},235000);setTimeout(function(){ barracks2()},240000);setTimeout(function(){ upbarracks()},250000);setTimeout(function(){ upbarracks()},255000);setTimeout(function(){ upbarracks()},260000);setTimeout(function(){ upbarracks()},270000);setTimeout(function(){ upbarracks()},280000);setTimeout(function(){ sellgens()},310000);setTimeout(function(){ base()},315000);setTimeout(function(){ sellsiege()},340000);setTimeout(function(){ centralizar()},340500);setTimeout(function(){ barracks1()},341000);setTimeout(function(){ upbarracks()},342000);setTimeout(function(){ upbarracks()},345000);setTimeout(function(){ upbarracks()},350000);setTimeout(function(){ centralizar2()},362000);setTimeout(function(){ centralizar3()},363000);setTimeout(function(){ centralizar3()},364000);setTimeout(function(){ upgens2()},365000);setTimeout(function(){ upantitank()},368000);
function gens(){
socket.emit("1", 4.73, 245, 3); socket.emit("1", 5.0025, 245, 3); socket.emit("1", 5.275, 245, 3); socket.emit("1", 5.5475, 245, 3); socket.emit("1", 5.82, 245, 3); socket.emit("1", 6.0925, 245, 3); socket.emit("1", 6.365, 245, 3); socket.emit("1", 6.6375, 245, 3); socket.emit("1", 6.91, 245, 3); socket.emit("1", 7.1825, 245, 3); socket.emit("1", 7.455, 245, 3); socket.emit("1", 7.7275, 245, 3); socket.emit("1", 8.0025, 245, 3); socket.emit("1", 8.275, 245, 3); socket.emit("1", 8.5475, 245, 3); socket.emit("1", 8.82, 245, 3); socket.emit("1", 9.0925, 245, 3); socket.emit("1", 9.3675, 245, 3); socket.emit("1", 9.64, 245, 3); socket.emit("1", 9.9125, 245, 3); socket.emit("1", 10.1875, 245, 3); socket.emit("1", 10.4625, 245, 3); socket.emit("1", 10.7375, 245, 3); socket.emit("1", 5.64, 180, 3); socket.emit("1", 5.999, 180, 3); socket.emit("1", 6.51, 185, 3); socket.emit("1", 7.05, 185, 3); socket.emit("1", 7.6, 185, 3); socket.emit("1", 8.15, 185, 3); socket.emit("1", 8.675, 185, 3); socket.emit("1", 9.225, 185, 3); socket.emit("1", 9.78, 185, 3); socket.emit("1", 10.325, 185, 3); socket.emit("1", 5.36, 130, 3); socket.emit("1", 6.275, 130, 3); socket.emit("1", 6.775, 130, 3); socket.emit("1", 7.3, 130, 3); socket.emit("1", 7.85, 130, 3); socket.emit("1", 8.4, 130, 3); socket.emit("1", 8.925, 130, 3); socket.emit("1", 9.5, 130, 3); socket.emit("1", 10.05, 130, 3);socket.emit("1",-1.55, 140, 7)

}
function walls(){
socket.emit("1",1.57, 306, 1);socket.emit("1",1.37, 306, 1);socket.emit("1",1.77, 306, 1);socket.emit("1",2.19, 306, 1);socket.emit("1",0.95, 306.01, 1);socket.emit("1",0.75, 306, 1);socket.emit("1",0.55, 306, 1);socket.emit("1",2.39, 306, 1);socket.emit("1",2.59, 306, 1);socket.emit("1",0.13, 306, 1);socket.emit("1",3.01, 306, 1);socket.emit("1",-3.07, 306, 1);socket.emit("1",-2.87, 306, 1);socket.emit("1",-2.67, 306, 1);socket.emit("1",-2.27, 306, 1);socket.emit("1",-2.07, 306, 1);socket.emit("1",-2.47, 306, 1);socket.emit("1",-0.07, 306, 1);socket.emit("1",-0.27, 306, 1);socket.emit("1",-0.47, 306, 1);socket.emit("1",-1.87, 306, 1);socket.emit("1",-1.67, 306, 1);socket.emit("1",-1.47, 306, 1);socket.emit("1",-1.27, 306, 1);socket.emit("1",-1.07, 306, 1);socket.emit("1",-0.87, 306, 1);socket.emit("1",-0.67, 306, 1);
}
function base(){
socket.emit("1", -2.54, 130, 4);socket.emit("1",-1.55, 140, 7);socket.emit("1",1.57, 306, 1);socket.emit("1",1.37, 306, 1);socket.emit("1",1.77, 306, 1);socket.emit("1",2.19, 306, 1);socket.emit("1",0.95, 306.01, 1);socket.emit("1",0.75, 306, 1);socket.emit("1",0.55, 306, 1);socket.emit("1",2.39, 306, 1);socket.emit("1",2.59, 306, 1);socket.emit("1",0.13, 306, 1);socket.emit("1",3.01, 306, 1);socket.emit("1",-3.07, 306, 1);socket.emit("1",-2.87, 306, 1);socket.emit("1",-2.67, 306, 1);socket.emit("1",-2.27, 306, 1);socket.emit("1",-2.07, 306, 1);socket.emit("1",-2.47, 306, 1);socket.emit("1",-0.07, 306, 1);socket.emit("1",-0.27, 306, 1);socket.emit("1",-0.47, 306, 1);socket.emit("1",-1.87, 306, 1);socket.emit("1",-1.67, 306, 1);socket.emit("1",-1.47, 306, 1);socket.emit("1",-1.27, 306, 1);socket.emit("1",-1.07, 306, 1);socket.emit("1",-0.87, 306, 1);socket.emit("1",-0.67, 306, 1);socket.emit("1",1.16, 310, 8);socket.emit("1",1.98, 310, 8);socket.emit("1",2.8, 310, 8);socket.emit("1",-1.03, 130, 4);socket.emit("1",3.61, 245, 4);socket.emit("1",3.86, 245.01, 4);socket.emit("1",-2.17, 245.85, 4);socket.emit("1",3.08, 184, 4);socket.emit("1",3.11, 245, 4);socket.emit("1",3.36, 245, 4);socket.emit("1",4.36, 245, 4);socket.emit("1",4.86, 245, 4);socket.emit("1",4.61, 245, 4);socket.emit("1",4.39, 185, 4);socket.emit("1",5.11, 245, 4);socket.emit("1",5.36, 244.99, 4);socket.emit("1",-1.21, 184.75, 4);socket.emit("1",6.11, 245.01, 4);socket.emit("1",6.36, 245, 4);socket.emit("1",4.21, 130, 4);socket.emit("1",4.06, 186, 4);socket.emit("1",3.74, 190, 4);socket.emit("1",3.27, 130, 4);socket.emit("1",3.42, 186, 4);socket.emit("1",6.05, 186, 4);socket.emit("1",0.1, 184.35, 4);socket.emit("1",6.19, 130, 4);socket.emit("1",5.72, 130, 4);socket.emit("1",-0.88, 185.64, 4);socket.emit("1",5.73, 190, 4);socket.emit("1",5.86, 245, 4);socket.emit("1",5.61, 245, 4);socket.emit("1",6.66, 130, 4);socket.emit("1",2.79, 130, 4);socket.emit("1",2.75, 190, 4);socket.emit("1",2.86, 245.85, 4);socket.emit("1",6.61, 244.99, 4);socket.emit("1",6.72, 189.5, 4);socket.emit("1",3.74, 130, 4);socket.emit("1",0.34, 310, 8);socket.emit("1",2.43, 188, 4);socket.emit("1",2.3, 243.85, 5);socket.emit("1",7.04, 188.5, 4);socket.emit("1",0.89, 243.85, 5);socket.emit("1",0.6, 243.85, 5);socket.emit("1",2.59, 243.85, 5);socket.emit("1",2.04, 245.85, 4);socket.emit("1",1.15, 245.85, 4);socket.emit("1",1.78, 243.85, 5);socket.emit("1",1.41, 243.85, 5);socket.emit("1",2.09, 183.74, 3);socket.emit("1",1.1, 183.82, 3);socket.emit("1",2.32, 130, 4);socket.emit("1",1.84, 132, 3);socket.emit("1",1.35, 132, 3);socket.emit("1",1.59, 188.08, 3);socket.emit("1",0.86, 130, 4);
}
function barracks1(){
  socket.emit("1",0.34, 310, 8)
}
function barracks2(){
socket.emit("1",1.16, 310, 8);socket.emit("1",1.98, 310, 8);socket.emit("1",2.8, 310, 8)
}
function greatleadership(){
filterUnitsUp(1, 9, 0)
}
function upbarracks(){
filterUnitsUp(2, 8, 0)
}
function micro(){
filterUnitsUp(3, 1, 1)
}
function upgens(){
filterUnitsUp(0, 3, 0)
}
function upgens2(){
filterUnitsUp(0, 3, 0)
}
function upantitank(){
filterUnitsUp(0, 5, 1)
}
function upgenstank(){
filterUnitsUp(0, 3, 0)
}
function command(){
socket.emit("4",0,0,1)
}
function siege(){
filterUnitsUp(2, 8, 2)
}
function armory(){
filterUnitsUp(0, 7, 0)
}
function sellgens(){
filterUnitsSell(0, 3)
filterUnitsSell(0, '3,0')
}
function sellsiege(){
filterUnitsSell(2, '8,2')
}
function centralizar(){
let ty = [];
for (var b = 0; b < units.length; ++b) {
if (units[b].owner == player.sid && units[b].uPath == 11) {
ty.push(units[b].id);
}
}
socket.emit("5", (player.x)-1, (player.y)+1, ty, 0, -1);
}
function centralizar2(){
let ty = [];
for (var b = 0; b < units.length; ++b) {
if (units[b].owner == player.sid && units[b].uPath == 11) {
ty.push(units[b].id);
}
}
socket.emit("5", (player.x)+1, (player.y)-1, ty, 0, -1);
}
function centralizar3(){
let ty = [];
for (var b = 0; b < units.length; ++b) {
if (units[b].owner == player.sid && units[b].uPath == 11) {
ty.push(units[b].id);
}
}
socket.emit("5", (player.x)*1, (player.y)*1, ty, 0, -1);
}
function centralizar4(){
let ty = [];
for (var b = 0; b < units.length; ++b) {
if (units[b].owner == player.sid && units[b].uPath == 11) {
ty.push(units[b].id);
}
}
socket.emit("5", (player.x), (player.y), ty, 0, -1);
}
}





if (a == 97){//full atk
socket.emit("1", -2.54, 130, 4);socket.emit("1",-1.55, 140, 7);socket.emit("1",1.57, 306, 1);socket.emit("1",1.37, 306, 1);socket.emit("1",1.77, 306, 1);socket.emit("1",2.19, 306, 1);socket.emit("1",0.95, 306.01, 1);socket.emit("1",0.75, 306, 1);socket.emit("1",0.55, 306, 1);socket.emit("1",2.39, 306, 1);socket.emit("1",2.59, 306, 1);socket.emit("1",0.13, 306, 1);socket.emit("1",3.01, 306, 1);socket.emit("1",-3.07, 306, 1);socket.emit("1",-2.87, 306, 1);socket.emit("1",-2.67, 306, 1);socket.emit("1",-2.27, 306, 1);socket.emit("1",-2.07, 306, 1);socket.emit("1",-2.47, 306, 1);socket.emit("1",-0.07, 306, 1);socket.emit("1",-0.27, 306, 1);socket.emit("1",-0.47, 306, 1);socket.emit("1",-1.87, 306, 1);socket.emit("1",-1.67, 306, 1);socket.emit("1",-1.47, 306, 1);socket.emit("1",-1.27, 306, 1);socket.emit("1",-1.07, 306, 1);socket.emit("1",-0.87, 306, 1);socket.emit("1",-0.67, 306, 1);socket.emit("1",1.16, 310, 8);socket.emit("1",1.98, 310, 8);socket.emit("1",2.8, 310, 8);socket.emit("1",-1.03, 130, 4);socket.emit("1",3.61, 245, 4);socket.emit("1",3.86, 245.01, 4);socket.emit("1",-2.17, 245.85, 4);socket.emit("1",3.08, 184, 4);socket.emit("1",3.11, 245, 4);socket.emit("1",3.36, 245, 4);socket.emit("1",4.36, 245, 4);socket.emit("1",4.86, 245, 4);socket.emit("1",4.61, 245, 4);socket.emit("1",4.39, 185, 4);socket.emit("1",5.11, 245, 4);socket.emit("1",5.36, 244.99, 4);socket.emit("1",-1.21, 184.75, 4);socket.emit("1",6.11, 245.01, 4);socket.emit("1",6.36, 245, 4);socket.emit("1",4.21, 130, 4);socket.emit("1",4.06, 186, 4);socket.emit("1",3.74, 190, 4);socket.emit("1",3.27, 130, 4);socket.emit("1",3.42, 186, 4);socket.emit("1",6.05, 186, 4);socket.emit("1",0.1, 184.35, 4);socket.emit("1",6.19, 130, 4);socket.emit("1",5.72, 130, 4);socket.emit("1",-0.88, 185.64, 4);socket.emit("1",5.73, 190, 4);socket.emit("1",5.86, 245, 4);socket.emit("1",5.61, 245, 4);socket.emit("1",6.66, 130, 4);socket.emit("1",2.79, 130, 4);socket.emit("1",2.75, 190, 4);socket.emit("1",2.86, 245.85, 4);socket.emit("1",6.61, 244.99, 4);socket.emit("1",6.72, 189.5, 4);socket.emit("1",3.74, 130, 4);socket.emit("1",0.34, 310, 8);socket.emit("1",2.43, 188, 4);socket.emit("1",2.3, 243.85, 5);socket.emit("1",7.04, 188.5, 4);socket.emit("1",0.89, 243.85, 5);socket.emit("1",0.6, 243.85, 5);socket.emit("1",2.59, 243.85, 5);socket.emit("1",2.04, 245.85, 4);socket.emit("1",1.15, 245.85, 4);socket.emit("1",1.78, 243.85, 5);socket.emit("1",1.41, 243.85, 5);socket.emit("1",2.09, 183.74, 3);socket.emit("1",1.1, 183.82, 3);socket.emit("1",2.32, 130, 4);socket.emit("1",1.84, 132, 3);socket.emit("1",1.35, 132, 3);socket.emit("1",1.59, 188.08, 3);socket.emit("1",0.86, 130, 4);
    }
})


//DEFEND//
addEventListener('keydown', a => {
a = a.keyCode;
if (a == 88){
socket.emit("1",1.57, 306, 1);socket.emit("1",1.37, 306, 1);socket.emit("1",1.77, 306, 1);socket.emit("1",2.19, 306, 1);socket.emit("1",0.95, 306.01, 1);socket.emit("1",0.75, 306, 1);socket.emit("1",0.55, 306, 1);socket.emit("1",2.39, 306, 1);socket.emit("1",2.59, 306, 1);socket.emit("1",0.13, 306, 1);socket.emit("1",3.01, 306, 1);socket.emit("1",-3.07, 306, 1);socket.emit("1",-2.87, 306, 1);socket.emit("1",-2.67, 306, 1);socket.emit("1",-2.27, 306, 1);socket.emit("1",-2.07, 306, 1);socket.emit("1",-2.47, 306, 1);socket.emit("1",-0.07, 306, 1);socket.emit("1",-0.27, 306, 1);socket.emit("1",-0.47, 306, 1);socket.emit("1",-1.87, 306, 1);socket.emit("1",-1.67, 306, 1);socket.emit("1",-1.47, 306, 1);socket.emit("1",-1.27, 306, 1);socket.emit("1",-1.07, 306, 1);socket.emit("1",-0.87, 306, 1);socket.emit("1",-0.67, 306, 1);socket.emit("1",3.11, 245, 1);socket.emit("1",3.36, 245, 1);socket.emit("1",3.08, 184, 1);socket.emit("1",3.42, 186, 1);socket.emit("1",3.27, 130, 1);socket.emit("1",8.26, 306, 1);socket.emit("1",3.61, 245, 1);socket.emit("1",3.86, 245.01, 1);socket.emit("1",4.73, 190, 1);socket.emit("1",3.74, 190, 1);socket.emit("1",5.06, 185, 1);socket.emit("1",4.06, 186, 1);socket.emit("1",4.39, 185, 1);socket.emit("1",4.73, 130, 1);socket.emit("1",5.25, 130, 1);socket.emit("1",3.74, 130, 1);socket.emit("1",4.21, 130, 1);socket.emit("1",2.8, 306, 1);socket.emit("1",1.16, 306, 1);socket.emit("1",0.35, 306, 1);socket.emit("1",2.43, 188, 1);socket.emit("1",7.13, 130, 1);socket.emit("1",7.6, 130, 1);socket.emit("1",1.85, 130, 1);socket.emit("1",2.32, 130, 1);socket.emit("1",2.79, 130, 1);socket.emit("1",8.89, 246, 1);socket.emit("1",2.86, 245, 1);socket.emit("1",2.75, 190, 1);socket.emit("1",8.14, 246.01, 1);socket.emit("1",8.39, 246, 1);socket.emit("1",8.64, 246, 1);socket.emit("1",7.37, 185, 1);socket.emit("1",7.71, 187.45, 1);socket.emit("1",8.04, 188.5, 1);socket.emit("1",8.36, 185, 1);socket.emit("1",7.64, 246, 1);socket.emit("1",7.89, 246, 1);socket.emit("1",4.11, 245, 1);socket.emit("1",4.36, 245, 1);socket.emit("1",4.61, 245, 1);socket.emit("1",4.86, 245, 1);socket.emit("1",5.11, 245, 1);socket.emit("1",5.36, 245, 1);socket.emit("1",5.61, 245, 1);socket.emit("1",5.73, 190, 1);socket.emit("1",5.4, 185, 1);socket.emit("1",5.72, 129.99, 1);socket.emit("1",6.19, 130, 1);socket.emit("1",6.66, 130, 1);socket.emit("1",5.86, 245, 1);socket.emit("1",6.11, 245, 1);socket.emit("1",6.36, 245, 1);socket.emit("1",6.61, 244.99, 1);socket.emit("1",6.05, 186, 1);socket.emit("1",6.37, 185, 1);socket.emit("1",6.86, 245.01, 1);socket.emit("1",7.14, 245, 1);socket.emit("1",7.39, 245, 1);socket.emit("1",6.72, 189.5, 1);socket.emit("1",7.04, 188.5, 1);
 }
})
//gens//
addEventListener('keydown', a => {
a = a.keyCode;
if (a == 96){
socket.emit("1",1.57, 243.85, 3);socket.emit("1",2.44, 196.8, 3);socket.emit("1",2.24, 243.86, 3);socket.emit("1",-2.78, 194.68, 3);socket.emit("1",1.97, 243.85, 3);socket.emit("1",2.1, 185.59, 3);socket.emit("1",1.87, 132, 3);socket.emit("1",1.26, 132, 3);socket.emit("1",1.38, 194.13, 3);socket.emit("1",1.76, 194.06, 3);socket.emit("1",-2.44, 185.75, 3);socket.emit("1",-2.59, 243.85, 3);socket.emit("1",3.06, 132, 3);socket.emit("1",2.37, 132, 3);socket.emit("1",2.77, 180.64, 3);socket.emit("1",2.91, 243.85, 3);socket.emit("1",2.64, 243.85, 3);socket.emit("1",3.11, 196.06, 3);socket.emit("1",-2.97, 243.85, 3);socket.emit("1",-2.69, 132, 3);socket.emit("1",-2.31, 243.85, 3);socket.emit("1",0.76, 132, 3);socket.emit("1",0.36, 180.1, 3);socket.emit("1",0.03, 197.16, 3);socket.emit("1",-0.44, 132, 3);socket.emit("1",0.08, 132, 3);socket.emit("1",0.23, 243.85, 3);socket.emit("1",0.5, 243.85, 3);socket.emit("1",0.7, 196.11, 3);socket.emit("1",0.9, 243.85, 3);socket.emit("1",1.04, 186.08, 3);socket.emit("1",1.17, 243.86, 3);socket.emit("1",-0.17, 243.85, 3);socket.emit("1",-0.36, 194.93, 3);socket.emit("1",-0.7, 183.73, 3);socket.emit("1",-0.55, 243.85, 3);socket.emit("1",-0.82, 243.85, 3);socket.emit("1",1.16, 310, 8);socket.emit("1",1.98, 310, 8);socket.emit("1",0.34, 310, 8);socket.emit("1",2.8, 310, 8);socket.emit("1",1.57, 306, 1);socket.emit("1",1.37, 306, 1);socket.emit("1",1.77, 306, 1);socket.emit("1",2.19, 306, 1);socket.emit("1",0.95, 306.01, 1);socket.emit("1",0.75, 306, 1);socket.emit("1",0.55, 306, 1);socket.emit("1",2.39, 306, 1);socket.emit("1",2.59, 306, 1);socket.emit("1",0.13, 306, 1);socket.emit("1",3.01, 306, 1);socket.emit("1",-3.07, 306, 1);socket.emit("1",-2.87, 306, 1);socket.emit("1",-2.67, 306, 1);socket.emit("1",-2.27, 306, 1);socket.emit("1",-2.07, 306, 1);socket.emit("1",-2.47, 306, 1);socket.emit("1",-0.07, 306, 1);socket.emit("1",-0.27, 306, 1);socket.emit("1",-0.47, 306, 1);socket.emit("1",-1.87, 306, 1);socket.emit("1",-1.67, 306, 1);socket.emit("1",-1.47, 306, 1);socket.emit("1",-1.27, 306, 1);socket.emit("1",-1.07, 306, 1);socket.emit("1",-0.87, 306, 1);socket.emit("1",-0.67, 306, 1);socket.emit("1",-1.55, 140, 7);socket.emit("1",-2.19, 132, 3);socket.emit("1",-0.95, 132, 3);socket.emit("1",-2.08, 193.61, 3);socket.emit("1",-1.05, 195.4, 3);socket.emit("1",-1.56, 243.85, 3);socket.emit("1",-1.27, 243.85, 3);socket.emit("1",-1.85, 243.85, 3);
 }
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 90) {//Commander
  const myUnits = units.filter(unit => unit.owner == player.sid && unit.type == 0 && unit.uPath == 3);
            myUnits.forEach(unit => {
                socket.emit("4", unit.id, 0)
            });
    }
})


addEventListener('keydown', a => {
a = a.keyCode;
if (a == 121) {//Sell gens
const my = {};
let Sell = [];
my.SellWalls = window.units.filter(unit => unit.owner == window.player.sid && unit.type == 0 && unit.uPath == 3 || unit.uPath == '3,0')
my.SellWalls.forEach(gensID => {Sell.push(gensID.id);window.socket.emit("3",Sell)})
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 189) {//Sell house
const my = {};
let Sell = [];
my.SellHouse = window.units.filter(unit => unit.owner == window.player.sid && unit.type == 0 && unit.uPath == 4)
my.SellHouse.forEach(houseID => {Sell.push(houseID.id);window.socket.emit("3",Sell)})
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 103) {//Up Barrack
const my = {};
my.UPbarracks = window.units.filter(unit => unit.owner == window.player.sid && unit.type == 2 && unit.uPath == 8)
my.UPbarracks.forEach(barracksID => {window.socket.emit("4",barracksID.id,0)})
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 190){
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
})
addEventListener('keydown', a => {
a = a.keyCode;
if (a == 90) {//Commander
window.socket.emit("4",0,0,1)
window.selUnits = [];
window.units.every((unit) => {
if (unit.owner === window.player.sid && unit.type === 1) {
if (!unit.info) unit.info = window.getUnitFromPath(unit.uPath);
if (unit.info.name === 'Commander') {
window.selUnits.push(unit);
return false;
}}
return true;
});
window.selUnitType = "Unit";
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 81) {//Soldiers
window.selUnits = [];
window.units.forEach((unit) => {
if (unit.owner === window.player.sid && unit.type === 1) {
if (!unit.info) unit.info = window.getUnitFromPath(unit.uPath);
if (unit.info.name === 'Soldier') {
window.selUnits.push(unit);
return false;
}}
return true;
});
window.selUnitType = "Unit";
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if(a == 226) {//Sell Walls
const my = {};
let Sell = [];
my.SellWalls = window.units.filter(unit => unit.owner == window.player.sid && unit.type == 3 && unit.uPath == 1)
my.SellWalls.forEach(wallsID => {Sell.push(wallsID.id);window.socket.emit("3",Sell)})
}
})

addEventListener('keydown', a => {
a = a.keyCode;
if (a == 110) {//Centralizador
for (var e = [], b = 0; b < Math.floor(window.selUnits.length-0); ++b) e.push(window.selUnits[b].id);window.socket.emit("5", (window.player.x)-1, (window.player.y)+1, e, 0, -1);
for (e = [], b = 0; b < Math.floor(window.selUnits.length-0); ++b) e.push(window.selUnits[b].id);window.socket.emit("5", (window.player.x)+1, (window.player.y)-1, e, 0, -1);
for (e = [], b = 0; b < Math.floor(window.selUnits.length-0); ++b) e.push(window.selUnits[b].id);window.socket.emit("5", (window.player.x)*1, (window.player.y)*1, e, 0, -1);
for (e = [], b = 0; b < Math.floor(window.selUnits.length-0); ++b) e.push(window.selUnits[b].id);window.socket.emit("5", (window.player.x), (window.player.y), e, 0, -1);
}
})


window.share.getUnitList = function() {
return [{
name: "Soldier",
shape: "circle",
desc: "Expendable and perfect for rushing the enemy",
typeName: "Unit",
limit: 4,
reward: 3,
notUser: true,
uPath: [0],
space: 2,
type: 1,
size: 17,
speed: 0.18,
health: 30,
dmg: 10
}, {
name: "Wall",
shape: "circle",
desc: "Blocks incoming units and projectiles",
typeName: "Tower",
uPath: [1],
type: 3,
size: 30,
cost: 20,
health: 100,
dmg: 50,
upgrades: [{
name: "Boulder",
shape: "hexagon",
desc: "Strong barrier that blocks incoming units",
typeName: "Tower",
uPath: [1, 0],
type: 3,
size: 30,
cost: 60,
health: 150,
dmg: 50,
upgrades: [{
name: "Spikes",
shape: "spike",
desc: "Strong spike that blocks incoming units",
typeName: "Tower",
uPath: [1, 0, 0],
type: 3,
size: 30,
cost: 200,
health: 200,
dmg: 100
}]
}, {
name: "Micro Generator",
shape: "circle",
desc: "Generates power over time",
typeName: "Tower",
uPath: [1, 1],
type: 3,
size: 30,
iSize: 0.55,
cost: 30,
health: 50,
dmg: 10,
pts: 0.5
}]
}, {
name: "Simple Turret",
shape: "circle",
desc: "Shoots incoming enemy units",
typeName: "Tower",
uPath: [2],
type: 0,
size: 29,
cost: 25,
turretIndex: 1,
range: 180,
reload: 800,
health: 20,
dmg: 20,
upgrades: [{
name: "Rapid Turret",
shape: "circle",
desc: "Shoots incoming units at faster rate",
typeName: "Tower",
uPath: [2, 0],
type: 0,
size: 30,
cost: 60,
turretIndex: 2,
range: 180,
reload: 400,
health: 20,
dmg: 20,
upgrades: [{
name: "Gatlin Turret",
shape: "circle",
desc: "Rapidly shoots incoming units at close range",
typeName: "Tower",
uPath: [2, 0, 0],
type: 0,
size: 30,
cost: 100,
turretIndex: 7,
range: 180,
reload: 140,
health: 20,
dmg: 15
}]
}, {
name: "Ranged Turret",
shape: "circle",
desc: "Turret with higher range and damage",
typeName: "Tower",
uPath: [2, 1],
type: 0,
size: 30,
cost: 60,
turretIndex: 3,
range: 240,
reload: 800,
health: 30,
dmg: 30,
upgrades: [{
name: "Spotter Turret",
shape: "circle",
desc: "Shoots at very high range and reveals cloaked units",
typeName: "Tower",
seeCloak: true,
uPath: [2, 1, 0],
type: 0,
size: 30,
cost: 100,
turretIndex: 10,
range: 290,
reload: 800,
health: 30,
dmg: 30
}]
}]
}, {
name: "Generator",
shape: "hexagon",
desc: "Generates power over time",
typeName: "Tower",
uPath: [3],
type: 0,
size: 32,
iSize: 0.55,
cost: 50,
health: 50,
dmg: 10,
pts: 1,
upgrades: [{
name: "Power Plant",
shape: "octagon",
desc: "Generates power at a faster rate",
typeName: "Tower",
uPath: [3, 0],
type: 0,
size: 32,
iSize: 0.6,
cost: 100,
health: 80,
dmg: 10,
pts: 1.5
}]
}, {
name: "House",
shape: "pentagon",
desc: "Increases unit limit",
typeName: "Tower",
uPath: [4],
type: 0,
size: 30,
iSize: 0.3,
cost: 60,
health: 40,
dmg: 10,
lmt: [0, 3]
}, {
name: "Sniper Turret",
shape: "circle",
desc: "Slower firerate but larger range and damage",
typeName: "Tower",
uPath: [5],
type: 0,
size: 32,
cost: 80,
turretIndex: 4,
range: 240,
reload: 2000,
health: 30,
tDmg: 50,
dmg: 30,
upgrades: [{
name: "Semi-Auto Sniper",
shape: "circle",
desc: "Fast firerate sniper turret",
typeName: "Tower",
uPath: [5, 0],
type: 0,
size: 32,
cost: 180,
turretIndex: 5,
range: 240,
reload: 1000,
health: 60,
tDmg: 50,
dmg: 30
}, {
name: "Anti Tank Gun",
shape: "circle",
desc: "High damage turret with very slow firerate",
typeName: "Tower",
target: 1,
uPath: [5, 1],
type: 0,
size: 32,
cost: 300,
turretIndex: 6,
range: 280,
reload: 4500,
health: 60,
tDmg: 250,
dmg: 30
}]
}, {
name: "Tank",
shape: "square",
desc: "More powerful unit but moves slower",
typeName: "Unit",
group: 0,
reward: 100,
notUser: true,
uPath: [6],
space: 15,
type: 1,
size: 31,
speed: 0.05,
health: 250,
dmg: 50
}, {
name: "Armory",
shape: "circle",
desc: "Provides improvements for your army",
typeName: "Tower",
uPath: [7],
limit: 1,
type: 0,
size: 40,
renderIndex: 3,
cost: 100,
health: 90,
dmg: 30,
upgrades: [{
name: "Power Armor",
desc: "Increases soldier armor",
powerup: true,
uPath: [7, 0],
cost: 500,
uVals: [0, 'health', 20, 'renderIndex', 4]
}, {
name: "Booster Engines",
desc: "Increases tank movement speed",
powerup: true,
uPath: [7, 1],
cost: 600,
uVals: [6, 'speed', 0.04, 'renderIndex', 5]
}, {
name: "Panzer Cannons",
desc: "Adds cannons to tank units",
powerup: true,
uPath: [7, 2],
cost: 1000,
uVals: [6, 'turretIndex', 8, 'tDmg', 10, 'reload', 900, 'range', 200, 'shoot', true, 'target', 1]
}, {
name: "Cloaking Device",
desc: "Hides tanks from enemy towers",
powerup: true,
uPath: [7, 3],
cost: 2000,
uVals: [6, 'cloak', 1, 'canCloak', 1]
}]
}, {
name: "Barracks",
shape: "square",
desc: "Produces soldiers over time",
typeName: "Tower",
uPath: [8],
limit: 4,
type: 2,
size: 34,
iSize: 0.55,
cost: 150,
reload: 3500,
unitSpawn: 0,
health: 60,
dmg: 30,
upgrades: [{
name: "Greater Barracks",
shape: "square",
desc: "Produces soldiers more rapidly",
typeName: "Tower",
uPath: [8, 0],
type: 2,
size: 34,
renderIndex: 1,
cost: 500,
reload: 2500,
unitSpawn: 0,
health: 80,
dmg: 40
}, {
name: "Tank Factory",
shape: "square",
desc: "Slowly produces tanks over time",
typeName: "Tower",
uPath: [8, 1],
type: 2,
size: 35,
range: 70,
renderIndex: 2,
cost: 2000,
reload: 10000,
unitSpawn: 6,
health: 140,
dmg: 50,
upgrades: [{
name: "Blitz Factory",
shape: "square",
desc: "Produces Tanks at a Faster rate",
typeName: "Tower",
uPath: [8, 1, 0],
type: 2,
size: 35,
range: 70,
renderIndex: 2,
cost: 5000,
reload: 6000,
unitSpawn: 6,
health: 180,
dmg: 50
}]
}, {
name: "Siege Factory",
shape: "square",
desc: "Produces siege tanks over time",
typeName: "Tower",
uPath: [8, 2],
type: 2,
size: 35,
range: 70,
renderIndex: 8,
cost: 3000,
reload: 20000,
unitSpawn: 11,
health: 200,
dmg: 100
}]
}, {
name: "Commander",
shape: "star",
hero: true,
desc: "Powerful commander unit",
typeName: "Unit",
reward: 200,
notUser: true,
uPath: [9],
limit: 1,
type: 1,
size: 32,
speed: 0.16,
health: 700,
dmg: 100,
tDmg: 30,
turretIndex: 9,
reload: 600,
range: 160,
target: 1,
upgrades: [{
name: "Great Leadership",
desc: "Increases population cap",
powerup: true,
removeOthers: true,
uPath: [9, 0],
cost: 500,
lmt: [0, 10]
}]
}, {
name: "Tree",
desc: "Can be used for cover",
typeName: "Nature",
layer: 1,
uPath: [10],
type: 4,
notUser: true,
dontUpdate: true,
size: 90,
renderIndex: 7
}, {
name: "Siege Ram",
shape: "circle",
desc: "Very powerful and slow siege tank",
typeName: "Unit",
group: 0,
reward: 300,
notUser: true,
uPath: [11],
space: 40,
type: 1,
size: 30,
iSize: 0.5,
speed: 0.015,
health: 1500,
dmg: 100
}];
}

updatePath = function(a, d) {
if (a.paths[1]) {
mainContext.save();
a.dir = a.paths[0];
var c = a.paths[1],
user = users.find(u => u.sid === a.owner);
c -= d;
0 < c ? (a.x += d * MathCOS(a.dir), a.y += d * MathSIN(a.dir)) : (c *= -1, a.x += a.paths[1] * MathCOS(a.dir), a.y += a.paths[1] * MathSIN(a.dir), a.startTime += a.paths[1] / a.speed, a.paths.splice(0, 2), updatePath(a, c));
mainContext.lineWidth = 2;
mainContext.globalAlpha = 5;
var x = a.x - ((player.x || 0) - maxScreenWidth / 2 + camX),
y = a.y - ((player.y || 0) - maxScreenHeight / 2 + camY);
renderLine(x, y, x + c * MathCOS(a.dir), y + c * MathSIN(a.dir), mainContext, user && playerColors[user.color]);
a.lastX = a.x;
a.lastY = a.y;
mainContext.restore();
}
}
renderLine = function(sX, sY, fX, fY, c, clr, sW) {
c.beginPath();
c.moveTo(sX, sY);
c.lineTo(fX, fY);
c.strokeStyle = clr || '#eee8';
c.stroke();
c.closePath();
}
 addEventListener("keydown",function(a){if(document.activeElement == mainCanvas && selUnits.length){if(a.key=="/"){effect700();}}});
var rot = 0.1;
function effect700(){var radiuslenght = 700;var radius = radiuslenght;var x = player.x+targetDst*
MathCOS(targetDir)+camX;var y = player.y+targetDst*MathSIN(targetDir)+camY;var interval = (Math.PI*2)/selUnits.length;rot+=0.1;
for(let i=0;i<selUnits.length;i++){socket.emit("5",x+(Math.cos(interval*i+rot)*radius),y+(Math.sin(interval*i+rot)*radius),[selUnits[i].id],0,0);
}};
var chatkaka = document.createElement("style")

addEventListener('keydown', a => {
a = a.keyCode;
   if (a === 69) {/*Commander e soldiers*/
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";
}
})


window.ntx = function(dir, dst, uPath) {window.socket.emit("1", dir, dst, uPath)}
window.resolution = 1;
window.upgrInputsToIndex = {};
window.cameraSpd = 2.0;
window.joinEnabled = true;
window.cid = window.UTILS.getUniqueID();localStorage.setItem("cid",window.cid);
window.outlineWidth = 6;

// Bot //
window.Bot=function(){
   var bots = prompt("quantidade de bot")
   for (let i = 0; i < bots; i++) {
   window.open("http://bloble.io/?l="+partyKey)
}}
// Hotbar //
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.UIList.push({

level:0,x:3,html:'<div onclick=Bot()>BotGuia</div>'},{

})
window.makeUI = function () {
if (window.hasMadeUI) return;
window.hasMadeUI = true;
window.statusItems.sort(function (a, b) {return a.order - b.order;})
var levels = [];
window.UIList.forEach((item) => {
if (!levels[item.level]) levels[item.level] = [];
levels[item.level].push(item)})
levels = levels.filter((a) => {if (a) {a.sort(function (a, b) {return a.x - b.x;})
return true;} else {return false;}})
var headAppend = document.getElementsByTagName("head")[0],style = document.createElement("div");
var toast = document.createElement('div');toast.id = "snackbar";
var css = document.createElement('div');
var height = levels.length * (14 + 19) + (levels.length - 1) * 7 + 23;
style.innerHTML = "<style>\n\
#noobscriptUI, #noobscriptUI > div > div {\n\
background-color: rgba(139,0,139, 0.2);\n\
margin-left: 1px;\n\
border-radius:10px;\n\
pointer-events:all\n\
}\n\
#noobscriptUI {\n\
top: -" + (height + 12) + "px;\n\
transition: 1s;\n\
margin-left:10px;\n\
position:absolute;\n\
padding-left:25px;\n\
margin-top:9px;\n\
padding-top:15px;\n\
width:500px;\n\
height: " + height + "px;\n\
font-family:arial;\n\
left:24%\n\
}\n\
#noobscriptUI:hover{\n\
top:0px\n\
}\n\
#noobscriptUI > div > div {\n\
color:#fff;\n\
padding:7px;\n\
height:19px;\n\
display:inline-block;\n\
background-color: rgba(139,0,139, 0.2)\n\
cursor:pointer;\n\
font-size:20px\n\
}\n\
</style>"
headAppend.appendChild(style);headAppend.appendChild(css);
var contAppend = document.getElementById("gameUiContainer"),menuA = document.createElement("div");
var code = ['<div id="noobscriptUI">\n'];
levels.forEach((items, i) => {
code.push(i === 0 ? '    <div>\n' : '    <div style="margin-top:7px;">\n');
items.forEach((el) => {
code.push('        ' + el.html + '\n');})
code.push('    </div>\n');})
code.push('    <div id="confinfo" style="margin-top:4px; color: white; text-align: center; font-size: 10px; white-space:pre"></div>')
code.push('</div>');
menuA.innerHTML = code.join("");
contAppend.insertBefore(menuA, contAppend.firstChild)
contAppend.appendChild(toast)}
setTimeout(() => {window.makeUI();}, 1000);

playerSkins = 0;cid = UTILS.getUniqueID();localStorage.setItem("cid",cid);upgrInputsToInde



function Troops1() {selUnits = []; units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1 && unit.id%2 === 0) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Soldier') { selUnits.push(unit);return false; } } return true; });selUnitType = "Unit"; }
function Troops2() {selUnits = []; units.forEach((unit) => {if (unit.owner === player.sid && unit.type === 1 && unit.id%2 !== 0) {if (!unit.info) unit.info = getUnitFromPath(unit.uPath);if (unit.info.name === 'Soldier') { selUnits.push(unit);return false; } } return true; });selUnitType = "Unit"; }
addEventListener("keydown", function(a){
a = a.keyCode ? a.keyCode : a.which;
if(a === 49){Troops1()}
if(a === 50){Troops2()}
})




