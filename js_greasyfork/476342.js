// ==UserScript==
// @name         Zelenka.guru Page Navigation
// @namespace    your_namespace_here
// @version      1.0
// @description  Allows navigation to a specific page on Zelenka.guru threads
// @author       Your Name
// @match        https://zelenka.guru/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476342/Zelenkaguru%20Page%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/476342/Zelenkaguru%20Page%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function goToPage(threadId, pageNumber) {
        const targetUrl = `https://zelenka.guru/threads/${threadId}/page-${pageNumber}`;
        window.location.href = targetUrl;
    }

    const threadId = window.location.pathname.split('/')[2];
    let pageNavContainer = null;

    // Function to check for the page navigation container
    function checkPageNavContainer() {
        pageNavContainer = document.querySelector('.PageNav');
        if (pageNavContainer) {
            clearInterval(intervalId); // Stop the interval once the button is found
            addPageNavigationButton();
        }
    }

    // Function to add the button to the page navigation container
    function addPageNavigationButton() {
        const button = document.createElement('button');
        button.innerHTML = '<i class="fa fa-angle-double-right"></i>';
        button.classList.add('custom-page-nav-button');
        button.onclick = function() {
            const pageNumber = prompt('Enter the page number:');
            if (pageNumber !== null) {
                const parsedPageNumber = parseInt(pageNumber, 10);
                if (!isNaN(parsedPageNumber) && parsedPageNumber > 0) {
                    goToPage(threadId, parsedPageNumber);
                } else {
                    alert('Invalid page number. Please enter a valid positive integer.');
                }
            }
        };

        button.style.padding = '6px';
        button.style.border = '1px solid #ccc';
        button.style.backgroundColor = '#f9f9f9';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        pageNavContainer.appendChild(button);
    }

    // Set up an interval to check for the page navigation container
    const intervalId = setInterval(checkPageNavContainer, 1000);
})();
