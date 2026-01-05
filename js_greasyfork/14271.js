// ==UserScript==
// @name       Alarma atac cont
// @namespace  Nirobot
// @version    0.1
// @description  Porneste alarma daca  esti atacat de alt jucator
// @match      http://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/14271/Alarma%20atac%20cont.user.js
// @updateURL https://update.greasyfork.org/scripts/14271/Alarma%20atac%20cont.meta.js
// ==/UserScript==

function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
        document.body.appendChild(script);
    }, false);
    document.body.appendChild(script);
}


document.body.style.background = 'lightgreen';
setInterval(
function checker(){
var sound = document.createElement('object');
sound.setAttribute('width', '5px');
sound.setAttribute('height', '5px');
    sound.setAttribute('data', 'http://www.soundrangers.com/demos/sirens/ambulance_siren.mp3');//'http://www.soundjay.com/clock/sounds/alarm-clock-1.mp3');
//var currElements = document.getElementsByClassName('incoming province');
    //for(var i=0;i<currElements.length;i++){
        //if(currElements[i].className == 'incoming province'){
    if(document.getElementsByClassName('incoming province')[0] != null){
 	document.body.appendChild(sound);
    document.body.style.background = 'red';
        }
    
    //location.reload();
    //xajax_spiesSubTabs(999,2);
    xajax_find_babysit(1, 1);
},5000);