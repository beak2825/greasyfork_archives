// ==UserScript==
// @name         Powerful Calculator
// @namespace    http://example.com
// @version      1.6
// @description  A user script that adds a powerful calculator to any webpage with buttons for all arithmetic operations, fractions, roots, various mathematical symbols, and supports multiple languages (English, Russian, Uzbek).
// @author       Bytecraft
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/509288/Powerful%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/509288/Powerful%20Calculator.meta.js
// ==/UserScript==

(() => {
    const calculatorContainer = document.createElement('div');
    calculatorContainer.style.position = 'fixed';
    calculatorContainer.style.bottom = '20px';
    calculatorContainer.style.right = '20px';
    calculatorContainer.style.padding = '20px';
    calculatorContainer.style.backgroundColor = '#f9f9f9';
    calculatorContainer.style.border = '2px solid #007BFF';
    calculatorContainer.style.borderRadius = '10px';
    calculatorContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    calculatorContainer.style.zIndex = 1000;
    calculatorContainer.style.cursor = 'move'; // Allow dragging

    // Language selection
    const languageSelector = document.createElement('select');
    languageSelector.id = 'language-selector';
    languageSelector.innerHTML = `
        <option value="en">English</option>
        <option value="ru">Русский</option>
        <option value="uz">O'zbekcha</option>
    `;

    calculatorContainer.innerHTML = `
        <h3 style="text-align: center;">Calculator</h3>
        ${languageSelector.outerHTML}
        <input type='text' id='expression' placeholder='Enter expression' style='width: 100%; padding: 5px; margin-bottom: 10px;'>
        <div id='buttons' style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px;">
            <button class='calc-btn'>1</button>
            <button class='calc-btn'>2</button>
            <button class='calc-btn'>3</button>
            <button class='calc-btn'>+</button>
            <button class='calc-btn'>4</button>
            <button class='calc-btn'>5</button>
            <button class='calc-btn'>6</button>
            <button class='calc-btn'>-</button>
            <button class='calc-btn'>7</button>
            <button class='calc-btn'>8</button>
            <button class='calc-btn'>9</button>
            <button class='calc-btn'>*</button>
            <button class='calc-btn'>0</button>
            <button class='calc-btn'>C</button>
            <button class='calc-btn'>=</button>
            <button class='calc-btn'>/</button>
            <button class='calc-btn'>(</button>
            <button class='calc-btn'>)</button>
            <button class='calc-btn'>√</button>
            <button class='calc-btn'>=</button> <!-- Equals -->
            <button class='calc-btn'>≠</button> <!-- Not equal -->
            <button class='calc-btn'>≈</button> <!-- Approximately equal -->
            <button class='calc-btn'>&gt;</button> <!-- Greater than -->
            <button class='calc-btn'>&lt;</button> <!-- Less than -->
            <button class='calc-btn'>≥</button> <!-- Greater than or equal to -->
            <button class='calc-btn'>≤</button> <!-- Less than or equal to -->
            <button class='calc-btn'>±</button> <!-- Plus-minus -->
            <button class='calc-btn'>mod</button> <!-- Modulus -->
            <button class='calc-btn'>%</button> <!-- Percent -->
            <button class='calc-btn'>ab</button> <!-- Power -->
            <button class='calc-btn'>n√</button> <!-- n-th root -->
        </div>
        <div id='result' style="margin-top: 10px; font-weight: bold; border: 1px solid #007BFF; padding: 10px; border-radius: 5px;"></div>
    `;

    document.body.appendChild(calculatorContainer);

    // Draggable functionality
    let isDragging = false;
    let offsetX, offsetY;

    calculatorContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - calculatorContainer.getBoundingClientRect().left;
        offsetY = e.clientY - calculatorContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            calculatorContainer.style.left = `${e.clientX - offsetX}px`;
            calculatorContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    const buttons = document.querySelectorAll('.calc-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const value = button.textContent;

            if (value === 'C') {
                document.getElementById('expression').value = '';
                document.getElementById('result').innerText = '';
            } else if (value === '=') {
                const expression = document.getElementById('expression').value;
                try {
                    // Replace mod with % for JavaScript evaluation
                    const evaluatedExpression = expression.replace(/mod/g, '%');
                    const result = eval(evaluatedExpression);
                    document.getElementById('result').innerText = 'Result: ' + result;
                } catch (e) {
                    document.getElementById('result').innerText = 'Error: ' + e.message;
                }
            } else {
                document.getElementById('expression').value += value;
            }
        });
    });

    languageSelector.addEventListener('change', () => {
        updateLanguage(languageSelector.value);
    });

    function getMessage(key) {
        const messages = {
            en: {
                result: 'Result',
                error: 'Error',
                calculator: 'Calculator',
                enter_expression: 'Enter expression'
            },
            ru: {
                result: 'Результат',
                error: 'Ошибка',
                calculator: 'Калькулятор',
                enter_expression: 'Введите выражение'
            },
            uz: {
                result: 'Natija',
                error: 'Xato',
                calculator: 'Kalkulyator',
                enter_expression: 'Ishlatiladigan ifodani kiriting'
            }
        };

        return messages[languageSelector.value][key];
    }

    function updateLanguage(lang) {
        document.querySelector('h3').textContent = getMessage('calculator');
        document.getElementById('expression').placeholder = getMessage('enter_expression');
        document.getElementById('result').innerText = '';
    }
})();
