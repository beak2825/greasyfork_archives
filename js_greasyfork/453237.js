// ==UserScript==
// @name         Tiosoul V1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tô aprendendo algumas coisas no visual não julguem kkkkkkkk, O script tá bom em rpzd e eu uso ele
// @author       ! Tiosoul`rltk#1180
// @match        http://bloble.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloble.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453237/Tiosoul%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/453237/Tiosoul%20V1.meta.js
// ==/UserScript==

//antikick//
function antikick() {setInterval(function(){if(window.socket){window.socket.emit("2",window.camX,window.camY)}},20000)}antikick();
//skin//
enterGame = function() {
socket && unitList && (showMainMenuText(randomLoadingTexts[UTILS.randInt(0, randomLoadingTexts.length - 1)]),
hasStorage && localStorage.setItem("lstnmdbl", userNameInput.value),
mainCanvas.focus(),
grecaptcha.execute("6Ldh8e0UAAAAAFOKBv25wQ87F3EKvBzyasSbqxCE").then(function(a) {
baseATK()
socket.emit("spawn", {
name: userNameInput.value,
skin: 24
}, a)}))}
//tropjooin//
var joinEnabled = true
addEventListener("keydown", function(a){
if(a.keyCode == 226){
    joinEnabled = !joinEnabled
}
})
// Thema //
window.renderPlayer = function(a, d, c, b, g) {b.save();if (a.skin && 0 < a.skin && a.skin <= playerSkins && !skinSprites[a.skin]) {var e = new Image;e.onload = function() {this.readyToDraw = !0;this.onload = null;g == currentSkin && changeSkin(0);};e.src = ".././img/skins/skin_" + (a.skin - 1) + ".png";skinSprites[a.skin] = e;};a.skin && skinSprites[a.skin] && skinSprites[a.skin].readyToDraw ? (e = a.size - b.lineWidth / 4, b.lineWidth /= 2, renderCircle(d, c, a.size, b, !1, !0)) : g || (b.fillStyle = "rgba(255, 255, 255, 0)", renderCircle(d, c, a.size, b));    b.restore();};
function theme(){
darkColor = "#6A5ACD",
backgroundColor = "#000000",
outerColor = "#0A0111",
indicatorColor = "	#8B008B",
turretColor = "#00000090",
bulletColor = "#A8A8A8",
redColor = "#3F47BA",
targetColor = "#b4b4b4",
playerColors = "#f9ff6060 #ff606060 #82ff6060 #607eff60 #60eaff60 #ff60ee60 #e360ff60 #ffaf6060 #a3ff6060 #ff609c60 #60ff8260 #cc60ff60 #c6595960 #404b7f60 #f2d95760 #c5525260 #c5525260 #498e5660 #c4515160 #c3545460 #c8575760 #c8595960 #5b74b660 #cd686860 #5c81bd60 #5bb14660 #d8c96360 #c5525260 #404b7f60 #c5525260 #c5525260 #c5525260 #c5525260 #404b7f60 #498e5660 #498e5660 #dbd24560 #ca514e60 #43427e60".split(" ");
}
theme();
// autobase //
function baseATK(){
setTimeout(function(){ gens();},1000);setTimeout(function(){ gens();},10000);setTimeout(function(){ gens();},20000);setTimeout(function(){ gens();},30000);setTimeout(function(){ gens();},50000);setTimeout(function(){ walls();},60000);setTimeout(function(){ walls();},63000);setTimeout(function(){ micro();},80000);setTimeout(function(){ micro();},95000);setTimeout(function(){ upgens();},100000);setTimeout(function(){ upgens();},130000);setTimeout(function(){ upgens();},155000);setTimeout(function(){ upgens();},160000);setTimeout(function(){ command();},170000);setTimeout(function(){ command();},180000);setTimeout(function(){ greatleadership();},185000);setTimeout(function(){ armory();},190000);setTimeout(function(){ barracks1();},195000);setTimeout(function(){ siege();},230000);setTimeout(function(){ siege();},234000);setTimeout(function(){ barracks2();},235000);setTimeout(function(){ barracks2();},240000);setTimeout(function(){ upbarracks();},250000);setTimeout(function(){ upbarracks();},255000);setTimeout(function(){ upbarracks();},260000);setTimeout(function(){ upbarracks();},270000);setTimeout(function(){ upbarracks();},280000);setTimeout(function(){ sellgens();},310000);setTimeout(function(){ base();},315000);setTimeout(function(){ sellsiege();},340000);setTimeout(function(){ barracks1();},341000);setTimeout(function(){ upbarracks();},342000);setTimeout(function(){ upbarracks();},345000);setTimeout(function(){ upbarracks();},350000);setTimeout(function() {selectsiege();}, 355000);setTimeout(function() {centralizer1();}, 365000);
function gens(){
socket.emit("1", 4.73, 245, 3);socket.emit("1", 5.0025, 245, 3);socket.emit("1", 5.275, 245, 3);socket.emit("1", 5.5475, 245, 3);socket.emit("1", 5.82, 245, 3);socket.emit("1", 6.0925, 245, 3);socket.emit("1", 6.365, 245, 3);socket.emit("1", 6.6375, 245, 3);socket.emit("1", 6.91, 245, 3);socket.emit("1", 7.1825, 245, 3);socket.emit("1", 7.455, 245, 3);socket.emit("1", 7.7275, 245, 3);socket.emit("1", 8.0025, 245, 3);socket.emit("1", 8.275, 245, 3);socket.emit("1", 8.5475, 245, 3);socket.emit("1", 8.82, 245, 3);socket.emit("1", 9.0925, 245, 3);socket.emit("1", 9.3675, 245, 3);socket.emit("1", 9.64, 245, 3);socket.emit("1", 9.9125, 245, 3);socket.emit("1", 10.1875, 245, 3);socket.emit("1", 10.4625, 245, 3);socket.emit("1", 10.7375, 245, 3);socket.emit("1", 5.999, 180, 3);socket.emit("1", 6.275, 130, 3);socket.emit("1", 6.51, 185, 3);socket.emit("1", 6.775, 130, 3);socket.emit("1", 7.05, 185, 3);socket.emit("1", 7.3, 130, 3);socket.emit("1", 8.4, 130, 3);socket.emit("1", 8.675, 185, 3);socket.emit("1", 8.925, 130, 3);socket.emit("1", 9.225, 185, 3);socket.emit("1", 9.5, 130, 3);socket.emit("1", 9.78, 185, 3);socket.emit("1", 10.05, 130, 3);socket.emit("1", 10.325, 185, 3);socket.emit("1", 10.6, 130, 3);socket.emit("1", 4.5889, 186.5, 3);socket.emit("1", 4.81, 130, 3);socket.emit("1", 5.085, 180.5, 3);socket.emit("1", 5.36, 130, 3);socket.emit("1", 5.64, 180, 3);socket.emit("1",-4.70,130,7)
}
function walls(){
socket.emit("1",7.86,311,1);socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);
}
function base(){
socket.emit("1", 1.71, 245.85, 4),socket.emit("1", 1.46, 245.85, 4),socket.emit("1", 1.96, 245.85, 4),socket.emit("1", 1.21, 245.85, 4),socket.emit("1", 2.21, 245.85, 4),socket.emit("1", 0.96, 245.85, 4),socket.emit("1", 2.46, 245.85, 4),socket.emit("1", 0.71, 245.85, 4),socket.emit("1", 0.46, 245.85, 4),socket.emit("1", 2.71, 245.85, 4),socket.emit("1", 2.96, 245.85, 4),socket.emit("1", 0.21, 245.85, 4),socket.emit("1", -3.07, 245.85, 4),socket.emit("1", -0.04, 245.85, 4),socket.emit("1", -0.29, 245.85, 4),socket.emit("1", -2.82, 245.85, 4),socket.emit("1", -2.57, 245.85, 4),socket.emit("1", -0.54, 245.85, 4),socket.emit("1", -2.32, 245.85, 4),socket.emit("1", -0.79, 245.85, 4),socket.emit("1", -2.07, 245.85, 4),socket.emit("1", -1.04, 245.85, 4),socket.emit("1", -1.82, 245.85, 4),socket.emit("1", -1.29, 245.85, 4),socket.emit("1",4.7280,245,4),socket.emit("1", 2.58, 190.7, 4),socket.emit("1", 0.59, 190.45, 4),socket.emit("1", -2.72, 189.71, 4),socket.emit("1", -0.39, 189.71, 4),socket.emit("1", -1.39, 189.09, 4),socket.emit("1", -1.73, 188.48, 4),socket.emit("1", -2.4, 187.66, 4),socket.emit("1", -0.71, 187.46, 4),socket.emit("1", 0.91, 186.12, 4),socket.emit("1", 0.27, 186.2, 4),socket.emit("1", 2.9, 186.15, 4),socket.emit("1", 2.26, 185.87, 4),socket.emit("1", -3.05, 185.31, 4),socket.emit("1", -0.06, 185.8, 4),socket.emit("1", -2.07, 185.43, 4),socket.emit("1", 1.24, 184.2, 4),socket.emit("1", -1.04, 184.09, 4),socket.emit("1", 1.93, 183.65, 4),socket.emit("1",-4.70,130,7),socket.emit("1", 2.11, 130, 4),socket.emit("1", 1.06, 130, 4),socket.emit("1", 2.58, 130, 4),socket.emit("1", 0.59, 130, 4),socket.emit("1", 3.05, 130, 4),socket.emit("1", 0.12, 130, 4),socket.emit("1", -2.76, 130, 4),socket.emit("1", -0.35, 130, 4),socket.emit("1", -0.83, 130, 4),socket.emit("1", -2.29, 130, 4),socket.emit("1", -1.82, 130, 4),socket.emit("1", -1.3, 130, 4)
}
function barracks1(){
socket.emit("1",11.93,311,8);}
function barracks2(){
socket.emit("1",10.07,311,8);
socket.emit("1",10.49,311,8);
socket.emit("1",11.51,311,8);
}
function greatleadership(){
for (var i = 0; i < units.length; ++i) 1 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0);}
function upbarracks(){
for (var i = 0; i < units.length; ++i) 2 == units[i].type && "square" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function micro(){
for (var i = 0; i < units.length; ++i) 3== units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)}
function upgens(){
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function command(){
socket.emit("4",0,0,1)}
function siege(){
for (var i = 0; i < units.length; ++i) 2 == units[i].type && "square" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 2)}
function armory(){
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)}
function sellgens(){
 for (var a = [], d = 0; d < units.length; ++d) {
  if (units[d].type === 0 && units[d].owner == player.sid) {
   var name = getUnitFromPath(units[d].uPath).name;
    (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
}}
socket.emit("3", a)}
function sellsiege(){
 for (var a = [], d = 0; d < units.length; ++d) {
  if (units[d].type === 2 && units[d].owner == player.sid) {
   var name = getUnitFromPath(units[d].uPath).name;
    (name === 'Siege Factory') && a.push(units[d].id)
}}
socket.emit("3", a)}
}
//Funções//
function LAG(){
lag()
lag2()
}
function lag(){var a = player.x + targetDst * MathCOS(targetDir) + camX,d = player.y + targetDst * MathSIN(targetDir) + camY;for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);socket.emit("5", UTILS.roundToOne(a), UTILS.roundToOne(d), e, 0, -1)}
function lag2(){var a = player.x + targetDst * MathCOS(targetDir) + camX,d = player.y + targetDst * MathSIN(targetDir) + camY;for (var e = [], b = 0; b < selUnits.length; ++b) e.push(selUnits[b].id);socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e, 0, -1)}
function House(){socket.emit("1",10.07,311,8);socket.emit("1",10.49,311,8);socket.emit("1",11.51,311,8);socket.emit("1",11.93,311,8);socket.emit("1",7.86,311,1);socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1", 1.71, 245.85, 4),socket.emit("1", 1.46, 245.85, 4),socket.emit("1", 1.96, 245.85, 4),socket.emit("1", 1.21, 245.85, 4),socket.emit("1", 2.21, 245.85, 4),socket.emit("1", 0.96, 245.85, 4),socket.emit("1", 2.46, 245.85, 4),socket.emit("1", 0.71, 245.85, 4),socket.emit("1", 0.46, 245.85, 4),socket.emit("1", 2.71, 245.85, 4),socket.emit("1", 2.96, 245.85, 4),socket.emit("1", 0.21, 245.85, 4),socket.emit("1", -3.07, 245.85, 4),socket.emit("1", -0.04, 245.85, 4),socket.emit("1", -0.29, 245.85, 4),socket.emit("1", -2.82, 245.85, 4),socket.emit("1", -2.57, 245.85, 4),socket.emit("1", -0.54, 245.85, 4),socket.emit("1", -2.32, 245.85, 4),socket.emit("1", -0.79, 245.85, 4),socket.emit("1", -2.07, 245.85, 4),socket.emit("1", -1.04, 245.85, 4),socket.emit("1", -1.82, 245.85, 4),socket.emit("1", -1.29, 245.85, 4),socket.emit("1",4.7280,245,4),socket.emit("1", 2.58, 190.7, 4),socket.emit("1", 0.59, 190.45, 4),socket.emit("1", -2.72, 189.71, 4),socket.emit("1", -0.39, 189.71, 4),socket.emit("1", -1.39, 189.09, 4),socket.emit("1", -1.73, 188.48, 4),socket.emit("1", -2.4, 187.66, 4),socket.emit("1", -0.71, 187.46, 4),socket.emit("1", 0.91, 186.12, 4),socket.emit("1", 0.27, 186.2, 4),socket.emit("1", 2.9, 186.15, 4),socket.emit("1", 2.26, 185.87, 4),socket.emit("1", -3.05, 185.31, 4),socket.emit("1", -0.06, 185.8, 4),socket.emit("1", -2.07, 185.43, 4),socket.emit("1", 1.24, 184.2, 4),socket.emit("1", -1.04, 184.09, 4),socket.emit("1", 1.93, 183.65, 4),socket.emit("1",-4.70,130,7),socket.emit("1", 2.11, 130, 4),socket.emit("1", 1.06, 130, 4),socket.emit("1", 2.58, 130, 4),socket.emit("1", 0.59, 130, 4),socket.emit("1", 3.05, 130, 4),socket.emit("1", 0.12, 130, 4),socket.emit("1", -2.76, 130, 4),socket.emit("1", -0.35, 130, 4),socket.emit("1", -0.83, 130, 4),socket.emit("1", -2.29, 130, 4),socket.emit("1", -1.82, 130, 4),socket.emit("1", -1.3, 130, 4)}
function DefHouse(){socket.emit("1",10.07,311,1);socket.emit("1",10.49,311,1);socket.emit("1",11.51,311,1);socket.emit("1",11.93,311,1);socket.emit("1",7.86,311,1);socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1", 1.71, 245.85, 1),socket.emit("1", 1.46, 245.85, 1),socket.emit("1", 1.96, 245.85, 1),socket.emit("1", 1.21, 245.85, 1),socket.emit("1", 2.21, 245.85, 1),socket.emit("1", 0.96, 245.85, 1),socket.emit("1", 2.46, 245.85, 1),socket.emit("1", 0.71, 245.85, 1),socket.emit("1", 0.46, 245.85, 1),socket.emit("1", 2.71, 245.85, 1),socket.emit("1", 2.96, 245.85, 1),socket.emit("1", 0.21, 245.85, 1),socket.emit("1", -3.07, 245.85, 1),socket.emit("1", -0.04, 245.85, 1),socket.emit("1", -0.29, 245.85, 1),socket.emit("1", -2.82, 245.85, 1),socket.emit("1", -2.57, 245.85, 1),socket.emit("1", -0.54, 245.85, 1),socket.emit("1", -2.32, 245.85, 1),socket.emit("1", -0.79, 245.85, 1),socket.emit("1", -2.07, 245.85, 1),socket.emit("1", -1.04, 245.85, 1),socket.emit("1", -1.82, 245.85, 1),socket.emit("1", -1.29, 245.85, 1),socket.emit("1",4.7280,245,1),socket.emit("1", 2.58, 190.7, 1),socket.emit("1", 0.59, 190.45, 1),socket.emit("1", -2.72, 189.71, 1),socket.emit("1", -0.39, 189.71, 1),socket.emit("1", -1.39, 189.09, 1),socket.emit("1", -1.73, 188.48, 1),socket.emit("1", -2.4, 187.66, 1),socket.emit("1", -0.71, 187.46, 1),socket.emit("1", 0.91, 186.12, 1),socket.emit("1", 0.27, 186.2, 1),socket.emit("1", 2.9, 186.15, 1),socket.emit("1", 2.26, 185.87, 1),socket.emit("1", -3.05, 185.31, 1),socket.emit("1", -0.06, 185.8, 1),socket.emit("1", -2.07, 185.43, 1),socket.emit("1", 1.24, 184.2, 1),socket.emit("1", -1.04, 184.09, 1),socket.emit("1", 1.93, 183.65, 1),socket.emit("1",-4.70,140,1),socket.emit("1", 2.11, 130, 1),socket.emit("1", 1.06, 130, 1),socket.emit("1", 2.58, 130, 1),socket.emit("1", 0.59, 130, 1),socket.emit("1", 3.05, 130, 1),socket.emit("1", 0.12, 130, 1),socket.emit("1", -2.76, 130, 1),socket.emit("1", -0.35, 130, 1),socket.emit("1", -0.83, 130, 1),socket.emit("1", -2.29, 130, 1),socket.emit("1", -1.82, 130, 1),socket.emit("1", -1.3, 130, 1)
}
function remontar(){
setTimeout(function() {vender();}, 20);setTimeout(function() {reconstruir();}, 30);}
function vender() {for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)};
function reconstruir() {socket.emit("1",10.07,311,8);socket.emit("1",10.49,311,8);socket.emit("1",11.51,311,8);socket.emit("1",11.93,311,8);socket.emit("1",7.86,311,1);socket.emit("1",8.06,311,1);socket.emit("1",8.26,311,1);socket.emit("1",8.46,311,1);socket.emit("1",8.66,311,1);socket.emit("1",8.86,311,1);socket.emit("1",9.06,311,1);socket.emit("1",9.26,311,1);socket.emit("1",9.46,311,1);socket.emit("1",9.66,311,1);socket.emit("1",9.86,311,1);socket.emit("1",10.28,311,1);socket.emit("1",10.70,311,1);socket.emit("1",10.90,311,1);socket.emit("1",11.10,311,1);socket.emit("1",11.30,311,1);socket.emit("1",11.72,311,1);socket.emit("1",12.14,311,1);socket.emit("1",12.34,311,1);socket.emit("1",12.54,311,1);socket.emit("1",12.74,311,1);socket.emit("1",12.94,311,1);socket.emit("1",13.14,311,1);socket.emit("1",13.34,311,1);socket.emit("1",13.54,311,1);socket.emit("1",13.74,311,1);socket.emit("1",13.94,311,1);socket.emit("1", 1.71, 245.85, 4),socket.emit("1", 1.46, 245.85, 4),socket.emit("1", 1.96, 245.85, 4),socket.emit("1", 1.21, 245.85, 4),socket.emit("1", 2.21, 245.85, 4),socket.emit("1", 0.96, 245.85, 4),socket.emit("1", 2.46, 245.85, 4),socket.emit("1", 0.71, 245.85, 4),socket.emit("1", 0.46, 245.85, 4),socket.emit("1", 2.71, 245.85, 4),socket.emit("1", 2.96, 245.85, 4),socket.emit("1", 0.21, 245.85, 4),socket.emit("1", -3.07, 245.85, 4),socket.emit("1", -0.04, 245.85, 4),socket.emit("1", -0.29, 245.85, 4),socket.emit("1", -2.82, 245.85, 4),socket.emit("1", -2.57, 245.85, 4),socket.emit("1", -0.54, 245.85, 4),socket.emit("1", -2.32, 245.85, 4),socket.emit("1", -0.79, 245.85, 4),socket.emit("1", -2.07, 245.85, 4),socket.emit("1", -1.04, 245.85, 4),socket.emit("1", -1.82, 245.85, 4),socket.emit("1", -1.29, 245.85, 4),socket.emit("1",4.7280,245,4),socket.emit("1", 2.58, 190.7, 4),socket.emit("1", 0.59, 190.45, 4),socket.emit("1", -2.72, 189.71, 4),socket.emit("1", -0.39, 189.71, 4),socket.emit("1", -1.39, 189.09, 4),socket.emit("1", -1.73, 188.48, 4),socket.emit("1", -2.4, 187.66, 4),socket.emit("1", -0.71, 187.46, 4),socket.emit("1", 0.91, 186.12, 4),socket.emit("1", 0.27, 186.2, 4),socket.emit("1", 2.9, 186.15, 4),socket.emit("1", 2.26, 185.87, 4),socket.emit("1", -3.05, 185.31, 4),socket.emit("1", -0.06, 185.8, 4),socket.emit("1", -2.07, 185.43, 4),socket.emit("1", 1.24, 184.2, 4),socket.emit("1", -1.04, 184.09, 4),socket.emit("1", 1.93, 183.65, 4),socket.emit("1",-4.70,130,7),socket.emit("1", 2.11, 130, 4),socket.emit("1", 1.06, 130, 4),socket.emit("1", 2.58, 130, 4),socket.emit("1", 0.59, 130, 4),socket.emit("1", 3.05, 130, 4),socket.emit("1", 0.12, 130, 4),socket.emit("1", -2.76, 130, 4),socket.emit("1", -0.35, 130, 4),socket.emit("1", -0.83, 130, 4),socket.emit("1", -2.29, 130, 4),socket.emit("1", -1.82, 130, 4),socket.emit("1", -1.3, 130, 4)
                       }
