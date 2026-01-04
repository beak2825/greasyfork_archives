// ==UserScript==
// @name         ringo
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  SINE! COSINE!
// @author       oki, meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393141/ringo.user.js
// @updateURL https://update.greasyfork.org/scripts/393141/ringo.meta.js
// ==/UserScript==


(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
        //loadVideoSkin("https://i.imgur.com/7VtOOXh.gif",{skinify:true, colorize:false, colorAlpha:.2})
        //loadVideoSkin("https://i.imgur.com/1kVUjoz.gif",{skinify:true, colorize:false, colorAlpha:.2})
        loadVideoSkin("https://i.imgur.com/MPE3KjL.gif",{skinify:true, colorize:false, colorAlpha:.2})

        //Jstris Custom Background Image

            if (typeof Game != "undefined") {
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://steamcdn-a.akamaihd.net/steamcommunity/public/images/items/546050/e6802fb67198c10a38e69bb7f87d830dc3663f0e.jpg')";
        //document.body.style.backgroundImage="url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6934273a-9e15-4547-ad85-38e162633665/dc481ez-ae828fac-2dbd-49e1-93f7-81667f8f266a.png/v1/fill/w_1600,h_900,q_80,strp/puyo_puyo_time__by_theadorableoshawott_dc481ez-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTAwIiwicGF0aCI6IlwvZlwvNjkzNDI3M2EtOWUxNS00NTQ3LWFkODUtMzhlMTYyNjMzNjY1XC9kYzQ4MWV6LWFlODI4ZmFjLTJkYmQtNDllMS05M2Y3LTgxNjY3ZjhmMjY2YS5wbmciLCJ3aWR0aCI6Ijw9MTYwMCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.GjsYNXXcvcHBYeguN_Ob4vSf5ewq987tdFlEWGLVEio')";
        document.body.style.backgroundSize="100% 100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";

        document.getElementById("rstage").style.backgroundColor="rgba(0,0,0,.75)";
        //document.getElementById("rstage").style.opacity = "75%";
            }


        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);



        //commented out to not replace default sfx

    });
})();

//these replace the default jstris sounds
function CustomSFXset(){
    this.volume=1;
    //this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_lock.wav",abs:1};
    this.ready={url:"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_iza-mairimasu.wav",abs:1,set:1};
    this.go={url:"",abs:1,set:0};
    this.died={url:"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_tsugi-wa-yoshuushite-kimasu.wav",abs:1,set:1}; //witch
    //this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_hold.wav",abs:1,set:0};
    //this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_move.wav",abs:1,set:0};
    //this.linefall={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_linefall.wav",abs:1,set:0};
    //this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_combo.mp3",abs:1,set:2,duration:1000,spacing:500,cnt:20};
};


/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){


//set url to "" if you dont want an extra sound
Game['eventSounds']  = [
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_koufunshitekita.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_kufufufufufu.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_sain.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_integuraru.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_kosain.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_paamiteeshon.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_tanjento.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_tetorisu-desu.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_tetorisu-plus-desu.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_kanpeki-desu.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOP_b2btspin.wav",
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_tetorisu-icchau-yo.wav",
//sound for incoming garbage (less than 4 lines), see bottom of script
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_ata.wav",
//sound for incoming garbage (4+ lines), see bottom of script
"https://meppydc.github.io/meppy-sounds/PPTJap/RNG_00/rng_aitatata.wav"
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]


window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","CLEAR5","PERFECT_CLEAR"]
window.enableB2B = false;


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
garbageFunc = garbageFunc.replace("}","};playSound(12+ +("+garbageParams+">3));");
Game['prototype']["addGarbage"] = new Function(...garbageParams, trim(garbageFunc));



});
})();