// ==UserScript==
// @name         Kinopoisk Redirect
// @namespace    https://t.me/johannmosin
// @version      1.1
// @description  Show a button on the page to redirect from kinopoisk.ru to C_X
// @author       Johann Mosin
// @match        https://www.kinopoisk.ru/*/*
// @license      MIT
// @grant        GM_addStyle
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/489001/Kinopoisk%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/489001/Kinopoisk%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and append the button
    function createAndAppendButton(containerClass, providedButtonClass) {
        // Check if the button already exists
        if (document.querySelector('button.redirect-button')) {
            return;
        }

        // Create a button element
        var button = document.createElement('button');
        button.textContent = 'Смотреть на C_X';
        button.className = 'redirect-button'; // Add a class to the button

        // Copy the classes from the provided button
        var providedButton = document.querySelector(providedButtonClass);
        var classes = providedButton.className.split(' ');

        // Apply the copied classes to the new button
        classes.forEach(function(className) {
            button.classList.add(className);
        });

        // Attach an event listener to the button
        button.addEventListener('click', function() {
            // Get the current URL
            var currentUrl = window.location.href;

            // Extract the type and id from the URL
            var parts = currentUrl.split('/');
            var type = parts[3];
            var id = parts[4];

            // Construct the new URL
            var newUrl = 'https://w2.kpfr.wiki/' + type + '/' + id + '/';

            // Redirect to the new URL
            window.location.href = newUrl;
        });

        // Append the button to the container
        document.querySelector(containerClass).appendChild(button);
    }

    // Check which container class the page contains and create the button accordingly
    function checkForButtons() {
        if (document.querySelector('div.styles_buttonsContainer__HREZO')) {
            createAndAppendButton('div.styles_buttonsContainer__HREZO', '.styles_button__tQYKG .style_root__BmiQ7 button');
        } else if (document.querySelector('div.styles_buttonsContainer__i6y3F')) {
            createAndAppendButton('div.styles_buttonsContainer__i6y3F', '.styles_button__Q82i0 .watch-online-button .kinopoisk-watch-online-button');
        }
    }

    // Use MutationObserver to check for changes in the DOM
    var observer = new MutationObserver(checkForButtons);
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the checkForButtons function initially
    checkForButtons();
})();
