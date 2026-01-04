// ==UserScript==
// @name         SimsFinds Wait Bypass
// @namespace    Callz
// @version      1.0.0
// @description  Bypass the timer on SimsFinds.com!
// @author       Callz
// @license      MIT
// @match        https://www.simsfinds.com/*
// @match        https://click.simsfinds.com/download?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523414/SimsFinds%20Wait%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/523414/SimsFinds%20Wait%20Bypass.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to construct the dynamic download URL
    function constructDownloadURL() {
        console.log('Starting URL construction...');

        const linkElement = document.querySelector('button._bt-download');
        const bodyElement = document.querySelector('body');

        if (!linkElement || !bodyElement) {
            console.warn('Required elements not found. Cannot proceed with URL construction.');
            return;
        }

        const dataAt5t768r9 = linkElement.getAttribute('data-at5t768r9');
        if (!dataAt5t768r9) {
            console.warn('Download data missing in the <a> tag.');
            return;
        }

        const flid = linkElement.getAttribute('data-at8r136r7');
          if (!flid) {
              console.warn('flid (data-at8r136r7) is missing from the <a> tag.');
              return;
          }

        const [cid, key, jogo, version] = dataAt5t768r9.split(',');
        const pass = bodyElement.getAttribute('data-passe');
        const dispositivo = bodyElement.getAttribute('data-dispositivo');
        const idioma = bodyElement.getAttribute('data-idioma-id');
        const fuso = bodyElement.getAttribute('data-fuso');



        const now = Date.now(); // Base time in milliseconds

        const downloadURL = `https://click.simsfinds.com/download?key=${key}&cid=${cid}&uid=0&pass=${pass}&dvc=${dispositivo}&version=${version}&flid=${flid}&now=${now}`;

        console.log('Constructed Download URL:', downloadURL);
        window.location.href = downloadURL;

    }

    // Function to redirect to the "data-continue" link
    function redirectToContinueLink() {
        const downloadDataDiv = document.getElementById('gd9t568a');
        if (downloadDataDiv) {
            const continueLink = downloadDataDiv.getAttribute('data-continue');
            if (continueLink) {
                console.log('Redirecting to:', continueLink);
                window.location.href = continueLink; // Redirect to the continue link
            } else {
                console.warn('data-continue attribute not found');
            }
        } else {
            console.warn('Download data div not found');
        }
    }

    // Handle logic for the different pages
    if (window.location.href.startsWith('https://www.simsfinds.com/')) {
        if (window.location.href.startsWith('https://www.simsfinds.com/continue?')) {
            // On the "continue" page
            console.log('Detected /continue page. Waiting for 1 second...');
            setTimeout(() => {
                console.log('Running constructDownloadURL...');
                constructDownloadURL();
            }, 1000);
        } else {
            // On the main SimsFinds page
            console.log('Running on SimsFinds main site');

            // Intercept button clicks
            document.addEventListener('click', (event) => {
                const buttonTarget = event.target.closest('button._bt-download');
                const linkTarget = event.target.closest('a._bt-download');

                if (buttonTarget) {
                    console.log('Download button clicked, redirecting to continue link...');
                    event.preventDefault(); // Prevent default button behavior
                    redirectToContinueLink(); // Redirect to the static link
                } else if (linkTarget) {
                    console.log('Download link clicked, constructing URL...');
                    event.preventDefault(); // Prevent default link behavior
                    constructDownloadURL(); // Construct and redirect
                }
            });
        }
    } else if (window.location.href.startsWith('https://click.simsfinds.com/download?')) {
        // On the redirect page
        console.log('Running on the download redirect page');

        // Automatically trigger the download and close the tab
        const downloadLink = document.querySelector('a[href*="/download/"]');
        if (downloadLink) {
            console.log('Triggering download:', downloadLink.href);
            // Create a virtual click to start the download
            downloadLink.click();

            // Close the redirect tab after a short delay
            setTimeout(() => {
                console.log('Closing the redirect tab...');
                window.close();
            }, 2000);
        } else {
            console.warn('Download link not found on the redirect page.');
        }
    }
})();
