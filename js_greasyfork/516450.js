// ==UserScript==
// @name         Compact Scientific Calculator
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Compact scientific calculator for Mathswatch
// @author       frozled
// @match        *://*.mathswatch.co.uk/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516450/Compact%20Scientific%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/516450/Compact%20Scientific%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Compact styles
    const styles = `
        .calculator-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 350px;
            background: #f0f4f8;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            z-index: 9999;
            font-family: 'Arial', sans-serif;
            transition: all 0.3s ease;
        }
        .calculator-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background: #e9ecef;
            border-top-left-radius: 10px;
            border-top-right-radius: 10px;
        }
        .calculator-header h3 {
            margin: 0;
            font-size: 14px;
        }
        .close-calculator {
            background: none;
            border: none;
            color: #666;
            font-size: 20px;
            cursor: pointer;
            padding: 0;
            line-height: 1;
        }
        .calculator-tabs {
            display: flex;
            background: #dee2e6;
        }
        .calculator-tab {
            flex: 1;
            padding: 8px;
            text-align: center;
            cursor: pointer;
            font-size: 12px;
            transition: all 0.2s;
        }
        .calculator-tab.active {
            background: #007bff;
            color: white;
        }
        .calculator-content {
            padding: 10px;
        }
        .calculator-display {
            width: 100%;
            height: 40px;
            margin-bottom: 10px;
            text-align: right;
            padding: 5px;
            font-size: 18px;
            border: 1px solid #ced4da;
            border-radius: 5px;
            background: white;
        }
        .calculator-buttons {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 5px;
        }
        .calculator-button {
            padding: 8px;
            border: 1px solid #dee2e6;
            background: white;
            cursor: pointer;
            border-radius: 4px;
            transition: all 0.2s;
            font-size: 12px;
        }
        .calculator-button:hover {
            background: #e9ecef;
        }
        .memory-panel {
            display: flex;
            justify-content: space-around;
            margin-top: 8px;
        }
    `;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Calculator HTML
    const calculatorHTML = `
        <div class="calculator-container" id="advanced-calculator">
            <div class="calculator-header">
                <h3>Scientific Calculator</h3>
                <button class="close-calculator">×</button>
            </div>
            <div class="calculator-tabs">
                <div class="calculator-tab active" data-tab="standard">Standard</div>
                <div class="calculator-tab" data-tab="scientific">Scientific</div>
            </div>
            <div class="calculator-content">
                <input type="text" class="calculator-display" readonly>

                <!-- Standard Calculator Buttons -->
                <div class="calculator-buttons standard-buttons">
                    <button class="calculator-button clear">C</button>
                    <button class="calculator-button function">( )</button>
                    <button class="calculator-button function">%</button>
                    <button class="calculator-button operator">÷</button>
                    <button class="calculator-button function">⌫</button>

                    <button class="calculator-button">7</button>
                    <button class="calculator-button">8</button>
                    <button class="calculator-button">9</button>
                    <button class="calculator-button operator">×</button>
                    <button class="calculator-button operator">^</button>

                    <button class="calculator-button">4</button>
                    <button class="calculator-button">5</button>
                    <button class="calculator-button">6</button>
                    <button class="calculator-button operator">-</button>
                    <button class="calculator-button function">√</button>

                    <button class="calculator-button">1</button>
                    <button class="calculator-button">2</button>
                    <button class="calculator-button">3</button>
                    <button class="calculator-button operator">+</button>
                    <button class="calculator-button equals">=</button>

                    <button class="calculator-button">0</button>
                    <button class="calculator-button">.</button>
                    <button class="calculator-button function">±</button>
                </div>

                <!-- Scientific Calculator Buttons -->
                <div class="calculator-buttons scientific-buttons" style="display:none;">
                    <button class="calculator-button function">sin</button>
                    <button class="calculator-button function">cos</button>
                    <button class="calculator-button function">tan</button>
                    <button class="calculator-button function">log</button>
                    <button class="calculator-button function">ln</button>

                    <button class="calculator-button function">sin⁻¹</button>
                    <button class="calculator-button function">cos⁻¹</button>
                    <button class="calculator-button function">tan⁻¹</button>
                    <button class="calculator-button function">10^x</button>
                    <button class="calculator-button function">e^x</button>

                    <button class="calculator-button function">π</button>
                    <button class="calculator-button function">e</button>
                    <button class="calculator-button function">!</button>
                    <button class="calculator-button function">√</button>
                    <button class="calculator-button function">∛</button>
                </div>

                <!-- Memory Functions -->
                <div class="memory-panel">
                    <button class="calculator-button memory-clear">MC</button>
                    <button class="calculator-button memory-recall">MR</button>
                    <button class="calculator-button memory-store">MS</button>
                    <button class="calculator-button memory-add">M+</button>
                    <button class="calculator-button memory-subtract">M-</button>
                </div>
            </div>
        </div>
    `;

    // Inject calculator to page
    document.body.insertAdjacentHTML('beforeend', calculatorHTML);

    // Get DOM elements
    const calculator = document.getElementById('advanced-calculator');
    const closeBtn = document.querySelector('.close-calculator');
    const display = document.querySelector('.calculator-display');
    const tabs = document.querySelectorAll('.calculator-tab');
    const standardButtons = document.querySelector('.standard-buttons');
    const scientificButtons = document.querySelector('.scientific-buttons');

    // Draggability functionality
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    // Drag start
    calculator.querySelector('.calculator-header').addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === calculator.querySelector('.calculator-header')) {
            isDragging = true;
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, calculator);
        }
    }

    function setTranslate(xPos, yPos, el) {
        el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
    }

    function dragEnd() {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
    }

    // Close calculator
    closeBtn.addEventListener('click', () => {
        calculator.style.display = 'none';
    });

    // Tab switching
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class and hide all button sets
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Hide all calculator sections
            standardButtons.style.display = 'none';
            scientificButtons.style.display = 'none';

            // Show selected tab's content
            switch(tab.dataset.tab) {
                case 'standard':
                    standardButtons.style.display = 'grid';
                    break;
                case 'scientific':
                    scientificButtons.style.display = 'grid';
                    break;
            }
        });
    });

    // Calculation logic (same as previous version)
    let currentExpression = '';
    let memoryStore = 0;

    // Memory functions
    const memoryButtons = document.querySelectorAll('.memory-panel button');
    memoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const value = parseFloat(display.value) || 0;
            switch(button.classList[1]) {
                case 'memory-clear':
                    memoryStore = 0;
                    break;
                case 'memory-recall':
                    display.value = memoryStore;
                    break;
                case 'memory-store':
                    memoryStore = value;
                    break;
                case 'memory-add':
                    memoryStore += value;
                    break;
                case 'memory-subtract':
                    memoryStore -= value;
                    break;
            }
        });
    });

    // Keyboard support
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        const validKeys = '0123456789.+-*/()^%';

        if (validKeys.includes(key)) {
            currentExpression += key;
            display.value = currentExpression;
        } else if (key === 'Backspace') {
            currentExpression = currentExpression.slice(0, -1);
            display.value = currentExpression;
        } else if (key === 'Enter' || key === '=') {
            calculateResult();
        }
    });

    // Advanced calculation function
    function calculateResult() {
        try {
            let expression = currentExpression
                .replace(/×/g, '*')
                .replace(/÷/g, '/')
                .replace(/\^/g, '**')
                .replace(/√/g, 'Math.sqrt')
                .replace(/sin\(/g, 'Math.sin(')
                .replace(/cos\(/g, 'Math.cos(')
                .replace(/tan\(/g, 'Math.tan(')
                .replace(/log\(/g, 'Math.log10(')
                .replace(/ln\(/g, 'Math.log(')
                .replace(/π/g, 'Math.PI')
                .replace(/e\^/g, 'Math.exp')
                .replace(/!\(/g, 'factorial(');

            // Custom factorial function
            function factorial(n) {
                if (n < 0) return NaN;
                if (n === 0 || n === 1) return 1;
                return n * factorial(n - 1);
            }

            const result = eval(expression);
            display.value = result;
            currentExpression = result.toString();
        } catch (error) {
            display.value = 'Error';
            currentExpression = '';
        }
    }

    // Bind calculation to main buttons
    const buttons = document.querySelectorAll('.calculator-button');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === 'C') {
                currentExpression = '';
                display.value = '';
            } else if (value === '=') {
                calculateResult();
            } else if (value === '⌫') {
                currentExpression = currentExpression.slice(0, -1);
                display.value = currentExpression;
            } else if (value === '±') {
                currentExpression = currentExpression.startsWith('-')
                    ? currentExpression.slice(1)
                    : `-${currentExpression}`;
                display.value = currentExpression;
            } else {
                currentExpression += value;
                display.value = currentExpression;
            }
        });
    });
})();