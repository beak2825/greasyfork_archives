// ==UserScript==
// @name         Car Theme
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Car theme for Jstris
// @author       You
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386485/Car%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/386485/Car%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/nZlStFy.png",32);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/xYHDjPW.png')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";

        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/carlock.mp3",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/carready.mp3",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/cargo.mp3",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/cardied.mp3",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/carhold.mp3",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/carmove.mp3",abs:1,set:0};
    this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/carcombo.mp3",abs:1,set:2,duration:2500,spacing:500,cnt:8};
    this.linefall={url:"blank.wav",abs:1,set:0};
};

/**************************
  Rotation Sounds Script
**************************/

Game['rotationSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/car_rotate.mp3", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/car_rotate.mp3", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/car_rotate.mp3" //rotate 180°
];

Game['rotationVolumes'] = [1,1,1]

localStorage.evVol=localStorage.evVol||"100"

Game["rArray"]=[];
Game["rotationSounds"].map((x,i)=>{if(Game['rotationSounds'][i]){Game["rArray"].push(document.createElement("audio"));Game["rArray"][i].src=x}else{Game["rArray"].push(null)}})


window.playRotSound = function(S){s=Game.rArray[S];!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=Game['rotationVolumes'][S]*localStorage.evVol/100,s.play())}


var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

var rotFunc = Game['prototype']['rotateCurrentBlock'].toString()
var rotParams = getParams(rotFunc)

var rotInsert = 'var rotPos=[0,0,1,2]['+rotParams[0]+'+1];console.log(rotPos);Game.rArray[rotPos]&&playRotSound(rotPos);'

rotFunc = rotInsert + trim(rotFunc)

Game['prototype']['rotateCurrentBlock'] = new Function(...rotParams, rotFunc);