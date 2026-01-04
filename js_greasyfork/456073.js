// ==UserScript==
// @name         OWoT Coordinates presets
// @namespace    owot-coordinatespreset
// @version      1
// @description  Use coordinates presets as an easier way to acessing specific coordinates. Bad script
// @author       e_g.
// @match        https://ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456073/OWoT%20Coordinates%20presets.user.js
// @updateURL https://update.greasyfork.org/scripts/456073/OWoT%20Coordinates%20presets.meta.js
// ==/UserScript==

var p = 30;
menu.addOption('Coordinate preset', function(){
    var x = prompt('X=?');
    var y = prompt('Y=?');
    var a = document.createElement('button');
    a.style.position = "absolute";
    a.style.top = p + "px";
    a.onclick = function(){
        w.doGoToCoord(y, x);
        w.ui.coordGotoModal.close()
    };
    a.innerHTML = "Go to " + x + "," + y;
    var b = modalOverlay.childNodes[1].childNodes[1].childNodes[0].childNodes[0];
    b.append(a);
    p += 20;
    b.style.height = p - 10 + "px";
});