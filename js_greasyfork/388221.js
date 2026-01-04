// ==UserScript==
// @name         Ayaya Theme
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Ayaya theme for Jstris
// @author       thickBUT
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388221/Ayaya%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/388221/Ayaya%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadVideoSkin("https://i.imgur.com/rqvJuyO.gif",{skinify:true, colorize:true, colorAlpha:.2})

        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_lock.wav",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_ready.wav",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_go.wav",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/ayayalose.wav",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_move.wav",abs:1,set:0};
    this.linefall={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_linefall.wav",abs:1,set:0};
    this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/ayayacombo.wav",abs:1,set:2,duration:750,spacing:250,cnt:20};
    this.linefall={url:"blank.wav",abs:1,set:0};
};

 /**************************
       Songs Script
**************************/

//change this to true if you want music to only play in sprint
var sprintOnly = false


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


localStorage.musicVol = "5";
localStorage.SPvol = "5";

var musicVol = document.createElement("tr");
musicVol.innerHTML = 'Ayaya vol (MP):&nbsp;<input id="volControl" oninput="Game.setVol(volControl.value,1)" type="range" min="0" max="100" value="'+localStorage.musicVol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting">'+localStorage.musicVol+'%</span>'
tab_sound.appendChild(musicVol);

var spVol = document.createElement("tr");
spVol.innerHTML = 'Ayaya vol (SP):&nbsp;<input id="volControl2" oninput="Game.setVol(volControl2.value,0)" type="range" min="0" max="100" value="'+localStorage.SPvol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting2">'+localStorage.SPvol+'%</span>'
tab_sound.appendChild(spVol);



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

//this exists 🤔
var song = "https://ecdldaiiere.github.io/Eddiez-Soundz/ayayasong.mp3"

if(typeof Game != "undefined"){

var songsMP = [song,]

var songSP = song


var songThresholds = [1]

Game['onlySprint'] = sprintOnly;//mega think


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
Game["song"].volume = 1;

songsMP.map((x,i)=>{
    Game["songs"].push(document.createElement("audio"));
    Game["songs"][i].src = x;
    Game["songs"][i].loop = true;
    Game["songs"][i].volume = 1;
})

Game["setVol"](localStorage.musicVol,.1)
Game["setVol"](localStorage.SPvol,.1)


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

//Stops song on gameover
var gameOver99 = Game['prototype']['GameOver'].toString();
gameOver99 = "Game['updateSong'](-1);Game['song'].pause();Game['song'].currentTime=0;" + trim(gameOver99)
Game['prototype']['GameOver'] = new Function(gameOver99)

//Sets different song based on remaining player count
var printSlot99 = SlotView['prototype']['printSlotPlace'].toString()
var printSlotParams = getParams(printSlot99);
printSlot99 = `Game["updateSong"](this['slot']['gs']['p']['getPlaceColor'](${printSlotParams[0]})['str']);` + trim(printSlot99)
SlotView['prototype']['printSlotPlace'] = new Function(...printSlotParams, printSlot99);


//Starts singleplayer song or multiplayer song
var readyGo99 = Game['prototype']['restart'].toString()
readyGo99 = "if(this['pmode']+this['isPmode'](true)+this['isPmode'](false)==0){Game['updateSong'](0)}else{Game['updateSong'](-1);if(!Game['onlySprint']){playSong(Game['song'])}else{if(this['pmode']==1){playSong(Game['song'])}}};" + trim(readyGo99)
Game['prototype']['restart'] = new Function(readyGo99);

//Stops song when you go into spectator mode
var specMode99 = Live['prototype']['spectatorMode'].toString()
var specParams = getParams(specMode99);
specMode99 = `Game['updateSong'](-1);` + trim(specMode99)
Live['prototype']['spectatorMode'] = new Function(...specParams, specMode99);

//Stops song on losing (again, just to be safe)
var paint99 = Game['prototype']['paintMatrixWithColor'].toString()
var paintParams = getParams(paint99);
paint99 = `Game['updateSong'](-1);` + trim(paint99)
Game['prototype']['paintMatrixWithColor'] = new Function(...paintParams, paint99);

//Fix so that main volume doesnt reset
localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){localStorage.mainVol=document.getElementById('vol-control').value}, false);
Settings['prototype']['volumeChange'](+localStorage.mainVol)


//remove these 3 lines if you dont want the music to stop for the countdown
var readyGo992 = Game['prototype']['readyGo'].toString()
readyGo992 = "Game['updateSong'](-1);" + trim(readyGo992)
Game['prototype']['readyGo'] = new Function(readyGo992);
}
