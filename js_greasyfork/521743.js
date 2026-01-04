// ==UserScript==
// @name         бан по айпи
// @namespace    simulate.403
// @version      1.7
// @description  тестовая версия которая покажет что будет, если вас забанят по айпи.
// @author       minish
// @match        https://drawaria.online/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521743/%D0%B1%D0%B0%D0%BD%20%D0%BF%D0%BE%20%D0%B0%D0%B9%D0%BF%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/521743/%D0%B1%D0%B0%D0%BD%20%D0%BF%D0%BE%20%D0%B0%D0%B9%D0%BF%D0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to simulate a 403 error
    function simulate403() {
        // Clear all elements on the page
        document.body.innerHTML = ''; // Clear the page content

        // Set the background image for the entire document
        document.body.style.margin = '0'; // Remove margins
        document.body.style.padding = '0'; // Remove padding
        document.body.style.backgroundImage = "url('https://avatars.mds.yandex.net/i?id=325dfbf3865153b60d5733bed28d477eebf594a687fd6fc8-12714815-images-thumbs&n=13')";
        document.body.style.backgroundSize = 'cover'; // Cover the entire page
        document.body.style.backgroundPosition = 'center'; // Center the background

        // Update the page title
        document.title = "403 Forbidden";

        // Change the URL in the address bar
        history.pushState(null, '', '/403');

        // Create an error message element
        const errorMessage = document.createElement('div');
        errorMessage.innerHTML = `
            <h1 style="color: black; text-align: center;">ERROR 403</h1>
            <h2 style="color: black; text-align: center;">Forbidden</h2>
            <p style="color: black; text-align: center; font-size: 20px;">
                Access to this resource is forbidden.<br>
                Your IP address has been banned for violating the site rules.
            </p>
        `;
        errorMessage.style.position = 'absolute';
        errorMessage.style.top = '10px'; // Position from the top
        errorMessage.style.left = '50%'; // Center horizontally
        errorMessage.style.transform = 'translateX(-50%)'; // Center horizontally
        document.body.appendChild(errorMessage);

        // Change all elements, including blocked ones, to black text
        const allElements = document.querySelectorAll('*');
        allElements.forEach(element => {
            element.style.color = 'black'; // Set text color to black
            element.style.backgroundColor = 'transparent'; // Make background transparent
            element.style.border = 'none'; // Remove borders
        });
    }

    // Automatically execute the function on page load
    simulate403();
})();
