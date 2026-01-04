// ==UserScript==
// @name         Tetris Ultimate Theme
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Tetris Ultimate theme for Jstris
// @author       Eddie, Bang
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391859/Tetris%20Ultimate%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/391859/Tetris%20Ultimate%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/0kZZro6.png",32);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://stmed.net/sites/default/files/tetris-hd-wallpapers-33758-4492289.jpg')";
        document.body.style.backgroundSize="100% 100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0.8)";
        document.getElementById("app").style.height="1000px";


        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://www.dropbox.com/s/d8is2gbsz3rpg8r/harddrop.wav?dl=1",abs:1};
    this.ready={url:"https://www.dropbox.com/s/ewbt1y5h156jdov/ready.wav?dl=1",abs:1,set:1};
    this.go={url:"https://www.dropbox.com/s/islh7roq1cv6zdy/go.wav?dl=1",abs:1,set:0};
    this.died={url:"https://www.dropbox.com/s/tvyaitwpmot147i/gameover.wav?dl=1",abs:1,set:1};
    this.hold={url:"https://www.dropbox.com/s/8o8l7xokoovnzc3/hold.wav?dl=1",abs:1,set:0};
    this.move={url:"https://www.dropbox.com/s/m5u5a52k4qkx5fj/move.wav?dl=1",abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
};

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){

Game['eventSounds']  = [
"https://www.dropbox.com/s/7bw5ppejo4i7cal/tspin1.wav?dl=1",
"https://www.dropbox.com/s/7bw5ppejo4i7cal/tspin1.wav?dl=1",
"https://www.dropbox.com/s/45bnsiim00t31fj/erase1.wav?dl=1",
"https://www.dropbox.com/s/cy5b2mlh3r8u7gz/tspin2.wav?dl=1",
"https://www.dropbox.com/s/xa15smtzcvum3pe/erase2.wav?dl=1",
"https://www.dropbox.com/s/xcsirkh0q9kln59/tspin3.wav?dl=1",
"https://www.dropbox.com/s/hap6m5kzvtuc0o7/erase3.wav?dl=1",
"https://www.dropbox.com/s/epnscuwpz10koak/erase4.wav?dl=1",
"https://ecdldaiiere.github.io/Eddiez-Soundz/NullpoLeague_clear5.mp3",
"https://www.dropbox.com/s/rctex0n9d1tpcfx/bravo.wav?dl=1",  //perfect clear sound in NullpoLeague uses clear4 sound
"https://www.dropbox.com/s/qtnnf126byxz9iq/b2b_tspin2.wav?dl=1",
"https://www.dropbox.com/s/epnscuwpz10koak/erase4.wav?dl=1"
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
      
/**************************
  Rotation Sounds Script
**************************/

Game['rotationSounds']  = [
"https://www.dropbox.com/s/3ylv0d6y23ys6jo/rotate.wav?dl=1", //rotate left
"https://www.dropbox.com/s/3ylv0d6y23ys6jo/rotate.wav?dl=1", //rotate right
"https://www.dropbox.com/s/3ylv0d6y23ys6jo/rotate.wav?dl=1" //rotate 180°
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