function micro(){
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
function sellwall(){
for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);socket.emit("3", a)
}
function gens(){
socket.emit("1", 4.73, 245, 3); socket.emit("1", 5.0025, 245, 3); socket.emit("1", 5.275, 245, 3); socket.emit("1", 5.5475, 245, 3); socket.emit("1", 5.82, 245, 3); socket.emit("1", 6.0925, 245, 3); socket.emit("1", 6.365, 245, 3); socket.emit("1", 6.6375, 245, 3); socket.emit("1", 6.91, 245, 3); socket.emit("1", 7.1825, 245, 3); socket.emit("1", 7.455, 245, 3); socket.emit("1", 7.7275, 245, 3); socket.emit("1", 8.0025, 245, 3); socket.emit("1", 8.275, 245, 3); socket.emit("1", 8.5475, 245, 3); socket.emit("1", 8.82, 245, 3); socket.emit("1", 9.0925, 245, 3); socket.emit("1", 9.3675, 245, 3); socket.emit("1", 9.64, 245, 3); socket.emit("1", 9.9125, 245, 3); socket.emit("1", 10.1875, 245, 3); socket.emit("1", 10.4625, 245, 3); socket.emit("1", 10.7375, 245, 3); socket.emit("1", 5.999, 180, 3); socket.emit("1", 6.275, 130, 3); socket.emit("1", 6.51, 185, 3); socket.emit("1", 6.775, 130, 3); socket.emit("1", 7.05, 185, 3); socket.emit("1", 7.3, 130, 3); socket.emit("1", 7.6, 185, 3); socket.emit("1", 7.85, 130, 3); socket.emit("1", 8.15, 185, 3); socket.emit("1", 8.4, 130, 3); socket.emit("1", 8.675, 185, 3); socket.emit("1", 8.925, 130, 3); socket.emit("1", 9.225, 185, 3); socket.emit("1", 9.5, 130, 3); socket.emit("1", 9.78, 185, 3); socket.emit("1", 10.05, 130, 3); socket.emit("1", 10.325, 185, 3); socket.emit("1", 10.6, 130, 3); socket.emit("1", 4.5889, 186.5, 3); socket.emit("1", 4.81, 130, 3); socket.emit("1", 5.085, 180.5, 3); socket.emit("1", 5.36, 130, 3); socket.emit("1", 5.64, 180, 3);
}
function defgens(){
socket.emit('1',-1.0622001258342575,243.84353179856956,1);socket.emit('1',1.0441830715523195,243.84792330466954,1);socket.emit('1',0.780903485821051,243.84823661449764,1);socket.emit('1',0.5175743723300564,243.84886835907193,1);socket.emit('1',0.25427836120664293,243.8510112753277,1);socket.emit('1',-0.00902206491167247,243.8499243387211,1);socket.emit('1',-0.27228367750613924,243.85375391820403,1);socket.emit('1',-0.5356018704187981,243.8480930825583,1);socket.emit('1',-0.7988822517151568,243.85379984736753,1);socket.emit('1',-0.9305375326299632,132.00469385593826,1);socket.emit('1',-0.6672207553366907,183.9997586954939,1);socket.emit('1',-0.403916953210808,132.00241967479243,1);socket.emit('1',-0.14062884883543125,183.99640349745965,1);socket.emit('1',0.12272942279962962,132.00290034692418,1);socket.emit('1',0.3859865208712111,183.99713177112304,1);socket.emit('1',0.6492890106455586,132.00021098467997,1);socket.emit('1',0.8965724125464973,184.2569523790079,1);socket.emit('1',-1.5707963267948966,140,1);socket.emit('1',1.5707963267948966,243.85,1);socket.emit('1',-1.5707963267948966,212.1,1);socket.emit('1',1.3074863342117489,243.85475882172156,1);socket.emit('1',-1.325489442637866,243.85018125890332,1);socket.emit('1',-1.1938323121943286,183.99923722667984,1);socket.emit('1',1.1392033572365667,132.00476658060498,1);socket.emit('1',1.394099029458639,182.5016219106011,1);socket.emit('1',1.8341063193780445,243.85475882172156,1);socket.emit('1',2.097409582037474,243.84792330466954,1);socket.emit('1',-2.0793925277555356,243.84353179856956,1);socket.emit('1',-1.8161032109519273,243.85018125890332,1);socket.emit('1',-1.9477603413954647,183.99923722667984,1);socket.emit('1',-2.21105512095983,132.00469385593826,1);socket.emit('1',-2.7376757003789853,132.00241967479243,1);socket.emit('1',2.4923036429442345,132.00021098467997,1);socket.emit('1',2.245020241043296,184.2569523790079,1);socket.emit('1',2.0023892963532264,132.00476658060498,1);socket.emit('1',1.7474936241311543,182.5016219106011,1);socket.emit('1',2.3606891677687423,243.84823661449764,1);socket.emit('1',-2.3427104018746365,243.85379984736753,1);socket.emit('1',-2.4743718982531027,183.9997586954939,1);socket.emit('1',2.755606132718582,183.99713177112304,1);socket.emit('1',-3.000963804754362,183.99640349745977,1);socket.emit('1',3.0188632307901635,132.00290034692418,1);socket.emit('1',2.624018281259737,243.84886835907201,1);socket.emit('1',2.8873142923831505,243.8510112753277,1);socket.emit('1',-3.1325705886781208,243.849924338721,1);socket.emit('1',-2.869308976083654,243.8537539182039,1);socket.emit('1',-2.605990783170995,243.8480930825583,1);
}
function upbase(){
for (var i = 0; i < units.length; ++i) 0 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 0)
for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
}
function centralizador(){
if(player.x==null){player.x==0};if(player.y==null){player.y==0};for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
}
window.addEventListener("keydown", function(a) {
    a = a.keyCode ? a.keyCode : a.which;

       if (a === 69) {//Commander e soldiers
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); unit.info.name !== 'Siege Ram' && selUnits.push(unit)  } });  selUnitType = "Unit";

} else if (a === 67) {//Commander
     selUnits = []; units.every((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Commander') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit";

} else if (a === 81) {//Soldier
     selUnits = []; units.forEach((unit) => { if (unit.owner === player.sid && unit.type === 1) { if (!unit.info) unit.info = getUnitFromPath(unit.uPath); if (unit.info.name === 'Soldier') { selUnits.push(unit); return false; } } return true; }); selUnitType = "Unit"; }
});
addEventListener("keydown", function(a){
if (a.keyCode == 67) {//Commander
socket.emit("4",0,0,1);
}})

