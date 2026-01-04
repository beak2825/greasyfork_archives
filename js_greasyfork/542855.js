// ==UserScript==
// @name         FarmRPG - Quick Bottle Rocket Brawl
// @namespace    duck.wowow
// @version      0.1
// @description  Adds buttons to quickly use rocket attacks.
// @author       Odung
// @match        https://*.farmrpg.com/index.php
// @match        https://*.farmrpg.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=farmrpg.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542855/FarmRPG%20-%20Quick%20Bottle%20Rocket%20Brawl.user.js
// @updateURL https://update.greasyfork.org/scripts/542855/FarmRPG%20-%20Quick%20Bottle%20Rocket%20Brawl.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const baseUrl = window.location.origin;
    const listeners = [];

    function observePage(element) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-page') {
                    removeListeners();
                    const page = mutation.target.getAttribute('data-page');
                    if (page === 'Bottle-Rocket-Brawl') rocketBrawl();
                }
            }
        });

        observer.observe(element, { attributes: true });
    }

    function removeListeners() {
        for (const { element, type, handler } of listeners) {
            element.removeEventListener(type, handler);
        }
        listeners.length = 0;
    }

    function rocketBrawl() {
        function createButton(type, elementId) {
            const button = document.createElement('button');
            button.textContent = 'Quick Attack';
            button.id = `odung-brawl${elementId}`;
            button.style.cssText = 'width:100%;height:40px;padding:4px 8px;background:#003300;color:#fff;border:1px solid #006600;cursor:pointer;align-self:center';

            const clickHandler = async e => {
                e.preventDefault();
                e.stopPropagation();

                try {
                    const response = await fetch(`${baseUrl}/worker.php?type=${type}&go=brb_attack`, { method: 'POST' });
                    const data = await response.json();
                    if (data.error) {
                        button.textContent = 'Error';
                        setTimeout(() => {
                            button.textContent = 'Quick Attack';
                        }, 1000);
                    } else {
                        if (attacksLeft) {
                            const match = attacksLeft.textContent.match(/Attacks left:\s*(\d+)/);
                            if (match) {
                                const current = parseInt(match[1], 10);
                                attacksLeft.textContent = `Attacks left: ${Math.max(0, current - 1)}`;
                            }
                        }
                    }
                } catch (error) {
                    console.error(error);
                    button.textContent = 'Error';
                    setTimeout(() => {
                        button.textContent = 'Quick Attack';
                    }, 1000);
                }
            };

            button.addEventListener('click', clickHandler);
            listeners.push({ element: button, type: 'click', handler: clickHandler });

            const existingButton = document.querySelector(`#${button.id}`);
            if (existingButton) existingButton.remove();

            return button;
        }

        const placement = document.querySelectorAll('.row.event-brb-row-no-bottom-margin')[2];
        if (!placement) return;

        const attacksLeft = Array.from(document.querySelectorAll('.card-content-inner')).find(el => el.firstChild?.nodeType === Node.TEXT_NODE && el.firstChild.textContent.trim().startsWith('Attacks left:'))?.firstChild;

        const smallAttack = createButton('small', 'smallRocketAttack');
        const mediumAttack = createButton('medium', 'mediumRocketAttack');
        const largeAttack = createButton('large', 'largeRocketAttack');

        placement.children[0].appendChild(smallAttack);
        placement.children[1].appendChild(mediumAttack);
        placement.children[2].appendChild(largeAttack);
    }

    const observer = new MutationObserver(mutations => {
        const element = document.querySelector('#fireworks');
        if (element) {
            observePage(element);
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();