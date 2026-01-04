// ==UserScript==
// @name         left right sound
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  test
// @author       oki is sad, top 24 player meppydc
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390401/left%20right%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/390401/left%20right%20sound.meta.js
// ==/UserScript==

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
"https://meppydc.github.io/meppy-sounds/left_right.wav", //left
"https://meppydc.github.io/meppy-sounds/right_left.wav", //right
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