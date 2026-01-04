// ==UserScript==
// @name         diep.io hard mode!
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  try to take over the world!
// @author       恋ポケ
// @match        http*://*diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375299/diepio%20hard%20mode%21.user.js
// @updateURL https://update.greasyfork.org/scripts/375299/diepio%20hard%20mode%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
function hard(){
    input.execute("net_replace_color 14 0xFF0000");
    input.execute("net_replace_color 2 0xFFE869");
    input.execute("net_replace_color 3 0xFFFFFF");
    input.execute("net_replace_color 4 0x444444");
    input.execute("net_replace_color 5 0xFF0000");
    input.execute("net_replace_color 6 0x0000FF");
    input.set_convar("ren_background_color",0x000000);
    input.set_convar("ren_grid_color",0xFF0000);
    input.set_convar("ren_grid_base_alpha",1);
    input.set_convar("ren_health_bars",false);
    input.set_convar("ren_scoreboard",false);
};

function nohard(){
    input.execute("net_replace_color 14 0xBBBBBB");
    input.execute("net_replace_color 2 0x00B1DE");
    input.execute("net_replace_color 3 0x00B1DE");
    input.execute("net_replace_color 4 0xF14E54");
    input.execute("net_replace_color 5 0xBE7FF5");
    input.execute("net_replace_color 6 0x00F46C");
    input.set_convar("ren_background_color",13487565);
    input.set_convar("ren_grid_color",0);
    input.set_convar("ren_grid_base_alpha",0.1000000);
    input.set_convar("ren_health_bars",true);
    input.set_convar("ren_scoreboard",true);
};

    var NewButton1 = document.createElement("button");
  NewButton1.setAttribute("id", "Local_Mode");
  NewButton1.innerHTML = "Hard Mode：OFF";
  NewButton1.style.color = "blue";
  NewButton1.style.fontSize = "20px";
  NewButton1.style.width = "40em";
  NewButton1.style.backgroundColor = "white";
  window.myFunc = function () {
hard();
document.getElementById("Local_Mode").style.display = "none";
document.getElementById("Hard_Mode").style.display = "block";
  };
NewButton1.addEventListener('click', window.myFunc);
  document.getElementById("a1").parentNode.appendChild(NewButton1);
var reference1 = document.getElementById('a1');
reference1.parentNode.insertBefore(NewButton1, reference1);

    var NewButton2 = document.createElement("button");
  NewButton2.setAttribute("id", "Hard_Mode");
  NewButton2.innerHTML = "Hard Mode：ON";
  NewButton2.style.color = "yellow";
  NewButton2.style.fontSize = "20px";
  NewButton2.style.width = "40em";
  NewButton2.style.backgroundColor = "red";
  NewButton2.style.borderColor = "#9D0015";
  window.myFunc = function () {
nohard();
document.getElementById("Hard_Mode").style.display = "none";
document.getElementById("Local_Mode").style.display = "block";
  };
NewButton2.addEventListener('click', window.myFunc);
  document.getElementById("a1").parentNode.appendChild(NewButton2);
var reference2 = document.getElementById('a1');
reference2.parentNode.insertBefore(NewButton2, reference2);

document.getElementById("Hard_Mode").style.display = "none";
})();