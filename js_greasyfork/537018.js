// ==UserScript==
// @name         World of States NAP Protection
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Disables "Declare War" on protected alliances in World of States
// @match        https://www.world-of-states.net/*
// @author       chickenPoo
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537018/World%20of%20States%20NAP%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/537018/World%20of%20States%20NAP%20Protection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const protectedAllianceImages = [
        'Untitled_design_2.jpg',
        'GB2.JPG',
        'UNSO.png',
        'tieditagainagain.png',
        'Copy_of_La_Stella_20250428_044630_0000.png'
    ];

    let currentUrl = location.href;
    let buttonHandled = false;

    const markButton = (button, text, color, disable = true) => {
        button.textContent = text;
        button.style.color = color;
        button.style.fontWeight = 'bold';
        button.classList.add('modified-by-extension');
        button.style.pointerEvents = disable ? 'none' : '';
        button.style.opacity = disable ? '0.6' : '';
    };

    const getAllianceImage = () => {
        const img = document.querySelector('img[src*="media/alliance"]');
        return img ? img.getAttribute('src') : null;
    };

    const checkAllianceMatch = (src) => {
        return protectedAllianceImages.some(filename => src && src.includes(filename));
    };

    const modifyButton = () => {
        if (
            !/^\/\d+\/(politics\/\d+|construction\/country\/\d+|military\/country\/\d+\/\d+\/headquarter|economy\/\d+\/overview|war\/war\/\d+)\/?$/.test(location.pathname)
        ) return;

        if (buttonHandled) return;

        const button = [...document.querySelectorAll('a')].find(link =>
            link.textContent.trim().toLowerCase() === 'declare war'
        );

        if (!button) return;

        buttonHandled = true;
        markButton(button, 'Checking...', 'gray', true);

        setTimeout(() => {
            const allianceSrc = getAllianceImage();

            if (!allianceSrc) {
                markButton(button, 'Declare War', '', false);
                button.classList.remove('modified-by-extension');
                return;
            }

            if (checkAllianceMatch(allianceSrc)) {
                markButton(button, "Don't Do It (NAP Member)", 'red', true);
            } else {
                markButton(button, 'Declare War', '', false);
                button.classList.remove('modified-by-extension');
            }
        }, 1500);
    };

    const observeChanges = () => {
        const observer = new MutationObserver(modifyButton);
        const waitForBody = () => {
            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
                modifyButton();
            } else {
                requestAnimationFrame(waitForBody);
            }
        };
        waitForBody();
    };

    const watchUrlChanges = () => {
        const loop = () => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                buttonHandled = false;
                setTimeout(modifyButton, 100);
            }
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    };

    observeChanges();
    watchUrlChanges();
    modifyButton();
})();
