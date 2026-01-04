// ==UserScript==
// @name         No lag
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374624/No%20lag.user.js
// @updateURL https://update.greasyfork.org/scripts/374624/No%20lag.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.set_convar("ren_stroke_soft_color", false);
        input.execute("ren_fps true");
        input.execute("ren_solid_background true");
        input.execute("ren_health_background_color 0x000000");
        input.execute("ren_health_fill_color 0xFFD500");
        clearInterval(setColor);
    }
},1000);