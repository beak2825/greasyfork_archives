// ==UserScript==
// @name         z place overlay CR
// @namespace    http://tampermonkey.net/
// @version      2024-09-10
// @license MIT
// @description  z place overlay clash royale
// @author       You
// @match        https://place.zevent.fr/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zevent.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507496/z%20place%20overlay%20CR.user.js
// @updateURL https://update.greasyfork.org/scripts/507496/z%20place%20overlay%20CR.meta.js
// ==/UserScript==

(function() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const image = document.createElement("img");
    image.src = "https://i.postimg.cc/zvyzfkv9/images-pixelicious.png";
    image.style = `
    position: absolute;
    left: 0;
    top: 0;
    image-rendering: pixelated;
    opacity: 0.7;
    width: 5%;
    height: auto;
    `;
    canvas.parentElement.appendChild(image);

    let posX = 197;
    let posY = 872;

    function updatePosition() {
        image.style.left = posX + 'px';
        image.style.top = posY + 'px';
    }

    updatePosition()

    document.addEventListener('keydown', (event) => {
        const step = 1;
        switch (event.key) {
            case 'ArrowUp':
                posY -= step;
                break;
            case 'ArrowDown':
                posY += step;
                break;
            case 'ArrowLeft':
                posX -= step;
                break;
            case 'ArrowRight':
                posX += step;
                break;
        }
        updatePosition();
    });

})();
