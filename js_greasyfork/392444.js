// ==UserScript==
// @name         TOAD
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Toad theme for jstris
// @author       thickbut
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392444/TOAD.user.js
// @updateURL https://update.greasyfork.org/scripts/392444/TOAD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        //loadVideoSkin("https://i.imgur.com/YmsOTTq.gif"); //skin with tetris-y garbage and death blocks
        loadVideoSkin("https://i.imgur.com/coqukw0.gif"); //skin with animated gargabe and smb1 death block

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/bXKX6qp.jpg')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";

        //change width of bottom stats box
        document.getElementById("gstats").style.width="236px";

        //change bg color and opacity of various elements
        document.getElementById("bgLayer").style.opacity=".9";
        document.getElementById("chatBox").style.backgroundColor="rgba(0, 0, 0, .9)";
        document.getElementById("holdCanvas").style.backgroundColor="rgba(0, 0, 0, .7)";
        document.getElementById("rstage").style.backgroundColor="rgba(0, 0, 0, .7)";
        //document.getElementById("queueCanvas").style.backgroundColor="rgba(0, 0, 0, .7)";
        document.getElementById("gstats").style.backgroundColor="rgba(0, 0, 0, .7)";
        //document.getElementById("statLabels").style.backgroundColor="rgba(0, 0, 0, .7)";
        //document.getElementById("glstats").style.backgroundColor="rgba(0, 0, 0, .7)";


        //add thin solid white line borders to various elements
        document.getElementById("bgLayer").style.border = "thin solid white";
        document.getElementById("chatBox").style.border = "thin solid white";
        document.getElementById("chatInput").style.border = "thin solid white";
        document.getElementById("rstage").style.border = "thin solid white";
        //document.getElementById("queueCanvas").style.border = "thin solid white";
        document.getElementById("holdCanvas").style.border = "thin solid white";
        document.getElementById("gstats").style.border = "thin solid white";
        //document.getElementById("statLabels").style.border = "thin solid white";
        //document.getElementById("glstats").style.border = "thin solid white";


        //change text color and add shadow to various elements
        document.getElementById("lrem").style.color = "white";
        document.getElementById("sprintText").style.color = "white";
        document.getElementById("gstats").style.color = "white";
        document.getElementById("connectStatus").style.color = "white";
        document.getElementById("lrem").style.textShadow = "0px 0px 10px black";
        document.getElementById("sprintText").style.textShadow = "0px 0px 10px black";
        document.getElementById("statLabels").style.textShadow = "0px 0px 10px black";
        document.getElementById("connectStatus").style.textShadow = "0px 0px 10px black";

        //change opponent field styles (semi transparent playfield, white border, text stroke on names)
        var opponentStyle=document.createElement("style");
        opponentStyle.innerHTML='.slot span a {text-shadow:-1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;} .slot span {text-shadow:-1px -1px 0px black, 1px -1px 0px black, -1px 1px 0px black, 1px 1px 0px black;} .players .bgLayer{background-color:rgba(0, 0, 0, 0.9); border:2px solid white;}';
        document.body.appendChild(opponentStyle);

        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_lock.wav",abs:1};
    this.ready={url:"https://thickbut.github.io/jstris/toad_ready.wav",abs:1,set:1};
    this.go={url:"https://thickbut.github.io/jstris/toad_go.wav",abs:1,set:1};
    this.died={url:"https://thickbut.github.io/jstris/toad_died.wav",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_move.wav",abs:1,set:0};
    //this.comboTones={url:"blank.wav",abs:1,set:2,duration:2500,spacing:500,cnt:8};
    //this.linefall={url:"blank.wav",abs:1,set:0};
};

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){


Game['eventSounds']  = [
"https://thickbut.github.io/jstris/toad_tspinsingle.wav",
"https://thickbut.github.io/jstris/toad_tspinmini.wav",
"https://thickbut.github.io/jstris/toad_clear1.wav",
"https://thickbut.github.io/jstris/toad_tspindouble.wav",
"https://thickbut.github.io/jstris/toad_clear2.wav",
"https://thickbut.github.io/jstris/toad_tspintriple.wav",
"https://thickbut.github.io/jstris/toad_clear3.wav",
"https://thickbut.github.io/jstris/toad_clear4.wav",
"https://thickbut.github.io/jstris/toad_clear4.wav",
"https://thickbut.github.io/jstris/toad_perfectclear.wav",
"https://thickbut.github.io/jstris/toad_b2b_tspin_double.wav",
"https://thickbut.github.io/jstris/toad_b2b_tetris.wav"
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1,1]


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","CLEAR5","PERFECT_CLEAR"]
window.enableB2B = true;


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
searchFor = clcFunc.split("switch")[1].split("=")[2]
searchFor = searchFor.substr(searchFor.indexOf("_0x"),searchFor.indexOf("]]["))

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

});
})();