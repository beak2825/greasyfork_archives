// ==UserScript==
// @name         arras.io theme for diep.io!!!
// @version      0.1.1
// @description  Full Arras.io theme for diep.io
// @author       Mixaz017
// @match        diep.io/
// @namespace https://greasyfork.org/users/158176
// @downloadURL https://update.greasyfork.org/scripts/439924/arrasio%20theme%20for%20diepio%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/439924/arrasio%20theme%20for%20diepio%21%21%21.meta.js
// ==/UserScript==
var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.execute("net_replace_color 4 4737096");
        input.execute("net_replace_color 4 10987439");
        input.execute("net_replace_color 4 3974347");
        input.execute("net_replace_color 4 3974347");
        input.execute("net_replace_color 4 14761537");
        input.execute("net_replace_color 4 13461149");
        input.execute("net_replace_color 4 9092159");
        input.execute("net_replace_color 4 15714123");
        input.execute("net_replace_color 4 15173997");
        input.execute("net_replace_color 4 9267935");
        input.execute("net_replace_color 4 15702467");
        input.execute("net_replace_color 4 9092159");
        input.execute("net_replace_color 4 10987439");
        input.execute("net_replace_color 4 14696001");
        input.execute("ui_replace_colors 3974347 12183678 14696001 16642944");
        input.set_convar("ren_background_color",14408667);
        input.set_convar("ren_bar_background_color",10987439);
        input.set_convar("ren_grid_base_alpha",1);
        input.set_convar("ren_grid_color",10987439);
        input.set_convar("ren_health_background_color",4737096);
        input.set_convar("ren_health_fill_color",12183678);
        input.set_convar("ren_minimap_background_color",12499903);
        input.set_convar("ren_minimap_border_color",4737096);
        input.set_convar("ren_score_bar_fill_color",9092159);
        input.set_convar("ren_xp_bar_fill_color",15714123);
        clearInterval(setColor);
    }
},1000);