// ==UserScript==
// @name         Extract LeetCode Question Topics
// @namespace    http://tampermonkey.net/
// @version      2024-02-22
// @description  Extract the Topics of a LeetCode question as a string
// @author       NeraSnow
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488045/Extract%20LeetCode%20Question%20Topics.user.js
// @updateURL https://update.greasyfork.org/scripts/488045/Extract%20LeetCode%20Question%20Topics.meta.js
// ==/UserScript==

// Function to get the text content of <a> elements inside the specified <div>
function getTextContent() {
  // Select the div element
  const divElement = document.querySelector('.mt-2.flex.gap-1.pl-7');

  // Select all the <a> elements inside the div
  const aElements = divElement.querySelectorAll('a');

  // Create an array to store the text content of each <a> element
  const textArray = [];

  // Iterate over each <a> element and store its text content in the array
  aElements.forEach((a) => {
    textArray.push(`"${a.textContent}"`);
  });

  // Log the array to the console (you can do other things with the array here)
  copyToClipboard(`"topic": [${textArray}]`,)
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text successfully copied to clipboard');
    })
    .catch((err) => {
      console.error('Unable to copy text to clipboard', err);
    });
}

// Create a button element
const buttonElement = document.createElement('button');
buttonElement.textContent = 'Get Topics';

// Add an onClick event listener to the button, linking it to the getTextContent function
buttonElement.addEventListener('click', getTextContent);


// Add styles to make the button a floating element
buttonElement.style.position = 'fixed';
buttonElement.style.top = '13px'; // Adjust the top position as needed
buttonElement.style.right = '450px'; // Adjust the right position as needed
buttonElement.style.zIndex = '9999'; // Ensure it's on top of other elements
buttonElement.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // 50% transparent white background

// Add an onClick event listener to the button, linking it to the getTextContent function
buttonElement.addEventListener('click', getTextContent);


function doStuff() {
    // Select the div with the specified class
    // const targetDivElement = document.querySelector('.relative.ml-4.flex.items-center.gap-2');
    // console.log(targetDivElement);
    // Prepend the button to the selected div
    document.body.prepend(buttonElement);
}

doStuff();

