// ==UserScript==
// @name         happyfor.win By- RDC- agario 
// @namespace    https://www.youtube.com/channel/UCFf1_gRuGId63rDrAHubeqg
// @version      3.0
// @description  T= TickSplit 16 partes ||Y= TickSplit 16 partes RAPIDO  |U= DobleSplit| I =LineSplit
// @author       RDC  Manda :)
// @match        http://happyfor.win/
// @match        http://agar.io/
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/22540/happyforwin%20By-%20RDC-%20agario.user.js
// @updateURL https://update.greasyfork.org/scripts/22540/happyforwin%20By-%20RDC-%20agario.meta.js
// ==/UserScript==

(function() {
    var amount = 2;
    var duration = 50;
    var overwriting = function(evt) {
        if (evt.keyCode === 73) { // Change 73[I] To Whichever Keycode You Want To Change The Double Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 85) { // Change 85[U] To Whichever Keycode You Want To Change The Double Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 5;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 89) { // Change 89[Y] To Whichever Keycode You Want To Change The Triple Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 6;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 84) {  // Change 84[T] To Whichever Keycode You Want To Change The 16 Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 6;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // Change 69[E] To Whichever Keycode You Want To Change The Quick Feeding Macro
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // 87 - W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();