// ==UserScript==
// @name         Legacy Outlines for diep
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  the outline arond things
// @author       iiiiop
// @match        https://diep.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398647/Legacy%20Outlines%20for%20diep.user.js
// @updateURL https://update.greasyfork.org/scripts/398647/Legacy%20Outlines%20for%20diep.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.set_convar("ren_stroke_soft_color", false);
        clearInterval(setColor);
    }
},1000);