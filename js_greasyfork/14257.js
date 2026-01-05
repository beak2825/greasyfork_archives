// ==UserScript==
// @name         Nexus
// @namespace    ProjectNexus
// @version      1.0
// @description  Nexus Duo Client for Agarz
// @author       Kemal Okan Dikkulak
// @match        http://agarz.com/
// @match        http://agarz.com/*
// @downloadURL https://update.greasyfork.org/scripts/14257/Nexus.user.js
// @updateURL https://update.greasyfork.org/scripts/14257/Nexus.meta.js
// ==/UserScript==

// Set Your Username: 'ᗪᙀƠ✿Åʟρεяøṧ'
$("#nick").val("ᗪᙀƠ✿Åʟρεяøṧ");

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

// Title 

var script = document.createElement('script');
script.src = "http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js";
(document.body || document.head || document.documentElement).appendChild(script);

	$("div.form-group div[style='float: right; margin-top: 50px; height: 40px;']").hide();
	$("div.form-group div h2").html('<a href="https://www.facebook.com/groups/agario.thechinesemafia/"><h2>Nexus Duo<sub><small></small></sub></h2></a>');

// Defaults

setDarkTheme(true);
setShowScore(true);
setSmooth(true);
setSkins(false);

// Remove Ads

var elmDeleted = document.getElementById("topInfo");
	elmDeleted.parentNode.removeChild(elmDeleted);

var elmDeleted = document.getElementById("instructions");
	elmDeleted.parentNode.removeChild(elmDeleted);
