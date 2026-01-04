// ==UserScript==
// @name         mehsic
// @namespace    http://tampermonkey.net/
// @version      420.69.2.2
// @description  Plays memes in singleplayer or multiplayer
// @author       tired dead oki and maybe meppydc perhaps
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390195/mehsic.user.js
// @updateURL https://update.greasyfork.org/scripts/390195/mehsic.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function(){
     /*var gameSPvol = gameSPvol || ""
     if (typeof Replayer != "undefined") {
         gameSPvol = localStorage.SPvol || ""
         localStorage.SPvol = "100"
     }*/
      // console.log(localStorage.SPvol);


/**************************
       Songs Script
**************************/


var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}


localStorage.musicVol = localStorage.musicVol || "100";
localStorage.SPvol = ( localStorage.SPvol) || "100";
//.log(localStorage.SPvol);
if(typeof localStorage.songChoice == "undefined"){
	localStorage.songChoice = "0iq";
}

var musicVol = document.createElement("tr");
musicVol.innerHTML = 'Music vol (MP):&nbsp;<input id="volControl" oninput="Game.setVol(volControl.value,1)" type="range" min="0" max="100" value="'+localStorage.musicVol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting">'+localStorage.musicVol+'%</span>'
tab_appear.appendChild(musicVol);

var spVol = document.createElement("tr");
spVol.innerHTML = 'Music vol (SP):&nbsp;<input id="volControl2" oninput="Game.setVol(volControl2.value,0)" type="range" min="0" max="100" value="'+localStorage.SPvol+'" step="1" style="width:150px;display:inline-block;padding-top:9px">&nbsp;&nbsp;<span id="volSetting2">'+localStorage.SPvol+'%</span>'
tab_appear.appendChild(spVol);

var songOption = document.createElement("table");
songOption.innerHTML = `<table><tbody><tr><td><input oninput="localStorage.songChoice=this.value;" `+ (localStorage.songChoice==""?``:("value='" + localStorage.songChoice + "'")) +` id="songId" style="width:50px"></td><td><label>&nbsp;&nbsp;Song code</label></td></tr></tbody></table>`
tab_other.appendChild(songOption)


Game["setVol"] = function(vol,mode) {
    //console.log(vol,mode)
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

		Game["songsCustom"].map(x=>{
			x.volume = (spVol.value/100);
		})

	}
}


