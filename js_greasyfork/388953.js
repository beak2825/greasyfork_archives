// ==UserScript==
// @name         PPT Theme but more memez
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  PPT theme but with weird SFX
// @author       Oki, Eddie, Harry, meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388953/PPT%20Theme%20but%20more%20memez.user.js
// @updateURL https://update.greasyfork.org/scripts/388953/PPT%20Theme%20but%20more%20memez.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){


        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/G6WbXoD.png",32);
        loadGhostSkin("https://i.imgur.com/OvH7LA4.png",36);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/YfV0NmQ.jpg')";
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
    this.lock={url:"blank.wav",abs:1};
    //this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_lock.wav,abs:1};
    this.ready={url:"https://meppydc.github.io/meppy-sounds/ex_youready.wav",abs:1,set:1};
    this.go={url:"https://meppydc.github.io/meppy-sounds/ex_awesome.wav",abs:1,set:0};
    this.died={url:"https://meppydc.github.io/meppy-sounds/ex_havingfun.wav",abs:1,set:1};
    this.hold={url:"https://meppydc.github.io/meppy-sounds/Tee_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_move.wav",abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
    this.comboTones={url:"https://meppydc.github.io/meppy-sounds/wch_laugh_minus30.wav",abs:1,set:2,duration:1000,spacing:0,cnt:1};
};

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){

Game['eventSounds']  = [
"https://meppydc.github.io/meppy-sounds/Tee_tstrike.wav",
"https://meppydc.github.io/meppy-sounds/ris_bearsounds.wav",
"https://meppydc.github.io/meppy-sounds/rng_sin.wav",
"https://meppydc.github.io/meppy-sounds/Tee_tstrike.wav",
"https://meppydc.github.io/meppy-sounds/rng_cosine.wav",
"https://meppydc.github.io/meppy-sounds/Tee_tstrike.wav",
"https://meppydc.github.io/meppy-sounds/rng_tangento.wav",
"https://meppydc.github.io/meppy-sounds/wch_tetorisdeswa.wav",
"https://meppydc.github.io/meppy-sounds/shz_shadowedgy.wav",//pentris die
"https://meppydc.github.io/meppy-sounds/ami_perfecto.wav", //no sound exists for TB
"https://meppydc.github.io/meppy-sounds/Tee_tstrike.wav",//not played
"https://meppydc.github.io/meppy-sounds/ex_tetris.wav"//not played
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

localStorage.mainVol = localStorage.mainVol || "25"
document.getElementById("settingsSave").addEventListener("click", function(){
    localStorage.mainVol=document.getElementById('vol-control').value
}, false);

Settings['prototype']['volumeChange'](+localStorage.mainVol)

/**************************
  Rotation Sounds Script
**************************/

        //rotations
        var rotationSound = ''
        //rotationSound = 'https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_rotate.wav'
        rotationSound = 'https://meppydc.github.io/meppy-sounds/ex_revolution.wav'
        //rotationSound = 'https://meppydc.github.io/meppy-sounds/mst_rotationx.wav'

Game['rotationSounds']  = [
'https://meppydc.github.io/meppy-sounds/ex_revolution.wav', //rotate left
'https://meppydc.github.io/meppy-sounds/ex_revolution.wav', //rotate right
'https://meppydc.github.io/meppy-sounds/mst_rotationx.wav' //rotate 180°
];

Game['rotationVolumes'] = [1,1,1]

localStorage.evVol=localStorage.evVol||"25"

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
       Songs Script
**************************/


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


localStorage.musicVol = localStorage.musicVol || "100";
localStorage.SPvol = localStorage.SPvol || "100";

var musicVol = document.createElement("tr");
musicVol.innerHTML = 'Music vol (MP):&nbsp;<input id="volControl" oninput="Game.setVol(volControl.value,1)" type="range" min="0" max="100" value="'+localStorage.musicVol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting">'+localStorage.musicVol+'%</span>'
tab_appear.appendChild(musicVol);

var spVol = document.createElement("tr");
spVol.innerHTML = 'Music vol (SP):&nbsp;<input id="volControl2" oninput="Game.setVol(volControl2.value,0)" type="range" min="0" max="100" value="'+localStorage.SPvol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting2">'+localStorage.SPvol+'%</span>'
tab_appear.appendChild(spVol);



Game["setVol"] = function(vol,mode) {
    if(mode){
        localStorage.musicVol = vol
        volSetting.innerHTML=vol+'%';
        var musicVol=document.getElementById("volControl")
        Game["songs"].map(x=>{
            x.volume = (musicVol.value/100);
        })
    } else {
        localStorage.SPvol = vol
        volSetting2.innerHTML=vol+'%';
        var spVol=document.getElementById("volControl2")
        Game["song"].volume = spVol.value/100
    }
}


if(typeof Game != "undefined"){


var songsMP = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPTsong1.mp3",
]

var songSP = "https://ecdldaiiere.github.io/Eddiez-Soundz/PPTsong1.mp3"

var songThresholds = [1]

Game['onlySprint'] = false;


window.playSong = function(s) {
    Game["songs"].map(x=>{
        x.pause();
        x.currentTime = 0;
    })
    Game["song"].pause();
    Game["song"].currentTime = 0;

    if(s != undefined){
        !s.paused&&0<s.currentTime?s.currentTime=0:s.play()
    }
}

Game["songs"] = [];
Game["maxPlayers"] = 0
Game["songIndex"] = -1


Game["song"] = document.createElement("audio");
Game["song"].src = songSP;
Game["song"].loop = true;
Game["song"].volume = .25;

songsMP.map((x,i)=>{
    Game["songs"].push(document.createElement("audio"));
    Game["songs"][i].src = x;
    Game["songs"][i].loop = true;
    Game["songs"][i].volume = .25;
})

Game["setVol"](localStorage.musicVol,1)
Game["setVol"](localStorage.SPvol,0)


Game["updateSong"] = function(i) {

    if(i<0){
        Game["maxPlayers"] = 0
        playSong()
        Game["songIndex"] = -1
    }

    if(i==0){
        Game["maxPlayers"]= -1
        playSong(Game["songs"][0])
        Game["songIndex"] = 0
    }

    if(typeof i == "string"){
        if(Game["maxPlayers"]<0){
            Game["maxPlayers"]=parseInt(i)
        }
        var alivePercent = (parseInt(i)-1)/Game["maxPlayers"]
        if(alivePercent <= songThresholds[Game["songIndex"]+1]){
            console.log(Game["songIndex"])
            Game["songIndex"]++
            playSong(Game["songs"][Game["songIndex"]])
        }
    }

}

var gameOver99 = Game['prototype']['GameOver'].toString();
gameOver99 = "Game['updateSong'](-1);Game['song'].pause();Game['song'].currentTime=0;" + trim(gameOver99)
Game['prototype']['GameOver'] = new Function(gameOver99)

var printSlot99 = SlotView['prototype']['printSlotPlace'].toString()
var printSlotParams = getParams(printSlot99);
printSlot99 = `Game["updateSong"](this['slot']['gs']['p']['getPlaceColor'](${printSlotParams[0]})['str']);` + trim(printSlot99)
SlotView['prototype']['printSlotPlace'] = new Function(...printSlotParams, printSlot99);



var readyGo99 = Game['prototype']['restart'].toString()
readyGo99 = "if(this['pmode']+this['isPmode'](true)+this['isPmode'](false)==0){Game['updateSong'](0)}else{Game['updateSong'](-1);if(!Game['onlySprint']){playSong(Game['song'])}else{if(this['pmode']==1){playSong(Game['song'])}}};" + trim(readyGo99)
Game['prototype']['restart'] = new Function(readyGo99);

var specMode99 = Live['prototype']['spectatorMode'].toString()
var specParams = getParams(specMode99);
specMode99 = `Game['updateSong'](-1);` + trim(specMode99)
Live['prototype']['spectatorMode'] = new Function(...specParams, specMode99);

var paint99 = Game['prototype']['paintMatrixWithColor'].toString()
var paintParams = getParams(paint99);
paint99 = `Game['updateSong'](-1);` + trim(paint99)
Game['prototype']['paintMatrixWithColor'] = new Function(...paintParams, paint99);

localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){localStorage.mainVol=document.getElementById('vol-control').value}, false);
Settings['prototype']['volumeChange'](+localStorage.mainVol)

