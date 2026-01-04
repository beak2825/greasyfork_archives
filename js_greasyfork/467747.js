// ==UserScript==
// @name         Fortunate Maps StraTAGy
// @namespace    Bambi
// @version      1.0
// @description  Redirects to StraTAGy and runs handleJPEGImage function
// @license      MIT
// @match        https://fortunatemaps.herokuapp.com/map/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467747/Fortunate%20Maps%20StraTAGy.user.js
// @updateURL https://update.greasyfork.org/scripts/467747/Fortunate%20Maps%20StraTAGy.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create a button element
    var button = document.createElement('button');
    button.innerHTML = 'Redirect to StraTAGy';

    // Add a click event listener to the button
    button.addEventListener('click', function() {
        // Extract the map code from the URL
        var mapUrl = window.location.href;
        var mapCode = mapUrl.substring(mapUrl.lastIndexOf('/') + 1);

        // Redirect to StraTAGy page and execute handleJPEGImage function
        window.location.href = 'https://bambitp.github.io/StraTAGy/?mapCode=' + encodeURIComponent(mapCode);
    });

    // Find the element on the Fortunate Maps page to append the button to
    var targetElement = document.querySelector('.btn-group.w-100');

    // Append the button to the target element
    if (targetElement) {
        targetElement.appendChild(button);
    }
})();
