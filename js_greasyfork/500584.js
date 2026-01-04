// ==UserScript==
// @name         Tonnis keystrokes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  :D
// @author       Tonnis
// @license MIT  nope :O
// @match        https://bloxd.io/
// @icon         https://i.imgur.com/1zP8aVR.png
// @downloadURL https://update.greasyfork.org/scripts/500584/Tonnis%20keystrokes.user.js
// @updateURL https://update.greasyfork.org/scripts/500584/Tonnis%20keystrokes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let keystrokescontainer;
    keystrokescontainer = document.createElement("div");
    keystrokescontainer.style.zIndex = "10000";
    keystrokescontainer.style.width = "65px";
    keystrokescontainer.style.height = "45px";
    keystrokescontainer.style.transform = "translate(-50%, -50%)";
    keystrokescontainer.style.backgroundColor = "transparent";
    keystrokescontainer.style.top = "93.5%";
    keystrokescontainer.style.position = "fixed";
    keystrokescontainer.style.left = "97%";
    keystrokescontainer.style.opacity = "70%";
    document.body.appendChild(keystrokescontainer);

    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    keystrokescontainer.addEventListener('mousedown', function(event) {
        if (event.target.nodeName !== 'INPUT') {
            isDragging = true;
            offsetX = event.clientX;
            offsetY = event.clientY;
        }
    });

    document.addEventListener('mousemove', function(event) {
        if (isDragging) {
            const left = event.clientX;
            const top = event.clientY;

            keystrokescontainer.style.left = left + "px";
            keystrokescontainer.style.top = top + "px";
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    function createKeystrokeElement(text, top, left, width, height) {
        let keystroke = document.createElement('div');
        keystroke.style.position = "fixed";
        keystroke.style.color = "#ffffff";
        keystroke.textContent = text;
        keystroke.style.top = top;
        keystroke.style.left = left;
        keystroke.style.transform = "translate(-50%, -50%)";
        keystroke.style.zIndex = "10000";
        keystroke.style.fontWeight = "bold";
        keystroke.style.backgroundColor = "#FFAE23";
        keystroke.style.fontSize = "6.5px";
        keystroke.style.height = height;
        keystroke.style.width = width;
        keystroke.style.textAlign = "center";
        keystroke.style.lineHeight = height;
        keystroke.style.border = '1.15px solid white';
        keystroke.style.borderRadius = '5px';

        return keystroke;
    }

    let wkey = createKeystrokeElement("W", "1.25px", "50%", "12.5px", "12.5px");
    let skey = createKeystrokeElement("S", "15px", "50%", "12.5px", "12.5px");
    let akey = createKeystrokeElement("A", "15px", "28.75%", "12.5px", "12.5px");
    let dkey = createKeystrokeElement("D", "15px", "71.25%", "12.5px", "12.5px");

    let spaceKey = createKeystrokeElement("SPACE", "28.75px", "50%", "40px", "12.5px");
    let lmb = createKeystrokeElement("LMB", "42.5px", "34.5%", "18.75px", "12.5px");
    let rmb = createKeystrokeElement("RMB", "42.5px", "65.5%", "18.75px", "12.5px");

    keystrokescontainer.appendChild(wkey);
    keystrokescontainer.appendChild(skey);
    keystrokescontainer.appendChild(akey);
    keystrokescontainer.appendChild(dkey);
    keystrokescontainer.appendChild(spaceKey);
    keystrokescontainer.appendChild(lmb);
    keystrokescontainer.appendChild(rmb);


    document.addEventListener('keydown', function(event) {
        if (event.key === 'w' || event.key === 'W') {
            wkey.style.backgroundColor = "#D51C00";
        }
        if (event.key === 's' || event.key === 'S') {
            skey.style.backgroundColor = "#D51C00";
        }
        if (event.key === 'a' || event.key === 'A') {
            akey.style.backgroundColor = "#D51C00";
        }
        if (event.key === 'd' || event.key === 'D') {
            dkey.style.backgroundColor = "#D51C00";
        }
        if (event.key === ' ') {
            spaceKey.style.backgroundColor = "#D51C00";
        }
    });

    document.addEventListener('keyup', function(eventa) {
        if (eventa.key === 'w' || eventa.key === 'W') {
            wkey.style.backgroundColor = "#FFAE23";
        }
        if (eventa.key === 's' || eventa.key === 'S') {
            skey.style.backgroundColor = "#FFAE23";
        }
        if (eventa.key === 'a' || eventa.key === 'A') {
            akey.style.backgroundColor = "#FFAE23";
        }
        if (eventa.key === 'd' || eventa.key === 'D') {
            dkey.style.backgroundColor = "#FFAE23";
        }
        if (eventa.key === ' ') {
            spaceKey.style.backgroundColor = "#FFAE23";
        }
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#D51C00";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#D51C00";
        }
    });

    document.addEventListener('mouseup', function(event) {
        if (event.button === 0) {
            lmb.style.backgroundColor = "#FFAE23";
        }
        if (event.button === 2) {
            rmb.style.backgroundColor = "#FFAE23";
        }
    });
})();