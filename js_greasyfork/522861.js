// ==UserScript==
// @name         Webtoon Scroller [Shift-Q]
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Auto scroll on webtoon with configurable speed (press Shift+Q for menu, Q to toggle scrolling)
// @author       GavinGoGaming
// @license      GPL-2.0
// @match        https://www.webtoons.com/en/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webtoons.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522861/Webtoon%20Scroller%20%5BShift-Q%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/522861/Webtoon%20Scroller%20%5BShift-Q%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let toggled = false;
    let scrollSpeed = window.localStorage.webtoonScrollSpeed || 10; // Default scroll speed in milliseconds
    let interval;

    const createConfigMenu = () => {
        const menu = document.createElement('div');
        menu.id = 'scroll-config-menu';
        menu.style.position = 'fixed';
        menu.style.top = '50%';
        menu.style.left = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.background = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.borderRadius = '8px';
        menu.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
        menu.style.padding = '16px';
        menu.style.display = 'none';
        menu.style.zIndex = '10000';

        menu.innerHTML = `
            <label for="scroll-speed">Scroll Speed (ms):</label>
            <input type="number" id="scroll-speed" value="${scrollSpeed}" max="100" style="width: 80px; margin-left: 8px;">
            <button id="save-scroll-config" style="margin-left: 8px;">Save</button>
            <button id="close-scroll-config" style="margin-left: 8px;">Close</button>
            <button id="toggle-scroll-config" style="margin-left: 8px;">Toggle</button>
        `;

        document.body.appendChild(menu);

        document.getElementById('save-scroll-config').onclick = () => {
            const speedInput = document.getElementById('scroll-speed');
            const newSpeed = parseInt(speedInput.value, 10);
            if (!isNaN(newSpeed) && newSpeed > 0) {
                scrollSpeed = newSpeed;
                alert(`Scroll speed set to ${scrollSpeed} ms.`);
                window.localStorage.webtoonScrollSpeed = newSpeed;
            } else {
                alert('Invalid scroll speed value. Please enter a positive number.');
            }
        };

        document.getElementById('close-scroll-config').onclick = () => {
            menu.style.display = 'none';
        };
        document.getElementById('toggle-scroll-config').onclick = () => {
            toggleScrolling();
        };
    };

    const toggleScrolling = () => {
        if (toggled) {
            clearInterval(interval);
            toggled = false;
        } else {
            interval = setInterval(() => {
                document.documentElement.scrollBy(0, 5);
            }, scrollSpeed);
            toggled = true;
        }
    };

    const toggleConfigMenu = () => {
        const menu = document.getElementById('scroll-config-menu');
        if (menu.style.display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    };

    document.addEventListener('keydown', (event) => {
        if (event.key === 'q' || event.key === "Q") {
            if(event.shiftKey) return toggleConfigMenu();
            toggleScrolling();
        }
    });

    createConfigMenu();
})();
