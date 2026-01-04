// ==UserScript==
// @name         Histologi slides tilfældig (Astas program)
// @namespace    http://tampermonkey.net/
// @version      2.6
// @author       You
// @description  histologiquiz. Har fjernet beskrivelse på viseren.
// @match        https://histoviewer.biomed.au.dk/Histo/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=au.dk
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/468686/Histologi%20slides%20tilf%C3%A6ldig%20%28Astas%20program%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468686/Histologi%20slides%20tilf%C3%A6ldig%20%28Astas%20program%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Your URL
    var url = window.location.href;

// Specify the suffix you want to check for
    var specificSuffix = "mobile.php";

// Check if the URL ends with the specific suffix
    if (url.includes(specificSuffix)) {
    // Load the content here
    // This code block will only execute if the URL ends with the specified suffix

    // Create the button element
    const button = document.createElement('button');
    button.textContent = 'ASTAS PASTA (MAN VED ALDRIG HVAD MAN FÅR)';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.right = '10px';
    button.style.width = '400px'; // Set the width to 300 pixels
    button.style.zIndex = '9999';

    // Create the input field and submit button
    var inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.style.position = 'fixed';
    inputField.style.top = '30px';
    inputField.style.right = '70px';
    inputField.style.zIndex = '9999';
    inputField.style.width = '340px'; // Set the width to 300 pixels
    inputField.placeholder = 'Indsæt link på dit præparat du vil se svar til';



    var submitBtn = document.createElement('button');
    submitBtn.style.position = 'fixed';
    submitBtn.style.top = '30px';
    submitBtn.style.right = '10px';
    submitBtn.style.zIndex = '9999';
    submitBtn.innerText = 'Se svar';
    submitBtn.addEventListener('click', extractElementText);

    var container = document.createElement('div');
    container.appendChild(inputField);
    container.appendChild(submitBtn);

    // Add the container to the page
    document.body.insertBefore(container, document.body.firstChild);

    // Function to extract element text
    function extractElementText() {

        const string = inputField.value;

        const tableMatch = string.match(/table=([^&]*)/);
        const mysqlidMatch = string.match(/mysqlid=([^&]*)/);

        const table = tableMatch ? tableMatch[1] : null;
        const mysqlid = mysqlidMatch ? mysqlidMatch[1] : null;


        // Find the table element based on table name and ID
        var element = document.querySelector('article[table="' + table + '"][tableid="' + mysqlid + '"]');

        // Check if the element exists
        if (element) {
            // Display the element text in an alert
            alert(element.innerText);

        } else {
            alert('Table element not found.');
        }
    }
    // Function to be executed when the button is clicked
    function executeScript() {




        const list = [9, 11, 12, 13, 16, 18, 23, 24, 26, 29, 31, 35, 36, 37, 38, 40, 41, 42, 44, 45, 46, 47, 50, 52, 53, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 73, 74, 75, 77, 78, 80, 81, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 92, 93, 97, 98, 99];

        // Get all elements with the role "complementary" and are in either the "auhisto" or "auhisto2" table
        const elements = Array.from(document.querySelectorAll('[role="complementary"][table="auhisto"], [role="complementary"][table="auhisto2"]'));

        // Filter elements that contain a number from the list in their title
        const filteredElements = elements.filter((element) => {
            const title = element.innerText;
            const number = parseInt(title.split(' ')[0]); // Assuming the number is at the beginning of the title
            return list.includes(number);
        });

        // Generate a random index within the range of the filtered elements' length
        const randomIndex = Math.floor(Math.random() * filteredElements.length);

        // Retrieve the randomly selected element from the filtered elements
        const randomElement = filteredElements[randomIndex];

        const targetElement = Array.from(document.getElementsByTagName('article')).find(
            (element) => element.innerText.includes(randomElement.innerText)
        );

        if (targetElement) {
            // Simulate a click on the element
            targetElement.click();
        } else {
            console.log("Der er sket en fejl Asta");
        }
    }

    // Add event listener to the button
    button.addEventListener('click', executeScript);

    // Append the button to the document body
    document.body.appendChild(button);
    console.log("Loading the content for the URL ending with '" + specificSuffix + "'");
    } else {

        var buttonscentElement = document.getElementById("buttonscent");
    if (buttonscentElement) {
        buttonscentElement.remove();
        console.log("Removed the element with id 'buttonscent'");
    }
        // URL doesn't end with the specific suffix
        console.log("URL does not end with '" + specificSuffix + "', so not loading the content.");
    }


})();