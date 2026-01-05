// ==UserScript==
// @name         Gota.io Macros By ReF and split
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  some macros for gota and spolit 16
// @author       ReF
// @match        http://gota.io/web/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20038/Gotaio%20Macros%20By%20ReF%20and%20split.user.js
// @updateURL https://update.greasyfork.org/scripts/20038/Gotaio%20Macros%20By%20ReF%20and%20split.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var timeoutId;
    var isHeld = false;
   
function splitST() {
 $(document).trigger({type: 'keydown', which: 69, keyCode: 69});
    $(document).trigger({type: 'keydown', which: 69, keyCode: 69});
    $(document).trigger({type: 'keydown', which: 69, keyCode: 69});
    $(document).trigger({type: 'keydown', which: 69, keyCode: 69});
}
 
    function macroFeed() {
        if (isHeld) {
        $(document).trigger({type: 'keydown', which: 69, keyCode: 69});
            console.log("mousehold");
        } else $(document).trigger({type: 'keyup', which: 69, keyCode: 69});
    }
   
     document.addEventListener('keydown', function(event) {
            if (event.keyCode == 16) {
                console.log("shift");
splitST();
            }
    }, false);
   
$('canvas').on('mousedown mouseup', function mouseState(e) {
    if (e.type == "mousedown") {
        isHeld = true;
    } else isHeld = false;
});
    setInterval(macroFeed,10);
})();

(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 82) { // KEY_Z
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // KEY_SPACE
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();