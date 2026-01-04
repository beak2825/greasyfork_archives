// ==UserScript==
// @name         Cartel Empire - Quick Wheel
// @namespace    baccy.ce
// @version      0.1.2
// @description  Adds a button to the wheel page that skips the wheel animation and instantly shows text with your prize
// @author       Baccy
// @match        https://cartelempire.online/Casino/Spinner
// @icon         https://cartelempire.online/images/icon-white.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531358/Cartel%20Empire%20-%20Quick%20Wheel.user.js
// @updateURL https://update.greasyfork.org/scripts/531358/Cartel%20Empire%20-%20Quick%20Wheel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    
    const headers = document.querySelectorAll('.header-section');
    if (headers[1]) {
        headers[1].style.cssText = 'display: flex; justify-content: space-between;';
        const button = document.createElement('button');
        button.textContent = 'Spin Wheel';
        button.style.cssText = 'background: #1e1e1e; color: #fff; border: 1px solid #555; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 14px;';
        button.addEventListener('click', async () => {
            const response = await fetch('https://cartelempire.online/Casino/spinWheel', { method: 'POST' });
            const data = await response.json();
            const message = document.querySelector('#spinnerText');
            if (data && data.message && message) {
                message.textContent = data.message;
                const tokens = document.querySelector('#tokenCount');
                if (parseInt(tokens.textContent) > 0 && !data.error) {
                    if (data.prizeChosen && data.prizeChosen.name === 'Free Spin') return;
                    tokens.textContent = parseInt(tokens.textContent) - 1;
                }
            }
        });
        headers[1].appendChild(button);
    }
})();