//Teclas//
addEventListener("keydown", function(a){
a = a.keyCode ? a.keyCode : a.which;
if(a == 17){LAG();}
if(a == 90){House();}
if(a == 88){DefHouse();}
if(a == 51){remontar();}
if(a == 52){micro();}
if(a == 53){sellwall();}
if(a == 120){gens();}
if(a == 121){defgens();}
if(a == 118){upbase();}
if(a == 45){baseATK();}
if(a == 191){centralizador();}
})
//Resolução//
cameraSpd *=1.5
var resolution = 1;
var rate = 0;
window.removeEventListener("mousemove", gameInput);
window.gameInput = function (a) {
a.preventDefault();
a.stopPropagation();
mouseX = a.clientX * resolution;
mouseY = a.clientY * resolution;
};
window.addEventListener("mousemove", gameInput, false);
window.removeEventListener("resize", resize);
window.resize = function (n) {
screenWidth = window.innerWidth * resolution;
screenHeight = window.innerHeight * resolution;
scaleFillNative = MathMAX(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight);
if (n !== true) {
mainCanvas.width = screenWidth;
mainCanvas.height = screenHeight;
mainCanvas.style.width = (screenWidth / resolution) + "px";
mainCanvas.style.height = (screenHeight / resolution) + "px";
};

mainContext.setTransform(scaleFillNative, 0, 0, scaleFillNative, Math.floor((screenWidth - maxScreenWidth * scaleFillNative) / 2), Math.floor((screenHeight - maxScreenHeight * scaleFillNative) / 2));
player || renderBackground();
};
window.setRes = function () {
var el = document.getElementById('res');
if (resolution === 1) {
    resolution = .1;
    el.textContent = 'Res(.1)';
} else if (resolution === .1) {
    resolution = .2;
    el.textContent = 'Res(.2)';
} else if (resolution === .2) {
    resolution = .3;
    el.textContent = 'Res(.3)';
} else if (resolution === .3) {
    resolution = .4;
    el.textContent = 'Res(.4)';
} else if (resolution === .4) {
    resolution = .5;
    el.textContent = 'Res(.5)';
} else if (resolution === .5) {
    resolution = .6;
    el.textContent = 'Res(.6)';
} else if (resolution === .6) {
    resolution = .7;
    el.textContent = 'Res(.7)';
} else if (resolution === .7) {
    resolution = .8;
    el.textContent = 'Res(.8)';
} else if (resolution === .8) {
    resolution = .9;
    el.textContent = 'Res(.9)';
} else if (resolution === .9) {
    resolution = 1;
    el.textContent = 'Res(1)';
}

    unitSprites = {};
resize();
window.statusBar();
};
//FPS//
window.setFPS = function () {
var el = document.getElementById('fps');
if (rate === 0) {
    el.textContent = 'Anti-Lag';
    rate = 60
} else {
    el.textContent = 'Normal';
    rate = 0;
}
unitSprites = {};
resize();
window.statusBar();
};
// Bot //
window.Bot=function(){
   var bots = prompt("quantidade de bot")
   for (let i = 0; i < bots; i++) {
   window.open("http://bloble.io/?l="+partyKey)
}}
//Sieg//
window.centro=function(){
if(player.x==null){player.x==0};if(player.y==null){player.y==0};for (var e = [], b = 0; b < Math.floor(selUnits.length-0); ++b) e.push(selUnits[b].id);socket.emit("5", (player.x)*1, (player.y)*1, e, 0, -1);
}
window.sellhouse=function(){
for (var a = [], d = 0; d < units.length; ++d) units[d].type === 0 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'House' && a.push(units[d].id);socket.emit("3", a);
}
window.Sellgens=function(){
for (var a = [], d = 0; d < units.length; ++d) {if (units[d].type === 0 && units[d].owner == player.sid) {var name = getUnitFromPath(units[d].uPath).name;(name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)}}socket.emit("3", a)
}
//great//
window.Great=function(){
for(i=0;i<units.length;++i){ if(2==units[i].type&&"square"==units[i].shape&&units[i].owner==player.sid){ socket.emit("4",units[i].id,0);}}
}
// Hotbar //
window.UIList = window.UIList || [];
window.initFuncs = window.initFuncs || [];
window.statusItems = window.statusItems || [];
window.UIList.push({
level:0,x:1,html:'<div id="res" onclick=setRes()>Resolução(1)</div>'},{
level:0,x:2,html:'<div id="fps" onclick=setFPS()>Normal</div>'},{
level:0,x:3,html:'<div onclick=Bot()>BotGuia</div>'},{
level:0,x:4,html:'<div onclick=centro()>Siege</div>'},{
level:0,x:5,html:'<div onclick=sellhouse()>SellHouse</div>'},{
level:1,x:1,html:'<div onclick=Great()>Barracks</div>'},{
level:1,x:2,html:'<div onclick=Power()>PowerPlant</div>'},{
level:1,x:3,html:'<div onclick=anti()>AntiTank</div>'},{
level:1,x:4,html:'<div onclick=Micro()>Micro</div>'},{
level:1,x:5,html:'<div onclick=Sellgens()>SellGens</div>'},{
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

// Propag //
document.getElementById("gameTitle").innerHTML = "Tiosoul V1";
document.getElementById("smallAdContainer").innerHTML = '';
document.getElementById("adContainer").innerHTML = '';
document.getElementById("youtubeContainer").innerHTML = '';
document.getElementById("youtuberOf").innerHTML = '';
document.getElementById("lobbyKey").innerHTML = "";
// setup //
function renderUnit(a,d,c,b,g,e,k){
var f=b.size*(k?iconSizeMult:1),h=f+":"+b.cloak+":"+b.renderIndex+":"+b.iSize+":"+b.turretIndex+":"+b.shape+":"+g;
if(!unitSprites[h]){var m=document.createElement("canvas"),l=m.getContext("2d");
m.width=2*f+30;m.height=m.width;m.style.width=m.width+"px";
m.style.height=m.height+"px";l.translate(m.width/2,m.height/2);
l.lineWidth=outlineWidth*(k?.9:1.2);l.strokeStyle=darkColor;
l.fillStyle=g;
4==b.renderIndex?l.fillStyle=turretColor:5==b.renderIndex&&(l.fillStyle=turretColor,renderRect(0,.76*f,1.3*f,f/2.4,l),l.fillStyle=g);b.cloak&&(l.fillStyle=backgroundColor);
"circle"==b.shape?(renderCircle(0,0,f,l),
b.iSize&&(l.fillStyle=turretColor,renderCircle(0,0,f*b.iSize,l))):"triangle"==b.shape?(renderTriangle(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderTriangle(0,2,f*b.iSize,l))):"hexagon"==b.shape?(renderAgon(0,0,f,l,6),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,f*b.iSize,l,6))):"octagon"==b.shape?(l.rotate(MathPI/8),renderAgon(0,0,.96*f,l,8),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,.96*f*b.iSize,l,8))):"pentagon"==b.shape?(l.rotate(-MathPI/2),renderAgon(0,0,1.065*f,l,5),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,1.065*f*b.iSize,l,5))):"square"==b.shape?(renderSquare(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderSquare(0,0,f*b.iSize,l))):"spike"==b.shape?renderStar(0,0,f,.7*f,l,8):"star"==b.shape&&(f*=1.2,renderStar(0,0,f,.7*f,l,6));
if(1==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.8,0,f/4,f/1,l),renderRect(-f/2.8,0,f/4,f/1,l);
else if(2==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(f/2.5,-f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,-f/2.5,f/2.5,f/2.5,l);
else if(3==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.75*f,f/2.85,3,l),renderCircle(0,0,.5*f,l),l.fillStyle=g;
else if(6==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.7*f,f/4,5,l),l.rotate(-MathPI/2),renderAgon(0,0,.4*f,l,6);
else if(7==b.renderIndex)for(g=0;3>g;++g)l.fillStyle=g?1==g?"#006e1a00":"#006e1a00":"#006e1a00",renderStar(0, 0, f, .8 * f, l, 15),f *= .70;
else 8==b.renderIndex&&(l.fillStyle=turretColor,renderRectCircle(0,0,.75*f,f/2.85,3,l),renderSquare(0,0,.5*f,l));1!=b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,-(MathPI/2),l);
unitSprites[h]=m}f=unitSprites[h];e.save();e.translate(a,d);e.rotate(c+MathPI/2);
e.drawImage(f,-(f.width/2),-(f.height/2),f.width,f.height);
1==b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,b.turRot-MathPI/2-c,e);e.restore()};
renderText=function(a, d) { var c = document.createElement("canvas") , b = c.getContext("2d"); b.font = d + "px regularF"; var g = b.measureText(a); c.width = g.width + 20; c.height = 2 * d; b.translate(c.width / 2, c.height / 2); b.font = d +"px regularF"; b.fillStyle = "#000"; b.textBaseline = "middle"; b.textAlign = "center"; b.strokeStyle = darkColor; b.lineWidth = outlineWidth; b.strokeText(a, 0, 0); b.fillText(a, 0, 0); return c }

