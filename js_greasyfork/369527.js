// ==UserScript==
// @name         FPS Surviv.io
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       Quintec#0689
// @match        *://surviv.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369527/FPS%20Survivio.user.js
// @updateURL https://update.greasyfork.org/scripts/369527/FPS%20Survivio.meta.js
// ==/UserScript==

var first = true;
(function() {
    'use strict';

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