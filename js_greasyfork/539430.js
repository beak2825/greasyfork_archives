// ==UserScript==
// @name         Human Vision Mask Overlay
// @description  Adds an adjustable overlay that mimics the field of vision of the human eye
// @match        *://*/*
// @version 0.0.1.20250614212221
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539430/Human%20Vision%20Mask%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/539430/Human%20Vision%20Mask%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create the vision mask
    const visionMask = document.createElement('div');
    visionMask.id = 'vision-mask-overlay';
    Object.assign(visionMask.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: '999999',
        background: 'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 85%, rgba(0,0,0,1) 100%)',
        transition: 'background 0.2s ease-out'
    });
    document.body.appendChild(visionMask);

    // Create control panel
    const controlPanel = document.createElement('div');
    Object.assign(controlPanel.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'white',
        color: 'black',
        padding: '10px',
        fontSize: '14px',
        border: '1px solid black',
        borderRadius: '6px',
        zIndex: '1000000',
        fontFamily: 'monospace',
        userSelect: 'none'
    });

    controlPanel.innerHTML = `
        <label>Inner Radius (%): <input id="inner-radius" type="range" min="10" max="90" value="40"></label><br>
        <label>Mid Radius (%): <input id="mid-radius" type="range" min="10" max="95" value="60"></label><br>
        <label>Outer Radius (%): <input id="outer-radius" type="range" min="10" max="100" value="85"></label>
    `;
    document.body.appendChild(controlPanel);

    // Get references to inputs
    const innerInput = controlPanel.querySelector('#inner-radius');
    const midInput = controlPanel.querySelector('#mid-radius');
    const outerInput = controlPanel.querySelector('#outer-radius');

    function updateGradient() {
        const inner = innerInput.value;
        const mid = midInput.value;
        const outer = outerInput.value;

        visionMask.style.background = `radial-gradient(ellipse at center, rgba(0,0,0,0) ${inner}%, rgba(0,0,0,0.4) ${mid}%, rgba(0,0,0,0.8) ${outer}%, rgba(0,0,0,1) 100%)`;
    }

    innerInput.addEventListener('input', updateGradient);
    midInput.addEventListener('input', updateGradient);
    outerInput.addEventListener('input', updateGradient);
})();
