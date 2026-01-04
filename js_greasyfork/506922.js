// ==UserScript==
// @name         Age Converter
// @description  Converts age in days to years, months, and days format with enhanced styling on Torn.com.
// @version      2.0
// @namespace    https://github.com/skillerious
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506922/Age%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/506922/Age%20Converter.meta.js
// ==/UserScript==

// JavaScript to dynamically add CSS to the document
const style = document.createElement('style');
style.textContent = `
  .cont.bottom-round.cont-gray {
      min-height: 420px; /* Further increase height to accommodate more content */
      padding-bottom: 20px; /* Add more padding at the bottom */
  }
  .cool-converted-age {
      font-size: 11px; /* Set the font size */
      color: #0092CD; /* Blue color */
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); /* Adds a shadow effect */
      text-align: center;
      margin-top: 10px;
      font-family: 'Arial', sans-serif; /* Use a modern font */
      letter-spacing: 1px; /* Space out the letters a bit */
  }
`;
document.head.appendChild(style);

// Function to calculate and display converted age
function convertAndDisplayAge() {
    const digitElements = document.querySelectorAll('.box-info.age .box-value .digit');
    console.log('Digit Elements:', digitElements); // Log the elements to check if they are correctly selected

    if (digitElements && digitElements.length > 0) {
        let ageInDaysStr = '';
        digitElements.forEach(digitElement => {
            const digitText = digitElement.textContent.trim();
            console.log('Digit Text:', digitText); // Log each digit text
            ageInDaysStr += digitText;
        });

        console.log('Age in Days String:', ageInDaysStr); // Log the concatenated string
        const ageInDays = parseInt(ageInDaysStr);

        if (!isNaN(ageInDays)) {
            const years = Math.floor(ageInDays / 365);
            const months = Math.floor((ageInDays % 365) / 30);
            const days = ageInDays % 30;

            console.log(`Converted Age: Y: ${years}, M: ${months}, D: ${days}`); // Log the converted age

            const ageConverted = document.createElement('div');
            ageConverted.className = 'cool-converted-age'; // Apply the new CSS class for cool styling
            ageConverted.textContent = `${years} Years, ${months} Months, ${days} Days`;

            const ageContainer = document.querySelector('.box-info.age');
            if (ageContainer) {
                ageContainer.appendChild(ageConverted);
                console.log('Age converted element added to the container'); // Confirm the addition
            } else {
                console.error('Age container not found'); // Log error if container is not found
            }
        } else {
            console.error('Unable to parse age from text content'); // Log error if parsing fails
        }
    } else {
        console.error('Age digit elements not found'); // Log error if elements are not found
    }
}

// Function to observe changes in the DOM and run the script when the elements are loaded
function observeDOMChanges() {
    const observer = new MutationObserver((mutationsList, observer) => {
        const ageContainer = document.querySelector('.box-info.age');
        const digitElements = document.querySelectorAll('.box-info.age .box-value .digit');
        
        if (ageContainer && digitElements.length > 0) {
            observer.disconnect(); // Stop observing once the elements are found
            convertAndDisplayAge(); // Call the function to convert and display age
        } else {
            console.log('Waiting for age container and digits to appear...');
        }
    });

    // Observe changes in the document body
    observer.observe(document.body, { childList: true, subtree: true });
}

// Start observing the DOM changes once the page is loaded
window.addEventListener('load', function () {
    observeDOMChanges();
});
