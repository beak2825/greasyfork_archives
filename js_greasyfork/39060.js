// ==UserScript==
// @name         4TDM color rotation
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Press R to switch the 4TDM colors
// @author       La Faucheuse
// @match        *://*.diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39060/4TDM%20color%20rotation.user.js
// @updateURL https://update.greasyfork.org/scripts/39060/4TDM%20color%20rotation.meta.js
// ==/UserScript==

(function() {
    //blue 0x00B1DE
    //red 0xF14E54
    //purple 0xBF7FF5
    //green 0x00E16E
    F=4;
    R=0;
    document.body.onkeyup=function(e){
        if(e.keyCode===82){
            if (R==0){
                input.execute("net_replace_color 5 0x00B1DE");
                input.execute("net_replace_color 4 0xBF7FF5");
                input.execute("net_replace_color 6 0xF14E54");
                input.execute("net_replace_color 3 0x00E16E");
                R+=1;
            }
            else if (R==1){
                input.execute("net_replace_color 4 0x00B1DE");
                input.execute("net_replace_color 6 0xBF7FF5");
                input.execute("net_replace_color 3 0xF14E54");
                input.execute("net_replace_color 5 0x00E16E");
                R+=1;
            }
            else if (R==2){
                input.execute("net_replace_color 6 0x00B1DE");
                input.execute("net_replace_color 3 0xBF7FF5");
                input.execute("net_replace_color 5 0xF14E54");
                input.execute("net_replace_color 4 0x00E16E");
                R+=1;
            }
            else if (R==3){
                input.execute("net_replace_color 3 0x00B1DE");
                input.execute("net_replace_color 5 0xBF7FF5");
                input.execute("net_replace_color 4 0xF14E54");
                input.execute("net_replace_color 6 0x00E16E");
                R=0;
            }
        }
    };
})();