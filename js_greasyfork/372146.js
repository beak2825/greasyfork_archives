// ==UserScript==
// @name         diep.io Quick upgrade v2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bounds keys to builds and themes
// @author       Unnamed gae
// @match        *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372146/diepio%20Quick%20upgrade%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/372146/diepio%20Quick%20upgrade%20v2.meta.js
// ==/UserScript==

(function() {
    document.body.onkeyup=function(e){

		//Build keys
		//Go to http://keycode.info/ if you want to reassign keys and then change the number after "e.keyCode==="

        //00077757 = "z key"
        if(e.keyCode===90){
            input.execute("game_stats_build 556644565656565644444888888877777");
        }
        //02377707 = "x key"
        if(e.keyCode===88){
            input.execute("game_stats_build 556644565656565644444888888832323");
        }
         //02307777 = "b key"
        if(e.keyCode===66){
            input.execute("game_stats_build 775566777775656565656888888832323");
        }
          //00067776 spammer = "n key"
        if(e.keyCode===78){
            input.execute("game_stats_build 775566777775656565656888888444444");
        }

		//Themes bellow. Delete if you don't care, but IMO these are lit.

        //My theme = "v key"
        if(e.keyCode===86){
            input.execute("ui_replace_colors 0xA221FE 0x7008FF 0x3426FF 0x0E69E6 0x06DDFF 0x00FFF9 0x00FFA2 0x00FF09");
            input.execute("ren_grid_base_alpha 0.3");
            input.execute("ren_stroke_soft_color_intensity 0.6");
            input.execute("ren_background_color 0xAAAAAA");
            input.execute("ren_bar_background_color 0x93ebff");
            input.execute("ren_health_background_color 0x2E5A89");
            input.execute("ren_health_fill_color 0x00FF00");
            input.execute("ren_minimap_viewport true");
            input.set_convar("ren_solid_background", true);
            input.set_convar("ren_fps", true);
            setInterval(function(){input.keyDown(76);},150);
        }
        ///u/162893476 Remove Upgrades = ", key"
        if(e.keyCode===188){
           input.set_convar("ren_upgrades", false);
           setInterval(function(){input.keyDown(76);},150);
        }
        ///u/162893476 Enable Upgrades = ". key"
        if(e.keyCode===190){
            input.set_convar("ren_upgrades", true);
        }
    };
})();