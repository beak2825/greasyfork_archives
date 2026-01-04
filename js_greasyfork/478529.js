// ==UserScript==
// @name         Webcomic Reader
// @description  Allows you to scroll through comics, rather than clicking.
// @author       HIDDEN-lo
// @version      1.0
// @match        *://akuma.moe/*
// @license MIT
// @run-at       document-start
// @namespace https://greasyfork.org/users/1206627
// @downloadURL https://update.greasyfork.org/scripts/478529/Webcomic%20Reader.user.js
// @updateURL https://update.greasyfork.org/scripts/478529/Webcomic%20Reader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Used to get the last page # for generating the URL
    function findHighestOptionValue() {
        var options = document.querySelectorAll('option[value]');
        var highestValue = -Infinity;
    
        options.forEach(function(option) {
            var value = parseInt(option.getAttribute('value'), 10);
            if (!isNaN(value) && value > highestValue) {
                highestValue = value;
            }
        });
    
        return highestValue;
    }

    // Function to check if the current page is in reading mode
    function isReadingMode() {
        var url = window.location.href;
        return /\/\d+$/.test(url); // Check if the URL ends with a number
    }

    // Function to extract the current page number from the URL
    function getCurrentPageNumber() {
        var url = window.location.href;
        var matches = url.match(/\/(\d+)$/);
        if (matches && matches[1]) {
            return parseInt(matches[1], 10);
        }
        return 0;
    }

    // Function to add an image to the parent element with id "image-container"
    function addImageToParentContainer(imgLink) {
        var parentContainer = document.getElementById('image-container'); // Parent container
        if (parentContainer) {
            var imgElement = document.createElement('img');
            imgElement.setAttribute('src', imgLink);
            parentContainer.appendChild(imgElement);
        }
    }

    // Function to load and add images from subsequent pages
    function loadAndAddImagesFromPage(pageNumber) {
        var pageUrl = window.location.href.replace(/\/\d+$/, '/' + pageNumber);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', pageUrl, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log('Loaded images from page:', pageUrl);
                var html = xhr.responseText;
                var matches = html.match(/<img[^>]+src=["']([^"']+)/gi);
                
                if (matches) {
                    matches.forEach(function(match, index) {
                        var srcMatch = match.match(/src=["']([^"']+)/i);
                        if (srcMatch && srcMatch[1]) {
                            var imgLink = srcMatch[1];
                            // Check if the imgLink matches the original page's src
                            if (imgLink !== getOriginalPageSrc()) {
                                addImageToParentContainer(imgLink); // Add the image to the parent container
                            }
                        }
                    });
                }

                // Continue loading and adding images from the next page
                loadAndAddImagesFromPage(pageNumber + 1);
            }
        };
        xhr.send();
    }

    // Function to get the original page's src
    function getOriginalPageSrc() {
        var imgElement = document.querySelector('img'); // Get the first image on the page
        if (imgElement) {
            return imgElement.getAttribute('src');
        }
        return '';
    }

    // Function to create and trigger the button
    function createButton() {
        // Create a button to trigger the script
        var button = document.createElement('button');
        button.textContent = 'Load Images';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '9999';

        // Add an event listener to run the script on button click
        button.addEventListener('click', function() {
            button.style.display = 'none'; // Hide the button after clicking
            var currentPageNumber = getCurrentPageNumber();
            loadAndAddImagesFromPage(currentPageNumber); // Start loading and adding images from the current page
            checkURLChange();
            markRead();
        });

        // Add the button to the page if in reading mode
        if (isReadingMode()) {
            document.body.appendChild(button);
        }
    }
    
    function gotoLastPage() {
        // Remove current page # from URL
        var currentURL = window.location.href;

        // Use a regular expression to find the last "/" and any numbers that follow it
        var regex = /\/(\d+)+$/;
        var match = currentURL.match(regex);

        if (match) {
            var numbersToRemove = match[0];
            var updatedURL = currentURL.replace(numbersToRemove, '');
        }
        updatedURL = updatedURL + "/" + findHighestOptionValue();
        console.log("Updated URL: ", updatedURL);

        window.location.href = updatedURL;
    }

    function markRead() {
        // Create a button to trigger the script
        var button = document.createElement('button');
        button.textContent = 'Mark as Read';
        button.style.position = 'relative';
        button.style.bottom = '40px';
        button.style.left = '43.4%';
        button.style.zIndex = '9999';

        // Add an event listener to run the script on button click
        button.addEventListener('click', function() {
                gotoLastPage();
        });


        // Add the button to the page if in reading mode
        if (isReadingMode()) {
            document.body.appendChild(button);
        }
    }

    function checkURLChange() {
        var currentURL = window.location.href;

        setInterval(function() {
            console.log("Checking");
            var newURL = window.location.href;
            if (newURL !== currentURL) {
                // URL has changed, reload the page
                location.reload();
            }
        }, 500); // Check every second (1000 milliseconds)
    }

    // Call the function to create and trigger the button
    createButton();
})();
