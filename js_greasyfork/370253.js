// ==UserScript==
// @name ++WeaponEffects
// @version 2.1
// @description Cool weapon effects added (katana, short sword, and polearm) ~~ You can easily change the color in your Tampermonkey dashboard code editor, here's a guide: https://tinyurl.com/ybg9z82j ~~ #### MAKE SURE YOU'VE UNINSTALLED THE DEMO BEFORE USING #### ~~ Documentation: https://greasyfork.org/en/scripts/370575-weaponeffects-documentation
// @author Perussi
// @match *://moomoo.io/*
// @match *sandbox.moomoo.io/*
// @grant none
// @namespace https://greasyfork.org/users/128061
// @downloadURL https://update.greasyfork.org/scripts/370253/%2B%2BWeaponEffects.user.js
// @updateURL https://update.greasyfork.org/scripts/370253/%2B%2BWeaponEffects.meta.js
// ==/UserScript==

// <3 Jesus


// Specific Colors toggle -- 0 = off, 1 = on
var sANC = 1;
// Global animation color -- [0] red, [1] green, [2] blue -- (RGB)
var aNC = [255,255,0];
// Rainbow animation color -- [0] 0 = off and 1 = on, [1] cycle speed (300 is 30 seconds for an entire cycle)
var rANC = [0,255];

var mk = document.getElementById("gameCanvas").getContext("2d");
var Laa = 0;
var Lab = 0;
var aVZ = 0;
var fBX = "<3 KatieW.";
var resForRANC = 1;

// 1920-1080

function rainbowColor(){
  if(resForRANC === 1){
    aNC = [255,0,0];
    resForRANC = 0;
  }
  if(aNC[0] === 255 && aNC[1] !== 255 && aNC[2] === 0){aNC[1] += 255/rANC[1];}
  if(aNC[0] !== 0 && aNC[1] === 255 && aNC[2] === 0){aNC[0] += 255/rANC[1]*-1;}
  if(aNC[0] === 0 && aNC[1] === 255 && aNC[2] !== 255){aNC[2] += 255/rANC[1];}
  if(aNC[0] === 0 && aNC[1] !== 0 && aNC[2] === 255){aNC[1] += 255/rANC[1]*-1;}
  if(aNC[0] !== 255 && aNC[1] === 0 && aNC[2] === 255){aNC[0] += 255/rANC[1];}
  if(aNC[0] === 255 && aNC[1] === 0 && aNC[2] !== 0){aNC[2] += 255/rANC[1]*-1;}
  if(aNC[0] < 0){aNC[0] = 0;} if(255 < aNC[0]){aNC[0] = 255;}
  if(aNC[1] < 0){aNC[1] = 0;} if(255 < aNC[1]){aNC[1] = 255;}
  if(aNC[2] < 0){aNC[2] = 0;} if(255 < aNC[2]){aNC[2] = 255;}
}

