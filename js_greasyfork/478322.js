// ==UserScript==
// @name         Swordz.io Fast teleport 2
// @namespace    omega
// @version      1.1.3
// @description  by Ömer
// @author       Ömer
// @match        *.swordz.io
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478322/Swordzio%20Fast%20teleport%202.user.js
// @updateURL https://update.greasyfork.org/scripts/478322/Swordzio%20Fast%20teleport%202.meta.js
// ==/UserScript==
 
var respawn = false;
 
function onUpdate() {
    if(respawn && document.getElementById('homeDiv').style.display === 'block') {
        document.getElementById('signDiv-signIn').click()
     } else {
        deathTimer = 60;
     }
}
setInterval(onUpdate, 150)
document.onkeydown = function(e) {
   switch(e.keyCode) {
      case 68:
         respawn = !respawn
         break;
      case 87:
         inputAttack(true)
         break;
       }
}
 
function onRender() {
    ctx.fillStyle = respawn? 'green': 'red'
    ctx.fillText('Auto Respawn[D]', 120, 140)
 
        ctx.beginPath(),
        ctx.arc(WIDTH - 155 + 140 * Player.leaderboardTopX / mapWIDTH, HEIGHT - 60 - 155 + 140 * Player.leaderboardTopY / mapHEIGHT, 5.5, 0, 2 * Math.PI),
        ctx.fillStyle = '#ff0000',
        ctx.fill(),
        ctx.lineWidth = 5,
        ctx.strokeStyle = '#333',
        ctx.stroke();
    requestAnimationFrame(onRender)
}
onRender()