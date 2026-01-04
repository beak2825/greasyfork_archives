// ==UserScript==
// @name         h
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  any taggers
// @author       Oki, meppydc, tag
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401363/h.user.js
// @updateURL https://update.greasyfork.org/scripts/401363/h.meta.js
// ==/UserScript==

tagh = "https://meppydc.github.io/meppy-sounds/h.mp3";

function CustomSFXset(){
    this.volume=1;
    this.lock={url:"blank.wav",abs:1};
    this.ready={url:"https://meppydc.github.io/meppy-sounds/any_taggers.mp3",abs:1,set:1};
    this.go={url:tagh,abs:1,set:0};
    this.died={url:tagh,abs:1,set:1};
    this.hold={url:tagh,abs:1,set:0};
    this.move={url:tagh,abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
    this.comboTones={url:tagh,abs:1,set:2,duration:1000,spacing:0,cnt:1};
};


(function() {

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
        setTimeout(x=>{
        console.log("hmm")
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);
        },0)

        //commented out to not replace default sfx

        var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
        var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

/*
var psFunc = Game['prototype']['playSound'].toString();
var psParams = getParams(psFunc)

window.differentVolumes = {"hold":0.1, "lock":0.3}

cutEnd = psFunc.slice(0,-1)
cutEnd = cutEnd + "*(differentVolumes["+psParams[0]+"])?differentVolumes["+psParams[0]+"]:1}"

Game['prototype']['playSound'] = new Function(...psParams, trim(cutEnd));
*/
    });


})();




/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){


//set url to "" if you dont want an extra sound
Game['eventSounds']  = [
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
tagh,
//sound for incoming garbage (less than 4 lines), see bottom of script
tagh,
//sound for incoming garbage (4+ lines), see bottom of script
tagh
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




//Sounds for incoming garbage
var garbageFunc = Game['prototype']['addGarbage'].toString()
var garbageParams = getParams(garbageFunc)
garbageFunc = garbageFunc.replace("}","};playSound(12+ +("+garbageParams+">3));");
Game['prototype']["addGarbage"] = new Function(...garbageParams, trim(garbageFunc));



});
})();

/**************************
  Rotation Sounds Script
**************************/
(function() {
    window.addEventListener('load', function(){


Game['rotationSounds']  = [
tagh, //rotate left
tagh, //rotate right
tagh //rotate 180°
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

(function() {
    //'use strict';

    window.addEventListener('load', function(){
        /*********************
        Harddrop softdrop detection
        **************************/
if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


Game['lockSounds']  = [
tagh, //softdrop
tagh, //harddrop
tagh //lock delay
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
            console.log("softdrop")
            type=0

        } else
        if(Game["keysPressed"][hdKey]) {
            console.log("harddrop")
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

(function() {
    //'use strict';

        window.addEventListener('load', function() {
                CustomSFXset.prototype = new BaseSFXset;
                loadSFX(new CustomSFXset);
        });
function CustomSFXset(){
    this.volume=1;
    this.move={url:"",abs:1,set:0};
};
    window.addEventListener('load', function(){


        /*********************
        left right softdrop detection
        **************************/
if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


Game['moveSounds']  = [
tagh, //left
tagh, //right
"blank.wav" //nothing
];

Game['moveVolumes'] = [1,1,1]


Game["mArray"]=[];
Game["moveSounds"].map((x,i)=>{if(Game['moveSounds'][i]){Game["mArray"].push(document.createElement("audio"));Game["mArray"][i].src=x}else{Game["mArray"].push(null)}})

localStorage.evVol=localStorage.evVol||"100"
window.playMoveSound = function(S){s=Game.mArray[S];!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=Game['moveVolumes'][S]*localStorage.evVol/100,s.play())}


function checkKeys() {
    setTimeout(x=>{
        leftKey = this.Settings.controls[0]
        rightKey = this.Settings.controls[1]
        var type = 2; //lock sound by default

        if(Game["keysPressed"][leftKey]){
            //console.log("left")
            type=0

        } else
        if(Game["keysPressed"][rightKey]) {
            //console.log("right")
            type=1
        }

        Game.mArray[type]&&playMoveSound(type)

        Game["keysPressed"] = []

    },2)
}

placeBlockFunc = Game['prototype']['moveCurrentBlock'].toString()
placeBlockParams = getParams(placeBlockFunc)
placeBlockFunc =  trim(checkKeys.toString()) + trim(placeBlockFunc)
Game['prototype']['moveCurrentBlock'] = new Function(...placeBlockParams, placeBlockFunc)


Game["keysPressed"] = [];
document.onkeydown = function(e) {Game["keysPressed"][e.keyCode] = true}
    });
})();
