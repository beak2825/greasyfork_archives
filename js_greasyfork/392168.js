// ==UserScript==
// @name	ShlongFeeders V1.6
// @include	*://diep.io/*
// @author	shlong#2873 (414460997697273856)
// @connect	    diep.io
// @version	1.6
// @namespace https://greasyfork.org/users/329817
// @description current version of my bot
// @downloadURL https://update.greasyfork.org/scripts/392168/ShlongFeeders%20V16.user.js
// @updateURL https://update.greasyfork.org/scripts/392168/ShlongFeeders%20V16.meta.js
// ==/UserScript==

(function(){
  var h=false;
function update(){
  setTimeout(function() {
    window.requestAnimationFrame(update);
    h=!h;
      input.keyDown(220)//back slash key down
      input.keyUp(220);//backslash key up
    input.execute('game_spawn Shlong4Team');//this is name setting
    input.keyDown(75)//this presses k
    input.keyDown(1)//this presses left click
    input.set_convar('game_stats_build','247756777665442655742665254542647',h);//this is for builds
},1);
}
window.requestAnimationFrame(update);
})();

javascript:(function(p,a,b,z){z=function(n){p(5.625*((n?b:b++)%360)-a)};canvas.onmousemove=function(e){a=Math.atan2(e.clientX-innerWidth/2,e.clientY-innerHeight/2)/Math.PI*180;z(1)};setInterval(z,15)})(function(a,r){r=Math.min(innerHeight,innerWidth)/2;a/=180/Math.PI;input.mouse(Math.cos(a)*r+innerWidth/2,Math.sin(a)*r+innerHeight/2)},0,0)