function katie(){
  if(document.getElementById("actionBarItem0")){
    if(document.getElementById("actionBarItem3").style.display === "inline-block"){
      if(fBX !== 3){
        aVZ = [[0,480],[0,360],[0,255]];
        if(sANC === 1){aNC = [255,0,0];}
        fBX = 3;
      }

      aVZ[0][0] += 1;
      if(aVZ[0][1] <= aVZ[0][0]){
        aVZ[0][0] = 0;
      }
      aVZ[1][0] += 1;
      if(aVZ[1][1] <= aVZ[1][0]){
        aVZ[1][0] = 0;
      }
      aVZ[2][0] += 1;
      if(aVZ[2][1] <= aVZ[2][0]){
        aVZ[2][0] = 0;
      }

      mk.beginPath();
      mk.lineWidth = 24;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.625)";
      mk.arc(960,540,212,0+Math.PI/(aVZ[0][1]/2)*aVZ[0][0],7/8*Math.PI+Math.PI/(aVZ[0][1]/2)*aVZ[0][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 30;
      mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*220)+","+Math.round(aNC[1]/255*220)+","+Math.round(aNC[2]/255*220)+",0.625)";
      mk.arc(960,540,185,0+Math.PI/(aVZ[1][1]/2)*aVZ[1][0],2/3*Math.PI+Math.PI/(aVZ[1][1]/2)*aVZ[1][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 45;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.5)";
      mk.arc(960,540,85,0+Math.PI/(aVZ[2][1]/2)*aVZ[2][0],1/3*Math.PI+Math.PI/(aVZ[2][1]/2)*aVZ[2][0]);
      mk.stroke();
    }
    if(document.getElementById("actionBarItem4").style.display === "inline-block"){
      if(fBX !== 4){
        aVZ = [[0,360],[0,250],[0,225],[0,250]];
        if(sANC === 1){aNC = [255,0,0];}
        fBX = 4;
      }

      aVZ[0][0] += -1;
      if(aVZ[0][1] <= aVZ[0][0]){
        aVZ[0][0] = 0;
      }
      aVZ[1][0] += 1;
      if(aVZ[1][1] <= aVZ[1][0]){
        aVZ[1][0] = 0;
      }
      aVZ[2][0] += -1;
      if(aVZ[2][1] <= aVZ[2][0]){
        aVZ[2][0] = 0;
      }
      aVZ[3][0] += 1;
      if(aVZ[3][1] <= aVZ[3][0]){
        aVZ[3][0] = 0;
      }

      mk.beginPath();
      mk.lineWidth = 36;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.45)";
      mk.arc(960,540,251,0+Math.PI/(aVZ[0][1]/2)*aVZ[0][0],15/16*Math.PI+Math.PI/(aVZ[0][1]/2)*aVZ[0][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 46;
      mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*220)+","+Math.round(aNC[1]/255*220)+","+Math.round(aNC[2]/255*220)+",0.45)";
      mk.arc(960,540,210,0+Math.PI/(aVZ[1][1]/2)*aVZ[1][0],7/9*Math.PI+Math.PI/(aVZ[1][1]/2)*aVZ[1][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 32;
      mk.strokeStyle = "rgb("+Math.round(aNC[0])+","+Math.round(aNC[1])+","+Math.round(aNC[2])+",0.383)";
      mk.arc(960,540,109,0+Math.PI/(aVZ[2][1]/2)*aVZ[2][0],2/3*Math.PI+Math.PI/(aVZ[2][1]/2)*aVZ[2][0]);
      mk.stroke();
      mk.beginPath();
      mk.lineWidth = 26;
      mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*235)+","+Math.round(aNC[1]/255*235)+","+Math.round(aNC[2]/255*235)+",0.383)";
      mk.arc(960,540,80,0+Math.PI/(aVZ[3][1]/2)*aVZ[3][0],7/8*Math.PI+Math.PI/(aVZ[3][1]/2)*aVZ[3][0]);
      mk.stroke();
    }
    if(document.getElementById("actionBarItem5").style.display === "inline-block"){
      if(fBX !== 5){
        aVZ = [[0,250,2.5,10,1.2]];
        if(sANC === 1){aNC = [255,0,255];}
        fBX = 5;
      }

      aVZ[0][0] += 1;
      if(aVZ[0][1] <= aVZ[0][0]){
        aVZ[0][0] = 0;
      }

      for(Laa = 0; Laa < Math.round(aVZ[0][1]/5*2); Laa++){
        mk.beginPath();
        mk.lineWidth = 26;
        mk.strokeStyle = "rgb("+Math.round(aNC[0]/255*235)+","+Math.round(aNC[1]/255*235)+","+Math.round(aNC[2]/255*235)+",0.5)";
        mk.arc(960,540,200+Math.sin(aVZ[0][3]*Math.PI/(aVZ[0][1]/aVZ[0][2])*(Laa-aVZ[0][0]))*aVZ[0][3]*aVZ[0][4],0-2*Math.PI/aVZ[0][1]*Laa+2*Math.PI/aVZ[0][1]*aVZ[0][0],2*Math.PI/aVZ[0][1]-2*Math.PI/aVZ[0][1]*Laa+2*Math.PI/aVZ[0][1]*aVZ[0][0]);
        mk.stroke();
      }
    }
  }
}

function letThereBeLight(){
  if(rANC[0] === 1){
    rainbowColor();
  }
  katie();
  window.requestAnimationFrame(letThereBeLight);
}

window.requestAnimationFrame(letThereBeLight);

// <3 Revival