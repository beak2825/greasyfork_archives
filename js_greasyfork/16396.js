// ==UserScript==
// @name         Triangle v1
// @namespace    Triangle
// @version      1.1
// @description  Mod
// @author       thelastsaint
// @match        http://agar.io/*
// @match        https://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16396/Triangle%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/16396/Triangle%20v1.meta.js
// ==/UserScript==

// Macro Feed 
(function() {
    var amount = 4;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_E
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

// Set Your Username: '㋑|'
$("#nick").val("㋑|");

// ==/UserScript==

setDarkTheme(true);

// Adblocker and Main Text

var script = document.createElement('script');
script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js";
(document.body || document.head || document.documentElement).appendChild(script);

	$("#adbg").hide();
	$(".agario-promo").hide();
	$("div#s300x250").hide();
	$("div.form-group div[style='float: right; margin-top: 10px; height: 40px;']").hide();
	$("div.form-group div h2").html('<h2>Triangle<sub><small>㋑</small></sub></h2></a>');

// ==/UserScript==

setShowMass(true);
setSkipStats(true);
setDarkTheme(true);
