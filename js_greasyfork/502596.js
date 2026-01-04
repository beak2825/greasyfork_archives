// ==UserScript==
// @name         SWDR EAP Tab animation fix
// @namespace    zordem.com
// @version      2024-08-04
// @description  Fixes EAP Tab animation
// @author       zordem
// @grant        none
// @match        https://rj.td2.info.pl/*
// @match        https://rjdev.td2.info.pl/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502596/SWDR%20EAP%20Tab%20animation%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/502596/SWDR%20EAP%20Tab%20animation%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EAPSound = document.getElementById("signalBlockEAPAudioPlayer");

    const goodListener = function () {
        clearInterval(tabAnimatorInterval);
        tabAnimatorInterval = 0;
        tabAnimatorInterval = setInterval(function () {
            $("a[data-toggle='tab'][href='#swdrTabConnections']").removeClass("bg-yellow");
            $("a[data-toggle='tab'][href='#swdrTabConnections']").addClass("bg-red");
            setTimeout(function () {
                $("a[data-toggle='tab'][href='#swdrTabConnections']").addClass("bg-yellow");
                $("a[data-toggle='tab'][href='#swdrTabConnections']").removeClass("bg-red");
            }, 400);
        }, 800);
    };


    function rehookanim() {
        EAPSound.removeEventListener("playing", function() {});
        EAPSound.addEventListener("playing", goodListener);

        console.log("EAP Tab animation fixed :D ~ zordem");
    }

    rehookanim();

})();