upgradeUnit=function(a){socket&&gameState&&(1==selUnits.length?socket.emit("4",selUnits[0].id,a):(activeBase)?(a==0&&activeBase.sid==player.sid?(socket.emit("4",0,a,1)):(handleActiveBaseUpgrade(activeBase.sid,activeBase.upgrades[a].name))):(upgradeSelUnits(selUnits[0],a)))}

window.toggleUnitInfo=function(a,d){var c="";a&&a.uPath&&(c=void 0!=a.group?a.group:a.uPath[0],c=unitList[c].limit?(unitList[c].count||0)+"/"+unitList[c].limit:"");if(a&&(forceUnitInfoUpdate||"block"!=unitInfoContainer.style.display||unitInfoName.innerHTML!=(a.iName||a.name)||lastCount!=c)){forceUnitInfoUpdate=!1;unitInfoContainer.style.display="block";unitInfoName.innerHTML=a.iName||a.name;a.cost?(unitInfoCost.innerHTML="Cost "+a.cost,unitInfoCost.style.display="block"):unitInfoCost.style.display="none";
unitInfoDesc.innerHTML=a.desc;unitInfoType.innerHTML=a.typeName;var b=a.space;lastCount=c;c='<span style="color:#fff">'+c+"</span>";unitInfoLimit.innerHTML=b?'<span><i class="material-icons" style="vertical-align: top; font-size: 20px;">&#xE7FD;</i>'+b+"</span> "+c:c;unitInfoUpgrades.innerHTML="";if(d&&a.upgrades){for(var g,e,h,f,k,c=0;c<a.upgrades.length;++c)(function(b){g=a.upgrades[b];var c=!0;g.lockMaxBuy&&void 0!=g.unitSpawn&&(unitList[g.unitSpawn].count||0)>=(unitList[g.unitSpawn].limit||0)?
c=!1:g.dontShow&&(c=!1);c&&(e=document.createElement("div"),e.className="upgradeInfo",h=document.createElement("div"),h.className="unitInfoName",h.innerHTML=g.name,e.appendChild(h),f=document.createElement("div"),f.className="unitInfoCost",g.cost?(f.innerHTML="Cost "+g.cost,e.appendChild(f)):(null),k=document.createElement("div"),k.id="upgrDesc"+b,k.className="unitInfoDesc",k.innerHTML=g.desc,k.style.display="none",e.appendChild(k),e.onmouseover=function(){document.getElementById("upgrDesc"+b).style.display="block"},
e.onmouseout=function(){document.getElementById("upgrDesc"+b).style.display="none"},e.onclick=function(){upgradeUnit(b);mainCanvas.focus()},unitInfoUpgrades.appendChild(e))})(c);g=e=h=f=k=null}}else a||(unitInfoContainer.style.display="none")}

