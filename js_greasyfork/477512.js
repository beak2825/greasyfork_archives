// ==UserScript==
// @name         Calculator
// @namespace    -
// @version      2
// @description  A simple calculator
// @author       discord: twilightmoon_
// @match        *://*.yourwebsite.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477512/Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/477512/Calculator.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create a container for the calculator
    const calculatorContainer = document.createElement('div');
    calculatorContainer.id = 'calculator-container';
    calculatorContainer.style.position = 'fixed';
    calculatorContainer.style.bottom = '10px';
    calculatorContainer.style.right = '10px';
    calculatorContainer.style.backgroundColor = 'white';
    calculatorContainer.style.padding = '10px';
    calculatorContainer.style.border = '1px solid #ccc';
    calculatorContainer.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.2)';
    calculatorContainer.style.zIndex = '9999';
    calculatorContainer.style.cursor = 'move';
    calculatorContainer.draggable = true;

    calculatorContainer.addEventListener('drag', (e) => {
        e.preventDefault();
    });

    // Create a display for the calculator
    const display = document.createElement('input');
    display.type = 'text';
    display.style.width = '100%';
    display.style.marginBottom = '10px';
    display.addEventListener('input', updateInput);
    calculatorContainer.appendChild(display);

    // Create calculator buttons in the order of a real calculator
    const buttonLayout = [
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', '=', '+'],
        ['C']
    ];

    buttonLayout.forEach(row => {
        const buttonRow = document.createElement('div');
        buttonRow.style.display = 'flex';

        row.forEach(button => {
            const btn = document.createElement('button');
            btn.textContent = button;
            btn.style.flex = '1';
            btn.style.padding = '10px';
            btn.style.margin = '2px';
            btn.addEventListener('click', () => onButtonClick(button));
            buttonRow.appendChild(btn);
        });

        calculatorContainer.appendChild(buttonRow);
    });

    // Add the calculator to the page
    document.body.appendChild(calculatorContainer);

    let currentInput = '';

    // Function to handle button clicks
    function onButtonClick(button) {
        if (button === '=') {
            try {
                display.value = eval(currentInput);
            } catch (error) {
                display.value = 'Error';
            }
            currentInput = '';
        } else if (button === 'C') {
            display.value = '';
            currentInput = '';
        } else {
            currentInput += button;
            display.value = currentInput;
        }
    }

    // Function to update input from typing
    function updateInput() {
        currentInput = display.value;
    }
})();