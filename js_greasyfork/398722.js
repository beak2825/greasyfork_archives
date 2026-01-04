// ==UserScript==
// @name         All shiny polygons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398722/All%20shiny%20polygons.user.js
// @updateURL https://update.greasyfork.org/scripts/398722/All%20shiny%20polygons.meta.js
// ==/UserScript==

var setColor=setInterval(()=>{
    if(document.getElementById("loading").innerText===""){
        input.execute("net_replace_color 8 0x89FF69");
        input.execute("net_replace_color 9 0x89FF69");
        input.execute("net_replace_color 10 0x89FF69");
        clearInterval(setColor);
    }
},1000);