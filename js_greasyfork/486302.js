// ==UserScript==
// @name         puhutv Picture in Picture
// @name:tr         puhutv Picture in Picture
// @namespace    puhutvPiP
// @version      1.3.1
// @description  Picture in Picture mode for puhutv
// @description:tr  puhutv için Picture in Picture modu
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        https://puhutv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puhutv.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/486302/puhutv%20Picture%20in%20Picture.user.js
// @updateURL https://update.greasyfork.org/scripts/486302/puhutv%20Picture%20in%20Picture.meta.js
// ==/UserScript==

console.log("puhutvPiP");

// Wait for the page to load
window.addEventListener('load', () => {
    // Add a delay of 2 seconds before adding the button
    setTimeout(() => {
        // Find the video player element (you may need to adjust the selector)
        const vid = document.querySelector('#dyg-player-new-player_html5_api');

        // Find the target div element
        const targetDiv = document.querySelector('[title="Tam Ekran"]') || document.querySelector('.vjs-fullscreen-control');

        // Add the Picture-in-Picture button just before the target div
        const pipBtn = document.createElement('button');
        pipBtn.id = 'pip-btn';
        pipBtn.className = 'vjs-icon-picture-in-picture-enter vjs-control vjs-button';

        pipBtn.style.fontSize = '26px';
        pipBtn.style.width = '40px';
        pipBtn.style.height = '30px';
        pipBtn.style.color = '#828282';
        pipBtn.style.cursor = 'pointer';

        // Append the button directly to the document body
        document.body.appendChild(pipBtn);


        // Insert the container just before the target div
        targetDiv.parentNode.insertBefore(pipBtn, targetDiv);

        // Function to toggle Picture-in-Picture mode
        // Function to toggle Picture-in-Picture mode
        const togglePiP = () => {
            const vid = document.querySelector('#dyg-player-new-player_html5_api');

            // Check if the browser supports requestPictureInPicture
            if ('pictureInPictureEnabled' in document && document.pictureInPictureEnabled) {
                if (document.pictureInPictureElement === vid) {
                    document.exitPictureInPicture();
                } else {
                    // Request Picture-in-Picture mode
                    vid.requestPictureInPicture()
                        .then(() => {
                        console.log('Entered Picture-in-Picture mode.');
                    })
                        .catch((error) => {
                        console.error('Error entering Picture-in-Picture mode:', error);
                    });
                }
            } else {
                // Alert the user that Picture-in-Picture is not supported
                alert('Your browser does not support Picture-in-Picture mode.');
            }
        };

        // On click of the PiP button, toggle Picture-in-Picture mode
        pipBtn.addEventListener('click', togglePiP);


        // On click of the PiP button, toggle Picture-in-Picture mode
        pipBtn.addEventListener('click', togglePiP);
    }, 3000);
});
