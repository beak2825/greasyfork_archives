// ==UserScript==
// @name         The Ultimate Calculator (Toggle with ')
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A powerful calculator that toggles with the ' key
// @author       jyomama28
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/542435/The%20Ultimate%20Calculator%20%28Toggle%20with%20%27%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542435/The%20Ultimate%20Calculator%20%28Toggle%20with%20%27%29.meta.js
// ==/UserScript==

//To all the people who use this as well as my other scripts, I really appreciate it. I work hard on making these scripts
//Please enjoy this as well as any of my other scripts!
//If you have any questions, Please email me! email me at: jyomama28@gmail.com
//Agian, Thank you all <3
(function() {
    'use strict';


    const calculator = document.createElement('div');
    calculator.id = 'ultimate-calculator';
    calculator.style.position = 'fixed';
    calculator.style.bottom = '20px';
    calculator.style.right = '20px';
    calculator.style.zIndex = '9999';
    calculator.style.backgroundColor = '#f0f0f0';
    calculator.style.padding = '15px';
    calculator.style.borderRadius = '10px';
    calculator.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    calculator.style.display = 'none'; // Start hidden
    calculator.style.transition = 'opacity 0.3s ease';


    const display = document.createElement('input');
    display.id = 'display';
    display.type = 'text';
    display.readOnly = true;
    display.style.width = '100%';
    display.style.marginBottom = '10px';
    display.style.padding = '10px';
    display.style.fontSize = '20px';
    display.style.textAlign = 'right';
    display.style.border = '1px solid #ccc';
    display.style.borderRadius = '5px';


    const keys = document.createElement('div');
    keys.id = 'keys';
    keys.style.display = 'grid';
    keys.style.gridTemplateColumns = 'repeat(4, 1fr)';
    keys.style.gap = '5px';


    const buttons = [
        '7', '8', '9', '/',
        '4', '5', '6', '*',
        '1', '2', '3', '-',
        '0', '.', '=', '+',
        'C'
    ];


    buttons.forEach(btnText => {
        const button = document.createElement('button');
        button.textContent = btnText;
        button.style.padding = '10px';
        button.style.fontSize = '16px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.backgroundColor = '#e0e0e0';
        button.style.transition = 'background-color 0.2s';

        button.onmouseover = () => button.style.backgroundColor = '#d0d0d0';
        button.onmouseout = () => button.style.backgroundColor = '#e0e0e0';

        if (btnText === 'C') {
            button.style.gridColumn = 'span 4';
            button.style.backgroundColor = '#ff6b6b';
            button.style.color = 'white';
            button.onclick = clearDisplay;
        } else if (btnText === '=') {
            button.style.backgroundColor = '#4CAF50';
            button.style.color = 'white';
            button.onclick = calculate;
        } else {
            button.onclick = () => appendToDisplay(btnText);
        }

        keys.appendChild(button);
    });


    const credit = document.createElement('div');
    credit.style.marginTop = '10px';
    credit.style.fontSize = '12px';
    credit.style.textAlign = 'center';
    credit.style.color = '#666';
    credit.innerHTML = 'Made by jyomama28 / jyoeymama on GitHub<br>Press \' to toggle';


    calculator.appendChild(display);
    calculator.appendChild(keys);
    calculator.appendChild(credit);
    document.body.appendChild(calculator);


    function appendToDisplay(input) {
        display.value += input;
    }

    function clearDisplay() {
        display.value = "";
    }

    function calculate() {
        try {
            display.value = eval(display.value);
        } catch(error) {
            display.value = "Error";
        }
    }


    function toggleCalculator() {
        if (calculator.style.display === 'none' || calculator.style.display === '') {
            calculator.style.display = 'block';
            calculator.style.opacity = '1';
            display.focus();
        } else {
            calculator.style.opacity = '0';
            setTimeout(() => {
                calculator.style.display = 'none';
            }, 300); 
        }
    }


    document.addEventListener('keydown', function(event) {

        if (event.key === "'" || event.key === '"') {

            if (document.activeElement.tagName !== 'INPUT' && 
                document.activeElement.tagName !== 'TEXTAREA') {
                event.preventDefault();
                toggleCalculator();
            }
        }

        if (event.key === 'Escape' && calculator.style.display === 'block') {
            toggleCalculator();
        }
    });


    GM_addStyle(`
        #ultimate-calculator {
            font-family: Arial, sans-serif;
        }
        
        #ultimate-calculator button:active {
            transform: scale(0.98);
        }
        
        #ultimate-calculator button:focus, 
        #display:focus {
            outline: 2px solid #4CAF50;
        }
    `);
})();