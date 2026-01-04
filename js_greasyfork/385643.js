// ==UserScript==
// @name         Animation Script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  a script to support animated skins on Jstris
// @author       Oki
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385643/Animation%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/385643/Animation%20Script.meta.js
// ==/UserScript==

/**************************
     Animation Script         
**************************/

(function() {
    window.addEventListener('load', function(){

localStorage.animSpeed = localStorage.animSpeed || '100';
localStorage.animToggle = localStorage.animToggle || 'b'

Game['animationRunning'] = false;

//Add toggle key option
var animationKey = document.createElement("tr");
animationKey.innerHTML = '<td>Toggle animation:</td><td><input maxlength="1" id="input420" type="text" size="7" value="'+localStorage.animToggle+'"></td><td id="kc420">0</td>'
tab_controls.children[2].appendChild(animationKey);

//Add speed option
var animOption = document.createElement("tr");
animOption.innerHTML = '<td>Animation speed:</td><td><input onchange="localStorage.animSpeed=parseInt(this.value)||100" size="10" id="animSpeed" type="text" value="'+localStorage.animSpeed+'"></td>'
tab_settings.children[1].appendChild(animOption);

//Custom skin here
Game['animatedSkin'] = [
["https://cdn.discordapp.com/attachments/429007833992790036/564703035196964864/ppt_crayon_1.png",36],
["https://cdn.discordapp.com/attachments/429007833992790036/564703064234131464/ppt_crayon_2.png",36],
["https://cdn.discordapp.com/attachments/429007833992790036/564703091375734804/ppt_crayon_3.png",36],
["https://cdn.discordapp.com/attachments/429007833992790036/564703116331843584/ppt_crayon_4.png",36]]

var intervals = []

Game['stopAnim'] = function() {
    for (var i=0; i < intervals.length; i++) {
        clearInterval(intervals[i]);
    }
}

Game['startAnim'] = function() {
    var animLength = Game['animatedSkin'].length*localStorage.animSpeed
    Game['animatedSkin'].map((x,i)=>{
        setTimeout(()=>{intervals.push(setInterval(()=>{loadSkin(x[0],x[1])}, animLength))}, i*(animLength/Game['animatedSkin'].length));
    })
}


window.onkeyup = function(e) {
    if(e.target.id == "input420") {
        event.preventDefault()
        input420.value=e.key
        kc420.innerHTML=e.keyCode
        localStorage.animToggle=e.key
    } else {
        if (e.key == localStorage.animToggle) {
            if(Game['animationRunning']) {
                Game['stopAnim']();
            } else {
                Game['startAnim']();
            }
            Game['animationRunning'] ^= 1
        }
    }
    "input421"==e.target.id?(e.preventDefault(),input421.value=e.key,kc421.innerHTML=e.keyCode,localStorage.randomizeKey=e.key):e.key==localStorage.randomizeKey&&Game['deployRandomSkin']();
}

})})()