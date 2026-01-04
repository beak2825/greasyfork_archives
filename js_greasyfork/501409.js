// ==UserScript==
// @name         Lichess Random Pixel Art Widget
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Shows a random pixel art image on the Lichess homepage
// @author       Your Name
// @match        https://lichess.org/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501409/Lichess%20Random%20Pixel%20Art%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/501409/Lichess%20Random%20Pixel%20Art%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pixelArtUrls = [
        'https://i.imgur.com/dSMUZxH.jpeg',
        'https://i.imgur.com/XlLQDtK.jpeg',
        'https://i.imgur.com/NwN2amv.jpeg',
        'https://i.imgur.com/vCJcXgz.jpeg',
        'https://i.imgur.com/Uh6kjlY.jpeg',
        'https://i.imgur.com/SHWbApB.jpeg',
        'https://i.imgur.com/Rj7xW1T.png',
        'https://i.imgur.com/UHGciiZ.jpeg',
        'https://i.imgur.com/gkKAEhk.jpeg',
        'https://i.imgur.com/P2Hp3dG.jpeg',
        'https://i.imgur.com/LMGpf1n.png',
        'https://i.imgur.com/UbrlF6a.png',
        'https://i.imgur.com/LESplr5.jpeg',
        'https://i.imgur.com/fD8dClw.png',
        'https://i.imgur.com/67ZRgDb.jpeg',
        'https://i.imgur.com/C5BOVpn.png',
        'https://i.imgur.com/Cm2j4fG.jpeg',
        'https://i.imgur.com/3UYYWpW.png',
        'https://i.imgur.com/wbx1fXO.jpeg',
        'https://i.imgur.com/2XnytbA.png',
        'https://i.imgur.com/B9uoL7p.jpeg',
        'https://i.imgur.com/1oQeVvG.png',
        'https://i.imgur.com/Z3Jv51Z.jpeg',
        'https://i.imgur.com/CnuA0XI.jpeg',
        'https://i.imgur.com/s8dwHfV.jpeg',
        'https://i.imgur.com/7A4WxGG.png',
        'https://i.imgur.com/g1NVfsx.jpeg',
        'https://i.imgur.com/aAb7Xk8.png',
        'https://i.imgur.com/XD0kILS.jpeg',
        'https://i.imgur.com/kQarEbB.png',
        'https://i.imgur.com/6a5jIFN.png',
        'https://i.imgur.com/SWhUzIt.jpeg',
        'https://i.imgur.com/7YqZyZV.png',
        'https://i.imgur.com/6UCHIq4.png',
        'https://i.imgur.com/HML9WxK.png',
        'https://i.imgur.com/zYLQUtV.jpeg',
        'https://i.imgur.com/kbYHac3.jpeg',
        'https://i.imgur.com/2Irg0aP.jpeg',
        'https://i.imgur.com/9BEugoB.jpeg',
        'https://i.imgur.com/8B2Tlqi.jpeg',
        'https://i.imgur.com/gT6XFC4.jpeg',
        'https://i.imgur.com/TR9DMu2.jpeg',
        'https://i.imgur.com/dNoEVRw.jpeg',
        'https://i.imgur.com/DCkO0OY.jpeg',
        'https://i.imgur.com/k51fbGI.jpeg',
        'https://i.imgur.com/AeILdF9.jpeg',
        'https://i.imgur.com/j42SoC1.jpeg',
        'https://i.imgur.com/Edpk8mS.jpeg',
        'https://i.imgur.com/YPa6YV6.jpeg',
        'https://i.imgur.com/TfEqpeg.jpeg',
        'https://i.imgur.com/eULi6OF.jpeg',
        'https://i.imgur.com/iDHRCl2.jpeg',
        'https://i.imgur.com/VIj3em4.png',
        // New links added
        'https://i.imgur.com/nAxkSLJ.png',
        'https://i.imgur.com/m78LKs1.jpeg',
        'https://i.imgur.com/ksqTiXI.jpeg',
        'https://i.imgur.com/mDWj33g.png',
        'https://i.imgur.com/GmKTtes.jpeg',
        'https://i.imgur.com/3HH8s0r.jpeg',
        'https://i.imgur.com/dbYq3IV.jpeg',
        'https://i.imgur.com/cnn3Dmb.jpeg',
        'https://i.imgur.com/z8cvnZl.jpeg',
        'https://i.imgur.com/lQJa9UZ.jpeg',
        'https://i.imgur.com/3Kl9AIv.jpeg',
        'https://i.imgur.com/emXbhFR.jpeg',
        'https://i.imgur.com/xLw9zOK.png'
    ];

    const randomImageUrl = pixelArtUrls[Math.floor(Math.random() * pixelArtUrls.length)];

    const widgetDiv = document.createElement('div');
    widgetDiv.style.position = 'fixed';
    widgetDiv.style.top = '100px';
    widgetDiv.style.right = '20px';
    widgetDiv.style.zIndex = '10'; // Lower z-index for the widget

    const imgElement = document.createElement('img');
    imgElement.src = randomImageUrl;
    imgElement.style.maxWidth = '200px';
    imgElement.style.border = '2px solid black';
    imgElement.style.borderRadius = '5px';

    widgetDiv.appendChild(imgElement);
    document.body.appendChild(widgetDiv);

    // Ensure dropdown menus have a higher z-index
    const style = document.createElement('style');
    style.innerHTML = `
        .site-buttons .dropdown,
        .site-buttons .dropdown-menu {
            z-index: 1000 !important; // Ensure the dropdown has a higher z-index
        }
    `;
    document.head.appendChild(style);

    // Ensure dropdown is created with correct z-index
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.classList && node.classList.contains('dropdown-menu')) {
                        node.style.zIndex = '1000';
                    }
                });
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();