updateGameLoop=function(a){if(player&&gameData){updateTarget();if(gameState&&mapBounds){if(camXS||camYS)camX+=camXS*cameraSpd*a,camY+=camYS*cameraSpd*a;player.x+camX<mapBounds[0]?camX=mapBounds[0]-player.x:player.x+camX>mapBounds[0]+mapBounds[2]&&(camX=mapBounds[0]+mapBounds[2]-player.x);player.y+camY<mapBounds[1]?camY=mapBounds[1]-player.y:player.y+camY>mapBounds[1]+mapBounds[3]&&(camY=mapBounds[1]+mapBounds[3]-player.y);
currentTime-lastCamSend>=sendFrequency&&(lastCamX!=camX||lastCamY!=camY)&&(lastCamX=camX,lastCamY=camY,lastCamSend=currentTime,socket.emit("2",Math.round(camX),Math.round(camY)))}renderBackground(outerColor);var d=(player.x||0)-maxScreenWidth/2+camX,c=(player.y||0)-maxScreenHeight/2+camY;mapBounds&&(mainContext.fillStyle=backgroundColor,mainContext.fillRect(mapBounds[0]-d,mapBounds[1]-c,mapBounds[2],mapBounds[3]));for(var b,g,e=0;e<units.length;++e)b=units[e],b.interpDst&&(g=b.interpDst*a*.015,b.interX+=
g*MathCOS(b.interpDir),b.interY+=g*MathSIN(b.interpDir),b.interpDst-=g,.1>=b.interpDst&&(b.interpDst=0,b.interX=b.interpDstS*MathCOS(b.interpDir),b.interY=b.interpDstS*MathSIN(b.interpDir))),b.speed&&(updateUnitPosition(b),b.x+=b.interX||0,b.y+=b.interY||0);var h,f;if(gameState)if(activeUnit){h=player.x-d+targetDst*MathCOS(targetDir)+camX;f=player.y-c+targetDst*MathSIN(targetDir)+camY;var k=UTILS.getDirection(h,f,player.x-d,player.y-c);0==activeUnit.type?(b=UTILS.getDistance(h,f,player.x-d,player.y-
c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange-.15&&(h=player.x-d+(player.buildRange-activeUnit.size-.15)*MathCOS(k),f=player.y-c+(player.buildRange-activeUnit.size-.15)*MathSIN(k))):1==activeUnit.type||2==activeUnit.type?(h=player.x-d+(activeUnit.size+player.buildRange)*MathCOS(k),f=player.y-c+(activeUnit.size+player.buildRange)*MathSIN(k)):3==activeUnit.type&&
(b=UTILS.getDistance(h,f,player.x-d,player.y-c),b-activeUnit.size<player.startSize?(h=player.x-d+(activeUnit.size+player.startSize)*MathCOS(k),f=player.y-c+(activeUnit.size+player.startSize)*MathSIN(k)):b+activeUnit.size>player.buildRange+2*activeUnit.size&&(h=player.x-d+(player.buildRange+activeUnit.size)*MathCOS(k),f=player.y-c+(player.buildRange+activeUnit.size)*MathSIN(k)));activeUnitDir=k;activeUnitDst=UTILS.getDistance(h,f,player.x-d,player.y-c);activeUnit.dontPlace=!1;mainContext.fillStyle=
outerColor;if(0==activeUnit.type||2==activeUnit.type||3==activeUnit.type)for(e=0;e<units.length;++e)if(1!=units[e].type&&units[e].owner==player.sid&&0<=activeUnit.size+units[e].size-UTILS.getDistance(h,f,units[e].x-d,units[e].y-c)){mainContext.fillStyle=redColor;activeUnit.dontPlace=!0;break}renderCircle(h,f,activeUnit.range?activeUnit.range:activeUnit.size+30,mainContext,!0)}else if(selUnits.length)for(e=0;e<selUnits.length;++e)mainContext.fillStyle=outerColor,1<selUnits.length?renderCircle(selUnits[e].x-
d,selUnits[e].y-c,selUnits[e].size+25,mainContext,!0):renderCircle(selUnits[e].x-d,selUnits[e].y-c,selUnits[e].range?selUnits[e].range:selUnits[e].size+25,mainContext,!0);else activeBase&&(mainContext.fillStyle=outerColor,renderCircle(activeBase.x-d,activeBase.y-c,activeBase.size+50,mainContext,!0));if(selUnits.length)for(mainContext.strokeStyle=targetColor,e=0;e<selUnits.length;++e)selUnits[e].gatherPoint&&renderDottedCircle(selUnits[e].gatherPoint[0]-d,selUnits[e].gatherPoint[1]-c,30,mainContext);
for(e=0;e<users.length;++e)if(b=users[e],!b.dead){mainContext.lineWidth=1.2*outlineWidth;mainContext.strokeStyle=indicatorColor;isOnScreen(b.x-d,b.y-c,b.buildRange)&&(mainContext.save(),mainContext.translate(b.x-d,b.y-c),mainContext.rotate(playerBorderRot),renderDottedCircle(0,0,b.buildRange,mainContext),renderDottedCircle(0,0,b.startSize,mainContext),mainContext.restore());b.spawnProt&&(mainContext.strokeStyle=redColor,mainContext.save(),mainContext.translate(b.x-d,b.y-c),mainContext.rotate(playerBorderRot),
renderDottedCircle(0,0,b.buildRange+140,mainContext),mainContext.restore());for(var m=0;m<users.length;++m)e<m&&!users[m].dead&&(mainContext.strokeStyle=b.spawnProt||users[m].spawnProt?redColor:indicatorColor,playersLinked(b,users[m])&&(isOnScreen(b.x-d,b.y-c,0)||isOnScreen(users[m].x-d,users[m].y-c,0)||isOnScreen((b.x+users[m].x)/2-d,(b.y+users[m].y)/2-c,0))&&(g=UTILS.getDirection(b.x,b.y,users[m].x,users[m].y),renderDottedLine(b.x-(b.buildRange+lanePad+(b.spawnProt?140:0))*MathCOS(g)-d,b.y-(b.buildRange+
lanePad+(b.spawnProt?140:0))*MathSIN(g)-c,users[m].x+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathCOS(g)-d,users[m].y+(users[m].buildRange+lanePad+(users[m].spawnProt?140:0))*MathSIN(g)-c,mainContext)))}mainContext.strokeStyle=darkColor;mainContext.lineWidth=1.2*outlineWidth;for(e=0;e<units.length;++e)b=units[e],b.layer||(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));for(e=0;e<units.length;++e)b=units[e],
1==b.layer&&(b.onScreen=!1,isOnScreen(b.x-d,b.y-c,b.size)&&(b.onScreen=!0,renderUnit(b.x-d,b.y-c,b.dir,b,playerColors[b.color],mainContext)));mainContext.fillStyle=bulletColor;for(e=bullets.length-1;0<=e;--e){b=bullets[e];if(b.speed&&(b.x+=b.speed*a*MathCOS(b.dir),b.y+=b.speed*a*MathSIN(b.dir),UTILS.getDistance(b.sX,b.sY,b.x,b.y)>=b.range)){bullets.splice(e,1);continue}isOnScreen(b.x-d,b.y-c,b.size)&&renderCircle(b.x-d,b.y-c,b.size,mainContext)}mainContext.strokeStyle=darkColor;mainContext.lineWidth=
1.2*outlineWidth;for(e=0;e<users.length;++e)b=users[e],!b.dead&&isOnScreen(b.x-d,b.y-c,b.size)&&(renderPlayer(b,b.x-d,b.y-c,mainContext),"unknown"!=b.name&&(tmpIndx=b.name+"-"+b.size,20<=b.size&&b.nameSpriteIndx!=tmpIndx&&(b.nameSpriteIndx=tmpIndx,b.nameSprite=renderText(b.name,b.size/4)),b.nameSprite&&mainContext.drawImage(b.nameSprite,b.x-d-b.nameSprite.width/2,b.y-c-b.nameSprite.height/2,b.nameSprite.width,b.nameSprite.height)));if(selUnits.length)for(e=selUnits.length-1;0<=e;--e)selUnits[e]&&
0>units.indexOf(selUnits[e])&&disableSelUnit(e);activeUnit&&renderUnit(h,f,k,activeUnit,playerColors[player.color],mainContext);showSelector&&(mainContext.fillStyle="rgba(255, 255, 255, 0.1)",h=player.x-d+targetDst*MathCOS(targetDir)+camX,f=player.y-c+targetDst*MathSIN(targetDir)+camY,mainContext.fillRect(mouseStartX,mouseStartY,h-mouseStartX,f-mouseStartY));playerBorderRot+=a/5600;hoverUnit?toggleUnitInfo(hoverUnit):activeBase?toggleUnitInfo(activeBase,true):activeUnit?toggleUnitInfo(activeUnit):
0<selUnits.length?toggleUnitInfo(selUnits[0].info,!0):toggleUnitInfo()}};

