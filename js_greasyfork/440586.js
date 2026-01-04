// ==UserScript==
// @name         NPR player controller
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  'c': loading; 'z': rewind; 'x':fast forward.
// @author       You
// @match        *://*.npr.org/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440586/NPR%20player%20controller.user.js
// @updateURL https://update.greasyfork.org/scripts/440586/NPR%20player%20controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var loading = 87; // w
    var rewind = 90; // z
    var fastForward = 88; // x

    function logKey(e){
        switch(e.keyCode){
                case loading:
                    document.querySelector(".player-play-pause-stop").click();
                    break;
                case rewind:
                    document.getElementsByClassName("player-rewind")[0].click();
                    break;
                case fastForward:
                    document.getElementsByClassName("player-fast-forward")[0].click();
                    break;
       }
    }
    document.addEventListener("keydown", logKey);
})();