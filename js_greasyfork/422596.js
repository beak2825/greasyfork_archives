// ==UserScript==
// @name         FastForward BBB AAU
// @version      0.1
// @description  Fast Foward Button for big blue button installation of university klagenfurt
// @author       Karim Krell
// @match        https://bbb.aau.at/playback/presentation/2.0/playback.html*
// @grant        none
// @namespace https://greasyfork.org/users/743299
// @downloadURL https://update.greasyfork.org/scripts/422596/FastForward%20BBB%20AAU.user.js
// @updateURL https://update.greasyfork.org/scripts/422596/FastForward%20BBB%20AAU.meta.js
// ==/UserScript==

window.setTimeout(()=>{
$('<button class="button" style="background-image: url(https://pics.freeicons.io/uploads/icons/png/19603807591586787983-512.png);filter: invert(100%);" id="forward">Faster</button><span style="color:white" id="speedval">1x</span>').insertAfter("[class='acorn-timer']")

console.log('losgehts')

$('#forward').on("click",
function(){
var speed =parseFloat($('#video').attr('speed'))

if(isNaN(speed)) {
	speed=1.25
} else {
    speed+0.25>2?speed=1:speed+=0.25
}
	$('#video').attr('speed',speed)
	$('#video')[0].playbackRate = speed
	$('#speedval').text(speed+'x')
}
)
}, 2000)