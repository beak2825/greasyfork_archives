// ==UserScript==
// @name         Splix.io Simple Zoom Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press "z" to toggle between custom and default zoom. Use "-" and "=" to adjust your custom zoom. That's all!
// @author       Shimdidly
// @match        https://splix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401836/Splixio%20Simple%20Zoom%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/401836/Splixio%20Simple%20Zoom%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //Set up zoom level span element in the #scoreBlock element
    window.addEventListener('load',function(){
        var zoomLevelSpan = document.createElement("span");
        zoomLevelSpan.setAttribute("id", "zoomLevelSpan");
        document.getElementById("scoreBlock").appendChild(document.createElement("br"));
        document.getElementById("scoreBlock").appendChild(zoomLevelSpan);

        window.SdefaultBlocks=window.BLOCKS_ON_SCREEN;
        window.ScustomBlocks=8000;
        window.SzoomLevelToggle = false;
        window.MAX_ZOOM = 10000;
    });
    document.onkeydown = function(e) {
        switch (e.keyCode) {
            case 90: //z
                console.log('toggling zoom', window.ScustomBlocks);
                window.SzoomLevelToggle = !window.SzoomLevelToggle;
                if (window.SzoomLevelToggle) window.BLOCKS_ON_SCREEN = window.ScustomBlocks;
                else window.BLOCKS_ON_SCREEN = window.SdefaultBlocks;
                document.getElementById("zoomLevelSpan").innerHTML = "Zoom Level: " + window.BLOCKS_ON_SCREEN;
                break;
            case 189: //-
                window.ScustomBlocks += 50;
                if (window.SzoomLevelToggle) window.BLOCKS_ON_SCREEN = window.ScustomBlocks;
                console.log("BLOCKS_ON_SCREEN = " + window.BLOCKS_ON_SCREEN);
                document.getElementById("zoomLevelSpan").innerHTML = "Zoom Level: " + window.BLOCKS_ON_SCREEN;
                break;
            case 187: //=
                window.ScustomBlocks -= 50;
                if (window.SzoomLevelToggle) window.BLOCKS_ON_SCREEN = window.ScustomBlocks;
                console.log("BLOCKS_ON_SCREEN = " + window.BLOCKS_ON_SCREEN);
                document.getElementById("zoomLevelSpan").innerHTML = "Zoom Level: " + window.BLOCKS_ON_SCREEN;
                break;
        }
    };
    // Your code here...
})();