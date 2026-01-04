// ==UserScript==
// @name         MooMoo.io Visuals (Rainbow)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Best for Just Visuals
// @author       The Best
// @license      MIT
// @match        *://*.moomoo.io/*
// @downloadURL https://update.greasyfork.org/scripts/486225/MooMooio%20Visuals%20%28Rainbow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/486225/MooMooio%20Visuals%20%28Rainbow%29.meta.js
// ==/UserScript==
// Visuals \\
//Map Display
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
//Remove stuff
document.getElementById('errorNotification').remove();
//Game Leaderboard Display Border
$("#leaderboard").css({'border':'1px solid #000000'});
//This just Promotion
$( "#linksContainer2 > a:nth-child(1)" ).replaceWith( '<a href="./docs/versions.txt" target="_blank" class="menuLink">Visuals (Rainbow v1.0.0)</a>' );
$("#menuCardHolder").append(`<div class='menuCard' id='guideCard'><div class='menuHeader'>This is not a hack<br>Made For people Like you<br>By The Best<br>`);
document.getElementById("mainMenu").style.backgroundImage = "url(Link here)";/*This can be used if you have a image to use for your main screen game any image works if it has a link Ex. https://wallpapercave.com/wp/wp2553589.jpg*/
document.getElementById("storeHolder").style = "height: 500px; width: 435px;";
//Game Name Text
document.getElementById('gameName').innerHTML = '';setTimeout(() => {document.getElementById('gameName').innerHTML = 'B';setTimeout(() => {document.getElementById('gameName').innerHTML = 'Be';setTimeout(() => {document.getElementById('gameName').innerHTML = 'Bes';setTimeout(() => {document.getElementById('gameName').innerHTML = 'Best';setTimeout(() => {document.getElementById('gameName').innerHTML = 'Best M';setTimeout(() => {document.getElementById('gameName').innerHTML = 'Best Mo';setTimeout(() => {document.getElementById('gameName').innerHTML = 'beSt MOd';setTimeout(() => {document.getElementById('gameName').innerHTML = 'BesT MoD';setTimeout(() => {document.getElementById('gameName').innerHTML = 'BEST MOD';setTimeout(() => {document.getElementById('gameName').innerHTML = 'Best Mod';}, 120);}, 120);}, 120);}, 120);}, 120);}, 120);}, 120);}, 120);}, 120);}, 120);
// If you want normal name Dont remove other one just put //
//document.getElementById('gameName').innerHTML = 'Best Mod';
//Removes Game Shadow 1.0
// Do not change Text-Shadow as that will mess with the Hue Title
$('#gameName').css({'text-shadow': '0 0px 0 rgba(0, 0, 0, 0), 0 0px 0 rgba(255, 255, 255, 0), 0 0px 0 rgba(255, 255, 255, 0), 0 0px 0 rgba(255, 255, 255, 0), 0 0px 0 rgba(255, 255, 255, 0), 0 0px 0 rgba(255, 255, 255, 0), 0 0px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 0px 0 rgba(255, 255, 255, 0)','text-align': 'center','font-size': '126px','margin-bottom': '-30px'});
//Adds Game Shadow 2.0
(function() {let shadowRadius = 20;let shadowDirection = 5;let canShadow = true;
setInterval(() => {if (canShadow == true) {shadowRadius = (shadowDirection == 1) ? shadowRadius - 5 : shadowRadius + 5;
if (shadowRadius >= 50 || shadowRadius <= 0) {shadowDirection = (shadowRadius >= 50) ? 1 : (shadowRadius <= 0) ? 0 : null;canShadow = false;
setTimeout(() => {canShadow = true;}, 100);}}
document.getElementById("gameName").style.textShadow = `0px 0px ${shadowRadius + 10}px black`;
document.getElementById("loadingText").style.textShadow = `0px 0px ${shadowRadius + 20}px Red`;}, 100);})();
//Loading text Edit as wish
document.getElementById('loadingText').innerHTML = 'Loading...';setTimeout(() => {document.getElementById('loadingText').innerHTML = '✅Successful✅';}, 710);
//FOR RAINBOW VISUALS
(function() {'KEEP THIS FOR TEXT COLOR';
window.addEventListener('load', function() {const canvas = document.getElementById("gameCanvas");const ctx = canvas.getContext("2d");const originalDrawImage = ctx.drawImage;
ctx.drawImage = function () {this.shadowColor = "rgba(50, 50, 50, 0.5)";this.shadowBlur = 10;originalDrawImage.apply(this, arguments);this.shadowColor = "transparent";this.shadowBlur = 0;};});
//AGE BAR RAINBOW
let ageBar = document.getElementById("ageBar");
let hueAgeBar = 0;
function updateAgeBarColor() {ageBar.style.backgroundColor = `hsl(${hueAgeBar}, 100%, 50%)`;hueAgeBar = (hueAgeBar + 1) % 360;}
let intervalAgeBarId = setInterval(updateAgeBarColor, 50);
//LEADER BOARD RAINBOW
let leaderboard = document.getElementById("leaderboard");
let hueLeaderboard = 0;
function updateLeaderboardColor() {leaderboard.style.borderColor = `hsl(${hueLeaderboard}, 100%, 50%)`;hueLeaderboard = (hueLeaderboard + 1) % 360;}
//IDS TO OTHER RAINBOW
let intervalLeaderboardId = setInterval(updateLeaderboardColor, 50);let foodDisplay = document.getElementById("foodDisplay");let gameName = document.getElementById("gameName");let leaderBoard = document.getElementById("leaderboard");let woodDisplay = document.getElementById("woodDisplay");let stoneDisplay = document.getElementById("stoneDisplay");let scoreDisplay = document.getElementById("scoreDisplay");let allianceButton= document.getElementById("allianceButton");let storeButton= document.getElementById("storeButton");let chatButton= document.getElementById("chatButton");let pingDisplay = document.getElementById("pingDisplay");
let hueText = 0;
function updateTextColors() {foodDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;gameName.style.color = `hsl(${hueText}, 100%, 50%)`;leaderboard.style.color = `hsl(${hueText}, 100%, 50%)`;allianceButton.style.color = `hsl(${hueText}, 100%, 50%)`;storeButton.style.color = `hsl(${hueText}, 100%, 50%)`;chatButton.style.color = `hsl(${hueText}, 100%, 50%)`;pingDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;woodDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;stoneDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;scoreDisplay.style.color = `hsl(${hueText}, 100%, 50%)`;hueText = (hueText + 1) % 360;}
let intervalTextId = setInterval(updateTextColors, 50);
let mapDisplay = document.getElementById("mapDisplay");
mapDisplay.style.backgroundImage = "url('https://i.imgur.com/fgFsQJp.png')";
mapDisplay.style.backgroundRepeat = "no-repeat";
mapDisplay.style.backgroundSize = "cover";})();
let hue = 0;
let replaceInterval = setInterval(() => {if (CanvasRenderingContext2D.prototype.roundRect) {CanvasRenderingContext2D.prototype.roundRect = ((oldFunc) => function() { if (this.fillStyle == "#8ecc51") this.fillStyle = `hsl(${hue}, 100%, 50%)`; return oldFunc.call(this, ...arguments); })(CanvasRenderingContext2D.prototype.roundRect);clearInterval(replaceInterval);}}, 10);
function changeHue() {hue += Math.random() * 3;}setInterval(changeHue, 10);
//Removes Grid If you like Remove (/**/)
/*
(function() {let oldLineTo = CanvasRenderingContext2D.prototype.lineTo;let oldFillRect = CanvasRenderingContext2D.prototype.fillRect;
CanvasRenderingContext2D.prototype.lineTo = function() {if (this.globalAlpha != .06) oldLineTo.apply(this, arguments);};
document.getElementById("enterGame").addEventListener('click', rwrw)
var RLC = 0
var MLC = 0
var KFC = 0
function rwrw() {console.log("Game Start");S = 1;M = 1;H = 1}
var H = 1,M = 1,S = 1
setInterval(() => {RLC++;S++}, 1000);
setInterval(() => {if (RLC == 60) {MLC++;RLC = 0}
if (MLC == 60) {KFC++;MLC = 0}
if (S == 60) {M++;S = 0}
if (M == 60) {H++;M = 0}}, 0);
const { msgpack } = window
function AntiKick() {this.resetDelay = 500;this.packetsLimit = 40;this.ignoreTypes = [ "pp", "rmd" ];this.ignoreQueuePackets = [ "5", "c", "33", "2", "7", "13c" ]
this.packetsStorage = new Map()
this.tmpPackets = []
this.packetsQueue =
this.lastSent = Date.now();
this.onSend = function(data) {const binary = new Uint8Array(data);const parsed = msgpack.decode(binary)
if (Date.now() - this.lastSent > this.resetDelay) {this.tmpPackets = [];this.lastSent = Date.now()}
if (!this.ignoreTypes.includes(parsed[0])) {if (this.packetsStorage.has(parsed[0])) {const oldPacket = this.packetsStorage.get(parsed[0]);switch (parsed[0]) {case "2":case "33":if (oldPacket[0] == parsed[1][0]) return true;break}}
if (this.tmpPackets.length > this.packetsLimit) {if (!this.ignoreQueuePackets.includes(parsed[0])) {this.packetsQueue.push(data)}return true}
this.tmpPackets.push({type: parsed[0],data: parsed[1]})
this.packetsStorage.set(parsed[0], parsed[1])}return false}}
const antiKick = new AntiKick()
let firstSend = false
window.WebSocket.prototype.send = new Proxy(window.WebSocket.prototype.send, {apply: function(target, _this) {
if (!firstSend) {_this.addEventListener("message", (event) => {if (!antiKick.packetsQueue.length) return
const binary = new Uint8Array(event.data)
const parsed = msgpack.decode(binary)
if (parsed[0] === "33") {_this.send(antiKick.packetsQueue[0])
antiKick.packetsQueue.shift()}})
firstSend = true}
if (antiKick.onSend(arguments[2][0])) return
return Reflect.apply(...arguments)}})})();
*/