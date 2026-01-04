// ==UserScript==
// @name         Site to Wireframe
// @namespace    http://your.namespace
// @version      0.1
// @description  Convert any website to a low-fidelity wireframe
// @author       Your Name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/480720/Site%20to%20Wireframe.user.js
// @updateURL https://update.greasyfork.org/scripts/480720/Site%20to%20Wireframe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inject your custom styles
    GM_addStyle(`
        /* Add your custom wireframe styles here */
        body {
            background: #fff; /* Set wireframe background color */
        }
        /* Define wireframe styles for different elements */
    `);

    // Capture the current page as an image using HTML2Canvas
    html2canvas(document.body).then(canvas => {
        // Convert the canvas to an image URL
        const imageURL = canvas.toDataURL();

        // Create a link to download the wireframe image
        const downloadLink = document.createElement('a');
        downloadLink.href = imageURL;
        downloadLink.download = 'wireframe.png';
        downloadLink.click();
    });
})();
