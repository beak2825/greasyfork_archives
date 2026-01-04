// ==UserScript==
// @name        Hydra
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  base automatica
// @author       Moderno
// @match        http://bloble.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412298/Hydra.user.js
// @updateURL https://update.greasyfork.org/scripts/412298/Hydra.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
addEventListener("keydown", function(a) {
    if (a.keyCode == 99) {
        setTimeout(function() {
            gens1();
        }, 1000);
        setTimeout(function() {
            gens1();
        }, 10000);
        setTimeout(function() {
            gens1();
        }, 20000);
        setTimeout(function() {
            gens1();
        }, 30000);
        setTimeout(function() {
            gens1();
        }, 50000);
        setTimeout(function() {
            gens1();
        }, 55000);
        setTimeout(function() {
            cam311();
        }, 80000);
        setTimeout(function() {
            bou1();
        }, 120000);
        setTimeout(function() {
            bou2();
        }, 255000);
        setTimeout(function() {
            gens2();
        }, 355000);
        setTimeout(function() {
            base();
        }, 360000);
        setTimeout(function() {
            army();
        }, 362000);
        setTimeout(function() {
            upgens();
        }, 363000);
        setTimeout(function() {
            ant();
        }, 380000);
        setTimeout(function() {
            upgens();
        }, 400000);
        setTimeout(function() {
            bou1();
        }, 410000);
        setTimeout(function() {
            bou2();
        }, 430000);
        setTimeout(function() {
            bou2();
        }, 450000);
        setTimeout(function() {
            ant();
        }, 490000);
    }

    function gens1() {
        socket.emit("1", 4.73, 245, 3), socket.emit("1", 5.0025, 245, 3), socket.emit("1", 5.275, 245, 3), socket.emit("1", 5.5475, 245, 3), socket.emit("1", 5.82, 245, 3);
        socket.emit("1", 6.0925, 245, 3), socket.emit("1", 6.365, 245, 3), socket.emit("1", 6.6375, 245, 3), socket.emit("1", 6.91, 245, 3), socket.emit("1", 7.1825, 245, 3);
        socket.emit("1", 7.455, 245, 3), socket.emit("1", 7.7275, 245, 3), socket.emit("1", 8.0025, 245, 3), socket.emit("1", 8.275, 245, 3), socket.emit("1", 8.5475, 245, 3);
        socket.emit("1", 8.82, 245, 3), socket.emit("1", 9.0925, 245, 3), socket.emit("1", 9.3675, 245, 3), socket.emit("1", 9.64, 245, 3), socket.emit("1", 9.9125, 245, 3);
        socket.emit("1", 10.1875, 245, 3);
        socket.emit("1", 10.4625, 245, 3);
        socket.emit("1", 10.7375, 245, 3);
        socket.emit("1", 5.999, 180, 3);
        socket.emit("1", 6.275, 130, 3);
        socket.emit("1", 6.51, 185, 3);
        socket.emit("1", 6.775, 130, 3);
        socket.emit("1", 7.05, 185, 3);
        socket.emit("1", 7.3, 130, 3);
        socket.emit("1", 7.6, 185, 3);
        socket.emit("1", 7.85, 130, 3);
        socket.emit("1", 8.15, 185, 3);
        socket.emit("1", 8.4, 130, 3);
        socket.emit("1", 8.675, 185, 3);
        socket.emit("1", 8.925, 130, 3);
        socket.emit("1", 9.225, 185, 3);
        socket.emit("1", 9.5, 130, 3);
        socket.emit("1", 9.78, 185, 3);
        socket.emit("1", 10.05, 130, 3);
        socket.emit("1", 10.325, 185, 3);
        socket.emit("1", 10.6, 130, 3);
        socket.emit("1", 4.5889, 186.5, 3);
        socket.emit("1", 4.81, 130, 3);
        socket.emit("1", 5.085, 180.5, 3);
        socket.emit("1", 5.36, 130, 3);
        socket.emit("1", 5.64, 180, 3);
    }

    function cam311() {
        socket.emit("1", 1.57, 311, 1);
        socket.emit("1", 1.78, 311, 8);
        socket.emit("1", 1.99, 311, 1);
        socket.emit("1", 2.19, 311, 1);
        socket.emit("1", 2.39, 311, 1);
        socket.emit("1", 2.60, 311, 8);
        socket.emit("1", 2.81, 311, 1);
        socket.emit("1", 3.01, 311, 1);
        socket.emit("1", 3.21, 311, 1);
        socket.emit("1", 3.41, 311, 1);
        socket.emit("1", 3.61, 311, 1);
        socket.emit("1", 3.81, 311, 1);
        socket.emit("1", 4.01, 311, 1);
        socket.emit("1", 4.21, 311, 1);
        socket.emit("1", 4.41, 311, 1);
        socket.emit("1", 4.61, 311, 1);
        socket.emit("1", 4.81, 311, 1);
        socket.emit("1", 5.01, 311, 1);
        socket.emit("1", 5.21, 311, 1);
        socket.emit("1", 5.41, 311, 1);
        socket.emit("1", 5.61, 311, 1);
        socket.emit("1", 5.81, 311, 1);
        socket.emit("1", 6.01, 311, 1);
        socket.emit("1", 6.21, 311, 1);
        socket.emit("1", 6.41, 311, 1);
        socket.emit("1", 6.61, 311, 1);
        socket.emit("1", 6.82, 311, 8);
        socket.emit("1", 7.03, 311, 1);
        socket.emit("1", 7.23, 311, 1);
        socket.emit("1", 7.43, 311, 1);
        socket.emit("1", 7.64, 311, 8);
    }

    function bou1() {
        for (i = 0; i < units.length; ++i) {
            if (3 == units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {
                socket.emit("4", units[i].id, 0);
            }
        }
    }

    function bou2() {
        for (i = 0; i < units.length; ++i) {
            if (3 == units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid) {
                socket.emit("4", units[i].id, 0);
            }
        }
    }

    function gens2() {
        for (var a = [], d = 0; d < units.length; ++d) {
            if (units[d].type === 0 && units[d].owner == player.sid) {
                var name = getUnitFromPath(units[d].uPath).name;
                (name === 'Generator' || name === 'Power Plant') && a.push(units[d].id)
            }
        }
        socket.emit("3", a)
    }

    function base() {
        socket.emit("1", 4.70, 130, 7);
        socket.emit("1", 4.70, 211, 4);
        socket.emit("1", 4.48, 245, 4);
        socket.emit("1", 4.92, 245, 4);
        socket.emit("1", 4.23, 245, 4);
        socket.emit("1", 5.17, 245, 4);
        socket.emit("1", 4.03, 245, 4);
        socket.emit("1", 5.37, 245, 4);
        socket.emit("1", 3.98, 245, 4);
        socket.emit("1", 5.42, 245, 4);
        socket.emit("1", 4.16, 130, 3);
        socket.emit("1", 5.24, 130, 3);
        socket.emit("1", 4.36, 188, 5);
        socket.emit("1", 5.04, 188, 5);
        socket.emit("1", 5.48, 184, 3);
        socket.emit("1", 3.92, 184, 3);
        socket.emit("1", 5.72, 130, 4);
        socket.emit("1", 3.68, 130, 4);
        socket.emit("1", 5.68, 245, 3);
        socket.emit("1", 3.72, 245, 3);
        socket.emit("1", 3.58, 188, 4);
        socket.emit("1", 5.82, 188, 4);
        socket.emit("1", 5.96, 245, 5);
        socket.emit("1", 3.44, 245, 5);
        socket.emit("1", 6.20, 130, 3);
        socket.emit("1", 3.20, 130, 3);
        socket.emit("1", 6.14, 194, 4);
        socket.emit("1", 3.26, 194, 4);
        socket.emit("1", 3.11, 245, 4);
        socket.emit("1", 6.29, 245, 4);
        socket.emit("1", 2.72, 130, 4);
        socket.emit("1", 6.68, 130, 4);
        socket.emit("1", 6.47, 183, 3);
        socket.emit("1", 2.93, 183, 3);
        socket.emit("1", 6.55, 245, 4);
        socket.emit("1", 2.86, 245, 4);
        socket.emit("1", 6.88, 184, 5);
        socket.emit("1", 2.52, 184, 5);
        socket.emit("1", 2.20, 130, 3);
        socket.emit("1", 7.20, 130, 3);
        socket.emit("1", 2.35, 245, 4);
        socket.emit("1", 2.19, 194, 4);
        socket.emit("1", 7.05, 245, 4);
        socket.emit("1", 2.04, 245, 4);
        socket.emit("1", 7.21, 194, 4);
        socket.emit("1", 7.36, 245, 4);
        socket.emit("1", 1.56, 130, 3);
        socket.emit("1", 1.86, 178, 3);
        socket.emit("1", 7.54, 178, 3);
        socket.emit("1", 1.56, 207, 5);
        socket.emit("1", 2.60, 245, 1);
        socket.emit("1", 6.80, 245, 1);
        socket.emit("1", 1.78, 245, 1);
        socket.emit("1", 7.62, 245, 1);
    }

    function army() {
        for (i = 0; i < units.length; ++i) { //armory upgrade
            if (0 === units[i].type && "circle" == units[i].shape && units[i].owner == player.sid) {
                socket.emit("4", units[i].id, 0);
            }
        }
    }

    function upgens() {
        for (i = 0; i < units.length; ++i) { //gens upgrade
            if (0 === units[i].type && "hexagon" == units[i].shape && units[i].owner == player.sid) {
                socket.emit("4", units[i].id, 0);
            }
        }
    }

    function ant() {
        for (var i = 0; i < units.length; ++i) 0 == units[i].type && 4 == units[i].turretIndex && "circle" == units[i].shape && units[i].owner == player.sid && socket.emit("4", units[i].id, 1)
    }
});
function ttrool() { for (var a = [], d = 0; d < units.length; ++d)(units[d].type === 3 || units[d].type === 2 || units[d].type === 0) && units[d].owner == player.sid && a.push(units[d].id);socket.emit("3", a)
    }
setInterval(ttrool, 180000);
addEventListener("keydown", function(a) {
    if (a.keyCode == 98) {
        socket.emit("1", 4.70, 130, 1);
        socket.emit("1", 4.70, 211, 1);
        socket.emit("1", 4.48, 245, 1);
        socket.emit("1", 4.92, 245, 1);
        socket.emit("1", 4.23, 245, 1);
        socket.emit("1", 5.17, 245, 1);
        socket.emit("1", 4.03, 245, 1);
        socket.emit("1", 5.37, 245, 1);
        socket.emit("1", 3.98, 245, 1);
        socket.emit("1", 5.42, 245, 1);
        socket.emit("1", 4.16, 130, 1);
        socket.emit("1", 5.24, 130, 1);
        socket.emit("1", 4.36, 188, 1);
        socket.emit("1", 5.04, 188, 1);
        socket.emit("1", 5.48, 184, 1);
        socket.emit("1", 3.92, 184, 1);
        socket.emit("1", 5.72, 130, 1);
        socket.emit("1", 3.68, 130, 1);
        socket.emit("1", 5.68, 245, 1);
        socket.emit("1", 3.72, 245, 1);
        socket.emit("1", 3.58, 188, 1);
        socket.emit("1", 5.82, 188, 1);
        socket.emit("1", 5.96, 245, 1);
        socket.emit("1", 3.44, 245, 1);
        socket.emit("1", 6.20, 130, 1);
        socket.emit("1", 3.20, 130, 1);
        socket.emit("1", 6.14, 194, 1);
        socket.emit("1", 3.26, 194, 1);
        socket.emit("1", 3.11, 245, 1);
        socket.emit("1", 6.29, 245, 1);
        socket.emit("1", 2.72, 130, 1);
        socket.emit("1", 6.68, 130, 1);
        socket.emit("1", 6.47, 183, 1);
        socket.emit("1", 2.93, 183, 1);
        socket.emit("1", 6.55, 245, 1);
        socket.emit("1", 2.86, 245, 1);
        socket.emit("1", 6.88, 184, 1);
        socket.emit("1", 2.52, 184, 1);
        socket.emit("1", 2.20, 130, 1);
        socket.emit("1", 7.20, 130, 1);
        socket.emit("1", 2.35, 245, 1);
        socket.emit("1", 2.19, 194, 1);
        socket.emit("1", 7.05, 245, 1);
        socket.emit("1", 2.04, 245, 1);
        socket.emit("1", 7.21, 194, 1);
        socket.emit("1", 7.36, 245, 1);
        socket.emit("1", 1.56, 130, 1);
        socket.emit("1", 1.86, 178, 1);
        socket.emit("1", 7.54, 178, 1);
        socket.emit("1", 1.56, 207, 1);
        socket.emit("1", 2.60, 245, 1);
        socket.emit("1", 6.80, 245, 1);
        socket.emit("1", 1.78, 245, 1);
        socket.emit("1", 7.62, 245, 1);
        socket.emit("1", 1.57, 311, 1);
        socket.emit("1", 1.78, 311, 1);
        socket.emit("1", 1.99, 311, 1);
        socket.emit("1", 2.19, 311, 1);
        socket.emit("1", 2.39, 311, 1);
        socket.emit("1", 2.60, 311, 1);
        socket.emit("1", 2.81, 311, 1);
        socket.emit("1", 3.01, 311, 1);
        socket.emit("1", 3.21, 311, 1);
        socket.emit("1", 3.41, 311, 1);
        socket.emit("1", 3.61, 311, 1);
        socket.emit("1", 3.81, 311, 1);
        socket.emit("1", 4.01, 311, 1);
        socket.emit("1", 4.21, 311, 1);
        socket.emit("1", 4.41, 311, 1);
        socket.emit("1", 4.61, 311, 1);
        socket.emit("1", 4.81, 311, 1);
        socket.emit("1", 5.01, 311, 1);
        socket.emit("1", 5.21, 311, 1);
        socket.emit("1", 5.41, 311, 1);
        socket.emit("1", 5.61, 311, 1);
        socket.emit("1", 5.81, 311, 1);
        socket.emit("1", 6.01, 311, 1);
        socket.emit("1", 6.21, 311, 1);
        socket.emit("1", 6.41, 311, 1);
        socket.emit("1", 6.61, 311, 1);
        socket.emit("1", 6.82, 311, 1);
        socket.emit("1", 7.03, 311, 1);
        socket.emit("1", 7.23, 311, 1);
        socket.emit("1", 7.43, 311, 1);
        socket.emit("1", 7.64, 311, 1);
    }
});