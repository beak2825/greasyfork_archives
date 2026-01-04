// ==UserScript==
// @name         puhutv windowed full screen
// @name:tr         puhutv pencereli tam ekran
// @namespace    puhutvWindowedFS
// @version      0.2.2
// @description  Windowed Full Screen mode for puhutv
// @description:tr  puhutv için Pencereli Tam Ekran modu
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        https://puhutv.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=puhutv.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/486332/puhutv%20windowed%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/486332/puhutv%20windowed%20full%20screen.meta.js
// ==/UserScript==

console.log("puhutvWindowedFS");

// Wait for the page to load
window.addEventListener('load', () => {
    // Add a delay of 2 seconds before adding the button
    setTimeout(() => {
        // Find the target div element
        const targetDiv = document.querySelector('[title="Tam Ekran"]') || document.querySelector('.vjs-fullscreen-control');

        // Add the Windowed Full Screen button just before the target div
        const fsBtn = document.createElement('button');
        fsBtn.id = 'fs-btn';
        fsBtn.className = 'vjs-icon-picture-in-picture-exit vjs-control vjs-button';

        fsBtn.style.fontSize = '20px';
        fsBtn.style.width = '40px';
        fsBtn.style.height = '30px';
        fsBtn.style.color = '#828282';
        fsBtn.style.cursor = 'pointer';

        // Create a container for the button
        document.body.appendChild(fsBtn);

        // Insert the container just before the target div
        targetDiv.parentNode.insertBefore(fsBtn, targetDiv);

        const videoBox = document.querySelector('[type="watch"]');
        const header = document.querySelector('header');

        const toggleFS = () => {
            if (videoBox.style.maxWidth) {
                // Reset styles to their original values
                videoBox.style.maxWidth = '';
                videoBox.style.maxHeight = '';
                videoBox.style.zIndex = '';
                videoBox.style.position = '';
                videoBox.style.bottom = '';
                videoBox.style.right = '';
                videoBox.style.left = '';
                videoBox.style.top = '';
                videoBox.style.margin = '';

                document.body.style.overflow = 'auto';

                header.style.display = '';

                document.getElementById('blackbox').parentNode.removeChild(document.getElementById('blackbox'));
            } else {
                // Apply the fullscreen styles
                videoBox.style.maxWidth = 'calc(100% - 183px)'; // must be reduced by the amount of overflow of height
                videoBox.style.maxHeight = '100%';
                videoBox.style.zIndex = '95000';
                videoBox.style.position = 'fixed';
                videoBox.style.bottom = '0px';
                videoBox.style.right = '0px';
                videoBox.style.left = '0px';
                videoBox.style.top = '0px';
                videoBox.style.margin = '0 auto 0';

                document.body.style.overflow = 'hidden';

                header.style.display = 'none';

                const blackboxHTML = '<div id="blackbox" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: black; z-index: 94; min-height: 10000px; overflow: hidden;"></div>';
                videoBox.insertAdjacentHTML('afterend', blackboxHTML);

            }
        };

        // On click of the Full Screen button, toggle Full Screen mode
        fsBtn.addEventListener('click', toggleFS);
    }, 3000);
});
