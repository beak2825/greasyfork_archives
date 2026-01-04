// ==UserScript==
// @name         Diep.io Theme for T.wS
// @namespace    https://greasyfork.org/ja/users/230360
// @version      1.2
// @description  maybe a dark theme i think
// @author       T.wS
// @match        diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411094/Diepio%20Theme%20for%20TwS.user.js
// @updateURL https://update.greasyfork.org/scripts/411094/Diepio%20Theme%20for%20TwS.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
	input.execute("ren_fps true");
	input.execute("net_predict_movement false");
	input.execute("ren_solid_background true");
        input.execute("ui_replace_colors 0xa321ff 0x8b19ff 0x3426ff 0x0e69e6 0x03cee5 0x03e6ff 0x00ffa2 0x00ff00");
        input.execute("net_replace_color 3 3355647");
        input.execute("net_replace_color 4 16724787");
        input.execute("net_replace_color 5 16724991");
        input.execute("net_replace_color 6 3407667");
        input.execute("net_replace_color 15 16724787");
        input.execute("net_replace_color 16 16746496");
        input.set_convar("ren_background_color", 1118481);
        input.set_convar("ren_health_background_color", 16777215);
        input.set_convar("ren_health_fill_color", 16711680);
        input.set_convar("ren_minimap_background_color", 6710886);
        input.set_convar("ren_score_bar_fill_color", false);
        input.set_convar("ren_stroke_soft_color_intensity", 0.52);
        input.set_convar("ren_xp_bar_fill_color", 10066431);
        input.set_convar("ren_raw_health_values", true);
        input.set_convar("ren_minimap_viewport", true);
        clearInterval(setColor);
    }
}, 1000);