//remove these 3 lines if you dont want the music to stop for the countdown
var readyGo992 = Game['prototype']['readyGo'].toString()
readyGo992 = "Game['updateSong'](-1);" + trim(readyGo992)
Game['prototype']['readyGo'] = new Function(readyGo992);
}


         });

    window.addEventListener('load', function(){
        /*********************
        Harddrop softdrop detection
        **************************/
if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


Game['lockSounds']  = [
"https://meppydc.github.io/meppy-sounds/Tee_lockdown.wav", //softdrop
"https://meppydc.github.io/meppy-sounds/ex_harddrop.wav", //harddrop
"https://meppydc.github.io/meppy-sounds/Tee_lockdown.wav" //lock delay
];

Game['lockVolumes'] = [1,1,1]


Game["lArray"]=[];
Game["lockSounds"].map((x,i)=>{if(Game['lockSounds'][i]){Game["lArray"].push(document.createElement("audio"));Game["lArray"][i].src=x}else{Game["lArray"].push(null)}})

localStorage.evVol=localStorage.evVol||"100"
window.playLockSound = function(S){s=Game.lArray[S];!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=Game['lockVolumes'][S]*localStorage.evVol/100,s.play())}


function checkKeys() {
    setTimeout(x=>{
        hdKey = this.Settings.controls[3]
        sdKey = this.Settings.controls[2]
        var type = 2; //lock sound by default

        if(Game["keysPressed"][sdKey]){
            //console.log("softdrop")
            type=0

        } else
        if(Game["keysPressed"][hdKey]) {
            //console.log("harddrop")
            type=1
        }

        Game.lArray[type]&&playLockSound(type)

        Game["keysPressed"] = []

    },2)
}

placeBlockFunc = GameCore['prototype']['placeBlock'].toString()
placeBlockParams = getParams(placeBlockFunc)
placeBlockFunc =  trim(placeBlockFunc) + trim(checkKeys.toString())
GameCore['prototype']['placeBlock'] = new Function(...placeBlockParams, placeBlockFunc)


Game["keysPressed"] = [];
document.onkeydown = function(e) {Game["keysPressed"][e.keyCode] = true}
    });

        


})();