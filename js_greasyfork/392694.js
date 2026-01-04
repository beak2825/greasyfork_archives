// ==UserScript==
// @name       Remonta wall 2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description Mano moderno manda.
// @author       You
// @match       http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392694/Remonta%20wall%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/392694/Remonta%20wall%2020.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
addEventListener("keydown", function(a) {
    if (a.keyCode == 57) {
        setTimeout(function() {
            vender();
        }, 10);

        setTimeout(function() {
            REMONTAR();
        }, 20);
        setTimeout(function() {
            evoluir();
        }, 30);
           setTimeout(function() {
            evoluir();
        }, 40);
           setTimeout(function() {
            evoluir();
        }, 50);
         setTimeout(function() {
            evoluir();
        }, 80);

    }

    function vender() {
               for (var a = [], d = 0; d < units.length; ++d) units[d].type === 3 && units[d].owner == player.sid && getUnitFromPath(units[d].uPath).name === 'Wall' && a.push(units[d].id);
    socket.emit("3", a)
}})


;
 function REMONTAR() {
socket.emit("1",4.725,130,7);
                socket.emit("1",5.245,130,4);
                socket.emit("1",5.715,130,4);
                socket.emit("1",6.185,130,4);
                socket.emit("1",6.655,130,4);
                socket.emit("1",7.13,130,4);
                socket.emit("1",7.6,130,4);
                socket.emit("1",1.85,130,4);
                socket.emit("1",2.32,130,4);
                socket.emit("1",2.79,130,4);
                socket.emit("1",3.265,130,4);
                socket.emit("1",3.735,130,4);
                socket.emit("1",4.205,130,4);
                socket.emit("1",5.06,185,4);
                socket.emit("1",5.4,185,4);
                socket.emit("1",5.725,190,4);
                socket.emit("1",6.045,186,4);
                socket.emit("1",6.374,185,4);
                socket.emit("1",6.7215,189.5,4);
                socket.emit("1",7.0425,188.5,4);
                socket.emit("1",7.365,185,4);
                socket.emit("1",7.712,187.45,4);
                socket.emit("1",8.035,188.5,4);
                socket.emit("1",8.36,185,4);
                socket.emit("1",2.425,188,4);
                socket.emit("1",2.75,190,4);
                socket.emit("1",3.075,184,4);
                socket.emit("1",3.42,186,4);
                socket.emit("1",3.74,190,4);
                socket.emit("1",4.06,186,4);
                socket.emit("1",4.39,185,4);
                socket.emit("1",4.8625,245,4);
                socket.emit("1",5.1125,245,4);
                socket.emit("1",5.3625,245,4);
                socket.emit("1",5.6125,245,4);
                socket.emit("1",5.8625,245,4);
                socket.emit("1",6.1125,245,4);
                socket.emit("1",6.3625,245,4);
                socket.emit("1",6.6125,245,4);
                socket.emit("1",6.8625,245,4);
                socket.emit("1",7.14,245,4);
                socket.emit("1",7.39,245,4);
                socket.emit("1",7.64,246,4);
                socket.emit("1",7.89,246,4);
                socket.emit("1",8.14,246,4);
                socket.emit("1",8.39,246,4);
                socket.emit("1",8.635,246,4);
                socket.emit("1",8.885,246,4);
                socket.emit("1",2.5825,245,4);
                socket.emit("1",2.8625,245,4);
                socket.emit("1",3.1125,245,4);
                socket.emit("1",3.3625,245,4);
                socket.emit("1",3.6125,245,4);
                socket.emit("1",3.8625,245,4);
                socket.emit("1",4.1125,245,4);
                socket.emit("1",4.3625,245,4);
                socket.emit("1",4.6125,245,4);
                socket.emit("1",7.86,311,1);
                socket.emit("1",8.06,311,1);
                socket.emit("1",8.26,311,1);
                socket.emit("1",8.46,311,1);
                socket.emit("1",8.66,311,1);
                socket.emit("1",8.86,311,1);
                socket.emit("1",9.06,311,1);
                socket.emit("1",9.26,311,1);
                socket.emit("1",9.46,311,1);
                socket.emit("1",9.66,311,1);
                socket.emit("1",9.86,311,1);
                socket.emit("1",10.28,311,1);
                socket.emit("1",10.70,311,1);
                socket.emit("1",10.90,311,1);
                socket.emit("1",11.10,311,1);
                socket.emit("1",11.30,311,1);
                socket.emit("1",11.72,311,1);
                socket.emit("1",12.14,311,1);
                socket.emit("1",12.34,311,1);
                socket.emit("1",12.54,311,1);
                socket.emit("1",12.74,311,1);
                socket.emit("1",12.94,311,1);
                socket.emit("1",13.14,311,1);
                socket.emit("1",13.34,311,1);
                socket.emit("1",13.54,311,1);
                socket.emit("1",13.74,311,1);
                socket.emit("1",13.94,311,1);
                socket.emit("1",10.07,311,8);
                socket.emit("1",10.49,311,8);
                socket.emit("1",11.51,311,8);
                socket.emit("1",11.93,311,8);
    }
    function evoluir() {for (var i = 0; i < units.length; ++i) 3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
                       }
(addEventListener("keydown", function(a) {
 if (a.keyCode == 69) {
 socket.emit("4",0,0,1);}

;
})
 );