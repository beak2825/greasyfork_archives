// ==UserScript==
// @name         Diep.io Simple Colors Theme
// @version      1
// @description  Change the setting of Diep.io to simple colors theme.
// @author       Unary
// @grant        none
// @include      http://diep.io/
// @namespace https://greasyfork.org/users/158176
// @downloadURL https://update.greasyfork.org/scripts/36326/Diepio%20Simple%20Colors%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/36326/Diepio%20Simple%20Colors%20Theme.meta.js
// ==/UserScript==
var setColor=setInterval(function(){
    if(document.getElementById("loading").innerText===""){
        input.execute("net_replace_color 1 0xa3a3a3");
input.execute("net_replace_color 2 0x00e1ff");
input.execute("net_replace_color 3 0x00e1ff");
input.execute("net_replace_color 4 0xff0c00");
input.execute("net_replace_color 5 0x7200ff");
input.execute("net_replace_color 6 0x04ff00");
input.execute("net_replace_color 7 0x04ff00");
input.execute("net_replace_color 8 0xeeff00");
input.execute("net_replace_color 10 0x0000ff");
input.execute("net_replace_color 11 0xf600ff");
input.execute("net_replace_color 12 0xeeff00");
input.execute("net_replace_color 13 0x00ff00");
input.execute("net_replace_color 14 0xa3a3a3");
input.execute("net_replace_color 15 0xff0c00");
input.execute("net_replace_color 16 0xeeff00");
input.execute("net_replace_color 17 0xa3a3a3");
input.execute("net_replace_color 18 0xa3a3a3");
input.execute("ren_stroke_soft_color_intensity 1");
        clearInterval(setColor);
    }
},1000);