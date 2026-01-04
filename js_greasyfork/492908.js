// ==UserScript==
// @name         Azure PR View Plus
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify repos elements on web pages
// @author       Nilesh Agarwal <nileshagarwal10@gmail.com>
// @match        https://dev.azure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492908/Azure%20PR%20View%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/492908/Azure%20PR%20View%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a floating toggle button for repos-pr-header
    var toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle PR Headers';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.backgroundColor = '#007bff';
    toggleButton.style.color = '#fff';
    toggleButton.style.cursor = 'pointer';

    document.body.appendChild(toggleButton);

    // Function to hide/show the repos-pr-header, region-header, region-header-menubar, navigation-container, and bolt-tabbar elements
function toggleReposPrHeader() {
    var elementsToHide = document.querySelectorAll('.repos-pr-header, .region-header, .region-header-menubar, .navigation-container, .bolt-tabbar, .repos-compare-toolbar');
    elementsToHide.forEach(function(element) {
        if (element.style.display === 'none') {
            element.style.display = '';
        } else {
            element.style.display = 'none';
        }
    });
}



    // Add click event listener to toggle button for repos-pr-header
    toggleButton.addEventListener('click', function() {
        toggleReposPrHeader();
    });

})();
