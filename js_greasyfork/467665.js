// ==UserScript==
// @name         Yohoho.io Updating Hack. Original Source From Adam B.
// @namespace    http://yohoho.io/
// @version      1.1.4
// @description  Hack yohoho.io | Choose any island. Press: I | Choose any skin(1-35). Press: P | Give Yourself As Many Coins At Will. Press: O | (NEW) Choose any pet. Press: Z
// @author       Hypno7767
// @match        yohoho.io/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467665/Yohohoio%20Updating%20Hack%20Original%20Source%20From%20Adam%20B.user.js
// @updateURL https://update.greasyfork.org/scripts/467665/Yohohoio%20Updating%20Hack%20Original%20Source%20From%20Adam%20B.meta.js
// ==/UserScript==



// ==============================================================================
// How to use the hacks:
// Press O to give yourself coins.
// Press P to select your character. 1-35
// Press I to go to an island.
// ==============================================================================




window.addEventListener("keydown", hehe, false);

showHacks();

function showHacks(){
    var box = document.getElementById("desktop-controls");
    var controls = document.createElement("div");
    controls.className = "title2";
    controls.id = "adamsstuff";
    var lol = document.getElementById("adamsstuff");
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
         }else if(e.keyCode == "90"){
        var z = prompt("What pet would you like? 1-9");
        if(isNaN(z) || z < 1 || z > 9){
            window.alert("Please put a number from 1-9 next time.");
        }else if(z != null || z != undefined || z != ""){
            localStorage.setItem("playerPet", z);
            window.alert("Please reload to enable the pet");
        }
    }else if(e.keyCode == "73"){
        var c = prompt("What island would you like? \n1 - Island 1 \n2 - Island 2 \n3 - Island 3 \n4 - Island 4 \n5 - Island 5 \n6 - Island 6");
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
            localStorage.setItem("playerXP", 100000);
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