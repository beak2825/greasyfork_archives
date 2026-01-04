// ==UserScript==
// @name Scholar Author Extractor
// @namespace http://tampermonkey.net/
// @version 0.2
// @description Extract authors from arXiv and Google Scholar search results and open Twitter search tabs for each author
// @author Your name
// @match https://*/*
// @grant none
// @license MIT
// @namespace search handles of authors
// @downloadURL https://update.greasyfork.org/scripts/494043/Scholar%20Author%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/494043/Scholar%20Author%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var shortcutKeyPressed = false;

    // Function to extract authors from arXiv
    function extractAuthorsFromArxiv() {
        var authorsElement = document.querySelector('.authors');
        if (authorsElement) {
            var authorsText = authorsElement.textContent.trim();
            var authors = authorsText.replace(/^Authors:\s*/, '').split(', ');
            return authors;
        }
        return [];
    }

    // Function to extract authors from Google Scholar
    function extractAuthorsFromGoogleScholar() {
        var authorElements = document.querySelectorAll('.gs_scl');
        var authors = [];

        for (var i = 0; i < authorElements.length; i++) {
            var element = authorElements[i];
            var field = element.querySelector('.gsc_oci_field');

            if (field && field.textContent.trim() === 'Authors') {
                var valueElement = element.querySelector('.gsc_oci_value');
                if (valueElement) {
                    var authorNames = valueElement.textContent.trim().split(', ');
                    authors = authors.concat(authorNames);
                }
            }
        }

        return authors;
    }

    // Function to open Twitter search tabs for each author
    function openTwitterTabs(authors) {
        authors.forEach(function(author) {
            var url = 'https://twitter.com/search?q=' + encodeURIComponent(author) + '&src=typed_query&f=user';
            window.open(url, '_blank');
        });
    }

    // Function to open LinkedIn search tabs for each author
    function openLinkedInTabs(authors) {
        authors.forEach(function(author) {
            var url = 'https://www.linkedin.com/search/results/all/?keywords=' + encodeURIComponent(author);
            window.open(url, '_blank');
        });
    }

    // Listen for keypress events
    window.addEventListener('keydown', function(event) {
        // Check if Ctrl + Shift + T is pressed
        if (event.ctrlKey && event.shiftKey && event.key === 'T') {
            shortcutKeyPressed = true;
        }
    });

    // Listen for keyup events to reset the flag
    window.addEventListener('keyup', function(event) {
        // Reset the flag if the same key combination is released
        if (event.key === 'T') {
            shortcutKeyPressed = false;
        }
    });


    // Create buttons for opening Twitter and LinkedIn search tabs
    var twitterButton = document.createElement('button');
    twitterButton.textContent = 'Open Twitter Search Tabs';
    twitterButton.addEventListener('click', function() {
        var authors;
        if (window.location.host === "arxiv.org") {
            // Extract authors from arXiv
            authors = extractAuthorsFromArxiv();
        } else if (window.location.host === "scholar.google.com") {
            // Extract authors from Google Scholar
            authors = extractAuthorsFromGoogleScholar();
        }

        openTwitterTabs(authors);
    });

    var linkedInButton = document.createElement('button');
    linkedInButton.textContent = 'Open LinkedIn Search Tabs';
    linkedInButton.addEventListener('click', function() {
        var authors;
        if (window.location.host === "arxiv.org") {
            // Extract authors from arXiv
            authors = extractAuthorsFromArxiv();
        } else if (window.location.host === "scholar.google.com") {
            // Extract authors from Google Scholar
            authors = extractAuthorsFromGoogleScholar();
        }

        openLinkedInTabs(authors);
    });


    // Listen for keyup events
    window.addEventListener('keyup', function(event) {
        // Check if Ctrl + Shift + T is released
        if (event.ctrlKey && event.shiftKey && event.key === 'T') {
            shortcutKeyPressed = true;

            var authors = [];
            if (window.location.host === "arxiv.org") {
                // Extract authors from arXiv
                authors = extractAuthorsFromArxiv();
            } else if (window.location.host === "scholar.google.com") {
                // Extract authors from Google Scholar
                authors = extractAuthorsFromGoogleScholar();
            }

            // Create a container element for the buttons and textarea
            var container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '10px';
            container.style.right = '10px';
            container.style.zIndex = '9999';
            document.body.appendChild(container);

            // Create a textarea to display and edit author names
            var textarea = document.createElement('textarea');
            textarea.style.width = '300px';
            textarea.style.height = '150px';
            textarea.value = authors.join(', ');
            container.appendChild(textarea);

            // Create the "Cancel" button
            var cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.addEventListener('click', function() {
                document.body.removeChild(container);
            });
            container.appendChild(cancelButton);

            // Create the "Twitter" button
            var twitterButton = document.createElement('button');
            twitterButton.textContent = 'Twitter';
            twitterButton.addEventListener('click', function() {
                var names = textarea.value.split(/,| and /).map(function(name) {
                    return name.trim();
                }).filter(function(name) {
                    return name !== '';
                });
                openTwitterTabs(names);
                document.body.removeChild(container);
            });
            container.appendChild(twitterButton);

            // Create the "LinkedIn" button
            var linkedInButton = document.createElement('button');
            linkedInButton.textContent = 'LinkedIn';
            linkedInButton.addEventListener('click', function() {
                var names = textarea.value.split(/,| and /).map(function(name) {
                    return name.trim();
                }).filter(function(name) {
                    return name !== '';
                });
                openLinkedInTabs(names);
                document.body.removeChild(container);
            });
            container.appendChild(linkedInButton);

            // Reset the flag after executing functionality
            shortcutKeyPressed = false;
        }
    });
})();