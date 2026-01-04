// ==UserScript==
// @name         [KPX] Replace Images with Text
// @namespace    https://www.sulane.net/
// @version      0.1
// @description  Replaces images with text on a specific webpage
// @author       KPCX
// @match        https://www.sulane.net/avaleht.php?asukoht=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sulane.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500733/%5BKPX%5D%20Replace%20Images%20with%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/500733/%5BKPX%5D%20Replace%20Images%20with%20Text.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imageToTextMap = {
        'tina.png': 'Tina',
        'Kivi.png': 'Kivi',
        'raud.png': 'Raud',
        'hobe.png': 'Hõbe',
        'liiv.png': 'Liiv',
        'kuld.png': 'Kuld',
        'savi.png': 'Savi',
        'muld.png': 'Muld',
        'sysi.png': 'Süsi',
        'vask.png': 'Vask',
        'rubiin.png': 'Ruby',
        'teemant.png': 'Diam',
        // Add more mappings as needed
    };

    // Your waitForElements function
    function waitForElements(selector, duration, maxTries, identifier) {
        return new Promise((resolve, reject) => {
            let tries = 0;
            const interval = setInterval(() => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    clearInterval(interval);
                    resolve(elements);
                } else if (tries >= maxTries) {
                    clearInterval(interval);
                    reject(new Error(`Elements ${identifier} not found`));
                }
                tries++;
            }, duration);
        });
    }

    // Wait for the buttons to appear
    waitForElements('.maavaranupp', 200, 50, 'buttons')
        .then(buttons => {
        buttons.forEach(button => {
            const img = button.querySelector('img');
            if (img) {
                const imageName = img.src.split('/').pop(); // Get the image filename
                const text = imageToTextMap[imageName];
                if (text) {
                    img.remove(); // Remove the image
                    button.textContent = text; // Set button text
                }
            }
        });
    })
        .catch(error => {
        console.error(error.message);
    });
})();

