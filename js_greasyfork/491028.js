// ==UserScript==
// @name         Yohoho.io Hack
// @namespace    http://yohoho.io/
// @version      0.5
// @description  Hack yohoho.io | Choose any island Hotkey: I | Choose any skin 1-35 (1 is the default skin 35 is the max skin) Hotkey: P | Give coins Hotkey: O
// @author       Sonic
// @match        yohoho.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491028/Yohohoio%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/491028/Yohohoio%20Hack.meta.js
// ==/UserScript==



// ==============================================================================
// How to use the hacks:
// Press O to change your coins.
// Press P to change your character. 1 is default 2 is the one after default ext.
// Press I to change your island.
// ==============================================================================



window.addEventListener("keydown", hehe, false);

showHacks();

function showHacks(){
    var box = document.getElementById("desktop-controls");
    var controls = document.createElement("div");
    controls.className = "title2";
    controls.id = "sonic";
    var lol = document.getElementById("sonic");
    var loltext = document.createElement("div");
    var loltextt = document.createTextNode("I - Change island \nO - Get coins \nP - Change skin");
    loltext.appendChild(loltextt);
    var controlsText = document.createTextNode("Hacks");
    controls.appendChild(controlsText);
    box.appendChild(controls);
    box.appendChild(loltext);
}

function hehe(e){
    if(e.keyCode == "79"){
        var a = prompt("How many coins would you like?");
        if(isNaN(a)){
            window.alert("Please enter a number next time");
        }else{
            localStorage.setItem("coinsOwned", a);
            document.getElementById("homepage-booty").innerHTML = a;
            document.getElementById("skin-popup-booty").innerHTML = a;
        }
    }else if(e.keyCode == "80"){
        var b = prompt("What character would you like? 1-35");
        if(isNaN(b) || b < 1 || b > 35){
            window.alert("Please put a number from 1-35 next time.");
        }else if(b != null || b != undefined || b != ""){
            localStorage.setItem("playerSkin", b);
            window.alert("Please reload to enable the skin");
        }
    }else if(e.keyCode == "73"){
        var c = prompt("What island would you like? \n1 - Tortuga \n2 - Beach \n3 - Easter \n4 - Wreck \n5 - Volcano \n6 - Village");
        if(c == 1){
            localStorage.setItem("playerXP", 0);
            window.alert("Island Changed. Please reload to save changes.");
        }else if(c == 2){
            localStorage.setItem("playerXP", 200);
            window.alert("Island Changed. Please reload to save changes.");
        }else if(c == 3){
            localStorage.setItem("playerXP", 1600);
            window.alert("Island Changed. Please reload to save changes.");
        }else if(c == 4){
            localStorage.setItem("playerXP", 4200);
            window.alert("Island Changed. Please reload to save changes.");
        }else if(c == 5){
            localStorage.setItem("playerXP", 8300);
            window.alert("Island Changed. Please reload to save changes.");
            }else if(c == 6){
            localStorage.setItem("playerXP", 15000);
            window.alert("Island Changed. Please reload to save changes.");
        }else if(c != (1 || 2 || 3 || 4 || 5 || 6)){
            window.alert("Please put in a number from 1 to 6.");
        }
    }
}

console.log("b");

let ez = document.getElementById("skin-button");
ez.onclick = function(){
    yohoho.chooseSkin();
    let a = parseInt(localStorage.getItem("coinsOwned"));
    document.getElementById("skin-popup-booty").innerHTML = a;
}