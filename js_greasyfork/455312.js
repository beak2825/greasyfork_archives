// ==UserScript==
// @name         swordzio hack game
// @namespace    Reiwilo09
// @version      1.1.3
// @description  Support extension for SwOrDz.Io
// @author       Reiwilo
// @match        *.swordz.io
// @grant        ur mum
// @downloadURL https://update.greasyfork.org/scripts/455312/swordzio%20hack%20game.user.js
// @updateURL https://update.greasyfork.org/scripts/455312/swordzio%20hack%20game.meta.js
// ==/UserScript==
// @license MIT

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
