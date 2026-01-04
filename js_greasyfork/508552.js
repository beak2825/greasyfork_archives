// ==UserScript==
// @name         YouTube Night Mode & Ad Remover
// @namespace    https://greasyfork.org/users/123456
// @version      1.0
// @description  Adds night mode button to YouTube and removes ads.
// @author       Saimen Nemias
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/s/desktop/8bb15d8c/img/favicon_32x32.png
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/508552/YouTube%20Night%20Mode%20%20Ad%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/508552/YouTube%20Night%20Mode%20%20Ad%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add night mode button
    const nightModeButton = document.createElement('button');
    nightModeButton.innerText = 'Night Mode';
    nightModeButton.style.position = 'fixed';
    nightModeButton.style.bottom = '10px';
    nightModeButton.style.right = '10px';
    nightModeButton.style.padding = '10px';
    nightModeButton.style.backgroundColor = '#000';
    nightModeButton.style.color = '#fff';
    nightModeButton.style.border = 'none';
    nightModeButton.style.borderRadius = '5px';
    document.body.appendChild(nightModeButton);

    nightModeButton.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        document.body.classList.contains('night-mode') ? 
            document.body.style.backgroundColor = '#181818' :
            document.body.style.backgroundColor = '#fff';
    });

    // Remove ads
    const observer = new MutationObserver(() => {
        const ads = document.querySelectorAll('.ad-container');
        ads.forEach(ad => ad.remove());
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Donation message
    console.log('Se você gostou deste script e deseja apoiar o desenvolvimento, considere fazer uma doação em [Buy Me a Coffee](https://buymeacoffee.com/saimen). Agradeço pelo apoio!');
})();
