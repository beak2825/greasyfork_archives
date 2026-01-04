// ==UserScript==
// @name         Tonnis Client
// @namespace    http://tampermonkey.net/
// @version      2024-06-15
// @description  this coooooooooooooooollllllllllllll
// @author       You
// @match        https://bloxd.io/
// @license MIT nope
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500242/Tonnis%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/500242/Tonnis%20Client.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //keystrokes
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

    //CrossHair
    setInterval(function() {
    const crosshair = document.querySelector(".CrossHair");
    if (crosshair) {
        crosshair.textContent = "";
        crosshair.style.backgroundImage = "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAAAXNSR0IArs4c6QAAATtJREFUaEPtmFsOgzAMBJv7H5qqEBBSAI8trUSj7ffatcebB2kf3W+BqRvUpWSSpL2CuRtbluv+WjuYSuBKkp4n5sZSKygWe2Ixo0GxLi5bsUDuKcRWLAC1FQvQwhBbMUQ0CmzFArQwxFYMEdmKGwHf7gtWWcEV40jY3B+agIAEriQpaEYumboxuhYo5R0WzZvVozp+SWkBKOFpQ6J5tY3dfenibsZXp+xd8VGfreOYmBu7QXdxk/DEOitb8fERp6/1+dcY3XWALrt9Z/WghO0STM8blPBN5xgt+K90U98VVZOgFpfAlSQ9n0uAmqQGSVJy4PrNA4z8SuKJFcBlL8GFv7gP8cQKOD2xArQwxFYMEY0CW7EALQyxFUNEtuJGwHfFglVWcMU4EuZdkVDKauQTAwVJapAkfcMX9BdcedwtahqUCgAAAABJRU5ErkJggg==)";
        crosshair.style.backgroundRepeat = "no-repeat";
        crosshair.style.backgroundSize = "contain";
        crosshair.style.width = "16px";
        crosshair.style.height = "16px";
        crosshair.style.opacity = "60%";
        }
    }, 1000);

    //healthbar
    setInterval(function() {
    var health1 = document.getElementsByClassName("BottomScreenStatBar");
    health1[0].style.backgroundColor = "rgb(126, 13, 13,)";
    health1[0].style.boxShadow = "3.5 0.4px rgb(178, 11, 11)";
    health1[0].style.borderRadius = "6px"
    var health2 = document.getElementsByClassName("BottomScreenStatBarBackground");
    health2[0].style.backgroundColor = "rgb(0,0,0)";
    health2[0].style.borderRadius = "6px"
    health2[0].style.width = "50rem"
    var background = document.getElementsByClassName("Background");
    var health3 = document.getElementsByClassName("BottomScreenStatBarWrapper");
    health3[0].style.left = "0.75rem"
    health3[0].style.top = "2rem"
    }, 1000);

    //hotbar
    setInterval(function() {
        const hotbarslots = document.querySelectorAll(".item");
        const selectedslot = document.querySelectorAll(".SelectedItem");
        if (hotbarslots) {
            hotbarslots.forEach(function(hotbar) {
                hotbar.style.color = "#fff";
                hotbar.style.borderRadius = "5px";
                hotbar.style.border = "0px";
                hotbar.style.borderTopLeftRadius = "5px";
                hotbar.style.boxShadow = "0 2px 4px rgba(225, 225, 225, 0.1), 0 0 10px rgba(0, 0, 0, 0.7)";
                hotbar.style.backdropFilter = "blur(5px)";
                hotbar.style.width = "30px"
                hotbar.style.height = "30px"
                hotbar.style.background = "rgba(0,0,0,.4)"
            });
        }
        if (selectedslot) {
            selectedslot.forEach(function(slot) {
                slot.style.color = "#fff";
                slot.style.borderRadius = "5px";
                slot.style.border = "0px";
                slot.style.borderTopLeftRadius = "5px";
                slot.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.7)";
                slot.style.backdropFilter = "blur(5px)";
                slot.style.width = "30px"
                slot.style.height = "30px"
                slot.style.background = "rgba(125, 125, 125, 0.4)"
            });
        }
    }, 100);
})();