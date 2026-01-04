// ==UserScript==
// @name         custom SE
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  meppydc's SE
// @author       Oki, meppydc, other people
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390406/custom%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/390406/custom%20SE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){
/*
        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/x89M9a1.png",32);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/nUIgWRb.png')";
        document.body.style.backgroundSize="100% 100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";
*/
        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);
        //commented out to not replace default sfx

    });
})();

//these replace the default jstris sounds
function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://s.jezevec10.com/res/se1/lock.wav",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_ready.wav",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_go.wav",abs:1,set:0};
    //this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/ayayalose.wav",abs:1,set:1};// ayaya
    this.died={url:"https://meppydc.github.io/meppy-sounds/wch_itetedaiyou.wav",abs:1,set:1}; //witch
    this.hold={url:"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_sore.wav",abs:1,set:0};
    this.move={url:"blank.wav",abs:1,set:0};
    this.linefall={url:"https://s.jezevec10.com/res/se1/linefall.wav",abs:1,set:0};
    //this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_combo.mp3",abs:1,set:2,duration:1000,spacing:500,cnt:20};
};

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){

Game['eventSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspinsingle.mp3",
"https://meppydc.github.io/meppy-sounds/ris_bearsounds.wav",
"https://meppydc.github.io/meppy-sounds/rng_sin.wav",
//"https://meppydc.github.io/meppy-sounds/wch_quasar.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspindouble.mp3",
"https://meppydc.github.io/meppy-sounds/rng_cosine.wav",
//"https://meppydc.github.io/meppy-sounds/wch_blackhole.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspintriple.mp3",
"https://meppydc.github.io/meppy-sounds/rng_tangento.wav",
//"https://meppydc.github.io/meppy-sounds/wch_bigabang.wav",
"https://meppydc.github.io/meppy-sounds/wch_tetorisdeswa.wav",
"https://meppydc.github.io/meppy-sounds/wch_puyopuyodeswa.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_perfectclear.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_b2btspin.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_b2btetris.mp3"
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1,1]


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","CLEAR5","PERFECT_CLEAR"]
window.enableB2B = false;


Game["latestEv"]="";Game["sArray"]=[];localStorage.evVol=localStorage.evVol||"100";window.b2bBefore=false;
Game["eventSounds"].map((x,i)=>{if(Game['eventSounds'][i]){Game["sArray"].push(document.createElement("audio"));Game["sArray"][i].src=x}else{Game["sArray"].push(null)}})


var evVol = document.createElement("tr");
evVol.innerHTML = `Special Events vol:&nbsp;<input id="volControl3" oninput="localStorage.evVol=volControl3.value;volSetting3.innerHTML=volControl3.value+'%'" type="range" min="0" max="100" value="`+localStorage.evVol+`" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting3">`+localStorage.evVol+`%</span>`
tab_appear.appendChild(evVol);

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
	replacement = searchFor.replace("[","[Game['btb']=this['isBack2Back'],Game['latestEv']='"+x+"',")
	clcFunc=clcFunc.replace(searchFor,replacement)
})

Game['prototype']["checkLineClears"] = new Function(...clcParams, trim(clcFunc));

var psFunc = Game['prototype']['playSound'].toString()
var psParams = getParams(psFunc);
psFunc = 'if(Game["latestEv"]){sIndex=events.indexOf(Game["latestEv"]);sound=sIndex;enableB2B&&Game.btb&&~[0,1,3,5,7,8].indexOf(sIndex)&&(sound=9+ +(7==sIndex));console.log(sound);Game.sArray[sound]&&playSound(sound);Game["latestEv"]="";}' + trim(psFunc)
Game['prototype']['playSound'] = new Function(...psParams, psFunc);

localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){
    localStorage.mainVol=document.getElementById('vol-control').value
}, false);

Settings['prototype']['volumeChange'](+localStorage.mainVol)

});

/**************************
  Rotation Sounds Script
**************************/
/*
Game['rotationSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_rotate.wav", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_rotate.wav", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_rotate.wav" //rotate 180°
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

*/

})();