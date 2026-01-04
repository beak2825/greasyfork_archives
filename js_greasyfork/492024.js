// ==UserScript==
// @name         Company Name Extractor with Block List (Enhanced)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Extract and manage company names from job listings on LinkedIn job search, with immediate blocking and interactive UI for managing blocked companies.
// @author       Daniel Gleason
// @match        https://www.linkedin.com/jobs/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/awesomplete/1.1.2/awesomplete.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492024/Company%20Name%20Extractor%20with%20Block%20List%20%28Enhanced%29.user.js
// @updateURL https://update.greasyfork.org/scripts/492024/Company%20Name%20Extractor%20with%20Block%20List%20%28Enhanced%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isUIOpen = false; // Flag to track if UI is already open
    let modalContent; // Reference to the modal content

    // Function to extract and handle job postings based on company block list
    function handleJobPostings() {
        const jobPostings = document.querySelectorAll('div[data-job-id]');

        jobPostings.forEach(jobPosting => {
            const companyNameElement = jobPosting.querySelector('span.job-card-container__primary-description');
            if (companyNameElement) {
                const companyName = companyNameElement.innerText.trim();
                if (isCompanyBlocked(companyName)) {
                    // Company is blocked, remove the job posting div
                    jobPosting.remove();
                }
            }
        });
    }

    // Function to check if a company is blocked
    function isCompanyBlocked(companyName) {
        const blockedCompanies = getBlockedCompanies();
        return blockedCompanies.includes(companyName);
    }

    // Function to retrieve blocked companies from storage
    function getBlockedCompanies() {
        const blockedCompaniesJSON = GM_getValue('blockedCompanies', '[]');
        return JSON.parse(blockedCompaniesJSON);
    }

    // Function to save blocked companies to storage
    function saveBlockedCompanies(blockedCompanies) {
        const blockedCompaniesJSON = JSON.stringify(blockedCompanies);
        GM_setValue('blockedCompanies', blockedCompaniesJSON);
    }

    // Function to add a company to block list
    function addCompanyToBlockList(companyName) {
        let blockedCompanies = getBlockedCompanies();
        blockedCompanies.push(companyName.trim());
        saveBlockedCompanies(blockedCompanies);

        // Immediately remove job postings for the newly blocked company
        const jobPostings = document.querySelectorAll('div[data-job-id]');
        jobPostings.forEach(jobPosting => {
            const companyNameElement = jobPosting.querySelector('span.job-card-container__primary-description');
            if (companyNameElement) {
                const postingCompanyName = companyNameElement.innerText.trim();
                if (postingCompanyName === companyName.trim()) {
                    jobPosting.remove(); // Remove the job posting
                }
            }
        });

        updateBlockedCompaniesTable(); // Update table after adding a new company
    }

    // Function to remove a company from block list
    function removeCompanyFromBlockList(companyName) {
        let blockedCompanies = getBlockedCompanies();
        const index = blockedCompanies.indexOf(companyName.trim());
        if (index !== -1) {
            blockedCompanies.splice(index, 1);
            saveBlockedCompanies(blockedCompanies);
            updateBlockedCompaniesTable(); // Update table after removing a company
        }
    }

    // Function to update the displayed table of blocked companies
    function updateBlockedCompaniesTable() {
        const table = document.getElementById('blockedCompaniesTable');
        if (!table) return;

        const blockedCompanies = getBlockedCompanies();

        // Clear existing table rows
        table.innerHTML = '';

        // Add rows for each blocked company
        blockedCompanies.forEach(companyName => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            nameCell.textContent = companyName;

            const actionCell = row.insertCell();
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.style.color = 'red';
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', () => {
                removeCompanyFromBlockList(companyName);
            });
            actionCell.appendChild(removeButton);
        });
    }

    // Function to display the blocked companies UI
    function displayBlockedCompaniesUI() {
        if (isUIOpen) {
            return; // Prevent opening UI more than once
        }

        const blockedCompanies = getBlockedCompanies();

        // Create a table to display blocked companies
        const table = document.createElement('table');
        table.id = 'blockedCompaniesTable'; // Set table id for easy access
        table.style.borderCollapse = 'collapse';
        table.style.marginTop = '20px';

        // Add header row
        const headerRow = table.insertRow();
        const nameHeader = headerRow.insertCell();
        nameHeader.textContent = 'Company Name';
        const actionHeader = headerRow.insertCell();
        actionHeader.textContent = 'Action';

        // Add rows for each blocked company
        blockedCompanies.forEach(companyName => {
            const row = table.insertRow();
            const nameCell = row.insertCell();
            nameCell.textContent = companyName;

            const actionCell = row.insertCell();
            const removeButton = document.createElement('button');
            removeButton.textContent = 'X';
            removeButton.style.color = 'red';
            removeButton.style.cursor = 'pointer';
            removeButton.addEventListener('click', () => {
                removeCompanyFromBlockList(companyName);
            });
            actionCell.appendChild(removeButton);
        });

        // Create input field for adding new company to block list
        const inputContainer = document.createElement('div');
        inputContainer.style.marginTop = '10px';
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';

        const addCompanyInput = document.createElement('input');
        addCompanyInput.placeholder = 'Enter company name';
        addCompanyInput.style.marginRight = '10px';
        inputContainer.appendChild(addCompanyInput);

        const addButton = document.createElement('button');
        addButton.textContent = 'Add to Block List';
        addButton.style.cursor = 'pointer';
        addButton.style.backgroundColor = '#007bff'; // Blue background color
        addButton.style.color = 'white'; // White text color
        addButton.style.border = 'none'; // No border
        addButton.style.borderRadius = '4px'; // Rounded corners
        addButton.style.padding = '8px 16px'; // Padding
        addButton.addEventListener('click', () => {
            const newCompanyName = addCompanyInput.value.trim();
            if (newCompanyName !== '') {
                addCompanyToBlockList(newCompanyName);
                addCompanyInput.value = ''; // Clear input field
            }
        });
        inputContainer.appendChild(addButton);

        // Display the table and input field in a modal
        modalContent = document.createElement('div');
        modalContent.style.position = 'fixed';
        modalContent.style.top = '50px';
        modalContent.style.left = '50px';
        modalContent.style.padding = '20px';
        modalContent.style.backgroundColor = 'white';
        modalContent.style.border = '1px solid black';
        modalContent.style.zIndex = '9999';
        modalContent.style.cursor = 'move'; // Make the modal draggable

        modalContent.appendChild(table);
        modalContent.appendChild(inputContainer);

        // Add close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.cursor = 'pointer';
        closeButton.style.backgroundColor = '#dc3545'; // Red background color
        closeButton.style.color = 'white'; // White text color
        closeButton.style.border = 'none'; // No border
        closeButton.style.borderRadius = '4px'; // Rounded corners
        closeButton.style.padding = '8px 16px'; // Padding
        closeButton.addEventListener('click', () => {
            modalContent.remove();
            isUIOpen = false; // Reset flag when UI is closed
        });
        modalContent.appendChild(closeButton);

        document.body.appendChild(modalContent);

        isUIOpen = true; // Set flag to indicate UI is open

        // Make the modal draggable
        let isDragging = false;
        let offsetX, offsetY;

        modalContent.addEventListener('mousedown', startDrag);
        modalContent.addEventListener('mouseup', endDrag);

        function startDrag(e) {
            isDragging = true;
            offsetX = e.clientX - modalContent.getBoundingClientRect().left;
            offsetY = e.clientY - modalContent.getBoundingClientRect().top;
        }

        function endDrag() {
            isDragging = false;
        }

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                modalContent.style.left = `${e.clientX - offsetX}px`;
                modalContent.style.top = `${e.clientY - offsetY}px`;
            }
        });

        // Initialize Awesomplete autocomplete for input field
        const awesomplete = new Awesomplete(addCompanyInput, {
            list: getUniqueCompanyNames(), // Autocomplete with unique company names
        });

        // Handle Enter key press to add company to block list
        addCompanyInput.addEventListener('keydown', event => {
            if (event.keyCode === 13) {
                event.preventDefault();
                const newCompanyName = addCompanyInput.value.trim();
                if (newCompanyName !== '') {
                    addCompanyToBlockList(newCompanyName);
                    addCompanyInput.value = ''; // Clear input field
                }
            }
        });
    }

    // Function to get unique company names from job postings
    function getUniqueCompanyNames() {
        const jobPostings = document.querySelectorAll('span.job-card-container__primary-description');
        const companyNames = new Set();

        jobPostings.forEach(companyNameElement => {
            const companyName = companyNameElement.innerText.trim();
            companyNames.add(companyName);
        });

        return Array.from(companyNames);
    }

    // Add button to display blocked companies UI
    const showBlockedCompaniesButton = document.createElement('button');
    showBlockedCompaniesButton.textContent = 'View Blocked Companies';
    showBlockedCompaniesButton.style.position = 'fixed';
    showBlockedCompaniesButton.style.top = '20px';
    showBlockedCompaniesButton.style.right = '20px';
    showBlockedCompaniesButton.style.zIndex = '9999';
    showBlockedCompaniesButton.style.backgroundColor = '#28a745'; // Green background color
    showBlockedCompaniesButton.style.color = 'white'; // White text color
    showBlockedCompaniesButton.style.border = 'none'; // No border
    showBlockedCompaniesButton.style.borderRadius = '4px'; // Rounded corners
    showBlockedCompaniesButton.style.padding = '8px 16px'; // Padding
    showBlockedCompaniesButton.style.cursor = 'pointer';
    showBlockedCompaniesButton.addEventListener('click', displayBlockedCompaniesUI);
    document.body.appendChild(showBlockedCompaniesButton);

    // Immediately block any existing job postings for companies in the block list
    handleJobPostings();

})();
