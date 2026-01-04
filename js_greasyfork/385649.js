// ==UserScript==
// @name         Special Events Script
// @namespace    http://tampermonkey.net/
// @version      0.98
// @description  allows sounds to be played for special events (eg. T-Spin Double)
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385649/Special%20Events%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385649/Special%20Events%20Script.meta.js
// ==/UserScript==

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){


//set url to "" if you dont want an extra sound
Game['eventSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspinsingle.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspinminisingle.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_clear1.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspindouble.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_clear2.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_tspintriple.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_clear3.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_clear4.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_clear5.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_perfectclear.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_b2btspin.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_b2btetris.mp3",
//sound for incoming garbage (less than 4 lines), see bottom of script
"",
//sound for incoming garbage (4+ lines), see bottom of script
""
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","CLEAR5","PERFECT_CLEAR"]
window.enableB2B = true;


Game["latestEv"]="";Game["sArray"]=[];localStorage.evVol=localStorage.evVol||"100";window.b2bBefore=false;
Game["eventSounds"].map((x,i)=>{
	if(Game['eventSounds'][i]){
		Game["sArray"].push(document.createElement("audio"));Game["sArray"][i].src=x
	}else {
		Game["sArray"].push(document.createElement("audio"));Game["sArray"][i].src="blank.wav"
	}
})


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




//Sounds for incoming garbage
var garbageFunc = Game['prototype']['addGarbage'].toString()
var garbageParams = getParams(garbageFunc)
garbageFunc = garbageFunc.replace("}","};playSound(12+ +("+garbageParams+">4));");
Game['prototype']["addGarbage"] = new Function(...garbageParams, trim(garbageFunc));



});
})();