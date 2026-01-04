// ==UserScript==
// @name         Torn - Current Loadout
// @namespace    duck.wowow
// @version      0.1
// @description  Displays the name of your current loadout below money/level/points with a link to the item page
// @author       Baccy
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539491/Torn%20-%20Current%20Loadout.user.js
// @updateURL https://update.greasyfork.org/scripts/539491/Torn%20-%20Current%20Loadout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addLabel() {
        if (!document.querySelector('.current-loadout')) {
            const pointsElement = document.querySelector('.points___UO9AU');
            if (pointsElement) {
                const pointsBlock = document.createElement('p');
                const nameElement = document.createElement('span');
                const valueElement = document.createElement('a');
                pointsBlock.className = 'current-loadout point-block___rQyUK';
                nameElement.textContent = 'LO: ';
                nameElement.classList.add('name___ChDL3');
                valueElement.textContent = currentLoadout;
                valueElement.href = 'https://www.torn.com/item.php';
                valueElement.style.cssText = 'color: inherit; text-decoration: none;';
                valueElement.className = 'value___mHNGb current_loadout_name';
                pointsBlock.appendChild(nameElement);
                pointsBlock.appendChild(valueElement);
                pointsElement.appendChild(pointsBlock);
            }
        }
    }

    function itemPage() {
        const observer = new MutationObserver(mutations => {
            const loadoutElement = document.querySelector('.slot___sOy0e.current___IkEyu.slot____QvbY');
            if (loadoutElement) {
                const loadoutName = loadoutElement.getAttribute('aria-label').match(/"([^"]+)"/)[1];
                if (loadoutName !== currentLoadout) {
                    currentLoadout = loadoutName;
                    document.querySelector('.current_loadout_name').textContent = currentLoadout;
                    localStorage.setItem('a_currentLoadout', currentLoadout);
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    let currentLoadout = localStorage.getItem('a_currentLoadout') || 'None';
    if (window.location.href === 'https://www.torn.com/item.php') itemPage();

    if (document.querySelector('.points___UO9AU')) addLabel();
    else {
        const observer = new MutationObserver(mutations => {
            const elements = document.querySelector('.points___UO9AU');
            if (elements) {
                addLabel();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

})();