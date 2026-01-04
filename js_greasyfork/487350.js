// ==UserScript==
// @name         Remove Elements from view.protectedpdf.com
// @namespace    http://yourwebsite.com
// @version      1.0
// @description  Remove specified elements from view.protectedpdf.com
// @author       Your Name
// @match        https://view.protectedpdf.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487350/Remove%20Elements%20from%20viewprotectedpdfcom.user.js
// @updateURL https://update.greasyfork.org/scripts/487350/Remove%20Elements%20from%20viewprotectedpdfcom.meta.js
// ==/UserScript==

    // Your code here...
(function() {
    'use strict';

    // Function to remove the blur filter
    function removeBlurFilter() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .preventScreenCapture .pageContainer {
                filter: blur(0px) !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Function to show hidden elements with class .displayNone
    function showHiddenElements() {
        const hiddenElements = document.querySelectorAll('.Modal .displayNone');
        hiddenElements.forEach(element => {
            element.classList.remove('displayNone');
        });
    }

    // Function to display modal dialogs and overlays
    function displayModals() {
        const modalElements = document.querySelectorAll('.Modal.ErrorModal');
        modalElements.forEach(element => {
            element.style.display = 'block';
        });
    }

    // Function to flip CSS restrictions
    function flipCSSRestrictions() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .preventScreenCapture .pageContainer {
                filter: none !important;
            }

            .Modal .displayNone {
                display: block !important;
            }

            .Modal.ErrorModal {
                display: block !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Call the functions to modify CSS restrictions
    removeBlurFilter();
    showHiddenElements();
    displayModals();
    flipCSSRestrictions();
})();