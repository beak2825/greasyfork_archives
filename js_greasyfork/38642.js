// ==UserScript==
// @name         diep.io Quick upgrade
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bounds keys to builds and themes
// @author       La Faucheuse
// @match        *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38642/diepio%20Quick%20upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/38642/diepio%20Quick%20upgrade.meta.js
// ==/UserScript==




(function() {
    document.body.onkeyup=function(e){

		//Build keys
		//Go to http://keycode.info/ if you want to reassign keys and then change the number after "e.keyCode==="

        //00057777 = "z key"
        if(e.keyCode===90){
            input.execute("game_stats_build 565656856885684845658448467777777");
        }

        //57700077 = "x key"
        if(e.keyCode===88){
            input.execute("game_stats_build 232323823823888328832777777711111");
        }



		//Themes bellow. Delete if you don't care, but IMO these are lit.

        //La Faucheuse theme = "v key"
        if(e.keyCode===86){
            input.set_convar("ren_minimap_viewport", true);
            input.set_convar("ren_background_color", 0xC8C661);
            input.set_convar("ren_pattern_grid", false);
            input.set_convar("ren_grid_base_alpha", 0.3);
            input.set_convar("ren_stroke_soft_color_intensity", 1);
            input.execute("net_replace_color 1 0xBCDED2");
            input.execute("net_replace_color 2 0x0E99EE");
            input.execute("net_replace_color 10 0x0BC9E1");
            input.execute("net_replace_color 9 0xF6181B");
            input.execute("net_replace_color 8 0xE3C816");
            input.execute("net_replace_color 11 0xA881C2");
            input.execute("net_replace_color 15 0xF71022");
            input.execute("net_replace_color 16 0xEBE776");
            input.execute("net_replace_color 14 0xBCB28F");
            input.execute("net_replace_color 3 0x0E99EE");
            input.execute("net_replace_color 4 0xF71022");
            input.execute("net_replace_color 5 0xC03998");
            input.execute("net_replace_color 6 0x9FFA03");
            setInterval(function(){input.keyDown(76);},150);
        }
        ///u/162893476 Neon Theme (aka Dark Theme) = "b key"
        if(e.keyCode===66){
            input.set_convar("ren_stroke_soft_color_intensity", -10);
            input.set_convar("ren_border_color_alpha", 0.5);
            input.set_convar("ren_background_color", 0);
            input.set_convar("ren_pattern_grid", false);
            input.execute("ren_grid_color 1118481");
            input.execute("ren_grid_base_alpha 2");
            input.execute("ren_minimap_background_color 0x393939");
            input.execute("ren_border_color 0x202020");
            input.execute("ren_score_bar_fill_color 28496");
            input.execute("ren_xp_bar_fill_color 5854988");
            input.execute("net_replace_colors 986895 986895 4375 4375 1310720 590867 4634 857344 1315840 1508870 3350 1443095 1315840 28496 1315860 1310720 1445891 855309 0");
            input.execute("ui_replace_colors 0x1B5B52 0x385D22 0x6B2626 0x6A5F2E 0x2E3B6A 0x4E2F6A 0x7C3463 0x775334");
        }
    };
})();