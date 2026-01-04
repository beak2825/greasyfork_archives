// ==UserScript==
// @name         The Ultimate Jstris Script alter-ver. 1
// @namespace    http://tampermonkey.net/
// @version      0.34
// @description  Multiple script code in one script
// @author       julf, MattMayuga, Oki, Eddie
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/387614/The%20Ultimate%20Jstris%20Script%20alter-ver%201.user.js
// @updateURL https://update.greasyfork.org/scripts/387614/The%20Ultimate%20Jstris%20Script%20alter-ver%201.meta.js
// ==/UserScript==


(function() {
    'use strict';

   window.addEventListener('load', function(){
        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/jkg9VE5.png')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0.7)";
        document.getElementById("app").style.height="1000px";

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/T7PyM45.png",32);
	loadGhostSkin("https://i.imgur.com/VbOkRzd.png",36);

        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

    });
})();

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_lock.mp3",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_ready.mp3",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_go.mp3",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_died.wav",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_hold.mp3",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_move.wav",abs:1,set:0};
    this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Hancombo.mp3",abs:1,set:2,duration:1500,spacing:500,cnt:15};
    };

/**************************
Opponent's Field Grid Script
**************************/

var customStyle=document.createElement("style");
customStyle.innerHTML='.players .bgLayer{display:none;}';
document.body.appendChild(customStyle);

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){

Game['eventSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_tspinsingle.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_tspinmini.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear1.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_tspindouble.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear2.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear3.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_tspintriple.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear4.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear5.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_perfectclear.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_b2btspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_b2btetris.mp3"
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
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_rotate.mp3", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_rotate.mp3", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_rotate.mp3" //rotate 180°
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

/**************************
       Songs Script
**************************/

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}


localStorage.musicVol = localStorage.musicVol || "100";
localStorage.SPvol = localStorage.SPvol || "100";

var musicVol = document.createElement("tr");
musicVol.innerHTML = 'Music vol (MP):&nbsp;<input id="volControl" oninput="Game.setVol(volControl.value,1)" type="range" min="0" max="100" value="'+localStorage.musicVol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting">'+localStorage.musicVol+'%</span>'
tab_sound.appendChild(musicVol);

var spVol = document.createElement("tr");
spVol.innerHTML = 'Music vol (SP):&nbsp;<input id="volControl2" oninput="Game.setVol(volControl2.value,0)" type="range" min="0" max="100" value="'+localStorage.SPvol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting2">'+localStorage.SPvol+'%</span>'
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


if(typeof Game != "undefined"){


var songsMP = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/t99song1.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/t99song2.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/t99song3.mp3"
]

var songSP = "https://ecdldaiiere.github.io/Eddiez-Soundz/t99song1.mp3"

var songThresholds = [1, 0.6, 0.2]

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
Game["song"].volume = 1;

songsMP.map((x,i)=>{
    Game["songs"].push(document.createElement("audio"));
    Game["songs"][i].src = x;
    Game["songs"][i].loop = true;
    Game["songs"][i].volume = 1;
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


//remove these 3 lines if you dont want the music to stop for the countdown
var readyGo992 = Game['prototype']['readyGo'].toString()
readyGo992 = "Game['updateSong'](-1);" + trim(readyGo992)
Game['prototype']['readyGo'] = new Function(readyGo992);
}

/**************************
  Keyboard Display Script
**************************/

if(typeof Game != "undefined"){
if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}

document['addEventListener']('keydown', press);
document['addEventListener']('keyup', press);

function press(e) {
	if(~Game['set2ings'].indexOf(e.keyCode)){
		var corresponding = [6,8,1,2,3,5,4,0][Game['set2ings'].indexOf(e.keyCode)]
		document.getElementsByClassName("kbkey")[corresponding].style.backgroundColor = ["lightgoldenrodyellow",""][+(e.type=="keyup")]
	}
}

var kbhold=document.createElement("div");
kbhold.id="keyboardHolder";
kbhold.style.position="absolute"
kbhold.style.left = (myCanvas.getBoundingClientRect().left - 300) + "px";
kbhold.style.top = (myCanvas.getBoundingClientRect().top + 100) + "px";
document.body.appendChild(kbhold);

var f='<R>M{text-align:center;position: absolute;font-size:15px`{]-Q:QIspacing:0;Nred`td|th|Uwp8o_000000;]:inherit`UT_34ff34`Ujy2k_f8a102`UO_f8ff00;}</RYbo"Yps"KPJV"Ptr^Tq180~TqSD~TqHDZ[CCWZXtr^OqHL~OqCWZ[&lt;[v[&gt;X/JK>~</td^|{padding:10px 5pxIR:solidIwidth:2px`q kbkey">`;}M.tg _{]-N#^PtdV-]border[~jy2kqZ~wp8o">YPdiv id="kX</tdP/trPV class="tgU.tg-Ttc3eRstyleQcollapseP><Op39mNcolor:M#kbo KP/divJtableI;]-';var g=0;var i=0;for(i in g='IJKMNOPQRTUVXYZ[]^_`q|~')var e=f.split(g[i]),f=e.join(e.pop())
keyboardHolder.innerHTML = f

var set2ings = Game['prototype']['readyGo'].toString()
set2ings = "Game['set2ings']=this.Settings.controls;" + trim(set2ings)
Game['prototype']['readyGo'] = new Function(set2ings);

var updateTextBarFunc = Game['prototype']['updateTextBar'].toString()
updateTextBarFunc = trim(updateTextBarFunc) + ";kps.innerHTML='KPS: '+(this.getKPP()*this.placedBlocks/this.clock).toFixed(2)"
Game['prototype']['updateTextBar'] = new Function(updateTextBarFunc);

}

/**************************
   Opponents Left Script
**************************/

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}
if(typeof Game != "undefined"){

var aliveHold=document.createElement("div");
aliveHold.id="aliveHolder";
aliveHold.style.position="absolute"
aliveHold.style.left = (myCanvas.getBoundingClientRect().left - 200) + "px";
aliveHold.style.top = (myCanvas.getBoundingClientRect().top + 400) + "px";
document.body.appendChild(aliveHold);

var f='<div id="lrem"><div id="aliveNum"></div></div><div id="sprintText"><div id="stLrem" style="display: block;">opponents remaining</div></div>'
aliveHolder.innerHTML = f
aliveHolder.style.display='none'

var printAlive = SlotView['prototype']['printSlotPlace'].toString()
var printAliveParams = getParams(printAlive);
printAlive = `aliveHolder.style.display='block';aliveNum.innerHTML=parseInt(this['slot']['gs']['p']['getPlaceColor'](${printAliveParams[0]})['str'])-1;` + trim(printAlive)
SlotView['prototype']['printSlotPlace'] = new Function(...printAliveParams, printAlive);

var readyGoAlive = Game['prototype']['restart'].toString()
readyGoAlive = "if(this['pmode']+this['isPmode'](true)+this['isPmode'](false)==0){aliveHolder.style.display='block';aliveNum.innerHTML='all'};" + trim(readyGoAlive)
Game['prototype']['restart'] = new Function(readyGoAlive);

}

/**************************
   Chat Timestamp Script
**************************/

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

var insertChat = ';var s=document.createElement("span");s.style="color:gray";s.innerHTML = "["+new Date().toTimeString().slice(0,8)+"] ";var c=document.getElementsByClassName("chl");c[c.length-1].prepend(s);'

var sicFunc = Live['prototype']['showInChat'].toString()
var paramsChat = getParams(sicFunc)

sicFunc = trim(sicFunc) + insertChat

Live['prototype']["showInChat"] = new Function(...paramsChat, sicFunc);

});
})();