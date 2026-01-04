// ==UserScript==
// @name         cor 2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match   http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404881/cor%202.user.js
// @updateURL https://update.greasyfork.org/scripts/404881/cor%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();

var css = document.createElement("style")
css.innerText = `
#chatBox {
    FONT-VARIANT-EAST-ASIAN: JIS83;
    position: absolute;
    bottom: 0px;
    right: 10px;
    width: 250px;
    overflow: hidden;
box-shadow: 5px 15px 10px black
}
#chatInput {
    background-color: #000000;
    font-family: 'regularF';
    font-size: 16px;
    padding: 5px;
    color: #00000;
    width: 100%;
    pointer-events: all;
    outline: none;
    border: white;
    box-sizing: border-box;
    border-radius: 5px 5px 18px 18px;
}
#leaderboardContainer {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 5px;
   background-color:#000000	;
    font-family: 'regularF';
    font-size: 24px;
    border-radius: 14px;
    color: #000000;
}
#darkener {
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #1a1616;
}
#skinSelector {
    display: none;
    font-family: 'regularF';
    font-size: 26px;
    padding: 6px;
    padding-left: 12px;
    padding-right: 12px;
    border: none;
    border-radius: 15px;
    background-color: #000000;
    color: #fff;
    cursor: pointer;
}
#enterGameButton {
    font-family: 'regularF';
    font-size: 26px;
    padding: 5px;
    color: #ffffff;
    background-color: #000000;
    border: none;
    cursor: pointer;
    margin-left: 10px;
    border-radius: 15px;
}
#userNameInput {
    font-family: 'regularF';
    font-size: 20px;
    padding: 12px;
    padding-left: 15px;
    border: none;
    border-radius: 18px;
    margin-left: 8px;
}
#skinInfo {
    position: absolute;
    display: none;
    text-align: left;
    width: 110px;
    margin-left: -135px;
    padding: 6px;
    padding-top: 3px;
    padding-left: 16px;
    color: #000000;
    border-radius: 19px;
    background-color: black;
    font-family: 'regularF';
    font-size: 15px;
}
.greyMenuText {
    color: #000000;
}
#gameTitle {
    color: #000000;
    font-size: 45px;
    width: 100%;
    text-align: center;
    font-family: 'regularF';
}
.unitItem {
    pointer-events: all;
    margin-left: 18px;
    position: relative;
    display: inline-block;
    width: 69px;
    height: 65px;
    background-color: #1C1C1C;
    border-radius: 45px;
    cursor: pointer;
}
#scoreContainer {
    display: inline-block;
    padding: 15px;
    background-color: #1C1C1C;
    font-family: 'regularF';
    font-size: 15px;
    border-radius: 18px;
    color: #000000;
}
#joinTroopContainer {
    display: inline-block;
	padding: 3px;
	background-color:#1C1C1C;
	font-family: 'regularF';
	font-size: 15px;
	border-radius: 18px;
	color: #000000;
}
#joinTroopContainer {
    display: inline-block;
	padding: 7px;
	background-color: #1C1C1C;
	font-family: 'regularF';
	font-size: 15px;
	border-radius: 18px;
	color: #000000;
}

`
renderUnit=function(a, d, c, b, g, e, k) { var f = b.size * (k ? iconSizeMult : 1), h = f + ":" + b.cloak + ":" + b.renderIndex + ":" + b.iSize + ":" + b.turretIndex + ":" + b.shape + ":" + g; if (!unitSprites[h]) { var m = document.createElement("canvas"), l = m.getContext("2d"); m.width = 2 * f + 30; m.height = m.width; m.style.width = m.width + "px"; m.style.height = m.height + "px";
l.translate(m.width / 2, m.height / 2); l.lineWidth = outlineWidth * (k ? .9 : 1.2); l.strokeStyle = darkColor; l.fillStyle = g; 4 == b.renderIndex ? l.fillStyle = turretColor : 5 == b.renderIndex && (l.fillStyle = turretColor, renderRect(0, .76 * f, 1.3 * f, f / 2.4, l), l.fillStyle = g); b.cloak && (l.fillStyle = backgroundColor); "circle" == b.shape ? (renderCircle(0, 0, f, l),
b.iSize && (l.fillStyle = turretColor, renderCircle(0, 0, f * b.iSize, l))) : "triangle" == b.shape ? (renderTriangle(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderTriangle(0, 2, f * b.iSize, l))) : "hexagon" == b.shape ? (renderAgon(0, 0, f, l, 6), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, f * b.iSize, l, 6))) : "octagon" == b.shape ? (l.rotate(MathPI / 8), renderAgon(0, 0, .96 * f, l, 8),
b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, .96 * f * b.iSize, l, 8))) : "pentagon" == b.shape ? (l.rotate(-MathPI / 2), renderAgon(0, 0, 1.065 * f, l, 5), b.iSize && (l.fillStyle = turretColor, renderAgon(0, 0, 1.065 * f * b.iSize, l, 5))) : "square" == b.shape ? (renderSquare(0, 0, f, l), b.iSize && (l.fillStyle = turretColor, renderSquare(0, 0, f * b.iSize, l))) : "spike" == b.shape ? renderStar(0, 0, f, .7 * f, l, 8) : "star" == b.shape && (f *= 1.2,
renderStar(0, 0, f, .7 * f, l, 6)); if (1 == b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.8, 0, f / 4, f / 1, l), renderRect(-f / 2.8, 0, f / 4, f / 1, l); else if (2 == b.renderIndex) l.fillStyle = turretColor, renderRect(f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, f / 2.5, f / 2.5, f / 2.5, l), renderRect(f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l), renderRect(-f / 2.5, -f / 2.5, f / 2.5, f / 2.5, l);
else if (3 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderCircle(0, 0, .5 * f, l), l.fillStyle = g; else if (6 == b.renderIndex) l.fillStyle = turretColor, l.rotate(MathPI / 2), renderRectCircle(0, 0, .7 * f, f / 4, 5, l), l.rotate(-MathPI / 2), renderAgon(0, 0, .4 * f, l, 6); else if (7 == b.renderIndex) for (g = 0; 3 > g; ++g) l.fillStyle = g ? 1 == g ? "#93e86510" : "#a2ff6f10" : "#89d95f10",
renderStar(0, 0, f, .7 * f, l, 7), f *= .55; else 8 == b.renderIndex && (l.fillStyle = turretColor, renderRectCircle(0, 0, .75 * f, f / 2.85, 3, l), renderSquare(0, 0, .5 * f, l)); 1 != b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, k ? iconSizeMult : 1, -(MathPI / 2), l); unitSprites[h] = m } f = unitSprites[h]; e.save(); e.translate(a, d); e.rotate(c + MathPI / 2); e.drawImage(f, -(f.width / 2), -(f.height / 2),
f.width, f.height); 1 == b.type && b.turretIndex && renderTurret(0, 0, b.turretIndex, k ? iconSizeMult : 1, b.turRot - MathPI / 2 - c, e); e.restore() }
console.log
document.head.appendChild(css)
screenWidth, screenHeight, darkColor = "#363636",
 backgroundColor = "#F8FBEF",
    outerColor = "#d6d6d6",
     indicatorColor = "rgba(0,0,0)",
  turretColor = "#00000040",
    turretColor = "#1C1C1CF",
    bulletColor = "#080D31",
  redColor = "rgba(0,0,0)",
 playerColors = "#000000 #000000 #000000 #000000 #000000 #000000  #000000 #000000 #000000  #000000 #000000 #000000  #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000  #000000 #000000 #000000 #000000 #000000 #000000  #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000 #000000".split(" "),
renderText=function(a, d) {
    var c = document.createElement("canvas")
      , b = c.getContext("2d");
    b.font = d + "px regularF";
    var g = b.measureText(a);
    c.width = g.width + 20;
    c.height = 2 * d;
    b.translate(c.width / 2, c.height / 2);
    b.font = d + "px regularF";
    b.fillStyle = "#bf1313";
    b.textBaseline = "middle";
    b.textAlign = "center";
    b.strokeStyle = darkColor;
    b.lineWidth = outlineWidth;
    b.strokeText(a, 0, 0);
    b.fillText(a, 0, 0);
    return c
}
renderDottedCircle=function(a, d, c, b) {
    b.setLineDash([5500, 1200]);
    b.beginPath();
    b.arc(a, d, c + b.lineWidth / 2, 0, 2 * Math.PI);
    b.stroke();
    b.setLineDash([])
}

renderDottedLine=function(a, d, c, b, g) {
    g.setLineDash([5500, 1200]);
    g.beginPath();
    g.moveTo(a, d);
    g.lineTo(c, b);
    g.stroke();
    g.setLineDash([])
}
         targetColor = "#00FF7F",
    el.textContent = 'Dark Theme';
        populate();
