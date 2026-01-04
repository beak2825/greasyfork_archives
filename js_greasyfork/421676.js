// ==UserScript==
// @name         Prisma Theme
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  a colorful theme for jstris
// @author       Justin1L8
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421676/Prisma%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/421676/Prisma%20Theme.meta.js
// ==/UserScript==

// code was taken from Eddie and Oki, but all images and sounds are mine

var customTextures = true;
var customSFX = true;

if (customTextures) {
    (function() {
        'use strict';

        window.addEventListener('load', function(){
            // Custom Navigation Bar
            let nav = document.querySelector('nav');
            nav.style.backgroundImage ='url("https://i.imgur.com/UddMv3X.png")'
            nav.style.backgroundSize = 'cover'
            nav.style.backgroundPositionY = '60px'


            // If Ingame
            if (typeof Game != "undefined") {
                // Hide Opponents' Fields' Grid
                var customStyle=document.createElement("style");
                customStyle.innerHTML='.players .bgLayer{display:none;}';
                document.body.appendChild(customStyle);

                // Jstris Block Skin Change
                loadSkin("https://i.imgur.com/goqOyYW.png",32);
                loadGhostSkin("https://i.imgur.com/NzkZJXe.png",32);

                // Jstris Custom Background Image
                document.head.getElementsByTagName("style")[0].innerHTML="";
                // document.body.style.backgroundImage="url('https://i.imgur.com/iBL3VI5.png')"; // old bg
                document.body.style.backgroundImage="url('https://i.imgur.com/bgDtXir.png')"; // new bg
                document.body.style.backgroundSize="100%";
                // document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0.6)";
                // document.getElementById("app").style.height=screen.height + "px";

                // Transparent Chat Box
                document.getElementById("chatBox").style = "height:154px;background-color:rgba(80,80,80,.2);border-color:black;border-style:solid;border-width:1px;";


                // Custom Board
                if(typeof Game != "undefined"){
                    if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
                    if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

                    function atGameStart() {

                        bgLayer.width = 500
                        bgLayer.height = 650
                        bgLayer.style.left = "-"+((880-248)/2)/2+"px"
                        bgLayer.style.top = "-"+((1080-480)/2)/2+"px"
                        this.drawBgGrid(1);
                        var bgctx = bgLayer.getContext("2d");
                        var img = new Image;
                        img.onload = function(){
                            bgctx.clearRect(0, 0, 880, 1080);
                            bgctx.drawImage(img,58,120,880/2,1080/2);
                        };
                        img.src = "https://i.imgur.com/DerNqus.png";
                        sprintInfo.style.zIndex = "100000";
                    }

                    var initRandom = GameCore['prototype']['initRandomizer'].toString()
                    var initRandomParams = getParams(initRandom)
                    initRandom = trim(atGameStart.toString()) + trim(initRandom)
                    GameCore['prototype']['initRandomizer'] = new Function(...initRandomParams, initRandom);

                    stage.style.left = "0px"
                }
            }
            // In Replayer
            else {
                document.head.getElementsByTagName("style")[0].innerHTML="";
                document.body.style.backgroundImage="url('https://i.imgur.com/PjuwKLU.png')";
                document.body.style.backgroundSize="100%";
                // document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0.6)";
                // document.getElementById("app").style.height=screen.height + "px";



                if (typeof Replayer != "undefined"){
                    // Block Skin
                    loadSkin("https://i.imgur.com/goqOyYW.png",32);
                }
            }
        });
    })();
}

if (customSFX) {
    (function() {

    function CustomSFXset(){
        this.volume=1;
        this.lock={url:"https://cdn.discordapp.com/attachments/609253923907436585/820881561511002112/hard_drop.wav",abs:1};
        this.ready={url:"https://cdn.discordapp.com/attachments/609253923907436585/820899493439733760/ready.wav",abs:1,set:1};
        this.go={url:"https://cdn.discordapp.com/attachments/609253923907436585/820899518224138260/go.wav",abs:1,set:0};
        this.died={url:"https://cdn.discordapp.com/attachments/609253923907436585/820897140490371102/long_sad.wav",abs:1,set:1};
        this.hold={url:"https://cdn.discordapp.com/attachments/609253923907436585/820888076678332416/hold.wav",abs:1,set:0};
        this.move={url:"https://cdn.discordapp.com/attachments/609253923907436585/820888224079413258/tap.wav",abs:1,set:0};
        this.linefall={url:"blank.wav",abs:1,set:0};
        this.comboTones={url:"https://cdn.discordapp.com/attachments/609253923907436585/821042196329398282/combos.wav",abs:1,set:2,duration:2000,spacing:0,cnt:12};
    };

    window.addEventListener('load', function(){
        //Jstris SFX
        CustomSFXset.prototype = new BaseSFXset;
        loadSFX(new CustomSFXset);


        /**************************
  Rotation Sounds Script
**************************/

        Game['rotationSounds']  = [
            "https://cdn.discordapp.com/attachments/609253923907436585/820888224079413258/tap.wav", //rotate left
            "https://cdn.discordapp.com/attachments/609253923907436585/820888224079413258/tap.wav", //rotate right
            "https://cdn.discordapp.com/attachments/609253923907436585/820888224079413258/tap.wav" //rotate 180°
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

        var rotInsert = 'var rotPos=[0,0,1,2]['+rotParams[0]+'+1];Game.rArray[rotPos]&&playRotSound(rotPos);'

        rotFunc = rotInsert + trim(rotFunc)

        Game['prototype']['rotateCurrentBlock'] = new Function(...rotParams, rotFunc);


        /********************
        Special Events Script
        *********************/

        //set url to "" if you dont want an extra sound
        Game['eventSounds']  = [
            "https://cdn.discordapp.com/attachments/609253923907436585/820901397804482580/spin_single.wav",
            "",
            "https://cdn.discordapp.com/attachments/609253923907436585/820900854638968882/single.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820901436237676584/spin_double.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820900884421804062/double.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820901454234517534/spin_triple.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820900929301118996/triple.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820900945503715409/tetris.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820901454234517534/spin_triple.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820906774466396170/perfect_clear.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820900945503715409/tetris.wav",
            "https://cdn.discordapp.com/attachments/609253923907436585/820900945503715409/tetris.wav",
            //sound for incoming garbage (less than 4 lines), see bottom of script
            "https://cdn.discordapp.com/attachments/609253923907436585/820911067370749962/hit_light.wav",
            //sound for incoming garbage (4+ lines), see bottom of script
            "https://cdn.discordapp.com/attachments/609253923907436585/820915368687042632/hit_heavy.wav"
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
        tab_sound.appendChild(evVol);

        if(typeof playSound != 'function') {
            window.playSound = function(S){s=Game.sArray[S];!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=Game['eventVolumes'][S]*localStorage.evVol/100,s.play())}
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
        psFunc = `
if(Game["latestEv"]){
sIndex=events.indexOf(Game["latestEv"]);
sound=sIndex;enableB2B&&Game.btb&&~[0,1,3,5,7,8].indexOf(sIndex)&&(sound=10+ +(7==sIndex));
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
    })
})();
}