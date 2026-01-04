// ==UserScript==
// @name         GraphicEx More Pages
// @namespace    https://greasyfork.org/en/users/781396-yad
// @version      1.8
// @description  Allows users to control the number of pages shown in pagination on graphicex.com
// @author       YAD
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxsA3xubmAnVbFJqEgajTJW0kIy7UzO9UEcA&s
// @match        https://graphicex.com/*
// @license      NO-REDISTRIBUTION
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505508/GraphicEx%20More%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/505508/GraphicEx%20More%20Pages.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const PAGINATION_KEY = 'graphicexCurrentPage';
    let currentPage = parseInt(localStorage.getItem(PAGINATION_KEY)) || 1;

    // Function to update pagination
    function updatePagination(totalPages) {
        const navigationDiv = document.querySelector('.navigation.ignore-select');
        if (!navigationDiv) return;

        // Clear existing page links (keep the first span element which indicates the current page)
        const existingLinks = Array.from(navigationDiv.children).filter(child => child.tagName === 'A' || (child.tagName === 'SPAN' && child !== navigationDiv.firstElementChild));
        existingLinks.forEach(link => link.remove());

        // Add new page links
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                const currentPageSpan = document.createElement('span');
                currentPageSpan.textContent = i;
                currentPageSpan.classList.add('active');
                navigationDiv.insertBefore(currentPageSpan, navigationDiv.querySelector('#nextlink'));
            } else {
                const pageLink = document.createElement('a');
                pageLink.href = "#";
                pageLink.textContent = i;
                pageLink.onclick = (function(page) {
                    return function() {
                        currentPage = page; // Update current page
                        localStorage.setItem(PAGINATION_KEY, currentPage); // Save current page to localStorage
                        list_submit(page);
                        return false;
                    };
                })(i);
                navigationDiv.insertBefore(pageLink, navigationDiv.querySelector('#nextlink'));
            }
        }
    }

    // Function to add input for the number of pages
    function addPageInput() {
        const navigationDiv = document.querySelector('.navigation.ignore-select');
        if (!navigationDiv) return;

        const savedTotalPages = localStorage.getItem('graphicexTotalPages') || 10;

        const label = document.createElement('label');
        label.textContent = 'Show pages:';
        label.style.marginLeft = '10px';

        const input = document.createElement('input');
        input.type = 'number';
        input.min = 1;
        input.style.width = '50px';
        input.style.marginLeft = '5px';
        input.value = savedTotalPages;  // Load saved value

        input.addEventListener('change', function() {
            const totalPages = parseInt(input.value);
            if (totalPages >= 1) {
                localStorage.setItem('graphicexTotalPages', totalPages);  // Save the value
                updatePagination(totalPages);
            }
        });

        navigationDiv.appendChild(label);
        navigationDiv.appendChild(input);

        updatePagination(savedTotalPages);  // Initialize with saved or default pages
    }

    // Wait for the page to load and then add the input field and update pagination
    window.addEventListener('load', function() {
        addPageInput();
    });
})();
