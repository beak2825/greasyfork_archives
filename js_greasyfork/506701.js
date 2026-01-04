// ==UserScript==
// @name         Hex Math Panel
// @namespace    http://tampermonkey.net/
// @version      1.0.0.
// @license      MIT
// @description  Calculator for math websites add ur own if urs isnt here.
// @icon         data:image/png;base64,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
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
// @downloadURL https://update.greasyfork.org/scripts/506701/Hex%20Math%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/506701/Hex%20Math%20Panel.meta.js
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
