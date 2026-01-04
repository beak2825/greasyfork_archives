// ==UserScript==
// @name        diep color theme
// @include        ://diep.io/
// @author      BLITZKRIEG
// @description a  color script for diep
// @connect        diep.io
// @namespace   [SCRIPT]
// @version 1
// @downloadURL https://update.greasyfork.org/scripts/432619/diep%20color%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/432619/diep%20color%20theme.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.set_convar("ren_stroke_soft_color", true);
        input.execute("ren_fps true"); //FPS Anzeigen
        input.execute("ren_raw_health_values true"); //Leben anzeigen
        input.execute("ren_solid_background false");
        input.execute("ren_health_background_color 0x000000");
        input.execute("net_replace_color 2 0x00B1DE"); //you FFA
        input.execute("net_replace_color 15 0xF154E54"); //Other FFA
        input.execute("net_replace_color 3 0x00BFDE"); //Blue
        input.execute("net_replace_color 4 0xF12739"); //Red
        input.execute("net_replace_color 6 0x12E108"); //Green
        input.execute("net_replace_color 5 0xF55FF1"); //Purple
        input.execute("net_replace_color 9 0xFC7677"); //Triangle
        input.execute("net_replace_color 8 0xFFE869"); //Square
        input.execute("net_replace_color 10 0x768DFC"); //Pentagon
        input.execute("net_replace_color 11 0xFFFFFF"); //Crasher
        input.execute("ren_health_fill_color 0xFFA500"); //Farbe Lebens

    }
},1000);