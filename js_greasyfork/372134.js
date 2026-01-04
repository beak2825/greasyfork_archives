// ==UserScript==
// @name         Diep.io Light theme ver .Jeshan
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change the setting of Diep.io to the original setting of Jeshan.
// @author       Jeshan
// @match        diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372134/Diepio%20Light%20theme%20ver%20Jeshan.user.js
// @updateURL https://update.greasyfork.org/scripts/372134/Diepio%20Light%20theme%20ver%20Jeshan.meta.js
// ==/UserScript==
var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.execute("net_replace_color 0 0x777777");
        input.execute("net_replace_color 1 0x898989");
        input.execute("net_replace_color 2 0x008db1");
        input.execute("net_replace_color 3 0x008db1");
        input.execute("net_replace_color 4 0xc23f43");
        input.execute("net_replace_color 5 0x9865c4");
        input.execute("net_replace_color 6 0x00aa4b");
        input.execute("net_replace_color 8 0xB8860B");
        input.execute("net_replace_color 9 0xa53c2c");
        input.execute("net_replace_color 10 0x105773");
        input.execute("net_replace_color 11 0xcc5fb0");
        input.execute("net_replace_color 12 0xccb954");
        input.execute("net_replace_color 13 0x2fb270");
        input.execute("net_replace_color 14 0x212121");
        input.execute("net_replace_color 15 0xc23f43");
        input.execute("net_replace_color 16 0xb48c56");
        input.execute("ren_fps true");
        input.execute("ren_solid_background true");
        input.execute("ren_minimap_viewport true");
        input.execute("ren_border_color_alpha 1");
        input.execute("ren_health_fill_color 0x20FFEF");
        input.execute("ren_health_background_color 0x000000");
        clearInterval(setColor);
    }
},1000);