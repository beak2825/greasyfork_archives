// ==UserScript==
// @name         CAF Entry
// @namespace    http://tampermonkey.net/
// @version      2025-04-04
// @description  Its Own and My Personal Use Only
// @license      MIT
// @author       You
// @match        https://tactv.in/TACTV/index.php?pgname=caf_form_entry
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tactv.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532065/CAF%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/532065/CAF%20Entry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of Tamil subscriber names (in uppercase)
    const tamilSubscriberNames = [
        'ARUN KUMAR', 'RAVI SHANKAR', 'KARTHIK RAJ', 'PRADEEP RAJAN', 'VIGNESHWARAN',
        'SANTHOSH KUMAR', 'SENTHIL KUMAR', 'HARISH KUMAR', 'NANDHAKUMAR', 'MURUGAN',
        'MANIKANDAN', 'PRABHU', 'VELMURUGAN', 'ANAND RAJ', 'SIVAKUMAR',
        'VENKATRAJ', 'AJITH KUMAR', 'KUMARAVEL', 'RAGHAVAN', 'DHANASEKAR',
        'KALAIARASAN', 'VELLAIYAPPAN', 'SURESH KUMAR', 'RAMESH KUMAR', 'KALAI VENDAN',
        'PRIYA DEVI', 'KAVITHA RAJ', 'ANJALI RANI', 'SNEHA KARTHIKA', 'LAKSHMI PRIYA',
        'MEERA SURESH', 'SHRUTHI DEVI', 'NANDHINI RAJAN', 'AISHWARYA SIVA', 'DIVYA SHREE',
        'JAYALAKSHMI', 'SINDHUJA', 'UMA MAHESHWARI', 'RATHIKA', 'NITHYA',
        'JANANI', 'VIJAYALAKSHMI', 'MALARVIZHI', 'MANJULA', 'RUKMINI',
        'KALAI SELVI', 'VIDHYA SREE', 'PAVITHRA', 'DEEPA PRIYA', 'SHANMUGA PRIYA'
    ];

    // Function to generate a random number between min and max
    function getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Function to generate a random mobile number starting with 9 or 10
    function generateRandomMobile() {
        const number = '9' + Math.floor(Math.random() * 1000000000).toString().padStart(9, '0');
        return number;
    }

    // Function to generate a random 12-digit Aadhaar number
    function generateRandomAadhaar() {
        return Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0');
    }

    // Auto-fill the form fields
    function autoFillForm() {
        const randomName = tamilSubscriberNames[Math.floor(Math.random() * tamilSubscriberNames.length)];
        document.getElementById('cust_name').value = randomName;

        // Type Of Customer: Auto select Residential
        document.getElementById('type_of_customer').value = '1';  // 1 is for Residential

        // Gender: Default to Male
        document.querySelector('input[name="gender"][value="1"]').checked = true; // Male

        // Date of Birth: Random between 25 to 60 years old
        const currentYear = new Date().getFullYear();
        const randomYear = getRandomNumber(currentYear - 60, currentYear - 25);
        const randomMonth = getRandomNumber(1, 12);
        const randomDay = getRandomNumber(1, 28); // Avoiding issues with months having fewer than 31 days
        const dob = `${randomDay.toString().padStart(2, '0')}-${randomMonth.toString().padStart(2, '0')}-${randomYear}`;
        document.getElementById('dob').value = dob;

        // Mobile: Random number starting with 9 or 10 and 10 digits long
        document.getElementById('mobile_no').value = generateRandomMobile();

        // Aadhaar No: Random 12-digit number
        document.getElementById('aadhaar_no').value = generateRandomAadhaar();

        // Door No: Random 2-digit number
        document.getElementById('door_no').value = getRandomNumber(10, 99);

        // Street Name: Fixed as "ANNA NAGAR"
        document.getElementById('street_name').value = 'INDIRA NAGAR';

        // Area Name: Fixed as "PONNAMMAPET"
        document.getElementById('area_name').value = 'MASINAYAKKANPATTI';

        // District: Fixed as "SALEM"
        document.getElementById('district').value = '7';  // Salem district ID (assumed from options)

        // STB Type: Default to HD
        document.getElementById('stb_type').value = '2'; // 2 is for HD Box

        // Pincode: Fixed as "636001"
        document.getElementById('pincode').value = '636103';
    }

    // Handle Enter key for submission
    function handleEnterKeySubmit(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action (form submission or page reload)
            const submitButton = document.querySelector('input[type="submit"], button[type="submit"]');
            if (submitButton) {
                submitButton.click(); // Trigger the submit button click
            }
        }
    }

    // Track submission count
    function updateEntryCount() {
        let entryCount = parseInt(localStorage.getItem('entryCount')) || 0; // Get current count or default to 0
        entryCount++; // Increment count
        localStorage.setItem('entryCount', entryCount); // Save the new count to localStorage
        displayEntryCount(entryCount); // Display the count on the page
    }

    // Display the entry count on the page
    function displayEntryCount(count) {
        let countDisplay = document.getElementById('entry-count-display');
        if (!countDisplay) {
            countDisplay = document.createElement('div');
            countDisplay.id = 'entry-count-display';
            countDisplay.style.position = 'fixed';
            countDisplay.style.top = '10px';
            countDisplay.style.left = '10px';
            countDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            countDisplay.style.color = 'white';
            countDisplay.style.padding = '10px';
            countDisplay.style.borderRadius = '5px';
            countDisplay.style.fontSize = '14px';
            countDisplay.style.cursor = 'pointer'; // Add cursor style to indicate clickable
            document.body.appendChild(countDisplay);
        }
        countDisplay.textContent = `Total Entries Submitted: ${count}`;

        // Add click event to clear the count
        countDisplay.addEventListener('click', () => {
            localStorage.setItem('entryCount', 0); // Reset count in localStorage
            displayEntryCount(0); // Update the display to show 0
        });
    }

    // Function to submit the next form if needed
    function submitNextForm() {
        let cafCount = parseInt(localStorage.getItem('cafCount')) || 0; // Get the count of CAFs left to submit
        if (cafCount > 0) {
            // Auto-fill the form
            autoFillForm();

            // Submit the form
            const submitButton = document.querySelector('input[type="submit"], button[type="submit"]');
            if (submitButton) {
                submitButton.click(); // Trigger the form submission

                // Decrement CAF count and update localStorage
                localStorage.setItem('cafCount', cafCount - 1);

                // Update the entry count
                updateEntryCount();
            }
        } else {
            alert('All CAFs have been submitted!');
        }
    }

    // Wait until the document is ready
    window.addEventListener('load', () => {
        // Check if the script is running on the correct page (if needed)
        const cafCount = parseInt(localStorage.getItem('cafCount')) || 0;

        if (cafCount > 0) {
            // Submit the next form
            submitNextForm();
        }

        // Create input field for Number of CAFs required
        const inputField = document.createElement('input');
        inputField.type = 'number';
        inputField.id = 'caf-count-input';
        inputField.placeholder = 'Required CAFs';
        inputField.style.position = 'fixed';
        inputField.style.top = '50px';
        inputField.style.left = '10px';
        inputField.style.padding = '10px';
        inputField.style.fontSize = '14px';
        inputField.style.borderRadius = '5px';
        inputField.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(inputField);

        // Create submit button for submitting the required number of CAFs
        const submitButton = document.createElement('button');
        submitButton.innerText = 'Start Submitting CAFs';
        submitButton.style.position = 'fixed';
        submitButton.style.top = '90px';
        submitButton.style.left = '10px';
        submitButton.style.padding = '10px';
        submitButton.style.fontSize = '14px';
        submitButton.style.borderRadius = '5px';
        submitButton.style.cursor = 'pointer';
        submitButton.style.fontFamily = 'Arial, sans-serif';
        document.body.appendChild(submitButton);

        // Event listener for the submit button
        submitButton.addEventListener('click', () => {
            const cafCount = parseInt(document.getElementById('caf-count-input').value);
            if (cafCount && cafCount > 0) {
                localStorage.setItem('cafCount', cafCount); // Save the required CAF count
                submitNextForm(); // Start submitting the first form
            } else {
                alert('Please enter a valid number of CAFs.');
            }
        });

        document.querySelectorAll('input, select, textarea').forEach((element) => {
            element.addEventListener('keypress', handleEnterKeySubmit);
        });

        // Display the entry count on page load (if any)
        const currentCount = parseInt(localStorage.getItem('entryCount')) || 0;
        displayEntryCount(currentCount);
    });

    // Focus on the Subscriber Name input field
    document.getElementById('cust_name').focus();
})();
