// ==UserScript==
// @name         flat.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398724/flatio.user.js
// @updateURL https://update.greasyfork.org/scripts/398724/flatio.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.execute("ren_stroke_soft_color_intensity = 0");
        clearInterval(setColor);
    }
},1000);