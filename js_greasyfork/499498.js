// ==UserScript==
// @name         FIBA Boxscore
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Tlačítko Boxscore
// @author       Michal
// @match        https://www.fiba.basketball/en/events/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499498/FIBA%20Boxscore.user.js
// @updateURL https://update.greasyfork.org/scripts/499498/FIBA%20Boxscore.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addButton() {
        let container = document.querySelector('.po9kne2') || document.querySelector('.qap2wa0');

        if (container) {
            let button = document.createElement('button');
            button.textContent = 'Boxscore';
            button.style.display = 'block';
            button.style.marginTop = '20px';
            button.style.padding = '10px 20px';
            button.style.fontSize = '16px';
            button.style.fontFamily = 'Arial, sans-serif';
            button.style.backgroundColor = '#007BFF';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            button.style.transition = 'background-color 0.3s ease';

            button.addEventListener('mouseover', function() {
                button.style.backgroundColor = '#0056b3';
            });
            button.addEventListener('mouseout', function() {
                button.style.backgroundColor = '#007BFF';
            });

            button.addEventListener('click', function() {
                window.location.hash = 'boxscore';
            });

            container.appendChild(button);
        }
    }

    setTimeout(addButton, 3000);
})();