// ==UserScript==
// @name         Agar.io Custom Mod
// @namespace    http://tampermonkey.net/
// @version      5.1
// @description  Includes keybindings to help make doing tricks easier. Also features full mouse control 
// @author       You
// @match        http://agarioforums.io
// @match        http://agarioforums.io/split/
// @match        http://agar.io/
// @match        http://agar.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19719/Agario%20Custom%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/19719/Agario%20Custom%20Mod.meta.js
// ==/UserScript==

(function() {
    var amount = 20;
    var duration = 1; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 81) { // KEY_Q
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 82) { // KEY_R
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
$(
    function() {
        var feeddown = $.Event("keydown", { keyCode: 87}); 
        var feedup = $.Event("keyup", { keyCode: 87});
        var splitdown = $.Event("keydown", { keyCode: 32});
        var splitup = $.Event("keyup", { keyCode: 32});
        $(document).bind('mousedown', function(e) {
            if( (e.which == 3) ){
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
  
            }
            else if( (e.which == 1) ){
                $("body").trigger(splitdown);
                $("body").trigger(splitup);
                
            }
        }).bind('contextmenu', function(e){
            e.preventDefault();
        });
       
    }
)();


