// ==UserScript==
// @name         Akira's Nullpomino Sound Pack
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  sounds by Akira
// @author       Akira, Eddie
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/391877/Akira%27s%20Nullpomino%20Sound%20Pack.user.js
// @updateURL https://update.greasyfork.org/scripts/391877/Akira%27s%20Nullpomino%20Sound%20Pack.meta.js
// ==/UserScript==

(function() {

    function CustomSFXset(){
    this.volume=1;
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_lock.wav",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_ready.wav",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_go.wav",abs:1,set:0};
    this.died={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_died.wav",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_move.wav",abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
    this.comboTones={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_combo.mp3",abs:1,set:2,duration:2000,spacing:500,cnt:15};
    };

    window.addEventListener('load', function(){

        //Next Piece Sounds
        var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
        Game['pieceSoundsTGM'] = [];
        var srcs = [
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_i.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_o.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_t.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_l.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_j.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_s.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_z.wav",
          "https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_idk.wav"
        ];

        Game['playSoundTGM'] = function(s)
        {
          if (!s.paused && s.currentTime > 0)
          {
            s.currentTime = 0;
          }
          else s.play();
        }

        function a(s, b)
        {
          for (var i = 0; i < b.length; i++)
          {
            s.push(document.createElement("audio"));
            s[i].src = b[i];
            s[i].volume = 0.8;
          }
        }
        a(Game['pieceSoundsTGM'], srcs);


        var uqbFunc = Game['prototype']['updateQueueBox'].toString()
        uqbFunc = "Game['playSoundTGM'](Game['pieceSoundsTGM'][this.queue[0].id]);" + trim(uqbFunc)
        Game['prototype']['updateQueueBox'] = new Function(uqbFunc);

        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/ZaXgGVa.png",32);
        loadGhostSkin("https://i.imgur.com/zyeqsgp.png",32);

        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/mIUIZ4N.png')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0)";
        document.getElementById("app").style.height="1000px";


/**************************
  Rotation Sounds Script
**************************/

Game['rotationSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_rotate.wav", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_rotate.wav", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_rotate.wav" //rotate 180°
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
  Special Events Script
**************************/
Game['eventSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_tspinsingle.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_tspinmini.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_clear1.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_tspindouble.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_clear2.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_clear3.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_tspintriple.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_clear4.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_clear5.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_perfectclear.wav",   //no sound exists for Nullpo
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_tspindouble.wav",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Akira_clear4.wav"
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


    }

  )();
})();