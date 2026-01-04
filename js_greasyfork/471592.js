// ==UserScript==
// @name         Scroll in E-ink browsing
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Inspired by Einkbro, imitate to optimize the page turning experience in a browser with js.
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471592/Scroll%20in%20E-ink%20browsing.user.js
// @updateURL https://update.greasyfork.org/scripts/471592/Scroll%20in%20E-ink%20browsing.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default values
    let squareSize = GM_getValue('squareSize', 120);
    let scrollAmount = GM_getValue('scrollAmount', 800);
    let position = GM_getValue('position', 4);

    GM_registerMenuCommand('Set Scroll Settings', () => {
    const newSquareSize = prompt('Enter control size (px):', squareSize);
    if (newSquareSize !== null) {
        squareSize = parseInt(newSquareSize);
        GM_setValue('squareSize', squareSize);
    }

    const newScrollAmount = prompt('Enter scroll amount (px):', scrollAmount);
    if (newScrollAmount !== null) {
        scrollAmount = parseInt(newScrollAmount);
        GM_setValue('scrollAmount', scrollAmount);
    }

    const newPosition = prompt('Enter control position (1-4) for TopLeft,TopRight,BottomLeft,BottomRight:', position);
    if (newPosition !== null) {
        position = parseInt(newPosition);
        GM_setValue('position', position);
    }
});


    // Create control elements
    const upControl = document.createElement('div');
    const downControl = document.createElement('div');

    // Style control elements
    upControl.style.width = `${squareSize}px`;
    upControl.style.height = `${squareSize}px`;
    upControl.style.borderTop = '2px dashed black';
    upControl.style.borderLeft = '2px dashed black';
    upControl.style.borderRight = '2px dashed black';

    upControl.style.opacity = '0.5';
    upControl.style.position = 'fixed';
    upControl.style.zIndex = '9999';
    upControl.style.cursor = 'pointer';

    downControl.style.width = `${squareSize}px`;
    downControl.style.height = `${squareSize}px`;
    downControl.style.border = '2px dashed black';
    downControl.style.opacity = '0.5';
    downControl.style.position = 'fixed';
    downControl.style.zIndex = '9999';
    downControl.style.cursor = 'pointer';

    // Set position of control elements
    switch (position) {
        case 1:
            upControl.style.top = '10px';
            upControl.style.left = '10px';
            downControl.style.top = `${squareSize + 10}px`;
            downControl.style.left = '10px';
            break;
        case 2:
            upControl.style.bottom = `${squareSize + 10}px`;
            upControl.style.left = '10px';
            downControl.style.bottom = '10px';
            downControl.style.left = '10px';
            break;
        case 3:
            upControl.style.top = '10px';
            upControl.style.right = '10px';
            downControl.style.top = `${squareSize + 10}px`;
            downControl.style.right = '10px';
            break;
        case 4:
            upControl.style.bottom = `${squareSize + 10}px`;
            upControl.style.right = '10px';
            downControl.style.bottom = '10px';
            downControl.style.right = '10px';
            break;
        default:
            break;
    }

    // Add click event listeners
    upControl.addEventListener('click', () => {
        window.scrollBy(0, -scrollAmount);
    });

    downControl.addEventListener('click', () => {
        window.scrollBy(0, scrollAmount);
    });

    // Add long press event listeners
    let pressTimer;

    upControl.addEventListener('mousedown', () => {
        pressTimer = window.setTimeout(() => {
            window.scrollTo(0, 0);
        }, 1500);
        return false;
    });

    upControl.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        return false;
    });

    downControl.addEventListener('mousedown', () => {
        pressTimer = window.setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
        }, 1500);
        return false;
    });

    downControl.addEventListener('mouseup', () => {
        clearTimeout(pressTimer);
        return false;
    });

    // Append control elements to body
    document.body.appendChild(upControl);
    document.body.appendChild(downControl);

})();