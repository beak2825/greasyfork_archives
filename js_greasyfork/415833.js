// ==UserScript==
// @name        Bitchute playback speed control hotkeys
// @namespace   Violentmonkey Scripts
// @match       https://www.bitchute.com/video/*
// @grant       GM_addStyle
// @version     1.0
// @author      The Mickey J
// @description Allows for adjusting the Bitchute player playback speed using the + and - numpad keys, adjusing playback by 25% increments, and allows setting the speed above the standard 2x speed cap. It will temporarily show the current playback speed in a little popup in the top-right corner of the player.
// @downloadURL https://update.greasyfork.org/scripts/415833/Bitchute%20playback%20speed%20control%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/415833/Bitchute%20playback%20speed%20control%20hotkeys.meta.js
// ==/UserScript==

$change = 0.25;
$hookedUp = false;
var hideSpeedDisplayTimeout;

function setSpeed(speed) {
      document.getElementById('player').playbackRate = speed;
      var speedDisplay = document.getElementById("JSpeedDisplay");
      speedDisplay.innerHTML = "Speed: " + speed;
      speedDisplay.className = "show";
      //If we had a timeout, kill it.
      clearTimeout(hideSpeedDisplayTimeout);
      //And start a new one.
      hideSpeedDisplayTimeout = setTimeout(function(){ speedDisplay.className = speedDisplay.className.replace("show", ""); }, 2000);
}

function doc_keyUp(e) {
    switch (e.keyCode) {
        case 187:
            //+ key number row
        case 107:
            //+ key keypad
            if($hookedUp) {
              var speed = document.getElementById('player').playbackRate + $change;
              setSpeed(speed);
            }
            break;
        case 189:
            //- key number row
        case 109:
            //- key numpad
            if($hookedUp) {
              var speed = document.getElementById('player').playbackRate - $change;
              setSpeed(speed);
            }
            break;
        default:
            break;
    }
}
document.addEventListener('keyup', doc_keyUp, false);



GM_addStyle(`
#JSpeedDisplay {
  display: block;
  width: auto;
  top: 2%;
  right: 2%;
  position: absolute;
  font-weight: 500;
  font-size: xxx-large;
  color: white;
  -webkit-text-stroke: 2px black;
  font-weight: bold;
  visibility: hidden; /* Hidden by default. Visible on click */
}
#JSpeedDisplay.show {
  visibility: visible;
}

`);


function insertSetSpeedDiv() {
	var container_block = document.querySelector('.plyr');
	if(container_block) {
    block_to_insert = document.createElement( 'div' );
    block_to_insert.id = "JSpeedDisplay";
    block_to_insert.innerHTML = 'Speed: 1';
    container_block.appendChild( block_to_insert );
    $hookedUp = true;
    return true;
	}
	return false;
}

function KeepTrying(func, attempts, delayMillis) {
	console.log('Trying to insert Speed Display div, remaining attempts: ' + attempts);
	if(!func() && (attempts-1 > 0)) {
		window.setTimeout(function() {
			KeepTrying(func, attempts-1, delayMillis);
		}, delayMillis);
	}
}

KeepTrying(insertSetSpeedDiv, 12, 500);

