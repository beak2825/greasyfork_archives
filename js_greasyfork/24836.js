// ==UserScript==
// @name        Pinegar
// @namespace   agar.io
// @include     http://agar.io/*
// @include     https://agar.io/*
// @version     1
// @grant       none
// @description Parody of Ogar and Agarplus
// @downloadURL https://update.greasyfork.org/scripts/24836/Pinegar.user.js
// @updateURL https://update.greasyfork.org/scripts/24836/Pinegar.meta.js
// ==/UserScript==

document.getElementById("darkTheme").checked = true;
document.getElementById("showMass").checked = true;
document.getElementById("skipStats").checked = true;

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'> Press <b>Q</b> for Macro Feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> Press <b>D</b> to Double Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>S</b> to Triple Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_h'> Press <b>A</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_C'> Creator: <b>Dabbles - Agario</b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_UPDT'> <b>UPDATE</b> soon !</span></span></center>";
load();
function load() {
}
(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 68) { // Change 68[D] To Whichever Keycode You Want To Change The Double Split HotKey
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
        if (evt.keyCode === 83) { // Change 83[S] To Whichever Keycode You Want To Change The Triple Split HotKey
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
    var amount = 8;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 65) {  // Change 65[A] To Whichever Keycode You Want To Change The 16 Split HotKey
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

if (event.keyCode == 81 ) // Q
{
Feed = true;
setTimeout(mass, Speed);
}

$(
    function() {
        var feeddown = $.Event("keydown", { keyCode: 87}); //w button
        var feedup = $.Event("keyup", { keyCode: 87}); //w button
        var splitdown = $.Event("keydown", { keyCode: 32}); //space button
        var splitup = $.Event("keyup", { keyCode: 32}); //space button
        $(document).bind('mousedown', function(e) {
            if( (e.which == 3) ){
                $("body").trigger(feeddown);
                $("body").trigger(feedup);
                //console.log("feed");
            }
            else if( (e.which == 1) ){
                $("body").trigger(splitdown);
                $("body").trigger(splitup);
                //console.log("split");
            }
        }).bind('contextmenu', function(e){
            e.preventDefault();
        });
        //alert("mouse enabled");
    }
)();