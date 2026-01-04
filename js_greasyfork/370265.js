// ==UserScript==
// @name         Test
// @namespace    *
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        htt*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370265/Test.user.js
// @updateURL https://update.greasyfork.org/scripts/370265/Test.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var node = document.createElement("style");
    node.innerText = "img{filter:blur(2px);}";
    document.body.appendChild(node);

 var node = document.createElement("style");
    node.innerText = "img{filter:blur(2px);}";
    document.body.appendChild(node);


    var px = document.createElement("div")
    px.class = "fu";
    px.style = "position:absolute; top:398px; left:345px;height:2px;width:2px;background-color:blue;border-radious:50%";
    document.body.appendChild(px);

    var rgb = false;
    var red, green, blue;

    setInterval(function() {



        if(rgb <= 16777216){
            red   = (rgb >> 16) & 0xFF;
            green = (rgb >> 8) & 0xFF;
            blue  = (rgb) & 0xFF;

            rgb+=30;
        }else{
          rgb=0;
        }

        px.style["background-color"]="rgb("+red+", "+green+", "+blue+")";

    }, 1)

})();