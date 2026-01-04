// ==UserScript==
// @name         LASTNITe|soundpack
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  lastnite sound pack for jstris
// @author       lastnite <<@1astnite>>
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389438/LASTNITe%7Csoundpack.user.js
// @updateURL https://update.greasyfork.org/scripts/389438/LASTNITe%7Csoundpack.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('load', function(){
        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://www.dropbox.com/s/k09olmcjrp9k9tw/harddrop.wav?dl=1",abs:1};          //Alternate lock sound :  https://ecdldaiiere.github.io/Eddiez-Soundz/Lastnite_lock.wav
    this.ready={url:"https://www.dropbox.com/s/81f18xamdnaeaxj/ready.wav?dl=1",abs:1,set:1};
    this.go={url:"https://www.dropbox.com/s/5223lstfsvo1rvo/go.wav?dl=1",abs:1,set:0};
    this.died={url:"https://www.dropbox.com/s/0oiwaeeujeisz9d/gameover.wav?dl=1",abs:1,set:1};
    this.hold={url:"https://www.dropbox.com/s/ec7qlj047wntrkg/hold.wav?dl=1",abs:1,set:0};
    this.move={url:"https://www.dropbox.com/s/ycu429kenn1gagb/move.wav?dl=1",abs:1,set:0};
    this.linefall={url:"https://www.dropbox.com/s/h3qxclmeym6h6jf/erase1.wav?dl=1",abs:1,set:0};
    this.comboTones={url:"https://www.dropbox.com/s/e36cdo7q4sr5li5/combosoundscombined.wav?dl=1",abs:1,set:2,duration:1000,spacing:500,cnt:15};
    this.softdrop={url:"https://www.dropbox.com/s/etim34cifuibgnm/softdrop.wav?dl=0",abs:1,set:0};

};

/**************************
  Rotation Sounds Script
**************************/
(function() {
    window.addEventListener('load', function(){


Game['rotationSounds']  = [
"https://www.dropbox.com/s/rbc74rzsmtu913p/rotate.wav?dl=1", //rotate left
"https://www.dropbox.com/s/rbc74rzsmtu913p/rotate.wav?dl=1", //rotate right
"https://www.dropbox.com/s/rbc74rzsmtu913p/rotate.wav?dl=1" //rotate 180°
];

Game['rotationVolumes'] = [0.6,0.6,0.6]

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


/**************************
  Special Events Script
**************************/

Game['eventSounds']  = [
"https://www.dropbox.com/s/cdzei89d93xhaod/tspin.wav?dl=1",
"https://www.dropbox.com/s/zdizo6r80tsourf/tspin4.wav?dl=1",
"clear1.wav",
"https://www.dropbox.com/s/tw6nomvd7hurjyj/tspin2.wav?dl=1",
"clear2.wav",
"https://www.dropbox.com/s/cu21icqqvdoik4c/tspin3.wav?dl=1",
"clear3.wav",
"clear4.wav",
"perfectclear.wav",
"https://www.dropbox.com/s/kngm1kkxbkx3nas/b2btspin.wav?dl=1",
"https://www.dropbox.com/s/0mydqc0qfdr552h/b2btetris.wav?dl=1"
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1]


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","PERFECT_CLEAR"]
window.enableB2B = true;


Game["latestEv"]="";Game["sArray"]=[];localStorage.evVol=localStorage.evVol||"100";window.b2bBefore=false;
Game["eventSounds"].map((x,i)=>{if(Game['eventSounds'][i]){Game["sArray"].push(document.createElement("audio"));Game["sArray"][i].src=x}else{Game["sArray"].push(null)}})


var evVol = document.createElement("tr");
evVol.innerHTML = `Special Events vol:&nbsp;<input id="volControl3" oninput="localStorage.evVol=volControl3.value;volSetting3.innerHTML=volControl3.value+'%'" type="range" min="0" max="100" value="`+localStorage.evVol+`" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting3">`+localStorage.evVol+`%</span>`
tab_sound.appendChild(evVol);

if(typeof playSound != 'function') {
    window.playSound = function(S){s=Game.sArray[S];console.log(s);!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=Game['eventVolumes'][S]*localStorage.evVol/100,s.play())}
}


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","PERFECT_CLEAR"]

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


var clcFunc = Game['prototype']['checkLineClears'].toString()
var clcParams = getParams(clcFunc)
searchFor = "[_" + clcFunc.split("switch")[1].split("]][_")[2]

events.map((x,i)=>{
	replacement = searchFor.replace("[","[Game['btb']=this['isBack2Back'],Game['latestEv']='"+x+"',")
	clcFunc=clcFunc.replace(searchFor,replacement)
})

Game['prototype']["checkLineClears"] = new Function(...clcParams, trim(clcFunc));

var psFunc = Game['prototype']['playSound'].toString()
var psParams = getParams(psFunc);
psFunc = 'if(Game["latestEv"]){sIndex=events.indexOf(Game["latestEv"]);sound=sIndex;enableB2B&&Game.btb&&~[0,1,3,5,7].indexOf(sIndex)&&(sound=9+ +(7==sIndex));console.log(sound);Game.sArray[sound]&&playSound(sound);Game["latestEv"]="";}' + trim(psFunc)
Game['prototype']['playSound'] = new Function(...psParams, psFunc);

localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){
    localStorage.mainVol=document.getElementById('vol-control').value
}, false);

Settings['prototype']['volumeChange'](+localStorage.mainVol)

});
})();