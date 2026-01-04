// ==UserScript==
// @name         Fallen World
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  The Fallen World
// @author       恋ポケ
// @match        http*://*diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375454/Fallen%20World.user.js
// @updateURL https://update.greasyfork.org/scripts/375454/Fallen%20World.meta.js
// ==/UserScript==

(function() {
    'use strict';
function Fallen(){
    input.execute("net_replace_color 2 0xCCCCFF");
    input.execute("net_replace_color 3 0xCCCCFF");
    input.execute("net_replace_color 4 0xFFCCCC");
    input.execute("net_replace_color 5 0xEE99EE");
    input.execute("net_replace_color 6 0xCCFFCC");
    input.execute("net_replace_color 7 0xC0C0C0");
    input.execute("net_replace_color 8 0xC0C0C0");
    input.execute("net_replace_color 9 0xC0C0C0");
    input.execute("net_replace_color 10 0xC0C0C0");
    input.execute("net_replace_color 11 0xC0C0C0");
    input.execute("net_replace_color 12 0xC0C0C0");
    input.execute("net_replace_color 15 0xFFCCCC");
    input.execute("net_replace_color 16 0xC0C0C0");
    input.set_convar("ren_health_fill_color",0xC0C0C0);
    input.set_convar("ren_xp_bar_fill_color",0xC0C0C0);
    input.set_convar("ren_score_bar_fill_color",0xC0C0C0);
}

function noFallen(){
    input.execute("net_replace_color 2 0x00B1DE");
    input.execute("net_replace_color 3 0x00B1DE");
    input.execute("net_replace_color 4 0xF14E54");
    input.execute("net_replace_color 5 0xBE7FF5");
    input.execute("net_replace_color 6 0x00F46C");
    input.execute("net_replace_color 7 0x89FF69");
    input.execute("net_replace_color 8 0xFFE869");
    input.execute("net_replace_color 9 0xFC7677");
    input.execute("net_replace_color 10 0x768DFC");
    input.execute("net_replace_color 11 0xFF77DC");
    input.execute("net_replace_color 12 0xFFE869");
    input.execute("net_replace_color 15 0xFF0000");
    input.execute("net_replace_color 16 0xFCC276");
    input.set_convar("ren_health_fill_color",0x85E37D);
    input.set_convar("ren_xp_bar_fill_color",0xF0D96C);
    input.set_convar("ren_score_bar_fill_color",0x6CEFA2);
}

    var NewButton1 = document.createElement("button");
  NewButton1.setAttribute("id", "Local_World");
  NewButton1.innerHTML = "Local World";
  NewButton1.style.color = "black";
  NewButton1.style.fontSize = "20px";
  NewButton1.style.width = "40em";
  NewButton1.style.backgroundColor = "white";
  window.myFunc = function () {
Fallen();
document.getElementById("Local_World").style.display = "none";
document.getElementById("Fallen_World").style.display = "block";
  };
NewButton1.addEventListener('click', window.myFunc);
  document.getElementById("a1").parentNode.appendChild(NewButton1);
var reference1 = document.getElementById('a1');
reference1.parentNode.insertBefore(NewButton1, reference1);

    var NewButton2 = document.createElement("button");
  NewButton2.setAttribute("id", "Fallen_World");
  NewButton2.innerHTML = "Fallen world";
  NewButton2.style.color = "black";
  NewButton2.style.fontSize = "20px";
  NewButton2.style.width = "40em";
  NewButton2.style.backgroundColor = "#C0C0C0";
  NewButton2.style.borderColor = "#A0A0A0";
  window.myFunc = function () {
noFallen();
document.getElementById("Fallen_World").style.display = "none";
document.getElementById("Local_World").style.display = "block";
  };
NewButton2.addEventListener('click', window.myFunc);
  document.getElementById("a1").parentNode.appendChild(NewButton2);
var reference2 = document.getElementById('a1');
reference2.parentNode.insertBefore(NewButton2, reference2);

document.getElementById("Fallen_World").style.display = "none";
})();