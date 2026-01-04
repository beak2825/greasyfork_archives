// ==UserScript==
// @name         Diep.io  Console Commands list
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  command list
// @author       Lost.#3609
// @match        https://*diep.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454412/Diepio%20%20Console%20Commands%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/454412/Diepio%20%20Console%20Commands%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.alert("Script Made By Lost.#3609");

var mbtn = document.createElement("button");
  document.body.appendChild(mbtn);
  mbtn.innerHTML = "Script Made By Lost!";
  mbtn.style.backgroundColor = "aqua";
  mbtn.style.position = "absolute";
  mbtn.style.left = "0px";
  mbtn.style.height = "36px";
  mbtn.style.width = "105px";
  mbtn.style.top = "54px";


  var renScoreBoard = true;
  var btn1 = document.createElement("button");
  document.body.appendChild(btn1);
  btn1.innerHTML = "render LeaderBoard";
  btn1.style.backgroundColor = "yellow";
  btn1.style.position = "absolute";
  btn1.style.top = "90px";
  btn1.style.left = "0px";
  btn1.style.height = "36px";
  btn1.style.width = "105px";
  btn1.onclick = function() {
  renScoreBoard = !renScoreBoard;
    input.set_convar("ren_scoreboard", renScoreBoard);
    }

var renUpgrades = true;
var btn3 = document.createElement("button");
  document.body.appendChild(btn3);
  btn3.innerHTML = "render upgrades table";
  btn3.style.backgroundColor = "lightgreen";
  btn3.style.position = "absolute";
  btn3.style.top = "122px";
  btn3.style.left = "0px";
  btn3.style.height = "36px";
  btn3.style.width = "105px";
  btn3.onclick = function() {
  renUpgrades = !renUpgrades;
    input.set_convar("ren_upgrades", renUpgrades);
    }

var renStats = true;
var btn4 = document.createElement("button");
  document.body.appendChild(btn4);
  btn4.innerHTML = "render stats table";
  btn4.style.backgroundColor = "red";
  btn4.style.position = "absolute";
  btn4.style.top = "156px";
  btn4.style.left = "0px";
  btn4.style.height = "36px";
  btn4.style.width = "105px";
  btn4.onclick = function() {
  renStats = !renStats;
    input.set_convar("ren_stats", renStats);
    }
})();