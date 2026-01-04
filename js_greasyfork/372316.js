// ==UserScript==
// @name           Memrise Timer Toggle
// @description    Adds a button to toggle the timer on/off. You can also click on the timer to pause/unpause the timer.
// @match          http://*.memrise.com/*
// @match          https://*.memrise.com/*
// @run-at         document-end
// @version        1.1.1
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/372316/Memrise%20Timer%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/372316/Memrise%20Timer%20Toggle.meta.js
// ==/UserScript==

// Based on https://gist.github.com/AntonioRigo/fae2536dbf5b7626c509102b2226353c/memrise-timer-toggle.user.js
if(typeof unsafeWindow == "undefined") {
  unsafeWindow = window;
}

var onLoad = function() {
  	var leftArea = document.getElementById("left-area");
		if(!leftArea) {
    	return;
    }

    // Add "pause timer" link to left area
    var pauseBtn = document.createElement('p');
    pauseBtn.innerHTML = "Pause timer";
    leftArea.appendChild(pauseBtn);

    pauseBtn.addEventListener("click", toggleTimer, false);
    document.getElementById("right-area").addEventListener("click", toggleTimer, false);

    // Toggle timer
    var pause = false;
    function toggleTimer() {
        if (pause) {
            unsafeWindow.MEMRISE.garden._events.unpause[0]();
            pauseBtn.innerHTML='Pause timer';
            pause = false;
        } else {
            unsafeWindow.MEMRISE.garden._events.pause[0]();
            pauseBtn.innerHTML='Unpause timer';
            pause = true;
        }
    }
};

window.addEventListener("load", function(){
  setTimeout(onLoad, 0);
}, false);