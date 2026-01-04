// ==UserScript==
// @name           Clock figuccio 12-24
// @description    clock ore ampm 24h al passaggio mouse
// @version        0.5
// @match          *://*/*
// @noframes
// @author         figuccio
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_registerMenuCommand
// @license        MIT
// @icon           data:image/gif;base64,R0lGODlhEAAQAKECABEREe7u7v///////yH5BAEKAAIALAAAAAAQABAAAAIplI+py30Bo5wB2IvzrXDvaoFcCIBeeXaeSY4tibqxSWt2RuWRw/e+UQAAOw==
// @namespace https://greasyfork.org/users/237458
// @downloadURL https://update.greasyfork.org/scripts/454041/Clock%20figuccio%2012-24.user.js
// @updateURL https://update.greasyfork.org/scripts/454041/Clock%20figuccio%2012-24.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let use12HourFormat = GM_getValue('use12HourFormat', false); // Recupera il formato salvato
    function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const milliseconds = String(now.getMilliseconds()).padStart(3, "0");

    let period = "";

    if (!use12HourFormat) {
        period = hours >= 12 ? " PM" : " AM";
        hours = hours % 12 || 12; // Converte in formato 12 ore
    }

    hours = String(hours).padStart(2, "0");
   return `${hours}:${minutes}:${seconds}:${milliseconds}${period}`;
    }

function toggleFormat() {
    //Cambia il formato orario
    use12HourFormat = !use12HourFormat;
    GM_setValue('use12HourFormat', use12HourFormat); // Salva lo stato del formato
}
GM_registerMenuCommand("Cambia 12/24", toggleFormat);

function makeDraggable(element) {
    let offsetX = 0, offsetY = 0, mouseDown = false;

    element.addEventListener('mousedown', (e) => {
        mouseDown = true;
        offsetX = e.clientX - element.offsetLeft;
        offsetY = e.clientY - element.offsetTop;
    });

    document.addEventListener('mouseup', () => { mouseDown = false; });

    document.addEventListener('mousemove', (e) => {
        if (mouseDown) {
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            // Limit movement within window
            x = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, y));

            element.style.left = `${x}px`;
            element.style.top = `${y}px`;

            // Save position to localStorage
             GM_setValue('clockPosition', JSON.stringify({ x, y }));
        }
    });
}

function createClock() {
    const clock = document.createElement('div');
    clock.id = 'clock';
    clock.style.position = 'fixed';
    clock.style.top = '0px';
    clock.style.left = '0px';
    clock.style.padding = '5px';
    clock.style.background = 'black';
    clock.style.color = 'lime';
    clock.style.border = '2px solid gold';
    clock.style.borderRadius = '5px';
    clock.style.fontFamily = 'Arial, sans-serif';
    clock.style.fontSize = '14px';
    clock.style.width='109px';
    clock.style.textAlign = 'center';
    clock.style.zIndex = '999999';
    document.body.appendChild(clock);
    makeDraggable(clock);

    // Load position from localStorage
    const savedPosition = JSON.parse(GM_getValue('clockPosition', JSON.stringify({ x: 0, y: 0 })));
    if (savedPosition) {
        clock.style.left = `${savedPosition.x}px`;
        clock.style.top = `${savedPosition.y}px`;
    }

  clock.addEventListener('mouseenter', () => {
            toggleFormat();
            clock.textContent = getCurrentTime();
        });

        setInterval(() => {
            clock.textContent = getCurrentTime();
        }, 70);
    }

    createClock();
})();
