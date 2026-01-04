// ==UserScript==
// @name         Diep.io Simple Colors Theme
// @version      1
// @description  Change the setting of Diep.io to simple colors theme.
// @author       Joshua8899
// @grant        none
// @include      https://diep.io/
// @namespace https://greasyfork.org/users/158176
// @downloadURL https://update.greasyfork.org/scripts/433515/Diepio%20Simple%20Colors%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/433515/Diepio%20Simple%20Colors%20Theme.meta.js
// ==/UserScript==
input.set_convar("ren_stroke_soft_color_intensity", -10);
input.set_convar("ren_border_color_alpha", 0.5);
input.set_convar("ren_background_color", 0);
input.set_convar("ren_pattern_grid", true);
input.execute("ren_grid_color 1118481");
input.execute("ren_grid_base_alpha 0");
input.execute("ren_minimap_background_color 0x393939");
input.execute("ren_border_color 0x202020");
input.execute("ren_score_bar_fill_color 28496");
input.execute("ren_xp_bar_fill_color 5854988");
input.execute("ren_health_fill_color 0x000000");
input.execute("net_replace_colors 986895 986895 1315840 590867 1310720 590867 4634 857344 1315840 1508870 4634 1443095 1315840 28496 1315860 1310720 1445891 855309 0");
input.execute("ren_fps true");