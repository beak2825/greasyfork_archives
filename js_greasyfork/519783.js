// ==UserScript==
// @name         Mobile CAI Improved
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Better mobile CAI experience
// @author       LuxTallis
// @match        https://character.ai/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519783/Mobile%20CAI%20Improved.user.js
// @updateURL https://update.greasyfork.org/scripts/519783/Mobile%20CAI%20Improved.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // Create the panel
    const panel = document.createElement('div');
    panel.style.position = 'fixed';
    panel.style.bottom = '0';
    panel.style.left = '0';
    panel.style.width = '100%';
    panel.style.height = '30px';
    panel.style.backgroundColor = 'black';
    panel.style.padding = '2px 5px';
    panel.style.zIndex = '9999';
    panel.style.display = 'flex';
    panel.style.justifyContent = 'space-between';
    panel.style.alignItems = 'center';

    // Create zoom buttons
    const zoomInButton = document.createElement('button');
    zoomInButton.innerHTML = 'A+';
    zoomInButton.style.padding = '5px';
    zoomInButton.style.fontSize = '16px';
    zoomInButton.style.border = 'none';
    zoomInButton.style.borderRadius = '3px';
    zoomInButton.style.backgroundColor = '#000000';
    zoomInButton.style.color = 'white';
    zoomInButton.style.cursor = 'pointer';
    zoomInButton.style.marginLeft = '5px';

    const zoomOutButton = document.createElement('button');
    zoomOutButton.innerHTML = 'A-';
    zoomOutButton.style.padding = '5px';
    zoomOutButton.style.fontSize = '16px';
    zoomOutButton.style.border = 'none';
    zoomOutButton.style.borderRadius = '3px';
    zoomOutButton.style.backgroundColor = '#000000';
    zoomOutButton.style.color = 'white';
    zoomOutButton.style.cursor = 'pointer';
    zoomOutButton.style.marginLeft = '5px';

    // Create the full-screen toggle button
    const fullScreenButton = document.createElement('button');
    fullScreenButton.innerHTML = '⛶';
    fullScreenButton.id = 'fullScreenToggle';
    fullScreenButton.style.padding = '5px';
    fullScreenButton.style.fontSize = '16px';
    fullScreenButton.style.border = 'none';
    fullScreenButton.style.borderRadius = '3px';
    fullScreenButton.style.backgroundColor = '#000000';
    fullScreenButton.style.color = 'white';
    fullScreenButton.style.cursor = 'pointer';
    fullScreenButton.style.marginRight = '5px';

    // Append buttons to the panel
    const leftGroup = document.createElement('div');
    leftGroup.style.display = 'flex';
    leftGroup.appendChild(zoomInButton);
    leftGroup.appendChild(zoomOutButton);
    panel.appendChild(leftGroup);

    const rightGroup = document.createElement('div');
    rightGroup.appendChild(fullScreenButton);
    panel.appendChild(rightGroup);

    // Append the panel to the body
    document.body.appendChild(panel);

    // CSS adjustments
    GM_addStyle(`
        @import url('https://fonts.googleapis.com/css2?family=PT+Sans&display=swap');

        body {
            background-color: #000000 !important;
            color: #ffffff !important;
            font-family: 'PT Sans', sans-serif !important;
        }

        .mt-1.bg-surface-elevation-2,
        .mt-1.bg-surface-elevation-3,
        .prose,
        .grow,
        textarea.flex {
            background-color: #000000 !important;
            font-family: 'PT Sans', sans-serif !important;
        }

        .text-foreground {
            color: #000000 !important;
            font-family: 'PT Sans', sans-serif !important;
        }

        #chat-messages .max-w-xl.rounded-2xl.bg-surface-elevation-2,
        #chat-messages textarea[maxlength="4092"] {
            background-color: #000000 !important;
            border: none !important;
        }

        .dark #chat-header-background {
            background: #000000 !important;
        }

        button.px-unit-0:nth-child(2) {
            display: none !important;
        }

        /* Ensure the zoom and fullscreen buttons are unaffected by font size change */
        button {
            font-size: 16px !important;
            font-family: 'PT Sans', sans-serif !important;
        }
    `);

    // Load saved font size
    let fontSize = GM_getValue('fontSize', 16);

    const applyFontSize = () => {
        GM_addStyle(`
            * { font-size: ${fontSize}px !important; }
        `);
    };

    applyFontSize();

    // Full-screen toggle functionality
    fullScreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.error(`Error attempting to exit full-screen mode: ${err.message}`);
            });
        }
    });

    // Zoom in and out functionality
    zoomInButton.addEventListener('click', () => {
        fontSize += 1;
        GM_setValue('fontSize', fontSize);
        applyFontSize();
    });

    zoomOutButton.addEventListener('click', () => {
        fontSize -= 1;
        GM_setValue('fontSize', fontSize);
        applyFontSize();
    });
})();
