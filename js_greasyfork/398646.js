// ==UserScript==
// @name         Dark diep
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Lights off in diep
// @author       iiiiop
// @match        diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398646/Dark%20diep.user.js
// @updateURL https://update.greasyfork.org/scripts/398646/Dark%20diep.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.execute("ren_solid_background true");
        input.execute("ren_health_background_color 0x8c8c8c");
        input.execute("ren_minimap_background_color 0x333333");
        input.execute("ren_background_color 0x0d0d0d");
        input.execute("ren_border_color 0xffffff");
        input.execute("ren_bar_background_color 0x8c8c8c");
        input.execute("net_replace_color 14 0x595959");
        input.execute("ren_stroke_solid_color 0x404040");
        clearInterval(setColor);
    }
},1000);