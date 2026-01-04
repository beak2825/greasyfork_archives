// ==UserScript==
// @name         WWC Theme
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  Worldwide Combos for Jstris
// @author       Eddie
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387837/WWC%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/387837/WWC%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/zpD5v7L.png",36);
        loadGhostSkin("https://i.imgur.com/w6yagIT.png",36);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/Inu1RkB.jpg')";
        document.body.style.backgroundSize="100% 100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";
        
        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_lock.wav",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_ready.wav",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_go.wav",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_died.wav",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_move.mp3",abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
    };

/**************************
  Opponent's Color Script
**************************/

var customStyle2=document.createElement("style");
customStyle2.innerHTML='.slot span a {color:rgba(255, 255, 255, 100);} .slot span {color:rgba(160, 160, 160, 100);}';
document.body.appendChild(customStyle2);

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){

Game['eventSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear1.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear1.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear1.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear2.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear2.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear3.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear3.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear4.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear5.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_perfectclear.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear2.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_clear4.mp3"
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1,1]


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","CLEAR5","PERFECT_CLEAR"]
window.enableB2B = true;


Game["latestEv"]="";Game["sArray"]=[];localStorage.evVol=localStorage.evVol||"100";window.b2bBefore=false;
Game["eventSounds"].map((x,i)=>{if(Game['eventSounds'][i]){Game["sArray"].push(document.createElement("audio"));Game["sArray"][i].src=x}else{Game["sArray"].push(null)}})


var evVol = document.createElement("tr");
evVol.innerHTML = `Special Events vol:&nbsp;<input id="volControl3" oninput="localStorage.evVol=volControl3.value;volSetting3.innerHTML=volControl3.value+'%'" type="range" min="0" max="100" value="`+localStorage.evVol+`" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting3">`+localStorage.evVol+`%</span>`
tab_sound.appendChild(evVol);

if(typeof playSound != 'function') {
    window.playSound = function(S){s=Game.sArray[S];console.log(s);!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=Game['eventVolumes'][S]*localStorage.evVol/100,s.play())}
}


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","CLEAR5","PERFECT_CLEAR"]

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


var clcFunc = Game['prototype']['checkLineClears'].toString()
var clcParams = getParams(clcFunc)
searchFor = "[_" + clcFunc.split("switch")[1].split("]][_")[2]

events.map((x,i)=>{
	replacement = searchFor.replace("[","[Game['btb']=this['isBack2Back'],console.log('"+x+"'),Game['latestEv']='"+x+"',")
	clcFunc=clcFunc.replace(searchFor,replacement)
})

Game['prototype']["checkLineClears"] = new Function(...clcParams, trim(clcFunc));

var psFunc = Game['prototype']['playSound'].toString()
var psParams = getParams(psFunc);
psFunc = `
if(Game["latestEv"]){
	sIndex=events.indexOf(Game["latestEv"]);
	console.log(sIndex)
	sound=sIndex;enableB2B&&Game.btb&&~[0,1,3,5,7,8].indexOf(sIndex)&&(sound=10+ +(7==sIndex));
	console.log(sound);
	Game.sArray[sound]&&playSound(sound);
	Game["latestEv"]="";
}` + trim(psFunc)

Game['prototype']['playSound'] = new Function(...psParams, psFunc);

localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){
    localStorage.mainVol=document.getElementById('vol-control').value
}, false);

Settings['prototype']['volumeChange'](+localStorage.mainVol)

/**************************
  Rotation Sounds Script
**************************/

Game['rotationSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_rotate.mp3", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_rotate.mp3", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/WWC_rotate.mp3" //rotate 180°
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

    });
})();