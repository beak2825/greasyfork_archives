// ==UserScript==
// @name         pdn's theme
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  a personlized version of ppt theme by pdn
// @author       Oki, Eddie, Harry, pdn
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416539/pdn%27s%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/416539/pdn%27s%20theme.meta.js
// ==/UserScript==
    const skinUrl = 'https://i.imgur.com/G6WbXoD.png';
    const skinSize = 32;
    const ghostUrl = 'https://i.imgur.com/OvH7LA4.png';
    const ghostSize = 32;

(function() {
    'use strict';

    window.addEventListener('load', function(){

        //Jstris Block Skin Change
                if (typeof Game != 'undefined') {
        loadSkin("https://i.imgur.com/PK7bld7.png",36);
        loadGhostSkin("https://i.imgur.com/VbOkRzd.png",36);
        } else {
            // Replay Mode

            // Don't load skin before replay starts playing, otherwise it shows stuff like this https://cdn.discordapp.com/attachments/340282855420723201/642924315272151045/unknown.png
            // $('#load').click(() => loadSkin(skinUrl, skinSize));
            // loadSkin got taken away recently, so here's the workaround.

            const skin = new Image;
            skin.src = skinUrl;
            View.prototype.drawBlock = function(t, e, i) {
                if (i && t >= 0 && e >= 0 && t < 10 && e < 20) {
                    const s = this.drawScale * this.block_size;
                    this.ctx.drawImage(skin, this.g.coffset[i] * skinSize, 0, skinSize, skinSize, t * this.block_size, e * this.block_size, s, s);
                }
            }
            View.prototype.drawBlockOnCanvas = function(t, e, i, s) {
                let o = s === this.HOLD ? this.hctx : this.qctx;
                o.drawImage(skin, this.g.coffset[i] * skinSize, 0, skinSize, skinSize, t * this.block_size, e * this.block_size, this.block_size, this.block_size);
            }

            // They don't have loadGhostSkin in replays, so we gotta do it this way.

            const ghost = new Image;
            ghost.src = ghostUrl;
            View.prototype.drawGhostBlock = function(t, e, i) {
                if (t >= 0 && e >= 0 && t < 10 && e < 20) {
                    const s = this.drawScale * this.block_size;
                    this.ctx.drawImage(ghost, (this.g.coffset[i] - 2) * ghostSize, 0, ghostSize, ghostSize, t * this.block_size, e * this.block_size, s, s);
                }
            }
        }
        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/DhLhqEw.png')";
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
    this.lock={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_lock.wav",abs:1};
    this.ready={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_ready.wav",abs:1,set:1};
    this.go={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_go.wav",abs:1,set:0};
    this.died={url:"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/gameover.mp3",abs:1,set:1};
    this.hold={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_hold.wav",abs:1,set:0};
    this.move={url:"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_move.wav",abs:1,set:0};
    this.linefall={url:"blank.wav",abs:1,set:0};
    this.comboTones={url:"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/combotune2.mp3",abs:1,set:2,duration:1500,spacing:500,cnt:7};
};
/**************************
Opponent's Field Background Script
**************************/

var customStyle=document.createElement("style");
customStyle.innerHTML='.players .bgLayer{background-color:yellow;opacity:0.25;}';
document.body.appendChild(customStyle);

/**************************
  Jstris Stats Script
**************************/

(function() {
    window.addEventListener('load', function(){

//default color is #808080 for both
colorhex_numbers = "#FFB600"
colorhex_text = "#B6FFAA"
colorhex_linesRemaining = "#C0FFEE"

colorhex_replay = "#FF0000"

if(typeof Game == "undefined"){
document.querySelectorAll("[id='stats']").forEach((stat) => {
  stat.style.color = colorhex_replay
})
}

sprintText.style.color = colorhex_linesRemaining
lrem.style.color = colorhex_linesRemaining

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? [parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)] : null
}

//canvas2d
var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}

var fastFont = FastFont2D['prototype']['draw'].toString()
var params = getParams(fastFont)
fastFont = trim(fastFont).split("=")
fastFont[2] = fastFont[2].split(";")
fastFont[2][0] = "'"+colorhex_numbers+"'"
fastFont[2] = fastFont[2].join(";")
fastFont = fastFont.join("=")

FastFont2D['prototype']['draw'] = new Function(...params, fastFont);

rgb = hexToRgb(colorhex_numbers)
oldcolor = "[128/ 255,128/ 255,128/ 255,1]"
newcolor = "["+rgb[0]+"/ 255, "+rgb[1]+" / 255, "+rgb[2]+" / 255, 1]"

//webgl
window.resetColor = true;

fastFont = FastFont['prototype']['draw'].toString()
params = getParams(fastFont)
fastFont = trim(fastFont).replace(oldcolor,newcolor)
fastFont = "if(resetColor){this['glParamsSet']=false;resetColor=0};" + fastFont

FastFont['prototype']['draw'] = new Function(...params, fastFont);

//changes the color of the texts
statLabels.style.color = colorhex_text
    });
})();

/**************************
 Remaining Players Script
**************************/

(function() {
    'use strict';

    window.addEventListener('load', function(){

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

    });
})();
/************************************
    TF Grid Script
************************************/
(function() {
    window.addEventListener('load', function(){

customFieldBorder = true //change to false to disable

if(customFieldBorder){
if(typeof Game != "undefined"){


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

function atGameStart() {



    bgLayer.width = 600
    bgLayer.height = 650
    bgLayer.style.left = "-"+((880-248)/2)/2+"px"
    bgLayer.style.top = "-"+((1080-480)/2)/2+"px"
    this.drawBgGrid(1);
    var bgctx = bgLayer.getContext("2d");
    var img = new Image;
    img.onload = function(){
        bgctx.clearRect(0, 0, 880, 1080);
        bgctx.drawImage(img,54,119,471,471*(608/518)); // Or at whatever offset you like
    };
    img.src = "https://i.imgur.com/GwKhSaO.png?width=518&height=608";
    sprintInfo.style.zIndex = "100000";
}

var initRandom = GameCore['prototype']['initRandomizer'].toString()
var initRandomParams = getParams(initRandom)
initRandom = trim(atGameStart.toString()) + trim(initRandom)
GameCore['prototype']['initRandomizer'] = new Function(...initRandomParams, initRandom);





var queueC = queueCanvas.getBoundingClientRect();

for (var i = 0; i < 5; i++) {
    var qCC = document.createElement("canvas");
    qCC.id = "queueCopy" + i
    qCC.className = "queueCopy"
    qCC.style.position = "absolute";
    qCC.style.left = queueC.left+"px";
    qCC.style.top = queueC.top+(72*i)+"px";
    qCC.height=72
    i&&(qCC.style.transform = "translatey("+(72*i)+") ")
    qCC.width=queueCanvas.width
    document.body.appendChild(qCC)

}

var customStyleQueue=document.createElement("style");
customStyleQueue.innerHTML='#queueCanvas {visibility:hidden;} .queueCopy {z-index:1} #holdCanvas {z-index:2}';
document.body.appendChild(customStyleQueue);


var updateQueueBoxFunc = Game['prototype']['updateQueueBox'].toString()

var inject = `;for (var i = 0; i < 5; i++) {
var destCanvas = document.getElementById("queueCopy"+i)
var destCtx = destCanvas.getContext('2d');
destCtx.clearRect(0, 0, destCanvas.width, destCanvas.height);
destCtx.drawImage(queueCanvas, 0, -i*72);}`

updateQueueBoxFunc = trim(updateQueueBoxFunc) + inject

Game['prototype']["updateQueueBox"] = new Function(updateQueueBoxFunc);

queueCopies = [queueCopy0,queueCopy1,queueCopy2,queueCopy3,queueCopy4]

i=0
queueCopies.map(x=>{
    x.style.transform = "scale(0.6,0.6) translate(13px,"+ (100+(-i*20)) +"px)"
    i++
})
queueCopy0.style.transform="scale(0.6,0.6) translate(13px, 80px)"


holdCanvas.style.float = "none"
holdCanvas.style.position = "absolute"
holdCanvas.style.transform = "scale(0.6,0.6)"
holdCanvas.style.top = "40px"
holdCanvas.style.left = "12px"


rInfoBox.style.position = "absolute"
rInfoBox.style.zIndex = 100
rInfoBox.style.marginLeft = "132px"
rInfoBox.style.marginTop = "25px"
rInfoBox.style.transform = "scale(0.8,0.8)"

stage.style.left = "112px"}

}


});
})();

/**************************
  Special Events Script
**************************/
(function() {
    window.addEventListener('load', function(){

/*Game['eventSounds']  = [
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_clear1.wav",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_clear2.wav",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_clear3.wav",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearquad.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/allclear.wav",   //no sound exists for TB
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearquad.mp3"
];*/
Game['eventSounds']  = [
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_clear1.wav",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_clear2.wav",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearspin.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_clear3.wav",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearquad.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/clearbtb.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/clearbtb.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearquad.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/master/clearquad.mp3"
];

Game['eventVolumes']  = [1,1,1,1,1,1,1,1,1,1,1]


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
	replacement = searchFor.replace("[","[Game['btb']=this['isBack2Back'],Game['latestEv']='"+x+"',")
	clcFunc=clcFunc.replace(searchFor,replacement)
})

Game['prototype']["checkLineClears"] = new Function(...clcParams, trim(clcFunc));

var psFunc = Game['prototype']['playSound'].toString()
var psParams = getParams(psFunc);
psFunc = 'if(Game["latestEv"]){sIndex=events.indexOf(Game["latestEv"]);sound=sIndex;enableB2B&&Game.btb&&~[0,1,3,5,7].indexOf(sIndex)&&(sound=9+ +(7==sIndex));console.log(sound);Game.sArray[sound]&&playSound(sound);Game["latestEv"]="";}' + trim(psFunc)
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
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_rotate.wav", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_rotate.wav", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPT_rotate.wav" //rotate 180°
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


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


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
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/Pokémon%20Super%20Mystery%20Dungeon%20OST%20-%20Boss%20Battle%20Children%27s%20Adventure%21.mp3",
"https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/Pokémon%20Super%20Mystery%20Dungeon%20OST%20-%20Legendary%20Boss%20Battle%20Rock%20Version!.mp3",
]

var songSP = "https://raw.githubusercontent.com/pdnghiaqoi/pptsfx/main/Pokémon%20Super%20Mystery%20Dungeon%20OST%20-%20Boss%20Battle%20Children%27s%20Adventure%21.mp3"

//Play song when only X*100% of players are left (first one is always 1)
var songThresholds = [1, 0.5]

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

localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){localStorage.mainVol=document.getElementById('vol-control').value}, false);
Settings['prototype']['volumeChange'](+localStorage.mainVol)

//remove these 3 lines if you dont want the music to stop for the countdown
var readyGo992 = Game['prototype']['readyGo'].toString()
readyGo992 = "Game['updateSong'](-1);" + trim(readyGo992)
Game['prototype']['readyGo'] = new Function(readyGo992);
}

         });
})();