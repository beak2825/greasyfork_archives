// ==UserScript==
// @name         Torn - Racing Blocker
// @namespace    duck.wowow
// @version      0.1.1
// @description  Adds a button that will prevent pressing buttons on the racing page if you need to fly after a race
// @author       Baccy
// @match        https://www.torn.com/page.php?sid=racing*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540691/Torn%20-%20Racing%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/540691/Torn%20-%20Racing%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enabled = JSON.parse(localStorage.getItem('a_racing_blocker')) ?? false;
    const header = document.querySelector('.title___rhtB4');

    const racing = document.querySelector('#racingMainContainer');
    const button = document.createElement('button');
    button.style.cssText = 'margin-left: 10px; padding: 5px 10px; border-radius: 5px; background-color: #555;  cursor: pointer;';
    button.textContent = enabled ? 'Remove' : 'Block';
    button.style.color = enabled ? 'red' : 'lightgreen';

    button.addEventListener('click', (e) => {
        e.stopPropagation();
        enabled = !enabled;
        button.textContent = enabled ? 'Remove' : 'Block';
        button.style.color = enabled ? 'red' : 'lightgreen';
        localStorage.setItem('a_racing_blocker', enabled);
        if (!enabled && racing) {
            racing.style.pointerEvents = '';
            racing.style.opacity = '1.0';
        } else if (enabled && racing) {
            racing.style.pointerEvents = 'none';
            racing.style.opacity = '0.5';
        }
    });
    button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "#444";
    });
    button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "#555";
    });

    if (header) header.appendChild(button);

    if (enabled) {
        if (header) header.appendChild(button);
        if (racing) {
            racing.style.pointerEvents = 'none';
            racing.style.opacity = '0.5';
        }
    }

})();