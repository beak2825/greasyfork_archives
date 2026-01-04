// ==UserScript==
// @name         Advanced YouTube Search
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Enhance YouTube search with both regular and advanced parameters like exact terms, exclusions, title includes, video length, and date range.
// @author       bitgineer https://github.com/bitgineer
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520195/Advanced%20YouTube%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/520195/Advanced%20YouTube%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait until the YouTube page is fully loaded
    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations, me) => {
            const element = document.querySelector(selector);
            if (element) {
                me.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Mapping for video length to 'sp' parameter
    const videoLengthOptions = {
        "any": "",
        "short": "EgIYAQ%253D%253D",      // Under 4 minutes
        "medium": "EgIYAw%253D%253D",     // 4-20 minutes
        "long": "EgIYAg%253D%253D"        // Over 20 minutes
    };

    // Create and inject the toggle button and advanced search popup
    function injectAdvancedSearchPopup() {
        // Create toggle button
        const toggleButton = document.createElement('button');
        toggleButton.innerText = '🔍 Advanced Search';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '20px';
        toggleButton.style.right = '20px';
        toggleButton.style.zIndex = '1000';
        toggleButton.style.padding = '10px 15px';
        toggleButton.style.backgroundColor = '#FF0000';
        toggleButton.style.color = '#fff';
        toggleButton.style.border = 'none';
        toggleButton.style.borderRadius = '4px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        toggleButton.style.fontSize = '14px';
        toggleButton.style.fontWeight = 'bold';
        toggleButton.title = 'Toggle Advanced YouTube Search';

        document.body.appendChild(toggleButton);

        // Create the popup container
        const popupDiv = document.createElement('div');
        popupDiv.id = 'advancedSearchPopup';
        popupDiv.style.position = 'fixed';
        popupDiv.style.top = '100px';
        popupDiv.style.left = '50%';
        popupDiv.style.transform = 'translateX(-50%)';
        popupDiv.style.width = '450px';
        popupDiv.style.backgroundColor = '#f9f9f9';
        popupDiv.style.border = '1px solid #ccc';
        popupDiv.style.borderRadius = '8px';
        popupDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
        popupDiv.style.padding = '0';
        popupDiv.style.zIndex = '1001';
        popupDiv.style.display = 'none'; // Initially hidden
        popupDiv.style.cursor = 'default';

        // Create the popup header for dragging
        const popupHeader = document.createElement('div');
        popupHeader.style.backgroundColor = '#FF0000';
        popupHeader.style.color = '#fff';
        popupHeader.style.padding = '10px';
        popupHeader.style.cursor = 'move';
        popupHeader.style.borderTopLeftRadius = '8px';
        popupHeader.style.borderTopRightRadius = '8px';
        popupHeader.style.fontSize = '16px';
        popupHeader.style.fontWeight = 'bold';
        popupHeader.innerText = 'Advanced YouTube Search';

        popupDiv.appendChild(popupHeader);

        // Create the form container
        const formContainer = document.createElement('div');
        formContainer.style.padding = '15px';
        popupDiv.appendChild(formContainer);

        // Create form element
        const form = document.createElement('form');

        // Helper function to create form fields
        function createField(labelText, inputType, inputName, placeholder='', options=[]) {
            const div = document.createElement('div');
            div.style.marginBottom = '12px';

            const label = document.createElement('label');
            label.innerText = labelText;
            label.htmlFor = inputName;
            label.style.display = 'block';
            label.style.marginBottom = '6px';
            label.style.fontWeight = 'bold';

            let input;
            if (inputType === 'select') {
                input = document.createElement('select');
                input.name = inputName;
                input.id = inputName;

                // Add options based on select options provided
                options.forEach(option => {
                    const opt = document.createElement('option');
                    opt.value = option.value;
                    opt.text = option.text;
                    input.appendChild(opt);
                });
            } else if (inputType === 'date') {
                input = document.createElement('input');
                input.type = 'date';
                input.name = inputName;
                input.id = inputName;
            } else {
                input = document.createElement('input');
                input.type = inputType;
                input.name = inputName;
                input.id = inputName;
                input.placeholder = placeholder;
            }

            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.boxSizing = 'border-box';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';

            div.appendChild(label);
            div.appendChild(input);
            return div;
        }

        // === Regular Search Section ===
        const regularSearchSection = document.createElement('div');
        regularSearchSection.style.marginBottom = '20px';

        const regularSearchTitle = document.createElement('h3');
        regularSearchTitle.innerText = 'Regular Search';
        regularSearchTitle.style.marginTop = '0';
        regularSearchTitle.style.marginBottom = '10px';
        regularSearchTitle.style.fontSize = '18px';
        regularSearchTitle.style.color = '#333';

        regularSearchSection.appendChild(regularSearchTitle);

        const regularSearchInput = createField('Search:', 'text', 'regularSearch', 'e.g., funny cats');

        regularSearchSection.appendChild(regularSearchInput);

        form.appendChild(regularSearchSection);

        // === Advanced Search Section ===
        const advancedSearchSection = document.createElement('div');

        const advancedSearchTitle = document.createElement('h3');
        advancedSearchTitle.innerText = 'Advanced Options';
        advancedSearchTitle.style.marginTop = '0';
        advancedSearchTitle.style.marginBottom = '10px';
        advancedSearchTitle.style.fontSize = '18px';
        advancedSearchTitle.style.color = '#333';

        advancedSearchSection.appendChild(advancedSearchTitle);

        // Exact Term
        advancedSearchSection.appendChild(createField('Exact Term:', 'text', 'exactTerm', 'e.g., "Awesome List"'));

        // Exclude Term
        advancedSearchSection.appendChild(createField('Exclude Term(s):', 'text', 'excludeTerms', 'e.g., spam, ads'));

        // Title Includes
        advancedSearchSection.appendChild(createField('Title Includes:', 'text', 'titleIncludes', 'e.g., tutorial'));

        // Video Length
        advancedSearchSection.appendChild(createField('Video Length:', 'select', 'videoLength', '', [
            {value: 'any', text: 'Any Length'},
            {value: 'short', text: 'Under 4 minutes'},
            {value: 'medium', text: '4-20 minutes'},
            {value: 'long', text: 'Over 20 minutes'}
        ]));

        // Date After
        advancedSearchSection.appendChild(createField('Date After:', 'date', 'dateAfter'));

        // Date Before
        advancedSearchSection.appendChild(createField('Date Before:', 'date', 'dateBefore'));

        form.appendChild(advancedSearchSection);

        // Submit Button
        const submitBtn = document.createElement('button');
        submitBtn.type = 'submit';
        submitBtn.innerText = 'Search';
        submitBtn.style.padding = '10px 20px';
        submitBtn.style.backgroundColor = '#FF0000';
        submitBtn.style.color = '#fff';
        submitBtn.style.border = 'none';
        submitBtn.style.borderRadius = '4px';
        submitBtn.style.cursor = 'pointer';
        submitBtn.style.fontSize = '16px';
        submitBtn.style.fontWeight = 'bold';
        submitBtn.style.width = '100%';
        submitBtn.style.marginTop = '10px';

        form.appendChild(submitBtn);

        // Handle form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form values
            const regularSearch = document.getElementById('regularSearch').value.trim();
            const exactTerm = document.getElementById('exactTerm').value.trim();
            const excludeTerms = document.getElementById('excludeTerms').value.trim();
            const titleIncludes = document.getElementById('titleIncludes').value.trim();
            const videoLength = document.getElementById('videoLength').value;
            const dateAfter = document.getElementById('dateAfter').value;
            const dateBefore = document.getElementById('dateBefore').value;

            let query = '';

            // Add regular search term
            if (regularSearch) {
                query += `${regularSearch}`;
            }

            // Add exact term
            if (exactTerm) {
                if (query.length > 0) query += ' ';
                query += `"${exactTerm}"`;
            }

            // Add exclude terms
            if (excludeTerms) {
                const excludes = excludeTerms.split(',').map(term => term.trim()).filter(term => term);
                excludes.forEach(term => {
                    query += ` -${term}`;
                });
            }

            // Add title includes
            if (titleIncludes) {
                const titles = titleIncludes.split(',').map(term => term.trim()).filter(term => term);
                titles.forEach(term => {
                    query += ` intitle:${term}`;
                });
            }

            // Add date filters
            if (dateAfter) {
                query += ` after:${dateAfter}`;
            }
            if (dateBefore) {
                query += ` before:${dateBefore}`;
            }

            // Encode the query
            const encodedQuery = encodeURIComponent(query.trim());

            // Construct the search URL
            let searchURL = `https://www.youtube.com/results?search_query=${encodedQuery}`;

            // Add video length filter if not 'any'
            if (videoLength !== 'any') {
                searchURL += `&sp=${videoLengthOptions[videoLength]}`;
            }

            // Redirect to the constructed search URL
            window.location.href = searchURL;
        });

        formContainer.appendChild(form);
        popupDiv.appendChild(formContainer);
        document.body.appendChild(popupDiv);

        // Toggle button functionality
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent event from bubbling up
            if (popupDiv.style.display === 'none') {
                popupDiv.style.display = 'block';
            } else {
                popupDiv.style.display = 'none';
            }
        });

        // Prevent popup click from closing when clicking inside
        popupDiv.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Implement dragging functionality
        let isDragging = false;
        let offsetX, offsetY;

        popupHeader.addEventListener('mousedown', (e) => {
            isDragging = true;
            const rect = popupDiv.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            if (isDragging) {
                let newLeft = e.clientX - offsetX;
                let newTop = e.clientY - offsetY;

                // Ensure the popup stays within the viewport
                const popupWidth = popupDiv.offsetWidth;
                const popupHeight = popupDiv.offsetHeight;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + popupWidth > windowWidth) newLeft = windowWidth - popupWidth;
                if (newTop + popupHeight > windowHeight) newTop = windowHeight - popupHeight;

                popupDiv.style.left = `${newLeft}px`;
                popupDiv.style.top = `${newTop}px`;
                popupDiv.style.transform = 'none'; // Disable transform when dragging
            }
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        // Optional: Close popup when clicking outside of it
        document.addEventListener('click', function(event) {
            if (!popupDiv.contains(event.target) && event.target !== toggleButton) {
                popupDiv.style.display = 'none';
            }
        });

    }

    // Initialize the script by injecting the popup
    waitForElement('body', function() {
        injectAdvancedSearchPopup();
    });

})();
