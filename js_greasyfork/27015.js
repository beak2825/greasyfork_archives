// ==UserScript==
// @name         Clicking Bad Auto-Clicker
// @namespace    http://jslifesim.tk
// @version      1.0
// @description  Automagically presses buy/sell buttons on clicking bad!
// @author       andrew65952
// @match        http://clickingbad.nullism.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27015/Clicking%20Bad%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/27015/Clicking%20Bad%20Auto-Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    message("Clicking Bad Hacks Loaded! H-Cookies, J-Stop Cookies, I-Sell, K-Stop Sell"); 
    window.addEventListener("keydown", hacker, false); 
    var autocook; 
    var autosell; 
    function hacker(e) { 
        if (e.keyCode == "72") { 
            autocook = setInterval(function() { 
                document.getElementById("make_btn").click(); 
            },1000/200); 
            message("Auto-Cook: Active"); 
        } else if (e.keyCode == "74") { 
            if (typeof autocook !== undefined) { 
                clearInterval(autocook); 
                message("Auto-Cook: Unactive"); 
            } 
        } else if (e.keyCode == "73") { 
            autosell = setInterval(function() { 
                document.getElementById("sell_btn").click(); 
            }, 1000/200); 
            message("Auto-Sell: Active"); 
        } else if (e.keyCode == "75") { 
            if (typeof autosell !== undefined) { 
                clearInterval(autosell); 
                message("Auto-Sell: Unactive"); 
            } 
        } 
    }
})();