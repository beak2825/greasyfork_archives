// ==UserScript==
// @name         Direct Download Buttons on OpenLibrary - DL from Anna's Archive and Z-Library
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Adds direct download buttons to openlibrary pages, so you don't have to waste time trying to borrow the books. https://imgur.com/a/g8KrriY https://imgur.com/a/YU0uh4I
// @author       stuffed
// @license MIT
// @match        *://openlibrary.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501656/Direct%20Download%20Buttons%20on%20OpenLibrary%20-%20DL%20from%20Anna%27s%20Archive%20and%20Z-Library.user.js
// @updateURL https://update.greasyfork.org/scripts/501656/Direct%20Download%20Buttons%20on%20OpenLibrary%20-%20DL%20from%20Anna%27s%20Archive%20and%20Z-Library.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the page is fully loaded
    window.addEventListener('load', function() {
        // Select the element with the class "modal-links"
        var modalLinksElement = document.querySelector('.modal-links');

        // Log the found element for debugging
        if (modalLinksElement) {
            console.log('Found modal-links element with class:', modalLinksElement.className);
        } else {
            console.log('No modal-links element found');
        }

        if (modalLinksElement) {
            // Function to create a button
            function createButton(text, backgroundColor, onClickHandler) {
                var button = document.createElement('button');
                button.textContent = text;

                // Apply styles to match the requested appearance
                button.style.fontSize = '16px';
                button.style.color = '#fff';
                button.style.width = '100%';
                button.style.display = 'block';
                button.style.border = '0';
                button.style.borderRadius = '5px';
                button.style.marginTop = '5px';
                button.style.boxSizing = 'border-box';
                button.style.cursor = 'pointer';
                button.style.textAlign = 'center';
                button.style.padding = '7px';
                button.style.whiteSpace = 'nowrap';
                button.style.backgroundColor = backgroundColor;
                button.style.lineHeight = '1.5em';
                button.style.transition = 'background-color .2s';

                // Add click event listener if provided
                if (onClickHandler) {
                    button.addEventListener('click', onClickHandler);
                }

                return button;
            }

            // Function to handle click event for the Z-Library button
            function handleZLibraryClick() {
                // Get the text from the element with class "work-title"
                var workTitleElement = document.querySelector('.work-title');
                var workTitle = workTitleElement ? workTitleElement.textContent.trim() : '';

                // Format the text for URL and open new URL
                var formattedTitle = encodeURIComponent(workTitle);
                var url = `https://singlelogin.re/s/${formattedTitle}`;
                window.open(url, '_blank');
            }

            // Function to handle click event for the Anna's Archive button
            function handleAnnasArchiveClick() {
                // Get the text from the element with class "work-title"
                var workTitleElement = document.querySelector('.work-title');
                var workTitle = workTitleElement ? workTitleElement.textContent.trim() : '';

                // Format the text for URL and open new URL
                var formattedTitle = encodeURIComponent(workTitle);
                var url = `https://annas-archive.org/search?q=${formattedTitle}`;
                window.open(url, '_blank');
            }

            // Create the Z-Library button with click handler
            var button1 = createButton('Z-Library', '#3f704d', handleZLibraryClick);
            // Insert the Z-Library button before the modal-links element
            modalLinksElement.parentNode.insertBefore(button1, modalLinksElement);

            // Create the Anna's Archive button with click handler
            var button2 = createButton("Anna's Archive", '#ac2121', handleAnnasArchiveClick);
            // Insert the Anna's Archive button before the modal-links element
            modalLinksElement.parentNode.insertBefore(button2, modalLinksElement);
        }
    });
})();
