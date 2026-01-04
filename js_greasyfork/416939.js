// ==UserScript==
// @name         cripmod!!
// @namespace    trent0nbro
// @version      0.2
// @description  for the fake ganstas
// @author       tyellowtail3198
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://abc.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416939/cripmod%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/416939/cripmod%21%21.meta.js
// ==/UserScript==
 document.getElementById("gameName").innerHTML = "cripmod.io";
setInterval(() => {
  setTimeout( () => {
    document.getElementById("gameName").style.color = "red";
    setTimeout( () => {
       document.getElementById("gameName").style.color = "blue";
       setTimeout( () => {
         document.getElementById("gameName").style.color = "green";
         setTimeout( () => {
           document.getElementById("gameName").style.color = "purple";
         setTimeout( () => {
           document.getElementById("gameName").style.color = "yellow";
           setTimeout( () => {
            document.getElementById("gameName").style.color = "blue";
            setTimeout( () => {
    document.getElementById("gameName").style.color = "green"; 
    }, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);
}, 100);}
 , 700); 
 
document.getElementById('loadingText').innerHTML = 'trentons  Mod is loading... Is Not Done Yet';
setTimeout( () => {
document.getElementById('loadingText').innerHTML = 'Loading almost done. If it dosent load refresh page';
}, 400);
   500;

setInterval(() => {
document.getElementById('enterGame').innerHTML = 'Enter And See The bloods';
setTimeout( () => {
document.getElementById('enterGame').innerHTML = 'bloods Names Changed!!';
}, 400);}
 , 500);

setInterval(() => {
document.getElementById('enterGame').style.color = 'red';
setTimeout( () => {
document.getElementById('enterGame').style.color = 'blue';
}, 400);}
 , 500);

setInterval(() => {
setTimeout( () => {
document.getElementById('nameInput').placeholder = "crip";
setTimeout( () => {
document.getElementById('nameInput').placeholder = "crip";
}, 200);
}, 200);}
 , 500);
setInterval(() => {
setTimeout( () => {
document.getElementById('diedText').style.color = "blue";
document.getElementById('diedText').innerHTML = "NOOOOOOOOO";
setTimeout( () => {
document.getElementById('diedText').style.color = "blue";
document.getElementById('diedText').innerHTML = "YOU DIED by a blood";
}, 200);
}, 200);}
 , 500);

setInterval(() => {
setTimeout( () => {
document.getElementById('nameInput').style.color = "red";
setTimeout( () => {
document.getElementById('nameInput').style.color = "blue";
}, 200);
}, 200);}
 , 500);
 $('#leaderboard').append('crip kod is the best');
document.getElementById("leaderboard").style.color = "blue";
document.getElementById("chatButton").style.color = "blue";
document.getElementById("allianceButton").style.color = "blue";
document.getElementById("storeButton").style.color = "blue";
document.getElementById("killCounter").style.color = "blue";
document.getElementById("ageText").style.color = "blue";
document.getElementById('adCard').remove(); 
document.getElementById("promoImgHolder").innerHTML = 
document.title = "cripmod";
document.getElementById("mainMenu").style.backgroundImage = "url(https://cdn.wallpapersafari.com/61/11/1KvsRm.gif)";
document.querySelectorAll("#adCard, #pre-content-container").forEach(function(a){
a.remove();
});
document.getElementsByClassName("menuCard")[4].remove();
document.getElementsByClassName("menuCard")[2].remove();
window.devicePixelRatio = 0.8;
var clearIframes = setInterval(function(){
    for (var i = 0; i < document.getElementsByTagName("iframe").length; i++){
    document.getElementsByTagName("iframe")[i].remove();
    }
if(document.getElementsByTagName("iframe").length === 0){
clearInterval(clearIframes);
}
}, 50);
var password = "trenton";
var response;
var entryCount = 0;
var entryLimit = 999999;
var error = false;

while(response != password && !error){
    if(entryCount < entryLimit){
        response = window.prompt("If you want to see cripMod load enter the password.");
        entryCount++;
    } else {
        error = true;
    }
}

if(error){
    alert("no game for you haha");
} else {
    alert("Password Correct");
}