function renderUnit(a,d,c,b,g,e,k){
var f=b.size*(k?iconSizeMult:1),h=f+":"+b.cloak+":"+b.renderIndex+":"+b.iSize+":"+b.turretIndex+":"+b.shape+":"+g;
if(!unitSprites[h]){var m=document.createElement("canvas"),l=m.getContext("2d");
m.width=2*f+30;m.height=m.width;m.style.width=m.width+"px";
m.style.height=m.height+"px";l.translate(m.width/2,m.height/2);
l.lineWidth=outlineWidth*(k?.9:1.2);l.strokeStyle=darkColor;
l.fillStyle=g;
4==b.renderIndex?l.fillStyle=turretColor:5==b.renderIndex&&(l.fillStyle=turretColor,renderRect(0,.76*f,1.3*f,f/2.4,l),l.fillStyle=g);b.cloak&&(l.fillStyle=backgroundColor);
"circle"==b.shape?(renderCircle(0,0,f,l),
b.iSize&&(l.fillStyle=turretColor,renderCircle(0,0,f*b.iSize,l))):"triangle"==b.shape?(renderTriangle(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderTriangle(0,2,f*b.iSize,l))):"hexagon"==b.shape?(renderAgon(0,0,f,l,6),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,f*b.iSize,l,6))):"octagon"==b.shape?(l.rotate(MathPI/8),renderAgon(0,0,.96*f,l,8),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,.96*f*b.iSize,l,8))):"pentagon"==b.shape?(l.rotate(-MathPI/2),renderAgon(0,0,1.065*f,l,5),b.iSize&&(l.fillStyle=turretColor,renderAgon(0,0,1.065*f*b.iSize,l,5))):"square"==b.shape?(renderSquare(0,0,f,l),b.iSize&&(l.fillStyle=turretColor,renderSquare(0,0,f*b.iSize,l))):"spike"==b.shape?renderStar(0,0,f,.7*f,l,8):"star"==b.shape&&(f*=1.2,renderStar(0,0,f,.7*f,l,6));
if(1==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.8,0,f/4,f/1,l),renderRect(-f/2.8,0,f/4,f/1,l);
else if(2==b.renderIndex)l.fillStyle=turretColor,renderRect(f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,f/2.5,f/2.5,f/2.5,l),renderRect(f/2.5,-f/2.5,f/2.5,f/2.5,l),renderRect(-f/2.5,-f/2.5,f/2.5,f/2.5,l);
else if(3==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.75*f,f/2.85,3,l),renderCircle(0,0,.5*f,l),l.fillStyle=g;
else if(6==b.renderIndex)l.fillStyle=turretColor,l.rotate(MathPI/2),renderRectCircle(0,0,.7*f,f/4,5,l),l.rotate(-MathPI/2),renderAgon(0,0,.4*f,l,6);
else if(7==b.renderIndex)for(g=0;3>g;++g)l.fillStyle=g?1==g?"#93e86550":"#a2ff6f50":"#89d95f50",renderStar(0, 0, f, .7 * f, l, 7),f *= .55;
else 8==b.renderIndex&&(l.fillStyle=turretColor,renderRectCircle(0,0,.75*f,f/2.85,3,l),renderSquare(0,0,.5*f,l));1!=b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,-(MathPI/2),l);
unitSprites[h]=m}f=unitSprites[h];e.save();e.translate(a,d);e.rotate(c+MathPI/2);
e.drawImage(f,-(f.width/2),-(f.height/2),f.width,f.height);
1==b.type&&b.turretIndex&&renderTurret(0,0,b.turretIndex,k?iconSizeMult:1,b.turRot-MathPI/2-c,e);e.restore()};
console.log
renderText=function(a, d) { var c = document.createElement("canvas") , b = c.getContext("2d"); b.font = d + "px regularF"; var g = b.measureText(a); c.width = g.width + 20; c.height = 2 * d; b.translate(c.width / 2, c.height / 2); b.font = d + "px regularF"; b.fillStyle = "#fff"; b.textBaseline = "middle"; b.textAlign = "center"; b.strokeStyle = darkColor; b.lineWidth = outlineWidth; b.strokeText(a, 0, 0); b.fillText(a, 0, 0); return c }
//Bot de Guia//
cid = UTILS.getUniqueID();
localStorage.setItem("cid",cid);
//tropjooin//
var joinEnabled = true;
moveSelUnits = function (){
if (selUnits.length) {
var a = player.x + targetDst * MathCOS(targetDir) + camX
, d = player.y + targetDst * MathSIN(targetDir) + camY
, c = 1;
if (c && 1 < selUnits.length)
for (var b = 0; b < users.length; ++b)
if (UTILS.pointInCircle(a, d, users[b].x, users[b].y, users[b].size)) {
c = 0;
break
}
var g = -1;
if (c)
for (b = 0; b < units.length; ++b)
if (units[b].onScreen && units[b].owner != player.sid && UTILS.pointInCircle(a, d, units[b].x, units[b].y, units[b].size)) {
c = 0;
g = units[b].id;
break
}
1 == selUnits.length && (c = 0);
var e = [];
for (b = 0; b < selUnits.length; ++b)
e.push(selUnits[b].id);
socket.emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e,joinEnabled?(0):(c),g)
for(var i=0; i<window.sockets.length; i++){sockets[i].emit("5", UTILS.roundToTwo(a), UTILS.roundToTwo(d), e,joinEnabled?(0):(c),g)}
}
}
// CSS //
var css = document.createElement("style")
css.innerText = `
html, body {
	width: 100%;
	height: 100%;
	-webkit-touch-callout: none;
	-webkit-user-select: none;
	-khtml-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
}

body {
	background-color: #ffffff;
	margin: 0;
	overflow: hidden;
}

canvas {
    image-rendering: optimizeSpeed;
    image-rendering: -moz-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: -o-crisp-edges;
    image-rendering: crisp-edges;
    -ms-interpolation-mode: nearest-neighbor;
}

.grecaptcha-badge {
    visibility: hidden !important;
}

.material-icons {

}

a:link {
	color: #60c1ff;
	text-decoration: none;
}

a:visited {
	color: #60c1ff;
}

a:hover {
	color: #ff6060;
}

.spanLink {
	cursor: pointer;
	color: #60c1ff;
}

.spanLink:hover {
	color: #ff6060;
}

.deadLink {
	cursor: auto;
	color: #ffffff;
}

.deadLink:hover {
	color: #ffffff;
}

.horizontalCWrapper {
	width: 100%;
	text-align: center;
}

.centerContent {
	text-align: center;
	width: 100%;
}

#twitterFollBt {
	z-index: 200;
}

#shareContainer {
	padding: 5px;
	width: 100%;
	position: absolute;
	top: 10px;
	left: 10px;
	position: absolute;
	z-index: 200;
}

#darkener {
	display: block;
	position: absolute;
	width: 100%;
	height: 100%;
    background-color: rgba(12,0,17, 1);
}

#menuContainer {
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	top: 10px;
	z-index: 100;
	align-items: center;
	text-align: center;
}

#optionsContainer {
	padding: 10px;
	position: absolute;
	right: 10px;
	top: 0px;
	font-family: 'regularF';
	text-align: right;
	color: #fff;
	z-index: 100;
	font-size: 20px;
}

#lobbyKey {
	font-size: 20px;
}

#smallAdContainer {
	position: absolute;
	right: 14px;
	bottom: 44px;
	z-index: 100;
	border: dashed 6px rgba(35, 35, 35, 0.1);
}

#twitterFollBt {
	position: absolute;
	left: 15px;
	bottom: 40px;
}

#followText {
	position: absolute;
	left: 15px;
	bottom: 75px;
	color: #fff;
	font-size: 28px;
	font-family: 'regularF';
}

#youtuberOf {
	z-index: 100;
	position: absolute;
	top: 10px;
	left: 10px;
	color: #fff;
	font-size: 20px;
	font-family: 'regularF';
}

#youtubeContainer {
	margin-top: 5px;
}

#mainCanvas {
	position: absolute;
	width: 100%;
	height: 100%;
}

#gameUiContainer {
	position: absolute;
	width: 100%;
	height: 100%;
	display: none;
	pointer-events: none;
}

#adContainer {
	width: 100%;
	text-align: center;
	margin-top: 20px;
	display: inline-block;
}

#adHolder {
	display: inline-block;
	border: dashed 6px rgba(35, 35, 35, 0.1);
}

#leaderboardContainer {
	position: absolute;
	top: 10px;
	right: 10px;
	padding: 10px;
	background-color:rgba(128,0,128, 0.1);
	font-family: 'regularF';
	font-size: 30px;
	border-radius: 4px;
	color: #fff;
}

.leaderboardItem {
	margin-top: 2px;
	color:  rgba(128,0,128, 0.1);
	font-family: 'regularF';
	font-size: 17px;
}

.leaderYou {
	color: #fff;
	display: inline-block;
	max-width: 150px;
	margin-left: 10px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
}

.leader {
	color: rgba(255,255,255, 0.6);
	display: inline-block;
	max-width: 150px;
	margin-left: 10px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	-o-text-overflow: ellipsis;
}

.scoreText {
    color: #c6c6c6;
	text-align: left;
	float: right;
	margin-left: 10px;
	display: inline-block;
}

#statContainer {
	position: absolute;
	bottom: 10px;
	left: 10px;
    color: #080475;
}

#scoreContainer {
	display: inline-block;
	padding: 10px;
	background-color: rgba(171, 0, 171, 0.1);
	font-family: 'regularF';
	font-size: 20px;
	border-radius: 4px;
	color: #55178B;
}

#unitList {
	text-align: center;
	width: 100%;
	position: absolute;
	bottom: 6px;
}

.unitItem {
	pointer-events: all;
	margin-left: 10px;
	position: relative;
	display: inline-block;
	width: 65px;
	height: 65px;
	background-color: rgba(128,0,128, 0.1);
	border-radius: 4px;
	cursor: pointer;
}

.unitItemA {
	pointer-events: all;
	margin-left: 10px;
	position: relative;
	display: inline-block;
	width: 65px;
	height: 65px;
    background-color: rgba(128,0,128, 0.1);
	border-radius: 4px;
	cursor: pointer;
}

.unitItem:hover {
	background-color: rgba(128,0,128, 0.1);
}

#unitInfoContainer {
	padding: 10px;
	display: none;
}

.upgradeInfo {
	margin-top: 10px;
	padding: 10px;
	background-color: rgba(128,0,128, 0.1);
	border-radius: 4px;
	font-family: 'regularF';
	max-width: 200px;
	overflow: auto;
	cursor: pointer;
	pointer-events: all;
}

.upgradeInfo:hover {
	background-color: rgba(128,0,128, 0.1);
}

.unitInfo {
	padding: 10px;
	background-color: rgba(128,0,128, 0.1);
	border-radius: 4px;
	font-family: 'regularF';
	max-width: 200px;
	overflow: auto;
}

.unitInfoName {
	font-size: 22px;
	color: #AB00AB;
}

.unitInfoCost {
	font-size: 16px;
	color: #AB00AB;
}

.unitInfoDesc {
	font-size: 16px;
	color: #AB00AB;
}

.unitInfoType {
	padding-top: 5px;
	font-size: 16px;
	color: #AB00AB;
	float: left;
}

.unitInfoLimit {
	display: inline-block;
	float: right;
	text-align: right;
	padding-top: 5px;
	font-size: 16px;
	color: #AB00AB;
}

#unitInfoUpgrades {

}

#chatBox {
    position: absolute;
	bottom: 10px;
	right: 10px;
	width: 250px;
	overflow: hidden;
}

#chatListWrapper {
	background-color:  rgba(128,0,128, 0.1);
	border-radius: 9px 9px 0px 0px;
	height: 215px;
}

.chatText {
	color: rgba(255, 255, 255, 0.65);
}

#chatList {
	width: 100%;
	font-family: 'regularF';
	padding: 8px;
    margin: 0;
    list-style: none;
    box-sizing: border-box;
    color: #fff;
	overflow: hidden;
	word-wrap: break-word;
	position: absolute;
    bottom: 30px;
    font-size: 16px;
    line-height: 23px
}

#chatInput {
	background-color:  rgba(128,0,128, 0.1);
	font-family: 'regularF';
	font-size: 16px;
	padding: 5px;
	color: #fff;
	width: 100%;
	pointer-events: all;
	outline: none;
	border: 0;
	box-sizing: border-box;
	border-radius: 8px 8px 8px 8px;
}

#sellButton {
	display: none;
	position: absolute;
	bottom: 65px;
	left: 10px;
	background-color: rgba(128,0,128, 0.1);
	border-radius: 4px;
	font-family: 'regularF';
	font-size: 20px;
	color: #55178B;
	cursor: pointer;
	padding: 10px;
	pointer-events: all;
}

#sellButton:hover {
	background-color: rgba(128,0,128, 0.1);
    color: #55178B;
}

.greyMenuText {
	color: rgba(255, 255, 255, 0.5);

}

.whiteText {
	color: #fff;
}

#userNameInput {
	font-family: 'regularF';
	font-size: 26px;
	padding: 6px;
	padding-left: 12px;
	border: none;
	border-radius: 4px;
	margin-left: 10px;
    color: #E0C5FC;
	background-color: #510770;
}

#enterGameButton {
	font-family: 'regularF';
	font-size: 26px;
	padding: 5px;
	color: #E0C5FC;
	background-color: #510770;
	border: none;
	cursor: pointer;
	margin-left: 10px;
	border-radius: 4px;
}

#enterGameButton:hover {
	background-color: #f25b5b;
}

#loadingContainer {
	display: none;
	font-family: 'regularF';
	font-size: 26px;
	padding: 6px;
	color: #ffffff;
}

#gameTitle {
	color: #E0C5FC;
	font-size: 130px;
	width: 100%;
	text-align: center;
	font-family: 'regularF';
}

#instructionsText {
	font-size: 21px;
	width: 400px;
	text-align: center;
	font-family: 'regularF';
	margin-top: 20px;
	display: inline-block;
}

#creatorLink {
	z-index: 1000;
	position: absolute;
	bottom: 0;
	text-align: center;
	font-size: 20px;
	font-family: 'regularF';
	color: rgba(255, 255, 255, 0.9);
	padding: 5px;
	margin-left: 10px;
	margin-bottom: 5px;
	padding: 5px;
}

#infoLinks {
	z-index: 0;
	position: absolute;
	bottom: 0;
	right: 0;
	text-align: center;
	font-size: 0px;
	font-family: 'regularF';
	color: rgba(255, 255, 255, 0.9);
	padding: 5px;
	margin-right: 0px;
	margin-bottom: 0px;
}

#infoLinks2 {
	z-index: 0;
	position: absolute;
	top: 0;
	right: 0;
	text-align: center;
	font-size: 0px;
	font-family: 'regularF';
	color: rgba(255, 255, 255, 0.9);
	padding: 0px;
	margin-right: 0px;
	margin-bottom: 0px;
}

#skinInfo {
	position: absolute;
	display: none;
	text-align: left;
	width: 110px;
	margin-left: -145px;
	padding: 6px;
	padding-top: 13px;
	padding-left: 16px;
	color: #fff;
	border-radius: 4px;
	background-color: rgba(0, 0, 0, 0.4);
	font-family: 'regularF';
	font-size: 5px;
}

#skinName {
	padding: 4px;
	padding-left: 0px;
	color: rgb(255, 255, 255);
	font-size: 22px;
}

#skinIcon {
	width: 100px;
	height: 100px;
    font-size: 15px;
}

#skinSelector {
	display: none;
	font-family: 'regularF';
	font-size: 26px;
	padding: 6px;
	padding-left: 12px;
	padding-right: 12px;
	border: none;
	border-radius: 4px;
	color: #E0C5FC;
	background-color: #510770;
	cursor: pointer;
}

#skinSelector:hover {
	background-color: #7a9de7;
}`
document.head.appendChild(css)