if(typeof Game != "undefined"){

/*
        var songsMP = [
                "https://ecdldaiiere.github.io/Eddiez-Soundz/t99song1.mp3",
                "https://ecdldaiiere.github.io/Eddiez-Soundz/t99song2.mp3",
                "https://ecdldaiiere.github.io/Eddiez-Soundz/t99song3.mp3"
        ]

        var songSP = "https://ecdldaiiere.github.io/Eddiez-Soundz/t99song1.mp3"
*/

        Game["customSongs"] = {
"": ["none"],//                                                                    0     none

//                                                                                       Tetris
"https://ecdldaiiere.github.io/Eddiez-Soundz/PPTsong1.mp3": ["ppt"], //  PPT
"https://ecdldaiiere.github.io/Eddiez-Soundz/TOPsong1.mp3": ["top"], //                  TOP
"https://ecdldaiiere.github.io/Eddiez-Soundz/TFsong1.mp3": ["tf"],//                     TF lol
"https://ecdldaiiere.github.io/Eddiez-Soundz/TBsong1.mp3": ["tb"],//                     TB lol
"https://ecdldaiiere.github.io/Eddiez-Soundz/8bitsong1.mp3": ["8bit"],//           5     8 bit theme?? idk
"https://ecdldaiiere.github.io/Eddiez-Soundz/HKTsong1.mp3": ["hkt"],//                   Hello Kitty lol (same as site 2)
"https://meppydc.github.io/meppy-sounds/tetriscomsong1.mp3": ["site 1"],//               tetris.com theme 1
"https://meppydc.github.io/meppy-sounds/tetriscomsong2.mp3": ["site 2"],//               tetris.com theme 2
"https://meppydc.github.io/meppy-sounds/tetriscomsong3.mp3": ["site 3"],//               tetris.com theme 3
"https://ecdldaiiere.github.io/Eddiez-Soundz/Hansong1.ogg": ["han","hangame"],//   10    Hangame
"https://meppydc.github.io/meppy-sounds/TetrisThemeA1989.mp3": ["a","a 1989"], //        1989 Theme A
"https://meppydc.github.io/meppy-sounds/TetrisThemeB1989.mp3": ["b","b 1989"], //        1989 Theme B
"https://meppydc.github.io/meppy-sounds/Tetris - Theme 'A' Acapella.mp3": ["acapella a","a bah"],//      Acapella Theme A
"https://meppydc.github.io/meppy-sounds/Tetris - Theme 'B' Acapella.mp3": ["bcapella b","b bah"],//    Acapella Theme B
"https://meppydc.github.io/meppy-sounds/Tetris - Theme 'B' Acapella.mp3": ["bcapella b","b bah"],//15    Acapella Theme B
"https://meppydc.github.io/meppy-sounds/Tetris - Theme 'B' Acapella.mp3": ["bcapella b","b bah"],//    Acapella Theme B

//                                                                                       Tetris 99 themes
"https://ecdldaiiere.github.io/Eddiez-Soundz/t99song1.mp3": ["t99 1"],//                 T99 1
"https://ecdldaiiere.github.io/Eddiez-Soundz/t99song2.mp3": ["t99 2"],//                 T99 2
"https://ecdldaiiere.github.io/Eddiez-Soundz/t99song3.mp3": ["t99 3"],//           20    T99 3
"https://ecdldaiiere.github.io/Eddiez-Soundz/Splatsong1.mp3": ["splat 1"],//             Splatoon 1
"https://ecdldaiiere.github.io/Eddiez-Soundz/Splatsong2.mp3": ["splat 2"],//             Splatoon 2
"https://ecdldaiiere.github.io/Eddiez-Soundz/Splatsong3.mp3": ["splat 3"],//             Splatoon 3
"https://ecdldaiiere.github.io/Eddiez-Soundz/GBsong1.wav": ["gb 1"],//                   Gameboy 1
"https://ecdldaiiere.github.io/Eddiez-Soundz/GBsong2.wav": ["gb 2"],//             25    Gameboy 2
"https://ecdldaiiere.github.io/Eddiez-Soundz/GBsong3.wav": ["gb 3"],//                   Gameboy 3
"https://ecdldaiiere.github.io/Eddiez-Soundz/Fancysong1.mp3": ["fancy"],//               Fancy
"https://ecdldaiiere.github.io/Eddiez-Soundz/Firesong1.mp3": ["fire"],//                 Fire
"https://ecdldaiiere.github.io/Eddiez-Soundz/Mariosong1.mp3": ["mario"],//               Mario
"https://ecdldaiiere.github.io/Eddiez-Soundz/Donkeysong1.mp3": ["donkey"],//       30    Donkey
"https://ecdldaiiere.github.io/Eddiez-Soundz/Zeldasong1.mp3": ["zelda"],//               Zelda
"https://ecdldaiiere.github.io/Eddiez-Soundz/Castlesong1.mp3": ["castle"],//             Castle
"https://ecdldaiiere.github.io/Eddiez-Soundz/Toysong1.mp3": ["toy"],//                   Toy
"https://ecdldaiiere.github.io/Eddiez-Soundz/Galaxysong1.mp3": ["galaxy"],//             Galaxy
"https://ecdldaiiere.github.io/Eddiez-Soundz/Kirbysong1.wav":["kirby 1"],//        35    Kirby 1
"https://ecdldaiiere.github.io/Eddiez-Soundz/Kirbysong2.wav":["kirby 2"],//              Kirby 2
"https://ecdldaiiere.github.io/Eddiez-Soundz/Kirbysong3.wav":["kirby 3"],//              Kirby 3
"https://ecdldaiiere.github.io/Eddiez-Soundz/Luigisong1.wav":["luigi 1"],//              Luigi 1
"https://ecdldaiiere.github.io/Eddiez-Soundz/Luigisong2.wav":["luigi 2"],//              Luigi 2
"https://ecdldaiiere.github.io/Eddiez-Soundz/Luigisong3.wav":["luigi 3"],//        40    Luigi 3

//                                                                                       Miscellaneous
"https://ecdldaiiere.github.io/Eddiez-Soundz/SWsong1.mp3": ["sw","star wars"],//         Star Wars thonk
"https://meppydc.github.io/meppy-sounds/interesting.mp3": ["0iq","ayaya", "default"],//interesting yes
"http://k007.kiwi6.com/hotlink/mqsjkkf6ty/bruh.mp3": ["bruh", "brah"],//               bruh

//                                                                                       custom
"http://k007.kiwi6.com/hotlink/2rsgkx41mo/Freedom_Dive.mp3": ["dive"],//                 Freedom Dive
}






//Game["mappings"] = ["0","1","2","3","4","5","6","7","8","9","10","11","12","13","100","0iq","default"]
//Game["mappings"] = ["none","PPT","TOP","TF","TB","A","B","Acapella A","Acapella B","T99 1","T99 2","T99 3","Splat 1","Splat 2","Splat 3","Han","0iq","ayaya","bruh",customCode]//18 codes

//Play song when only X*100% of players are left (first one is always 1)
var songThresholds = [1, 0.6, 0.2]

Game['onlySprint'] = false;


window.playSong = function(s) {

    //console.log(s)

	Game["songs"].map(x=>{
		x.pause();
		x.currentTime = 0;
	})
    Game["songsCustom"].map(x=>{
		x.pause();
		x.currentTime = 0;
	})
	Game["song"].pause();
	Game["song"].currentTime = 0;

	if(s != undefined && s!=""){
		!s.paused&&0<s.currentTime?s.currentTime=0:s.play()
	}
}

Game["songs"] = [];
Game["songsCustom"] = [];

Game["maxPlayers"] = 0
Game["songIndex"] = -1


Game["song"] = document.createElement("audio");
Game["song"].src = "http://k007.kiwi6.com/hotlink/mqsjkkf6ty/wbruh.mp3"
Game["song"].loop = true;
Game["song"].volume = 1;


/*songsMP.map((x,i)=>{
    Game["songs"].push(document.createElement("audio"));
    Game["songs"][i].src = x;
    Game["songs"][i].loop = true;
    Game["songs"][i].volume = 1;
})*/

Object.keys(Game["customSongs"]).map((x,i)=>{
    Game["songsCustom"].push(document.createElement("audio"));
    Game["songsCustom"][i].src = x;
    Game["songsCustom"][i].loop = true;
    Game["songsCustom"][i].volume = 1;
})


Game["setVol"](localStorage.musicVol,1)
Game["setVol"](localStorage.SPvol,1)


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
			Game["songIndex"]++
			playSong(Game["songs"][Game["songIndex"]])
		}
	}

}
//if (localStorage.songChoice != "dive") {
//Stops song on gameover
var gameOver99 = Game['prototype']['GameOver'].toString();
gameOver99 = "Game['updateSong'](-1);Game['song'].pause();Game['song'].currentTime=0;" + trim(gameOver99)
Game['prototype']['GameOver'] = new Function(gameOver99)
//}

