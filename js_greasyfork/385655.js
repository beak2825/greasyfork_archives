// ==UserScript==
// @name         Under PPS Restart Script
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  restarts game automatically when you go too slow
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385655/Under%20PPS%20Restart%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385655/Under%20PPS%20Restart%20Script.meta.js
// ==/UserScript==

/**************************
  Under PPS Restart Script         
**************************/
(function() {
    window.addEventListener('load', function(){

localStorage.restartOption = localStorage.restartOption || "0";
localStorage.restartThreshold = localStorage.restartThreshold || "0";

var pbOption = document.createElement("table");
pbOption.innerHTML = `<tbody><tr><td><input name='group'onclick="localStorage.restartOption=0"id='soundPPS'type="radio"><label for="soundPPS">Play a sound</label></td><td><input onclick="localStorage.restartOption=1" id='restartPPS' name='group' type="radio"><label for="restartPPS">Restart the run</label></td></tr><tr><td colspan="2"><span>when PPS goes below <input oninput='localStorage.restartThreshold=this.value'id='threshold'style="width:50px"></span></td></tr></tbody><br>`
tab_other.appendChild(pbOption)

document.getElementsByName("group")[+localStorage.restartOption].checked = 1
threshold.value = localStorage.restartThreshold

var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}
if(typeof getParams != "function"){var getParams=a=>{var params=a.slice(a.indexOf("(")+1);params=params.substr(0,params.indexOf(")")).split(",");return params}}


function afterRoundStart() {
    window.soundAlreadyPlayed = false;
}

var placeBlockFunc = Game['prototype']["startReadyGo"].toString()
placeBlockFunc =  trim(placeBlockFunc) + trim(afterRoundStart.toString())
Game['prototype']["startReadyGo"] = new Function(placeBlockFunc);



function afterPlaceBlock() {

if(0<threshold.value&&this['clock']>5){
	if(this['getPPS']()<+threshold.value&&0!=this['getPPS']()){
		if(document.getElementsByName("group")[0].checked&&+localStorage.SE){
			var a=new Audio("https://jstris.jezevec10.com/res/se0/fault.wav");
			if(vol=document.getElementById("vol-control").value)
				a.volume=vol/100;
			if(!soundAlreadyPlayed) {
				a.play()
				soundAlreadyPlayed = true;
			}
		}
		else {
            this.GameOver();
            this['startPractice'](1)
		}
	}
};

};



var placeBlockFunc = Game['prototype']["placeBlock"].toString()
var params2 = getParams(placeBlockFunc)
placeBlockFunc =  trim(placeBlockFunc) + trim(afterPlaceBlock.toString())
Game['prototype']["placeBlock"] = new Function(...params2, placeBlockFunc);


    });
})();