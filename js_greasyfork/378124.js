// ==UserScript==
// @name         mwave2 (mobile) tournament auto vote lisa
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match       https://m.mwave.me/en/vote/tournament/view?tab=vote&voteSeq=900875
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/378124/mwave2%20%28mobile%29%20tournament%20auto%20vote%20lisa.user.js
// @updateURL https://update.greasyfork.org/scripts/378124/mwave2%20%28mobile%29%20tournament%20auto%20vote%20lisa.meta.js
// ==/UserScript==
var player = document.createElement('audio');
//player.src= "https://freewavesamples.com/files/8-Bit-Noise-3.wav";
player.src= "https://freesound.org/data/previews/233/233645_1752933-lq.mp3";
player.preload = 'auto';

var count = document.querySelector('#_voteArea > li > div.art_choice > p > span').innerHTML;
//var settingsButton1 = '<button id="leftja" type="button" value="left" onclick="authMember(90094755);"">Lisa</button>';
//$('#_voteArea > li > div.art_choice > p').append(settingsButton1);

if (count>0) {
    //alert (document.getElementById("modalAlert").innerHTML)
  authMember(90094755);
}
else {
    window.location.href = "https://m.mwave.me/en/vote/tournament/list";
}
window.setInterval(function(){
    if(document.getElementById("modalAlert").innerHTML){document.getElementById("modalAlert").focus();keyP();player.play();}
}, 1000);
/*
if(document.getElementById("modalAlert").innerHTML != null){
player.play();
}
*/
function clickAnchorTag() {
    var event = document.createEvent('MouseEvent');
    event = new CustomEvent('click');
    var a = document.getElementById('_okBtn');
    a.dispatchEvent(event);
}
function keyP() {
var ev = $.Event('keypress');
ev.which = 38; // Carriage-return (ArrowUP)
$('body').trigger(ev);
}