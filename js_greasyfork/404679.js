// ==UserScript==
// @name         cor 1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match   http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404679/cor%201.user.js
// @updateURL https://update.greasyfork.org/scripts/404679/cor%201.meta.js
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
document.head.appendChild(css)
screenWidth, screenHeight, darkColor = "#666666",
 backgroundColor = "#1C1C1C",
    outerColor = "#d6d6d6",
     indicatorColor = "rgba(240,248,255)",
  turretColor = "#00000040",
    turretColor = "#1C1C1CF",
    bulletColor = "#1C1C1C",
  redColor = "rgba(0,0,0)",
         targetColor = "#00FF7F",
    el.textContent = 'Dark Theme';
        populate();
