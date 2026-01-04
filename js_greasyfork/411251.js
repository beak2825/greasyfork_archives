// ==UserScript==
// @name         Show Your FPS
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This mod allows you to see your FPS in the top left corner of the game.
// @author       Quintec#0689
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411251/Show%20Your%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/411251/Show%20Your%20FPS.meta.js
// ==/UserScript==

var first = true;
(function() {
    'use strict';
    
    // Reposting this script because Quintec#0689 didn't include description or anything to tell what this script actually does,
    // and it's kinda a waste cause some people might find this useful.

    const times = [];
    let fps;

    function refreshLoop() {
        window.requestAnimationFrame(() => {
            const now = performance.now();
            while (times.length > 0 && times[0] <= now - 1000) {
                times.shift();
            }
            times.push(now);
            fps = times.length;
            if (first) {
                var obj = document.createElement("P");
                var text = document.createTextNode(Math.round(fps).toString() + " FPS");
                obj.appendChild(text);
                obj.setAttribute("id", "fps");
                document.getElementById("ui-top-left").appendChild(obj);
                var credit = document.createElement("P");
                var txt = document.createTextNode("Created by Quintec#0689 on Discord");
                credit.appendChild(txt);
                document.getElementById("ui-top-left").appendChild(credit);
                first = false;
            } else {
                document.getElementById("fps").innerHTML = Math.round(fps).toString() + " FPS";
            }
            refreshLoop();
        });
    }
    refreshLoop();
})();