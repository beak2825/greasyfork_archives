// ==UserScript==
// @name         Useful Everyday Tools
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Simple everyday useful tools
// @author       CodePer
// @match        *://*/*
// @icon
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511677/Useful%20Everyday%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/511677/Useful%20Everyday%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

const divWrap123123 = document.createElement('div');
divWrap123123.style.cssText = 'position: fixed; top: 200px; right: 10px; z-index: 99999; background:white; padding:5px;';
document.body.appendChild(divWrap123123);
divWrap123123.innerHTML = `
    <div style="margin-bottom:5px; margin-top:5px;">
    <span id="openCalculator123123" style="cursor: pointer; opacity: 1; transition: opacity 0.3s; color:black;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calculator" viewBox="0 0 16 16">
            <path d="M12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            <path d="M4 2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5zm0 4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3-6a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z"/>
        </svg>
    </span>
    </div>
    <div style="margin-bottom:5px;">
    <span id="openNotes123123" style="cursor: pointer; opacity: 1; transition: opacity 0.3s; color:black;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-text" viewBox="0 0 16 16">
            <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"/>
            <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5M3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8m0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5"/>
        </svg>
    </span>
    </div>
`;

// Add event listener to show the calculator on click
document.getElementById('openCalculator123123').addEventListener('click', () => {
    const calculator = document.querySelector('.calculator');
    calculator.style.display = calculator.style.display === 'none' ? 'block' : 'none';
});

// Add hover effect for opacity
const openCalculator = document.getElementById('openCalculator123123');
openCalculator.addEventListener('mouseenter', () => {
    openCalculator.style.opacity = '0.7'; // Change opacity on hover
});

openCalculator.addEventListener('mouseleave', () => {
    openCalculator.style.opacity = '1'; // Reset opacity when not hovering
});

// Add hover effect for opacity
const openNotes = document.getElementById('openNotes123123');
openNotes.addEventListener('mouseenter', () => {
    openNotes.style.opacity = '0.7'; // Change opacity on hover
});

openNotes.addEventListener('mouseleave', () => {
    openNotes.style.opacity = '1'; // Reset opacity when not hovering
});

// Create the calculator HTML structure and style it
const calculatorDiv = document.createElement('div');
calculatorDiv.className = 'calculator';

// Style for the calculator using JS
calculatorDiv.style.cssText = `
    display: none; /* Start hidden */
    position: fixed;
    top: 10px;
    right: 50px;
    width: 250px;
    padding: 20px;
    background-color: #f1f1f1;
    border: 1px solid #ccc;
    z-index: 1000000;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    color: black;
    text-align:center;
`;

// Add close button for calculator
const closeButton = document.createElement('button');
closeButton.innerHTML = '&times;'; // HTML for close 'X'
closeButton.style.cssText = `
    position: absolute;
    top: 0px;
    right: 0px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
`;

// Add event listener to close the calculator
closeButton.addEventListener('click', () => {
    calculatorDiv.style.display = 'none';
});

// Append the close button to the calculatorDiv
calculatorDiv.appendChild(closeButton);

// Add buttons and display for the calculator
calculatorDiv.innerHTML += `
    <input type="text" id="calc-display" style="width: 100%; height: 40px; margin-bottom: 10px; text-align: right; color: black;" />
    <br/>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px;">
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('1')">1</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('2')">2</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('3')">3</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('4')">4</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('5')">5</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('6')">6</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('7')">7</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('8')">8</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('9')">9</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="clearDisplay()">C</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('0')">0</button>
        <button style="height: 40px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('.')">.</button>
    </div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px;">
        <button style="flex: 1; margin-right: 5px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('+')">+</button>
        <button style="flex: 1; margin-right: 5px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('-')">-</button>
        <button style="flex: 1; margin-right: 5px; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('*')">*</button>
        <button style="flex: 1; border: 1px solid #ccc; cursor:pointer;" onclick="pressKey('/')">/</button>
    </div>
    <button style="width: 100%; height: 40px; margin-top: 10px; border: 1px solid #ccc; cursor:pointer;" onclick="calculateResult()">=</button>
`;

// Append the calculator to the body
document.body.appendChild(calculatorDiv);

// Calculator functionality
let expression = '';

// Make the functions global
window.pressKey = function(key) {
    expression += key;
    document.getElementById('calc-display').value = expression;
}

window.calculateResult = function() {
    try {
        const result = eval(expression);
        document.getElementById('calc-display').value = result;
        expression = result.toString();
    } catch (error) {
        document.getElementById('calc-display').value = 'Error';
        expression = '';
    }
}

window.clearDisplay = function() {
    expression = '';
    document.getElementById('calc-display').value = '';
}

// Create the notes pad
const notesPadDiv = document.createElement('div');
notesPadDiv.className = 'notesPad';

// Style for the notes pad using JS
notesPadDiv.style.cssText = `
    display: none; /* Start hidden */
    position: fixed;
    bottom: 10px;
    right: 50px;
    width: 250px;
    padding:20px;
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    z-index: 1000000;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow:hidden;
`;

// Add close button for notes pad
const closeNotesButton = document.createElement('button');
closeNotesButton.innerHTML = '&times;'; // HTML for close 'X'
closeNotesButton.style.cssText = `
    position: absolute;
    top: 0px;
    right: 0px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #333;
`;

// Add event listener to close the notes pad
closeNotesButton.addEventListener('click', () => {
    notesPadDiv.style.display = 'none';
});

// Append the close button to the notesPadDiv
notesPadDiv.appendChild(closeNotesButton);

// Add text area for the notes pad
const notesArea = document.createElement('textarea');
notesArea.setAttribute("placeholder", "Website Notes..."); // Set the placeholder
notesArea.style.cssText = `
    width: 100%;
    height: 150px;
    margin-top: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: none; /* Disable resizing */
    color: black;
`;


// Load saved notes from localStorage
notesArea.value = localStorage.getItem('notes') || '';

// Save notes to localStorage on input change
notesArea.addEventListener('input', () => {
    localStorage.setItem('notes', notesArea.value);
});

// Append the text area to the notes pad
notesPadDiv.appendChild(notesArea);

// Append the notes pad to the body
document.body.appendChild(notesPadDiv);

// Add event listener to show the notes pad on click
document.getElementById('openNotes123123').addEventListener('click', () => {
    const notesPad = document.querySelector('.notesPad');
    notesPad.style.display = notesPad.style.display === 'none' ? 'block' : 'none';
});

// Append the close button to the calculatorDiv after all innerHTML is set
calculatorDiv.appendChild(closeButton);



})();