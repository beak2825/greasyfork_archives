// ==UserScript==
// @name         Neon
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  diepio neon
// @author       You
// @match        ://.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433052/Neon.user.js
// @updateURL https://update.greasyfork.org/scripts/433052/Neon.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.set_convar("ren_stroke_soft_color_intensity", -10);
        input.set_convar("ren_background_color", 0);
        input.set_convar("ren_border_color_alpha", 0.5);
        input.execute("ren_fps true");
        input.execute("ren_health_background_color 0x101010");
        input.execute("ren_score_bar_fill_color 28496");
        input.execute("ren_xp_bar_fill_color 5854988");
        input.execute("ren_border_color 0x101010");
        input.execute("ren_minimap_background_color 0x393939");
        input.execute("net_replace_colors 986895 986895 4375 4375 1310720 590867 4634 857344 1315840 1508870 3350 1443095 1315840 28496 1315860 1310720 1445891 855309 0");
        input.execute("ui_replace_colors 0x1B5B52 0x385D22 0x6B2626 0x6A5F2E 0x2E3B6A 0x4E2F6A 0x7C3463 0x775334");
        setInterval(function(){input.keyDown(76);}, 150);
        clearInterval(setColor);
    }
},1000);