// ==UserScript==
// @name         Pop-Up
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a user input form to a webpage
// @author       Your Name
// @match        https://www.google.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469240/Pop-Up.user.js
// @updateURL https://update.greasyfork.org/scripts/469240/Pop-Up.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the form element
    const form = document.createElement('form');
    form.style.position = 'fixed';
    form.style.top = '50%';
    form.style.left = '50%';
    form.style.transform = 'translate(-50%, -50%)';
    form.style.backgroundColor = 'white';
    form.style.padding = '20px';
    form.style.border = '1px solid black';
    form.style.zIndex = '9999';

    // Create the first input field
    const input1 = document.createElement('input');
    input1.type = 'text';
    input1.placeholder = 'Enter Input 1';
    input1.style.marginBottom = '10px';
    const lineBreak1 = document.createElement('br');

    // Create the second input field
    const input2 = document.createElement('input');
    input2.type = 'text';
    input2.placeholder = 'Enter Input 2';
    input2.style.marginBottom = '10px';
    const lineBreak2 = document.createElement('br');

    // Create the third input field
    const input3 = document.createElement('input');
    input3.type = 'text';
    input3.placeholder = 'Enter Input 3';
    input3.style.marginBottom = '10px';
    const lineBreak3 = document.createElement('br');

    // Create a submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Submit';

    // Append input fields and button to the form
    form.appendChild(input1);
    form.appendChild(lineBreak1);
    form.appendChild(input2);
    form.appendChild(lineBreak2);
    form.appendChild(input3);
    form.appendChild(lineBreak3);
    form.appendChild(submitBtn);

    // Append the form to the body
    document.body.appendChild(form);

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        const input1Value = input1.value;
        const input2Value = input2.value;
        const input3Value = input3.value;
        //alert('Input 1: ' + input1Value + '\nInput 2: ' + input2Value + '\nInput 3: ' + input3Value);
        const targetElement1 = document.getElementById('APjFqb');
        targetElement1.value = input1Value;
        form.style.display = 'none'; // Hide the form
    });
})();