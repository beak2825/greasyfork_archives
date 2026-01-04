// ==UserScript==
// @name     crunchyroll_auto_fullscreen
// @version  1
// @grant    none
// @include  https://www.crunchyroll.com/*
// @description Auto Full Screens the current video playing video on page load
// @namespace https://greasyfork.org/users/387764
// @downloadURL https://update.greasyfork.org/scripts/391272/crunchyroll_auto_fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/391272/crunchyroll_auto_fullscreen.meta.js
// ==/UserScript==

//Make sure your browser config for full screen api request is turned off
//Firefox - full-screen-api.allow-trusted-requests-only

function handleKeypress(event) {
	if(event.keyCode === 0){
		toggleFullscreen();
	}
};

document.addEventListener("keypress", handleKeypress, false);

function toggleFullscreen() {
  let elem = document.getElementById("vilos-player");
	if(elem != null){
    elem.requestFullscreen = elem.requestFullscreen || elem.mozRequestFullscreen
            || elem.msRequestFullscreen || elem.webkitRequestFullscreen;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().then({}).catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
	}
};

var keyboardEvent = document.createEvent("KeyboardEvent");
var initMethod = typeof keyboardEvent.initKeyboardEvent !== 'undefined' ? "initKeyboardEvent" : "initKeyEvent";


keyboardEvent[initMethod](
                   "keypress", // event type : keydown, keyup, keypress
                    true, // bubbles
                    true, // cancelable
                    window, // viewArg: should be window
                    false, // ctrlKeyArg
                    false, // altKeyArg
                    false, // shiftKeyArg
                    false, // metaKeyArg
                    0, // keyCodeArg : unsigned long the virtual key code, else 0
                    0 // charCodeArgs : unsigned long the Unicode character associated with the depressed key, else 0
);

setTimeout(function(){document.dispatchEvent(keyboardEvent)}, 5000);