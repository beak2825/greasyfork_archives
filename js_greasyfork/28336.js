// ==UserScript==
// @name       wuk
// @namespace  wolf
// @version    0.1
// @description  Imperiaonline attackCheker
// @match      https://*.imperiaonline.org/imperia/game_v5/game/village.php
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/28336/wuk.user.js
// @updateURL https://update.greasyfork.org/scripts/28336/wuk.meta.js
// ==/UserScript==


document.body.style.background = 'green';
setInterval(
function checker(){
var sound = document.createElement('embed');
sound.setAttribute('width', '5px');
sound.setAttribute('height', '5px');
sound.setAttribute('src', 'https://www.soundjay.com/phone/sounds/telephone-ring-04.mp3');
var currElements = document.getElementsByClassName('incoming province');
    for(var i=0;i<currElements.length;i++){
        if(currElements[i].className == 'incoming province'){
  document.body.appendChild(sound);
    document.body.style.background = 'red';
        }
    };
    //location.reload();
    xajax_find_babysit(1, 1);
    
},15000);