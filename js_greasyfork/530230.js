// ==UserScript==
// @name         Torn - Mission Gym Blocker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a button to the mission page that when clicked will block training at the gym until the 'Remove' button is clicked
// @author       Odung
// @match        https://www.torn.com/gym.php
// @match        https://www.torn.com/loader.php?sid=missions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530230/Torn%20-%20Mission%20Gym%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/530230/Torn%20-%20Mission%20Gym%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = JSON.parse(localStorage.getItem('mission_gym_blocker')) ?? false;
    const header = document.querySelector('div.content-title > h4#skip-to-content');
    const url = window.location.href.toLowerCase();

    if (url.includes('gym')) {
        const gym = document.querySelector('#gymroot');
        const button = document.createElement('button');
        button.textContent = 'Remove';
        button.style.cssText = 'margin-left: 10px; color: red; padding: 5px 10px; border-radius: 5px; background-color: #555;  cursor: pointer;';
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            enabled = !enabled;
            localStorage.setItem('mission_gym_blocker', enabled);
            if (!enabled && gym) {
                gym.style.pointerEvents = '';
                gym.style.opacity = '1.0';
                button.remove();
            }
        });
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "#444";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "#555";
        });

        if (enabled) {
            if (header) header.appendChild(button);
            if (gym) {
                gym.style.pointerEvents = 'none';
                gym.style.opacity = '0.5';
            }
        }
    } else {
        const button = document.createElement('button');
        button.textContent = 'Gym';
        button.style.cssText = 'margin-left: 10px; padding: 5px 10px; border-radius: 5px; background-color: #555;  cursor: pointer;';
        button.style.color = enabled ? 'lightgreen' : 'white';
        button.addEventListener('click', () => {
            enabled = !enabled;
            localStorage.setItem('mission_gym_blocker', enabled);
            button.style.color = enabled ? 'lightgreen' : 'white';
        });
        button.addEventListener("mouseenter", () => {
            button.style.backgroundColor = "#444";
        });
        button.addEventListener("mouseleave", () => {
            button.style.backgroundColor = "#555";
        });

        if (header) header.appendChild(button);
    }
})();