//Sets different song based on remaining player count
var printSlot99 = SlotView['prototype']['printSlotPlace'].toString()
var printSlotParams = getParams(printSlot99);
printSlot99 = `Game["updateSong"](this['slot']['gs']['p']['getPlaceColor'](${printSlotParams[0]})['str']);` + trim(printSlot99)
SlotView['prototype']['printSlotPlace'] = new Function(...printSlotParams, printSlot99);



var readyGo99 = Game['prototype']['restart'].toString()
readyGo99 = `
if(localStorage.songChoice==''){
	if(this['pmode']+this['isPmode'](true)+this['isPmode'](false)==0){
		Game['updateSong'](0)
	}else{
		Game['updateSong'](-1);
		if(!Game['onlySprint']){
			playSong(Game['song'])
		}else{
			if(this['pmode']==1){
				playSong(Game['song'])
			}
		}
	}
}else{

	values=Object.values(Game['customSongs'])
	var selectedSong=-1;
	var defaultSong=0;
	for (var i=0;i < values.length; i++) {
//console.log(values[i])
	if(~values[i].indexOf(localStorage.songChoice.toLowerCase()))selectedSong=i;
	if(~values[i].indexOf("default"))defaultSong=i;
	}

//console.log(defaultSong)
//console.log(selectedSong)

	if(selectedSong<0){
		playSong(Game['songsCustom'][defaultSong])
	}else{
		playSong(Game['songsCustom'][selectedSong])
	}
};` + trim(readyGo99)



Game['prototype']['restart'] = new Function(readyGo99);



//if (localStorage.songChoice != "dive") {

    //Stops song when you go into spectator mode
var specMode99 = Live['prototype']['spectatorMode'].toString()
var specParams = getParams(specMode99);
specMode99 = `Game['updateSong'](-1);` + trim(specMode99)
Live['prototype']['spectatorMode'] = new Function(...specParams, specMode99);

//Stops song on losing (again, just to be safe)
var paint99 = Game['prototype']['paintMatrixWithColor'].toString()
var paintParams = getParams(paint99);
paint99 = `Game['updateSong'](-1);` + trim(paint99)
Game['prototype']['paintMatrixWithColor'] = new Function(...paintParams, paint99);

//remove these 3 lines if you dont want the music to stop for the countdown
var readyGo992 = Game['prototype']['readyGo'].toString()
readyGo992 = "Game['updateSong'](-1);" + trim(readyGo992)
Game['prototype']['readyGo'] = new Function(readyGo992);
//}


//Fix so that main volume doesnt reset
localStorage.mainVol = localStorage.mainVol || "100"
document.getElementById("settingsSave").addEventListener("click", function(){localStorage.mainVol=document.getElementById('vol-control').value}, false);
Settings['prototype']['volumeChange'](+localStorage.mainVol)


}


    });
})();