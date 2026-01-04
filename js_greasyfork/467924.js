// ==UserScript==
// @name         Brickplanet Custom Color
// @version      1.0
// @description  Custom Color on BrickPlanet avatar
// @author       Radiohead
// @match        https://www.brickplanet.com/account/avatar/edit
// @grant        none
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/467924/Brickplanet%20Custom%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/467924/Brickplanet%20Custom%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeBodyColor(hexCode) {
        const validHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!validHex.test(hexCode)) {
            console.error('Invalid hex code');
            return;
        }
        document.body.style.backgroundColor = hexCode;
    }

    function handleCustomHexColor() {
        const input = document.getElementById('customHexInput');
        const hexCode = input.value.trim();
        if (hexCode) {
            const script = `changeBodyColor('${hexCode}')`;
            console.log(script);
            const scriptElement = document.createElement('script');
            scriptElement.textContent = script;
            document.body.appendChild(scriptElement);
            document.body.removeChild(scriptElement);
        }
    }

    const customColorLink = document.querySelector('a[data-bs-toggle="modal"][data-bs-target="#custom-color"]');
    if (customColorLink) {
        const customHexColorInput = document.createElement('input');
        customHexColorInput.type = 'text';
        customHexColorInput.id = 'customHexInput';
        customHexColorInput.placeholder = 'Enter hex code';

        const applyButton = document.createElement('button');
        applyButton.type = 'button';
        applyButton.innerText = 'Apply';
        applyButton.addEventListener('click', handleCustomHexColor);

        customColorLink.parentNode.appendChild(customHexColorInput);
        customColorLink.parentNode.appendChild(applyButton);
    }
})();
