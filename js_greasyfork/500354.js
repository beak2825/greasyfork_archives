// ==UserScript==
// @name         Florr.io Image Gatherer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gather all images from florr.io and download as a ZIP file
// @author       Your Name
// @match        *://florr.io/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/500354/Florrio%20Image%20Gatherer.user.js
// @updateURL https://update.greasyfork.org/scripts/500354/Florrio%20Image%20Gatherer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const corsProxy = 'https://cors-anywhere.herokuapp.com/';

    // Function to get base64 from image URL
    async function toDataURL(url) {
        try {
            const response = await fetch(corsProxy + url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Failed to fetch image:', error);
        }
    }

    // Add the gather images button
    const gatherButton = document.createElement('button');
    gatherButton.innerHTML = 'Gather Images';
    gatherButton.style.position = 'fixed';
    gatherButton.style.top = '50%';
    gatherButton.style.left = '50%';
    gatherButton.style.transform = 'translate(-50%, -50%)';
    gatherButton.style.zIndex = '9999';
    gatherButton.style.border = '2px solid black';
    gatherButton.style.backgroundColor = 'white';
    gatherButton.style.color = 'black';
    gatherButton.style.padding = '10px';
    gatherButton.style.cursor = 'pointer';
    document.body.appendChild(gatherButton);

    // Add click event listener to the button
    gatherButton.addEventListener('click', async () => {
        const zip = new JSZip();
        const images = document.querySelectorAll('img');
        
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const dataUrl = await toDataURL(img.src);
            if (dataUrl) {
                const base64Data = dataUrl.split(',')[1];
                zip.file(`image${i}.png`, base64Data, {base64: true});
            }
        }

        zip.generateAsync({type:"blob"})
            .then(function(content) {
                saveAs(content, "images.zip");
            });
    });
})();
