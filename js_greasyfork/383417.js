// ==UserScript==
// @name         (Orion)Builds Script 
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Just builds.
// @author       Orion#2521
// @match        *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383417/%28Orion%29Builds%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/383417/%28Orion%29Builds%20Script.meta.js
// ==/UserScript==




(function() {
    document.body.onkeyup=function(e){

		//Build keys
		//Go to http://keycode.info/ if you want to reassign keys and then change the number after "e.keyCode==="

        //02377707 = "a key"
        if(e.keyCode===65){
            input.execute("game_stats_build 656565656565654444444888888822333");
        }

        //00077757 = "b key"
        if(e.keyCode===66){
            input.execute("game_stats_build 656565656565654444444888888877777");
        }

        //57700077 = "d key"
        if(e.keyCode===68){
            input.execute("game_stats_build 823823823823823823823777777755555");
        }

        //00057777 = "f key"
        if(e.keyCode===70){
            input.execute("game_stats_build 654765476547654765476547654788888");
        }

        //00077775 = "g key"
        if(e.keyCode===71){
            input.execute("game_stats_build 654765476547654765476547654788888");
        }

    };
})();