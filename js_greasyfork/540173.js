// ==UserScript==
// @name         My First Userscript
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Highlights all input fields, adds a floating button that toggles dark mode, and logs key presses.
// @author       PianoMan0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540173/My%20First%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/540173/My%20First%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function highlightInputs() {
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.style.border = '2px solid #4CAF50';
            input.style.backgroundColor = '#e8f5e9';
        });
    }
    highlightInputs();

    const button = document.createElement('button');
    button.textContent = 'Toggle Dark Mode';
    button.style.position = 'fixed';
    button.style.bottom = '24px';
    button.style.right = '24px';
    button.style.zIndex = '10000';
    button.style.padding = '12px 20px';
    button.style.background = '#222';
    button.style.color = '#fff';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
    button.style.cursor = 'pointer';
    button.style.opacity = '0.85';

    document.body.appendChild(button);

    let dark = false;
    button.addEventListener('click', () => {
        dark = !dark;
        if (dark) {
            document.body.style.background = '#222';
            document.body.style.color = '#eee';
            button.style.background = '#fff';
            button.style.color = '#222';
        } else {
            document.body.style.background = '';
            document.body.style.color = '';
            button.style.background = '#222';
            button.style.color = '#fff';
        }
    });

    document.addEventListener('keydown', function(e) {
        console.log(`Key pressed: ${e.key}`);
    });

    setTimeout(() => {
        const msg = document.createElement('div');
        msg.textContent = 'Userscript loaded! Inputs highlighted. Try toggling dark mode.';
        msg.style.position = 'fixed';
        msg.style.top = '10px';
        msg.style.left = '50%';
        msg.style.transform = 'translateX(-50%)';
        msg.style.background = '#4CAF50';
        msg.style.color = '#fff';
        msg.style.padding = '8px 24px';
        msg.style.borderRadius = '6px';
        msg.style.zIndex = '10001';
        msg.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
    }, 500);
})();