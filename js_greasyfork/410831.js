// ==UserScript==
// @name         Invis Toggle Script
// @namespace    http://tampermonkey.net/
// @version      0.0
// @description  a
// @author       orz
// @match        https://*.jstris.jezevec10.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410831/Invis%20Toggle%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/410831/Invis%20Toggle%20Script.meta.js
// ==/UserScript==

/**************************
    Skin Storage Script
**************************/
(function() {

    window.addEventListener('load', function(){
window.invisToggleAttached = false;
function initInvisToggle() {
    var createEventHandler = (game) => {
        window.addEventListener("keyup", (e)=> {
            if (e.keyCode == 113) {
                console.log("hi");
                game.isInvisibleSkin = !game.isInvisibleSkin;
            }
        });
    };

    if (!window.invisToggleAttached)
        createEventHandler(this);
    window.invisToggleAttached = true;

}


if(typeof trim != "function"){var trim=a=>{a=a.slice(0,-1);a=a.substr(a.indexOf("{")+1);return a}}
var randomizeStart = Game['prototype']['readyGo'].toString()
randomizeStart = trim(randomizeStart) + trim(initInvisToggle.toString());
Game['prototype']['readyGo'] = new Function(randomizeStart);


    });
})();