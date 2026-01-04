// ==UserScript==
// @name         Androidworld admin link
// @namespace    https://androidworld.nl/ & https://androidworld.be/
// @version      0.2
// @description  Add link to edit post in Androidworld pages
// @author       Roger GPT
// @match        https://androidworld.be/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=androidworld.be
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495760/Androidworld%20admin%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/495760/Androidworld%20admin%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the script is running on one of the specified domains
    if (!window.location.href.startsWith('https://androidworld.be/')) {
        return; // Exit the script if not on the correct domain
    }

    // Check if the element with id 'next_prev_articles_component' exists
    var nextPrevComponent = document.getElementById('next_prev_articles_component');

    // If the element exists
    if (nextPrevComponent) {
        // Get the data-id attribute value
        var postId = nextPrevComponent.getAttribute('data-id');

        // Determine the domain
        var domain = window.location.href.startsWith('https://androidworld.nl/') ? 'nl' : 'be';

        // Create the URL for editing the post
        var editUrl = 'https://androidworld.' + domain + '/admin/article/' + postId + '/edit';

        // Create a link element
        var editLink = document.createElement('a');
        editLink.href = editUrl;
        editLink.target = '_blank';
        editLink.textContent = 'Artikel bewerken';
        editLink.style.position = 'fixed';
        editLink.style.bottom = '20px';
        editLink.style.right = '20px';
        editLink.style.padding = '10px';
        editLink.style.backgroundColor = '#007bff';
        editLink.style.color = '#fff';
        editLink.style.borderRadius = '5px';
        editLink.style.zIndex = '9999';

        // Append the link to the body of the page
        document.body.appendChild(editLink);
    }
})();