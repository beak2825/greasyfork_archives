// ==UserScript==
// @name         neverlose v1.0
// @namespace    http://tampermonkey.net/
// @version      2025-02-26
// @description  test
// @author       futurism
// @match        https://mine-craft.io
// @match        https://mine-craft.io/worlds
// @match        https://vanilla.mine-craft.io/
// @match        https://vanilla.mine-craft.io/worlds
// @icon         https://mine-craft.io/games/litecraft.io/images/textures/packs/default/items/netherite_sword.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528225/neverlose%20v10.user.js
// @updateURL https://update.greasyfork.org/scripts/528225/neverlose%20v10.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hidecontainer = () => {
        const elementToRemove = document.querySelector('div.col.left-col.flex-height-fit');
        if (elementToRemove) {
            elementToRemove.style.display = 'none';
        }
    }

    const hidebuttons = () => {
        const buttonsToHide = [
            'button.turn-fullscreen.button.small.only-icon',
            'button.open-how-to-play.button.small.only-icon',
            'button.camera-under-roof.button.small.only-icon',
            'button.back-to-spawn.button.small',
            'claim.reward.button.small.claimable'
        ];

        buttonsToHide.forEach(selector => {
            const button = document.querySelector(selector);
            if (button) {
                button.style.display = 'none';
            }
        });
    }

    const hideadditionaltexts = () => {
        const textElements = document.querySelectorAll('p.header-text, p');
        textElements.forEach(textElement => {
            if (textElement.textContent.includes("Онлайн") &&
                (textElement.textContent.includes("Регион EU") || textElement.textContent.includes("Регион RU"))) {
                textElement.style.display = 'none';
            }
            if (textElement.textContent.includes("Ванильный режим")) {
                textElement.style.display = 'none';
            }
        });
    }

    const hidefeedbackelement = () => {
        const feedbackelement = document.querySelector('#leave-game-feedback.show');
        if (feedbackelement) {
            feedbackelement.style.display = 'none';
        }
    }

    const hidefooter = () => {
        const footerElement = document.querySelector('.row.row2');
        if (footerElement) {
            footerElement.style.display = 'none';
        }
    }

    const styleSlots = () => {
        const slots = document.querySelectorAll('.slot');
        slots.forEach(slot => {
            slot.style.backgroundColor = 'rgba(198, 198, 198, 0)';
        });
    }

    const toggleClasses = () => {
        const topLeft = document.querySelector('.top-left');
        const topRight = document.querySelector('.top-right');

        if (topLeft) {
            topLeft.classList.toggle('top-left-hidden');
        }
        if (topRight) {
            topRight.classList.toggle('top-right-hidden');
        }
    }

    hidecontainer();
    hidebuttons();
    hideadditionaltexts();
    hidefeedbackelement();
    hidefooter();
    styleSlots();

    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                hidecontainer();
                hidebuttons();
                hideadditionaltexts();
                hidefeedbackelement();
                hidefooter();
                styleSlots();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    document.addEventListener('keydown', function(event) {
        if (event.key === 'F4') {
            toggleClasses();
        }
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .top-left-hidden {
            display: none !important;
        }
        .top-right-hidden {
            display: none !important;
        }
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 10px;
        }
    `;
    document.head.appendChild(style);

})();
