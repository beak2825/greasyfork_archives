// ==UserScript==
// @name         Evade and deceive
// @version      1.1
// @description  Better evades.io experience
// @author       Shädam
// @match        https://evades.io
// @icon         https://www.google.com/s2/favicons?domain=evades.io
// @grant        none
// @run-at       document-body
// @namespace    https://greasyfork.org/users/719520
// @downloadURL https://update.greasyfork.org/scripts/427194/Evade%20and%20deceive.user.js
// @updateURL https://update.greasyfork.org/scripts/427194/Evade%20and%20deceive.meta.js
// ==/UserScript==

"use strict";

const style = document.createElement("style");
style.innerHTML = `
body, html {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: 0;
  overflow-x: hidden;
}
.hero-select-heroes-container {
  height: auto;
  width: 100%;
  overflow: hidden;
  padding: 0;
  margin: auto;
  padding-left: 50px;
  padding-bottom: 250px;
}
.hero-tooltip {
  transform: translate(0);
}
#hero-tooltip-aurora, #hero-tooltip-shade, #hero-tooltip-rameses, #hero-tooltip-jötunn, #hero-tooltip-glob, #hero-tooltip-viola, #hero-tooltip-stheno {
  transform: translate(-150px);
}
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
#chat-input {
  border: 0;
}
#leaderboard {
  max-height: 650px;
}
.changelog {
  height: 300px;
  transform: translate(-500px, -50px);
}
div:not(.game-servers-list) + div + div + a + div#tsm-chlog {
  transform: translate(-500px, -75px)!important;
}
#tsm-chlog.sellected {
  height: 325px!important;
}
#tsm-chlog > div {
  height: 301px!important;
}
.game-servers-list + div + div + a + div#tsm-chlog {
  transform: translate(-505px, -75px)!important;
}
.hero-select-heroes-container {
  padding-left: 0px !important;
  transform: translateX(-20px);
}
`;
function run() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
	ctx.miterLimit = 1;
    document.body.appendChild(style);
    window.onbeforeunload = function(e) {
        if(window.socket != null) {
            e.preventDefault();
            e.returnValue = "Are you sure you want to quit?";
            return "Are you sure you want to quit?";
        }
    };
    canvas.oncontextmenu = function(e) {
        e = e || window.event;
        e.preventDefault();
    };
}
let a = setInterval(function() {
    if(document.getElementById("canvas")) {
        clearInterval(a);
        run();
    }
}, 50);