// ==UserScript==
// @name         Anonym File Autodownloader
// @namespace    -
// @version      0.4
// @description  Automatically starts file download without needing to wait for the timer to finish.
// @author       Cat-Ling
// @homepageURL  https://github.com/Cat-Ling
// @icon         https://www.google.com/s2/favicons?sz=64&domain=anonymfile.com
// @match        https://anonymfile.com/*
// @exclude      https://anonymfile.com/
// @license      GPL-2.0
// @supportURL   https://github.com/Cat-Ling/f95zone-skipper/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485881/Anonym%20File%20Autodownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/485881/Anonym%20File%20Autodownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showToast(message) {
        // Create toast container
        var toastContainer = document.createElement('div');
        toastContainer.id = 'customToast';
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '20px';
        toastContainer.style.left = '50%';
        toastContainer.style.transform = 'translateX(-50%)';
        toastContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        toastContainer.style.color = '#fff';
        toastContainer.style.padding = '30px'; // Increased padding
        toastContainer.style.fontSize = '30px'; // Increased font size
        toastContainer.style.borderRadius = '5px';
        toastContainer.style.transition = 'opacity 0.5s';
        toastContainer.textContent = message;

        // Append toast container to the body
        document.body.appendChild(toastContainer);

        // Show toast
        setTimeout(function() {
            toastContainer.style.opacity = '1';
        }, 100);

        // Hide toast after 3 seconds
        setTimeout(function() {
            toastContainer.style.opacity = '0';
            // Remove toast from DOM after fade out
            setTimeout(function() {
                toastContainer.parentNode.removeChild(toastContainer);
            }, 500);
        }, 3000);
    }

    function extractAndRedirect() {
        var elements = document.querySelectorAll('*');

        for (var i = 0; i < elements.length; i++) {
            var element = elements[i];
            if (element.outerHTML.includes('.append(\'<a href="') && element.outerHTML.includes('anonymfile.com/f/')) {
                // Extract the link from the element's HTML
                var startIndex = element.outerHTML.indexOf('anonymfile.com/f/');
                var endIndex = element.outerHTML.indexOf('"', startIndex);
                var link = element.outerHTML.slice(startIndex, endIndex);
                window.location.href = "https://" + link;
                showToast("Download Started");
                return;
            }
        }
    }

    window.addEventListener('load', extractAndRedirect);
})();
