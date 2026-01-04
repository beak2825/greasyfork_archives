// ==UserScript==
// @name ++WeaponEffects Documentation
// @version 2
// @description ++WeaponEffects in an easy to understand way, for other developers. Please don't 100% copy my full version in put it into a "mod package" or whatever, make your own script. But I'm not selfish so please make your own based off this code. I'm going to get a demanding job and might not be around as much and if so I want this to spark new things. Full version: https://greasyfork.org/en/scripts/370253-weaponeffects
// @author Perussi
// @match *://moomoo.io/*
// @grant none
// @namespace https://greasyfork.org/users/128061
// @downloadURL https://update.greasyfork.org/scripts/370575/%2B%2BWeaponEffects%20Documentation.user.js
// @updateURL https://update.greasyfork.org/scripts/370575/%2B%2BWeaponEffects%20Documentation.meta.js
// ==/UserScript==

// <3 Je$us

var mk = document.getElementById("gameCanvas").getContext("2d");
var Caa = 0;
var Cab = 0;
var aVZ = 0;
// Katana
var fBX = "<3 KatieW.";

// 1920 1080 (game canvas dimensions for drawing)

function testArc(){
  if(document.getElementById("actionBarItem3")){
    if(document.getElementById("actionBarItem3").style.display === "inline-block"){
      if(fBX !== 3){ // WILL CHANGE "3" HERE
        aVZ = [0];
        fBX = 3;
      }
      aVZ[0] += 1;
      if(480 <= aVZ){
        aVZ[0] = 0;
      }
      mk.beginPath();
      mk.lineWidth = 25;
      mk.strokeStyle = "#dc0000";
      mk.arc(1920/2,1080/2,200,0+Math.PI/240*aVZ,2/3*Math.PI+Math.PI/240*aVZ);
      mk.stroke();
    }
  }
}

function letThereBeLight(){
  testArc();
  window.requestAnimationFrame(letThereBeLight);
}

window.requestAnimationFrame(letThereBeLight);