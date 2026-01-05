// ==UserScript==
// @name        diep.io dark theme - modified
// @version      007
// @description  dark them by 162893476, script by BlazingFire007, modified by 325 Gerbils
// @author       BlazingFire007, 325 Gerbils, && 162893476
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        http://diep.io/*
// @run-at         document-end
// @namespace https://greasyfork.org/users/49806
// @downloadURL https://update.greasyfork.org/scripts/28379/diepio%20dark%20theme%20-%20modified.user.js
// @updateURL https://update.greasyfork.org/scripts/28379/diepio%20dark%20theme%20-%20modified.meta.js
// ==/UserScript==
$(window).load(function () {
    input.set_convar("ren_stroke_soft_color_intensity", -10);
    input.set_convar("ren_background_color", 0);
    input.set_convar("ren_border_color_alpha", 1);
    input.set_convar("ren_solid_background", true);
    input.execute("ren_minimap_background_color 3289650");
    input.execute("ren_border_color 0x0f0f0f");
    input.execute("net_replace_colors 986895 986895 4375 4375 1310720 590867 4634 857344 1315840 1508870 3350 1443095 1315840 28496 1315860 1310720 1445891 855309 0");
    input.execute("ui_replace_colors 0x440088 0x000088 0x004444  0x008800  0x448800  0x888800  0x884400  0x880000");
});