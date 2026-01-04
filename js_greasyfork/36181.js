// ==UserScript==
// @name         Mathletics Hack
// @namespace    snowlord7
// @version      1.0
// @description  Mathletics Hack (Spam A and Enter for it to work)
// @author       You
// @match        http://mzaue2.live.mathletics.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36181/Mathletics%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/36181/Mathletics%20Hack.meta.js
// ==/UserScript==


var btn = document.createElement("BUTTON");
    document.body.appendChild(btn);
    btn.setAttribute("onclick","ShowAwnser()");
    btn.setAttribute("id","dashow");
     var t = document.createTextNode("Spam A and Enter");
    btn.appendChild(t);

function ShowAwnser(){

 var nums = document.getElementsByClassName('questions-text-alignment whiteTextWithShadow question-size-v4')["0"].innerText;
 var add = nums.split('+' && '=');
 var equasion = add[0];
 function addbits(s){
    var total= 0, s= s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
    while(s.length){
        total+= parseFloat(s.shift());
    }
    return total;
}
 var awnser = addbits(equasion);

var nums = document.getElementsByClassName('questions-text-alignment whiteTextWithShadow question-size-v4')["0"].innerText;
 var add = nums.split('+' && '=');
 var equasion = add[0];
 function addbits(s){
    var total= 0, s= s.match(/[+\-]*(\.\d+|\d+(\.\d+)?)/g) || [];
    while(s.length){
        total+= parseFloat(s.shift());
    }
    return total;
}
 var awnser = addbits(equasion);

document.getElementById('dashow').innerText = awnser;
 document.getElementsByClassName("questions-input-adjustment questions-input-width-v3")["0"].value = awnser;
}

 window.addEventListener("keydown", checkKeyPressed, false);

function checkKeyPressed(e) {
    if (e.keyCode == "65") {
       ShowAwnser();
    }
}

document.getElementById("dashow").style.visibility = "hidden";