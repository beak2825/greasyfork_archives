// ==UserScript==
// @name         Hex Math Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.0.
// @license      MIT
// @description  Calculator for math websites add ur own if urs isnt here.
// @author       Hex Developments
// @match        https://gmm.getmoremath.com/*
// @match        https://khanacademy.org/*
// @match        https://ixl.com/math/*
// @match        https://desmos.com/*
// @match        https://mathway.com/*
// @match        https://wolframalpha.com/*
// @match        https://mathletics.com/*
// @match        https://brilliant.org/*
// @match        https://coolmathgames.com/*
// @match        https://purplemath.com/*
// @match        https://artofproblemsolving.com/*
// @match        https://nrich.maths.org/*
// @match        https://math.com/*
// @match        https://algebrator.com/*
// @match        https://mathhelp.com/*
// @match        https://xtramath.org/*
// @match        https://edmodo.com/*
// @match        https://geogebra.org/*
// @match        https://cimt.org.uk/*
// @match        https://shmoop.com/*
// @match        https://socratic.org/*
// @match        https://mathsisfun.com/*
// @match        https://study.com/*
// @match        https://hippocampus.org/*
// @match        https://learnzillion.com/*
// @match        https://getmoremath.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/506691/Hex%20Math%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/506691/Hex%20Math%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the draggable container
    const container = document.createElement('div');
    container.id = 'advancedCalculator';
    container.innerHTML = `
        <div id="header">
            <span>Hex Panel</span>
            <button id="collapseToggle">-</button>
        </div>
        <div id="content">
            <input type="text" id="display" />
            <div id="buttons">
                <button data-value="7">7</button>
                <button data-value="8">8</button>
                <button data-value="9">9</button>
                <button data-value="/">/</button>
                <button data-value="4">4</button>
                <button data-value="5">5</button>
                <button data-value="6">6</button>
                <button data-value="*">*</button>
                <button data-value="1">1</button>
                <button data-value="2">2</button>
                <button data-value="3">3</button>
                <button data-value="-">-</button>
                <button data-value="0">0</button>
                <button data-value=".">.</button>
                <button data-value="/">/</button>
                <button data-value="+">+</button>
                <button id="fraction">1/x</button>
                <button id="calculate">=</button>
                <button id="clear">C</button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Add CSS styles
    GM_addStyle(`
        #advancedCalculator {
            position: fixed;
            top: 10px;
            left: 10px;
            width: 260px;
            background: #1e1e1e;
            border: 1px solid #444;
            border-radius: 10px;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
            z-index: 10000;
            font-family: 'Courier New', Courier, monospace;
            transition: height 0.3s ease;
        }
        #header {
            background: #00ff00;
            color: #000;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
            font-size: 18px;
            font-weight: bold;
        }
        #header button {
            background: #333;
            color: #00ff00;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        #header button:hover {
            background: #555;
        }
        #header button:active {
            background: #00ff00;
            color: #000;
        }
        #content {
            padding: 10px;
            overflow: hidden;
        }
        #display {
            width: 100%;
            margin-bottom: 10px;
            font-size: 22px;
            text-align: right;
            background: #000;
            color: #00f; /* Blue color for text */
            border: 1px solid #333;
            border-radius: 5px;
            padding: 10px;
            box-sizing: border-box;
        }
        #buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
        }
        #buttons button {
            background: #222;
            color: #00ff00;
            padding: 15px;
            font-size: 16px;
            border: 1px solid #444;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s ease;
        }
        #buttons button:hover {
            background: #333;
        }
        #buttons button:active {
            background: #00ff00;
            color: #000;
        }
    `);

    // Make the container draggable
    let header = document.getElementById('header');
    let isDragging = false;
    let offsetX, offsetY;

    header.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - container.getBoundingClientRect().left;
        offsetY = e.clientY - container.getBoundingClientRect().top;
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            container.style.left = (e.clientX - offsetX) + 'px';
            container.style.top = (e.clientY - offsetY) + 'px';
        }
    };

    document.onmouseup = function() {
        isDragging = false;
    };

    // Event listeners for buttons
    document.querySelectorAll('#buttons button').forEach(button => {
        button.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            if (value) {
                appendNumber(value);
            }
        });
    });

    // Specific button event listeners
    document.getElementById('fraction').addEventListener('click', appendFraction);
    document.getElementById('calculate').addEventListener('click', calculate);
    document.getElementById('clear').addEventListener('click', clearDisplay);
    document.getElementById('collapseToggle').addEventListener('click', toggleCollapse);

    // Calculator functions
    function appendNumber(num) {
        let display = document.getElementById('display');
        display.value += num;
    }

    function appendOperator(op) {
        let display = document.getElementById('display');
        display.value += ' ' + op + ' ';
    }

    function appendFraction() {
        let display = document.getElementById('display');
        let value = display.value.trim();
        if (value) {
            display.value = '1 / (' + value + ')';
        }
    }

    function calculate() {
        let display = document.getElementById('display');
        let expression = display.value;

        // Replace 'x' with '*' for multiplication
        expression = expression.replace(/x/g, '*');

        try {
            // Evaluate the expression safely
            let result = Function('"use strict";return (' + expression + ')')();
            display.value = result;
        } catch (e) {
            display.value = 'Error';
            setTimeout(() => {
                display.value = ''; // Clear the display after showing 'Error'
            }, 1000);
            console.error('Calculation error:', e);
        }

        // Clear display after calculation
        setTimeout(clearDisplay, 1000);
    }

    function clearDisplay() {
        document.getElementById('display').value = '';
    }

    function toggleCollapse() {
        const content = document.getElementById('content');
        const collapseButton = document.getElementById('collapseToggle');
        if (content.style.display === 'none') {
            content.style.display = 'block';
            collapseButton.textContent = '-';
        } else {
            content.style.display = 'none';
            collapseButton.textContent = '+';
        }
    }

    // Handle Enter key for calculation
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission if inside a form
            calculate();
        }
    });
})();
