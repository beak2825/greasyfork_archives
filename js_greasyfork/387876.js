// ==UserScript==
// @name         tebo is big noobish nerd
// @namespace    http://tampermonkey.net/
// @version      42069.69
// @description  ...jezevec10 is typing...
// @author       julf, MattMayuga, Oki, Eddie, meppydc 🤔
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387876/tebo%20is%20big%20noobish%20nerd.user.js
// @updateURL https://update.greasyfork.org/scripts/387876/tebo%20is%20big%20noobish%20nerd.meta.js
// ==/UserScript==


(function() {
    'use strict';

   window.addEventListener('load', function(){
        //Jstris Custom Background Image
        document.head.getElementsByTagName("style")[0].innerHTML="";
        document.body.style.backgroundImage="url('https://i.imgur.com/jkg9VE5.png')";
        document.body.style.backgroundSize="100%";
        document.getElementById("app").style.backgroundColor="rgba(0, 0, 0, 0.9)";
        document.getElementById("app").style.height="1000px";

        //Jstris Block Skin Change
        loadSkin("https://i.imgur.com/T7PyM45.png",32);
		loadGhostSkin("https://cdn.discordapp.com/attachments/429007833992790036/563712557504921621/tf_default_ghost.png",36);

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
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3",
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear1.mp3",
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear2.mp3",
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_clear3.mp3",
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3",
"https://ecdldaiiere.github.io/Eddiez-Soundz/Han_perfectclear.mp3",
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3",
"http://k007.kiwi6.com/hotlink/56pxwu7mde/SPOILER_t-spin-click-60dB-bass-boost.mp3"
    //I did literally nothing :)
];

window.events = ["TSPIN_SINGLE","TSPIN_MINI_SINGLE","CLEAR1","TSPIN_DOUBLE","CLEAR2","TSPIN_TRIPLE","CLEAR3","CLEAR4","PERFECT_CLEAR"]
window.enableB2B = true;


Game["latestEv"]="";Game["sArray"]=[];localStorage.evVol=localStorage.evVol||"100";window.b2bBefore=false;
Game["eventSounds"].map((x,i)=>{if(Game['eventSounds'][i]){Game["sArray"].push(document.createElement("audio"));Game["sArray"][i].src=x}else{Game["sArray"].push(null)}})


var evVol = document.createElement("tr");
evVol.innerHTML = `Special Events vol:&nbsp;<input id="volControl3" oninput="localStorage.evVol=volControl3.value;volSetting3.innerHTML=volControl3.value+'%'" type="range" min="0" max="100" value="`+localStorage.evVol+`" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting3">`+localStorage.evVol+`%</span>`
tab_appear.appendChild(evVol);

if(typeof playSound != 'function') {
    window.playSound = function(s){!s.paused&&0<s.currentTime?s.currentTime=0:(s.volume=localStorage.evVol/100,s.play())}
}

if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}

var clcFunc = Game['prototype']['checkLineClears'].toString()
events.map((x,i)=>{clcFunc=clcFunc.replace(x+")",x+");Game['btb']=this['isBack2Back'];Game['latestEv']='"+x+"';");})
Game['prototype']["checkLineClears"] = new Function(trim(clcFunc));

var psFunc = Game['prototype']['playSound'].toString()
var psParams = getParams(psFunc);
psFunc = 'if(Game["latestEv"]){sIndex=events.indexOf(Game["latestEv"]);sound=Game["sArray"][sIndex];enableB2B&&Game.btb&&~[0,1,3,5,7].indexOf(sIndex)&&(sound=Game.sArray[9+ +(7==sIndex)]);sound&&playSound(sound);Game["latestEv"]="";}' + trim(psFunc)
Game['prototype']['playSound'] = new Function(...psParams, psFunc);

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
tab_appear.appendChild(musicVol);

var spVol = document.createElement("tr");
spVol.innerHTML = 'Music vol (SP):&nbsp;<input id="volControl2" oninput="Game.setVol(volControl2.value,0)" type="range" min="0" max="100" value="'+localStorage.SPvol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting2">'+localStorage.SPvol+'%</span>'
tab_appear.appendChild(spVol);



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
"http://k007.kiwi6.com/hotlink/8w58in2uwb/interesting.mp3"
]

var songSP = "http://k007.kiwi6.com/hotlink/8w58in2uwb/interesting.mp3"//interesting

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

//Only display the keyboard if either in a Game or Replay
        if (typeof Game != "undefined" || typeof Replayer != "undefined") {

            //labels are     0     1     2          3
            var labels = ['tebo','noob', 'HD',      'CW',
                          // 4     5     6     7    8     9
                          '180', 'HL', 'CCW', 'L', 'SD', 'R']
            //          left right  sd hd ccw cw hold 180 reset new
            //order is: [6,    8,   1,  2, 3,  5,  4,  0] (.22)
            //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.23)
            //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.24)
            //order is: [7,    9,   8,  2, 5,  6,  1,  4,   0    3] (.24.1)
            //order is: [7,    9,   8,  3, 5,  6,  2,  4,   0    1] (.24.2)
            //0.25 added crap ton of variables, maybe use dictionary instead?
            let kbdisplay = {left:7,right:9,sd:8,hd:2,ccw:6,cw:3,hold:5,oneeighty:4,reset:0,new:1}


            //var highlight = [[6,2],[8,2],[6,0],[8,0],[3,2],[5,2],[0,2],[2,2],[1,2],,[4,2]][this['actions'][this['ptr']]["a"]] //reference




            if (typeof getParams != "function") {
                var getParams = a => {
                    var params = a.slice(a.indexOf("(") + 1);
                    params = params.substr(0, params.indexOf(")")).split(",");
                    return params
                }
            }
            if (typeof trim != "function") {
                var trim = a => {
                    a = a.slice(0, -1);
                    a = a.substr(a.indexOf("{") + 1);
                    return a
                }
            }

            //Create the "keyboard holder". It's a div positioned where the keyboard will be, but it doesnt contain anything yet.
            var kbhold = document.createElement("div");
            kbhold.id = "keyboardHolder";
            kbhold.style.position = "absolute"
            //Im trying to position it relative to the main canvas (this doesnt really work well...)
            kbhold.style.left = (myCanvas.getBoundingClientRect().left - 300) + "px";
            kbhold.style.top = (myCanvas.getBoundingClientRect().top + 100) + "px";

            //Helper method for keyboards in replays
            if (typeof Replayer != "undefined" && typeof Game == "undefined") {
                Replayer["pressKey"] = function(num, type) {
                    console.log(num)
                    //type: 0=release 1=down 2=press
                    //Highlights the corresponding key
                    //gets array of all "kbkey" classes and takes cell "num" and hightlights it
                    document.getElementsByClassName("kbkey")[num].style.backgroundColor = type ? "lightgoldenrodyellow" : ""
                    if (type == 2) {
                        //from replay data you dont really know how long a key has been pressed. im using 100ms as a default
                        setTimeout(x => {
                            document.getElementsByClassName("kbkey")[num].style.backgroundColor = ""
                        }, 100)
                    }

                }
                //positions the keyboard holder differently for replays (thanks to meppydc)
                kbhold.style.left = (myCanvas.getBoundingClientRect().right + 200) + "px";
                kbhold.style.top = (myCanvas.getBoundingClientRect().top + 200) + "px";
            }

            document.body.appendChild(kbhold);


            //(important)
            //this is what is pasted into the keyboard holder and makes up the entire visual keyboard.
            //(i decompressed and tidied it up a bit)
            //basically it's a table consisting of 2 rows and 6 columns
            //maybe read up on css tables if you wanna add new cells


            f = `

<style>
#kbo {text-align:center;position: absolute;font-size:15px;}
#kbo .tg {border-collapse:collapse;border-spacing:0;color:red;}
#kbo .tg td{padding:10px 5px;border-style:solid;border-width:2px;}
#kbo .tg th{padding:10px 5px;border-style:solid;border-width:2px;}
#kbo .tg .tg-wp8o{border-color:#000000;border:inherit;}
#kbo .tg .tg-tc3e{border-color:#34ff34;}
#kbo .tg .tg-jy2k{border-color:#f8a102;}
#kbo .tg .tg-p39m{border-color:#f8ff00;
}</style>

<div id=\"kbo\"><div id=\"kps\"></div>
<table class=\"tg\">
	<tr>
		<td class=\"tg-tc3e kbkey\">${labels[0]}</td>
		<td class=\"tg-tc3e kbkey\">${labels[1]}</td>
		<td class=\"tg-tc3e kbkey\">${labels[2]}</td>
		<td class=\"tg-wp8o\"></td>
		<td class=\"tg-jy2k kbkey\">${labels[3]}</td>
		<td class=\"tg-wp8o\"></td>
	</tr>
	<tr>
		<td class=\"tg-p39m kbkey\">${labels[4]}</td>
		<td class=\"tg-p39m kbkey\">${labels[5]}</td>
		<td class=\"tg-p39m kbkey\">${labels[6]}</td>
		<td class=\"tg-jy2k kbkey\">${labels[7]}</td>
		<td class=\"tg-jy2k kbkey\">${labels[8]}</td>
		<td class=\"tg-jy2k kbkey\">${labels[9]}</td>
	</tr>
</table>
</div>
`
            keyboardHolder.innerHTML = f

            //keyboard if in game (not replays)********************************************************************************************************************************
            if (typeof Game != "undefined") {

                document['addEventListener']('keydown', press);
                document['addEventListener']('keyup', press);

                function press(e) {
                    if (~Game['set2ings'].indexOf(e.keyCode)) {
                        //console.log(Game['set2ings'])//displays the keycodes of your controls
                        // left right sd hd ccw cw hold 180
                        //(important)
                        //listens to pressed keys and highlights the corresponsing div.
                        //the magic array converts between the actions and the div that is highlighted.
                        //If you change the order of the boxes, you might also have to adjust the numbers in this array
                        //           left right sd hd ccw cw hold 180 reset new
                        //order is: [6,    8,   1,  2, 3,  5,  4,  0] (.22 order)
                        //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.23 order)
                        //order is: [7,    9,   8,  2, 5,  6,  1,  4] (.24 order)
                        //order is: [7,    9,   8,  2, 5,  6,  1,  4,   0    3] (.24.1 order)
                        //order is: [7,    9,   8,  3, 5,  6,  2,  4,   0    1] (.24.2 order)
                        var corresponding = [kbdisplay.left, kbdisplay.right, kbdisplay.sd, kbdisplay.hd, kbdisplay.ccw, kbdisplay.cw, kbdisplay.hold, kbdisplay['180'], kbdisplay.reset, kbdisplay.new][Game['set2ings'].indexOf(e.keyCode)]
                        document.getElementsByClassName("kbkey")[corresponding].style.backgroundColor = ["lightgoldenrodyellow", ""][+(e.type == "keyup")]
                    }
                }

                //This saves the settings array (which maps all actions in jstris to their keycodes) to a global variable for me to use (called Game['se2ings'])
                //resets every time a new game is started
                var set2ings = Game['prototype']['readyGo'].toString()
                set2ings = "Game['set2ings']=this.Settings.controls;" + trim(set2ings)
                Game['prototype']['readyGo'] = new Function(set2ings);

                //calculates kps from kpp and pps and writes it into the kps element
                var updateTextBarFunc = Game['prototype']['updateTextBar'].toString()
                updateTextBarFunc = trim(updateTextBarFunc) + ";kps.innerHTML='KPS: '+(this.getKPP()*this.placedBlocks/this.clock).toFixed(2)"
                Game['prototype']['updateTextBar'] = new Function(updateTextBarFunc);
            } else {

                //else: we're in a replay********************************************************************************************************************************

                var website = "jstris.jezevec10.com"
                var url = window.location.href
                var parts = url.split("/")

                if (parts[3] == "replay" && parts[2].endsWith(website)) {

                    //making a web request for the sole purpose of getting the DAS that was used for the replay
                    //(can be done more elegantly)
                    fetch("https://" + parts[2] + "/replay/data?id=" + (parts.length == 6 ? (parts[5] + "&live=1") : (parts[4])))
                        .then(function(response) {
                            return response.json();
                        })
                        .then(function(jsonResponse) {
                            var das = jsonResponse.c.das
                            var playT = Replayer['prototype']['playUntilTime'].toString()
                            var playTparams = getParams(playT);


                            //going though the list of actions done in the replay, and translating that into the timings for highlighting the divs
                            //i dont rememer how exactly i did this but it's not pretty
                            var insert1 = `
			kps.innerHTML="KPS: "+(this.getKPP()*this.placedBlocks/(this.clock/1000)).toFixed(2)
			this["delayedActions"] = []
			for (var i = 0; i < this["actions"].length; i++) {
				var action = JSON.parse(JSON.stringify(this["actions"][i]));
				if(action.a == 2 || action.a == 3){
					action.t = (action.t-` + das + `)>0 ? (action.t-` + das + `) : 0
				}
				this["delayedActions"].push(action)
			}

			this["delayedActions"].sort(function(a, b) {
    			return a.t - b.t;
			});

			var oldVals = [this["timer"],this["ptr"]]

			while (` + playTparams[0] + ` >= this['delayedActions'][this['ptr']]['t']) {
			    if (this['ptr']) {
			        this['timer'] += (this['delayedActions'][this['ptr']]['t'] - this['delayedActions'][this['ptr'] - 1]['t']) / 1000
			    };
			    if(this['delayedActions'][this['ptr']]["a"] == 2){
			    	Replayer["pressKey"](${kbdisplay.left},1)
			    }
				if(this['delayedActions'][this['ptr']]["a"] == 3){
			    	Replayer["pressKey"](${kbdisplay.right},1)
			    }

			    this['ptr']++;
			    if (this['delayedActions']['length'] === this['ptr']) {
			        this['reachedEnd'] = true;
			        break
			    }
			};

			this["timer"] = oldVals[0]
			this["ptr"] = oldVals[1]`


                            //this maps a specific action (this['actions'][this['ptr']]["a"]) to what to do with the divs
                            //the list of what action code equals what action is in that one harddrop forum post
                            //for example, if you DAS_LEFT then left will be held down.
                            //You might also adjust the numbers here (the first number in the pairs. remap them the same as in the magic array)
                            var insert2 = `
			var highlight = [[${kbdisplay.left},2],[${kbdisplay.right},2],[${kbdisplay.left},0],[${kbdisplay.right},0],[${kbdisplay.ccw},2],[${kbdisplay.cw},2],[${kbdisplay['180']},2],[${kbdisplay.hd},2],[${kbdisplay.sd},2],,[${kbdisplay.hold},2]][this['actions'][this['ptr']]["a"]]
			if(highlight){
				Replayer["pressKey"](...highlight)
			};
			`

                            playT = playT.replace(";", insert1 + ";")
                            playT = playT.replace("1000};", "1000};" + insert2)
                            Replayer['prototype']['playUntilTime'] = new Function(...playTparams, trim(playT));

                        //i hate myself - Oki
                        //I heard jez whips Oki - meppydc
                        //I hate myself as well once it stopped working when I did basically nothing - meppydc
                        //typing var names wrong sucks - meppydc
                        });
                }
            }
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