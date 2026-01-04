// ==UserScript==
// @name         Capture and Save Website Source
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Capture HTML, CSS, and JS of the page and save it as a file
// @author       You
// @match        *://*/*
// @grant        GM_download
// @grant        GM_info
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.7.1/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/504313/Capture%20and%20Save%20Website%20Source.user.js
// @updateURL https://update.greasyfork.org/scripts/504313/Capture%20and%20Save%20Website%20Source.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to capture and save the website's HTML, CSS, and JS
    function captureAndSave() {
        // Get HTML content
        let htmlContent = document.documentElement.outerHTML;

        // Get CSS content
        let cssContent = '';
        document.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            fetch(link.href)
                .then(response => response.text())
                .then(css => cssContent += css);
        });

        // Get JavaScript content
        let jsContent = '';
        document.querySelectorAll('script[src]').forEach(script => {
            fetch(script.src)
                .then(response => response.text())
                .then(js => jsContent += js);
        });

        // Wait for all fetch requests to complete
        Promise.all([
            ...Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => fetch(link.href).then(response => response.text())),
            ...Array.from(document.querySelectorAll('script[src]')).map(script => fetch(script.src).then(response => response.text()))
        ]).then(() => {
            // Create a new JSZip instance
            const zip = new JSZip();
            zip.file("index.html", htmlContent);
            zip.file("styles.css", cssContent);
            zip.file("scripts.js", jsContent);

            // Generate the ZIP file and save it
            zip.generateAsync({ type: "blob" })
                .then(content => {
                    saveAs(content, "website-source.zip");
                });
        });
    }

    // Add a button to trigger capture and save
    let button = document.createElement('button');
    button.textContent = 'Save Website Source';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#007BFF';
    button.style.color = '#FFFFFF';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    button.addEventListener('click', captureAndSave);
})();
