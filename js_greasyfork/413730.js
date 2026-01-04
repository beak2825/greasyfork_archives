// ==UserScript==
// @name          AutoScroll by CyRuler
// @namespace     -
// @version       1.0
// @author        Discord : CyRuler#3691  /  Youtube : https://youtube.com/CyRuler  /  Discord Server : https://discord.gg/SjkzxVc  / (Subscribe me for more hacks!!)
// @description   B = Shop / T = Tank Gear / C = Bull Helmet / V = Turret Gear / Z = Flipper Hat / F = Solider / G = Samurai / H = Booster
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @grant        none
// @icon
// @downloadURL https://update.greasyfork.org/scripts/413730/AutoScroll%20by%20CyRuler.user.js
// @updateURL https://update.greasyfork.org/scripts/413730/AutoScroll%20by%20CyRuler.meta.js
// ==/UserScript==

document.getElementById("pingDisplay").style.color = "white";
document.getElementById('enterGame').innerHTML = 'Enter Game'
document.getElementById("gameName").style.color = "";
document.getElementById('loadingText').innerHTML = 'Loading...'
document.getElementById('nameInput').placeholder = "Enter Name"
document.getElementById('chatBox').placeholder = "Enter Message";
document.getElementById("pingDisplay").style.color = "#fafafa";
document.getElementById('diedText').innerHTML = 'YOU DIED';
document.getElementById('diedText').style.color = "white";

document.getElementById('adCard').remove(); //Ad-Block
document.getElementById('errorNotification').remove(); //Error-Block

document.getElementById("leaderboard").style.color = "#fafafa";
document.getElementById("gameName").style.color = "#fafafa";
document.getElementById("setupCard").style.color = "#fafafa";
document.getElementById('gameName').innerHTML = 'MOOMOO.io'
document.getElementById("promoImg").remove();
document.getElementById("scoreDisplay").style.color = "#fafafa";
document.getElementById("woodDisplay").style.color = "#fafafa";
document.getElementById("stoneDisplay").style.color = "#fafafa";
document.getElementById("killCounter").style.color = "#fafafa";
document.getElementById("foodDisplay").style.color = "#fafafa";
document.getElementById("ageText").style.color = "#fafafa";
document.getElementById("allianceButton").style.color = "#fafafa";
document.getElementById("chatButton").style.color = "#fafafa";
document.getElementById("storeButton").style.color = "#fafafa";

(function() {
    'use strict';
    var SoreHolder = document.getElementById('storeHolder');
        SoreHolder.scrollTop = 0;
document.addEventListener('keydown', function(e) {
    if( e.keyCode === 67 ){
        SoreHolder.scrollTop = 800;
        console.log("j is pressed and winter is on");
    };
    if( e.keyCode === 90 ){
        SoreHolder.scrollTop = 1000;
        console.log("r is pressed and flappy is on");
    };
    if( e.keyCode === 70 ){
        SoreHolder.scrollTop = 1050;
        console.log("g is pressed and solieder is on");
    };
    if( e.keyCode === 84){
        SoreHolder.scrollTop = 2100;
        console.log("c is pressed and tank is on");
    };
    if( e.keyCode === 71){
        SoreHolder.scrollTop = 1900;
        console.log("y is pressed and samurai is on");
    };
    if( e.keyCode === 86){
        SoreHolder.scrollTop = 1850;
        console.log("n is pressed and turret is on");
    };
    if( e.keyCode === 67){
        SoreHolder.scrollTop = 1450;
        console.log("b is pressed and bull is on");
    };
    if( e.keyCode === 72){
        SoreHolder.scrollTop = 1560;
        console.log("h is pressed and boost is on");
    };
})
})();


(function() {
var k = function(action){
var eventObj = document.createEvent("Events");


eventObj.initEvent("keydown", true, true);
eventObj.keyCode = 75;
eventObj.which = 75;


document.body.dispatchEvent(eventObj);
};


var killSpaceBar = function(evt) {


var target = evt.target || {},
isInput = ("INPUT" == target.tagName || "TEXTAREA" == target.tagName || "SELECT" == target.tagName || "EMBED" == target.tagName);



if(isInput || !target.tagName) return;



if(target && target.getAttribute && target.getAttribute('role') === 'textbox') return;



if (evt.keyCode === 32) {
evt.preventDefault();
k();
}
};


document.addEventListener("keydown", killSpaceBar, false);


})();
document.addEventListener('keydown', function(e){
if (e.keyCode == 66){
    if (document.activeElement.id == 'chatBox') return;
    if (document.activeElement.id == 'allianceInput') return;
    let Storekey = document.getElementById('storeMenu');
 if (Storekey.style.display == "none")
 {
     Storekey.style.display = "block"
 }
 else if (Storekey.style.display == "block")
 {
     Storekey.style.display = "none"
 }
}
})