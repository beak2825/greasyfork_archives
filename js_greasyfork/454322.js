// ==UserScript==
// @name         Freesound Volume Control
// @version      0.1
// @description  This script adds a simple volume control to all sounds on freesound.org
// @author       cosmik_debree
// @match        https://freesound.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freesound.org
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/830718
// @downloadURL https://update.greasyfork.org/scripts/454322/Freesound%20Volume%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/454322/Freesound%20Volume%20Control.meta.js
// ==/UserScript==

// modified https://stackoverflow.com/questions/5525071/how-to-wait-until-an-element-exists
function waitForElm(context, selector) {
    return new Promise(resolve => {
        if (context.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (context.querySelector(selector)) {
                resolve(context.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

(function() {
    'use strict';
    let default_vol = "10";

    let allPlayers = document.querySelectorAll('.player');
    for (var i=0; i < allPlayers.length; i++){
        (function(i){
            var vol = document.createElement('input');
            vol.id = "volume-control-" + i.toString();
            vol.type = "range";
            vol.value = default_vol;

            vol.addEventListener("change", function(e){
                window.soundManager.sounds["sound-id-" + i.toString()].setVolume(e.currentTarget.value);
            });
            if (allPlayers[i].classList.contains('small')){
                vol.style.width = "120px";
            }
            waitForElm(allPlayers[i],'.controls').then((elm) => {
                window.soundManager.sounds["sound-id-" + i.toString()].setVolume(parseInt(default_vol));
                allPlayers[i].appendChild(vol);
            });
        })(i);
    }
})();