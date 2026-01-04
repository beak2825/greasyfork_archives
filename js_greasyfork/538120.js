// ==UserScript==
// @name         Slither.io Background Changer
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Main Menu Background Color Changer - slither.io
// @author       Jadob Lane
// @match        http://slither.com/io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538120/Slitherio%20Background%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/538120/Slitherio%20Background%20Changer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create the background changer UI
    function createBackgroundChanger() {
        const colors = {
            Default: '#1a1a1a',
            Light: '#f0f0f0',
            Blue: '#001f3f',
            Green: '#2ecc40',
            Purple: '#7f00ff',
            Pink: '#ff69b4',
            Cyan: '#00ffff',
            Red: '#ff4136',
            Orange: '#ff851b',
            Yellow: '#ffdc00',
            Lime: '#01ff70',
            Teal: '#39cccc',
            Indigo: '#4b0082',
            Brown: '#8b4513',
            Gray: '#aaaaaa'
        };

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '9999';
        container.style.background = 'rgba(0, 0, 0, 0.6)';
        container.style.padding = '8px';
        container.style.borderRadius = '5px';
        container.style.color = '#fff';
        container.style.fontFamily = 'Arial, sans-serif';
        container.style.fontSize = '14px';

        const label = document.createElement('label');
        label.textContent = 'Background: ';
        label.style.marginRight = '5px';

        const select = document.createElement('select');
        for (let name in colors) {
            const option = document.createElement('option');
            option.value = colors[name];
            option.textContent = name;
            select.appendChild(option);
        }

        select.addEventListener('change', function() {
            document.body.style.backgroundColor = select.value;
        });

        container.appendChild(label);
        container.appendChild(select);
        document.body.appendChild(container);

        // Prevent the dropdown from opening when space is pressed
        select.addEventListener('keydown', function(event) {
            if (event.key === ' ' || event.keyCode === 32) {
                event.preventDefault(); // Prevent spacebar from opening the dropdown
            }
        });
    }

    // Wait for the page to load and then create the background changer
    window.addEventListener('load', createBackgroundChanger);
})();