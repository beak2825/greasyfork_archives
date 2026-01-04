// ==UserScript==
// @name         Agma.io Scroll Buttons
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  lets you scroll zoom on agma with ease if you're on a laptop without a mouse.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agma.io
// @author       Day
// @license      GPL-3.0-or-later
// @match        https://agma.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466709/Agmaio%20Scroll%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/466709/Agmaio%20Scroll%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const scrollUpButton = document.createElement('button');
    scrollUpButton.id = 'scrollUpButton';
    scrollUpButton.innerText = '▲';
    scrollUpButton.style.position = 'fixed';
    scrollUpButton.style.top = '10px';
    scrollUpButton.style.left = '400px';
    scrollUpButton.style.width = '30px';
    scrollUpButton.style.height = '30px';
    scrollUpButton.style.borderRadius = '50%';
    scrollUpButton.style.backgroundColor = '#ffffff';
    scrollUpButton.style.color = '#000000';
    scrollUpButton.style.fontSize = '16px';
    scrollUpButton.style.fontWeight = 'bold';
    scrollUpButton.style.border = 'none';
    scrollUpButton.style.outline = 'none';
    document.body.appendChild(scrollUpButton);

    const scrollDownButton = document.createElement('button');
    scrollDownButton.id = 'scrollDownButton';
    scrollDownButton.innerText = '▼';
    scrollDownButton.style.position = 'fixed';
    scrollDownButton.style.top = '10px';
    scrollDownButton.style.left = '440px';
    scrollDownButton.style.width = '30px';
    scrollDownButton.style.height = '30px';
    scrollDownButton.style.borderRadius = '50%';
    scrollDownButton.style.backgroundColor = '#ffffff';
    scrollDownButton.style.color = '#000000';
    scrollDownButton.style.fontSize = '16px';
    scrollDownButton.style.fontWeight = 'bold';
    scrollDownButton.style.border = 'none';
    scrollDownButton.style.outline = 'none';
    document.body.appendChild(scrollDownButton);

    document.getElementById('scrollUpButton').addEventListener('click', function() {
        const container = document.getElementById('canvas');
        simulateScroll(container, -100);
    });

    document.getElementById('scrollDownButton').addEventListener('click', function() {
        const container = document.getElementById('canvas');
        simulateScroll(container, 100);
    });

    function simulateScroll(element, deltaY) {
        const event = new WheelEvent('wheel', {
            bubbles: true,
            deltaY: deltaY,
            view: window
        });
        element.dispatchEvent(event);
    }
})();
