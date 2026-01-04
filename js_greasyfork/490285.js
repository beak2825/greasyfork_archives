// ==UserScript==
// @name         Bloxd.io GUI beta
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      2024-03-19
// @description  A Simple GUI for Bloxd.io. still in work though
// @author       You
// @match        https://bloxd.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bloxd.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490285/Bloxdio%20GUI%20beta.user.js
// @updateURL https://update.greasyfork.org/scripts/490285/Bloxdio%20GUI%20beta.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clickGUI = document.createElement('div');
clickGUI.style.position = 'fixed';
clickGUI.style.top = '50%';
clickGUI.style.left = '50%';
clickGUI.style.transform = 'translate(-50%, -50%)';
clickGUI.style.backgroundColor = 'rgba(255, 255, 255, 0.93)';
clickGUI.style.padding = '200px';
clickGUI.style.borderRadius = '10px';
clickGUI.style.width = '100%';
clickGUI.style.maxWidth = '400px';
clickGUI.style.zIndex = '9999';
clickGUI.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.3)';
clickGUI.style.transition = 'opacity 0.3s, transform 0.3s ease-in-out';
clickGUI.style.opacity = '0';
clickGUI.style.transform = 'translate(-50%, -50%) scale(0.5)';

document.body.appendChild(clickGUI);

function isOnMainMenu() {
    const element = document.querySelector('.Title.FullyFancyText');
    if (element && (element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0)) {
        return true;
    } else {
        return false;
    }
}
var isVisible = isOnMainMenu();

let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

function dragElement(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX || e.touches[0].clientX;
    pos4 = e.clientY || e.touches[0].clientY;
    document.onmouseup = closeDragElement;
    document.ontouchend = closeDragElement;
    document.onmousemove = elementDrag;
    document.ontouchmove = elementDrag;
}

function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - (e.clientX || e.touches[0].clientX);
    pos2 = pos4 - (e.clientY || e.touches[0].clientY);
    pos3 = e.clientX || e.touches[0].clientX;
    pos4 = e.clientY || e.touches[0].clientY;
    clickGUI.style.top = (clickGUI.offsetTop - pos2) + "px";
    clickGUI.style.left = (clickGUI.offsetLeft - pos1) + "px";
}

function closeDragElement() {
    document.onmouseup = null;
    document.ontouchend = null;
    document.onmousemove = null;
    document.ontouchmove = null;
}

clickGUI.onmousedown = dragElement;
clickGUI.ontouchstart = dragElement;

document.addEventListener('keydown', function(e) {
    // var mainFuckingMenu = isOnMainMenu('.Title.FullyFancyText');
    // if (mainFuckingMenu) {
    //  console.error('Naw bro, u cant run dis command on da main menu');
    // } else {
        if (e.key === 'm') {
            if (clickGUI.style.opacity === '0') {
                clickGUI.style.opacity = '1';
                clickGUI.style.transform = 'translate(-50%, -50%) scale(1)';
                toggleBlurEffect(true);
                document.body.style.overflow = 'hidden';
            } else {
                clickGUI.style.opacity = '0';
                clickGUI.style.transform = 'translate(-50%, -50%) scale(0)';
                toggleBlurEffect(false);
            }
            //   }
    }
});


function toggleBlurEffect(enableBlur) {
    var backgroundElements = document.querySelectorAll('body > *:not(.idk)');
    backgroundElements.forEach(function(element) {
        if (!clickGUI.contains(element)) {
            if (enableBlur) {
                element.style.transition = 'filter 0.3s ease-in-out'; // blur animation cuz why not lol
                element.style.filter = 'blur(5px)';
            } else {
                element.style.transition = 'filter 0.3s ease-in-out';
                element.style.filter = 'none';
            }
        }
    });
}

})();