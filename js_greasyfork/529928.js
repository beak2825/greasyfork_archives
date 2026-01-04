// ==UserScript==
// @name         Torn Custom Plane Image
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Sets a custom plane image on the Torn Travel page.
// @author       TR0LL [2561502]
// @match        https://www.torn.com/page.php?sid=travel
// @match        https://www.torn.com/preferences.php
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Proprietary
// @downloadURL https://update.greasyfork.org/scripts/529928/Torn%20Custom%20Plane%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/529928/Torn%20Custom%20Plane%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const defaultImage = "https://i.pinimg.com/originals/98/5e/ad/985ead90bd841958d2bb4b09ca60d123.gif";

    function replacePlaneImage() {
        const planeImage = document.querySelector('.planeImage___Kbn3b');
        if (!planeImage) return;

        const customImage = GM_getValue('permanentPlaneImage') || defaultImage;
        planeImage.src = customImage;

        // Center the image
        planeImage.style.position = 'absolute';
        planeImage.style.top = '50%';
        planeImage.style.left = '50%';
        planeImage.style.transform = 'translate(-50%, -50%)';
        planeImage.style.maxWidth = '778px';
        planeImage.style.maxHeight = '300px';
        planeImage.style.width = 'auto';
        planeImage.style.height = 'auto';
    }

    function addImageButton() {
        if (!window.location.href.startsWith("https://www.torn.com/preferences.php")) return;

        const imageButton = document.createElement('button');
        imageButton.textContent = 'Set Plane Image';
        imageButton.style.padding = '8px 12px';
        imageButton.style.margin = '5px';
        imageButton.style.cursor = 'pointer';
        imageButton.style.backgroundColor = '#3498db';
        imageButton.style.color = 'white';
        imageButton.style.border = 'none';
        imageButton.style.borderRadius = '3px';
        imageButton.style.fontSize = '14px';

        // Position the button on the right side of the screen
        imageButton.style.position = 'fixed';
        imageButton.style.top = '50%';
        imageButton.style.right = '20px'; // Adjust this value to change the distance from the right
        imageButton.style.transform = 'translateY(-50%)';
        imageButton.style.zIndex = '9999'; // Ensure it's above other elements

        imageButton.addEventListener('click', () => {
            const imageUrl = prompt("Please enter the image URL");
            if (imageUrl){
                GM_setValue('permanentPlaneImage', imageUrl);
                replacePlaneImage();
            }
        });

        document.body.appendChild(imageButton);
    }

    replacePlaneImage();
    addImageButton();

    const observer = new MutationObserver(mutations => {
        replacePlaneImage();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();