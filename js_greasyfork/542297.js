// ==UserScript==
// @name         Poxel.io Custom Crosshair with Menu
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a customizable crosshair with menu to Poxel.io
// @author       You
// @match        *://poxel.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542297/Poxelio%20Custom%20Crosshair%20with%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/542297/Poxelio%20Custom%20Crosshair%20with%20Menu.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Crosshair styles
    const styles = {
        dot: {
            width: '8px',
            height: '8px',
            backgroundColor: 'red',
            border: 'none',
            borderRadius: '50%',
        },
        cross: {
            width: '2px',
            height: '30px',
            backgroundColor: 'lime',
            boxShadow: '0 0 0 0 transparent',
        },
        x: {
            width: '2px',
            height: '30px',
            backgroundColor: 'transparent',
            transform: 'translate(-50%, -50%) rotate(45deg)',
            boxShadow: '0 0 0 0 transparent',
            borderLeft: '2px solid lime',
            borderBottom: '2px solid lime'
        },
        circle: {
            width: '30px',
            height: '30px',
            backgroundColor: 'transparent',
            border: '2px solid yellow',
            borderRadius: '50%',
        },
        image: {
            width: '32px',
            height: '32px',
            backgroundImage: 'url(https://i.imgur.com/aym4kkT.png)', // Replace with your image
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        }
    };

    // Create the crosshair element
    const crosshair = document.createElement('div');
    crosshair.id = 'customCrosshair';
    document.body.appendChild(crosshair);

    Object.assign(crosshair.style, {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: '9999',
        pointerEvents: 'none'
    });

    // Apply a style by name
    function applyStyle(styleName) {
        crosshair.style = ''; // Reset
        Object.assign(crosshair.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: '9999',
            pointerEvents: 'none'
        });
        Object.assign(crosshair.style, styles[styleName]);
    }

    // Create the menu
    const menu = document.createElement('div');
    menu.id = 'crosshairMenu';
    menu.innerHTML = '<strong style="color:white;">Crosshair Menu</strong><br>';
    menu.style.position = 'fixed';
    menu.style.top = '10px';
    menu.style.left = '10px';
    menu.style.padding = '10px';
    menu.style.background = 'rgba(0,0,0,0.7)';
    menu.style.color = 'white';
    menu.style.fontFamily = 'sans-serif';
    menu.style.zIndex = '9999';
    menu.style.borderRadius = '8px';

    for (const name in styles) {
        const btn = document.createElement('button');
        btn.textContent = name;
        btn.style.margin = '3px';
        btn.onclick = () => applyStyle(name);
        menu.appendChild(btn);
    }

    // Add toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'Toggle';
    toggleBtn.style.marginTop = '5px';
    toggleBtn.onclick = () => {
        crosshair.style.display = (crosshair.style.display === 'none') ? 'block' : 'none';
    };
    menu.appendChild(document.createElement('br'));
    menu.appendChild(toggleBtn);

    document.body.appendChild(menu);

    // Default style
    applyStyle('dot');
})();