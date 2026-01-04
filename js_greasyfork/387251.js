// ==UserScript==
// @name         Rotation Sounds Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  plays different sounds for rotations
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387251/Rotation%20Sounds%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/387251/Rotation%20Sounds%20Script.meta.js
// ==/UserScript==

/**************************
  Rotation Sounds Script
**************************/
(function() {
    window.addEventListener('load', function(){


Game['rotationSounds']  = [
"https://ecdldaiiere.github.io/Eddiez-Soundz/TF_rotate.mp3", //rotate left
"https://ecdldaiiere.github.io/Eddiez-Soundz/TF_rotate.mp3", //rotate right
"https://ecdldaiiere.github.io/Eddiez-Soundz/TF_rotate.mp3" //rotate 180°
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