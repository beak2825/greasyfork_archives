// ==UserScript==
// @name         MTO ON-PREM IMG CHECKER
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Show an alert message if any images are hosted on d1.awsstatic
// @author       gabng (modified)
// @match        https://prod.aem-author.marketing.aws.dev/*
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/536156/MTO%20ON-PREM%20IMG%20CHECKER.user.js
// @updateURL https://update.greasyfork.org/scripts/536156/MTO%20ON-PREM%20IMG%20CHECKER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function log(message) {
        if (typeof GM_log !== 'undefined') {
            GM_log(message);
        }
        console.log('AWS Image Checker:', message);
    }

    function checkForAwsStaticImages() {
        const images = document.getElementsByTagName('img');
        let awsStaticImageFound = false;
        let foundImages = [];

        log(`Checking ${images.length} images on the page`);

        for (const img of images) {
            try {
                if (img.src.includes('d1.awsstatic')) {
                    awsStaticImageFound = true;
                    foundImages.push(img.src);
                    log(`Found AWS Static image: ${img.src}`);

                    // Highlight the problematic image
                    img.style.border = '3px solid red';
                    img.style.boxShadow = '0 0 10px red';
                }
            } catch (e) {
                log(`Error checking image: ${e}`);
            }
        }

        return {found: awsStaticImageFound, images: foundImages};
    }

    function showAlert(message, duration = 10000) {
        const existingAlert = document.getElementById('awsImageAlert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertBar = document.createElement('div');
        alertBar.id = 'awsImageAlert';
        alertBar.style.backgroundColor = '#b80a0a';
        alertBar.style.color = 'white';
        alertBar.style.padding = '10px';
        alertBar.style.fontWeight = 'bold';
        alertBar.style.position = 'fixed';
        alertBar.style.top = '0';
        alertBar.style.left = '0';
        alertBar.style.width = '100%';
        alertBar.style.zIndex = '9999';
        alertBar.style.textAlign = 'center';
        alertBar.textContent = message;

        document.body.insertBefore(alertBar, document.body.firstChild);

        setTimeout(() => {
            alertBar.style.display = 'none';
        }, duration);
    }

    // Run check when page loads
    window.addEventListener('load', function() {
        log('Page loaded, starting image check');
        const result = checkForAwsStaticImages();

        if (result.found) {
            const message = `⚠️ WARNING: Found ${result.images.length} image(s) hosted on d1.awsstatic ⚠️`;
            showAlert(message);
            log(message);
        } else {
            log('No AWS Static images found');
        }
    });

    // Also check periodically in case images load dynamically
    const checkInterval = setInterval(() => {
        log('Periodic image check');
        const result = checkForAwsStaticImages();

        if (result.found) {
            const message = `⚠️ WARNING: Found ${result.images.length} image(s) hosted on d1.awsstatic ⚠️`;
            showAlert(message);
            clearInterval(checkInterval); // Stop checking once we find something
        }
    }, 3000);
})();