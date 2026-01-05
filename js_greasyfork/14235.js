// ==UserScript==
// @name         Nexus Duo
// @namespace    ProjectNexus
// @version      1.0
// @description  Nexus Duo Client / Macro feed, enters tag automatically, default dark theme and show status feature.
// @author       Kemal Okan Dikkulak
// @match        http://agarz.com/
// @match        http://agarz.com/*
// @downloadURL https://update.greasyfork.org/scripts/14235/Nexus%20Duo.user.js
// @updateURL https://update.greasyfork.org/scripts/14235/Nexus%20Duo.meta.js
// ==/UserScript==

// Macro Feed 
(function() {
    var amount = 7;
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

// Set Your Username: 'ᗪᙀƠ✿ ﻀﮔλкε'
$("#nick").val("ᗪᙀƠ✿ ﻀﮔλкε");

// Adblocker and Main Text

var script = document.createElement('script');
script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js";
(document.body || document.head || document.documentElement).appendChild(script);

	$("#adbg").hide();
	$(".agario-promo").hide();
	$("div#s300x250").hide();
	$("div.form-group div[style='float: right; margin-top: 10px; height: 40px;']").hide();
	$("div.form-group div h2").html('<a href="https://www.facebook.com/groups/agario.thechinesemafia/"><h2>Nexus Duo<sub><small></small></sub></h2></a>');

// Defaults

setDarkTheme(true);
setShowScore(true);
setSmooth(true);
setSkins(false);
