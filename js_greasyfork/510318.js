// ==UserScript==
// @name         Gartic.io Advanced Calculator
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Gartic.io için gelişmiş bilimsel hesap makinesi
// @author       《₁₈₇》
// @match        https://gartic.io/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/11.7.0/math.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510318/Garticio%20Advanced%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/510318/Garticio%20Advanced%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const math = window.math;
    let calcDiv = document.createElement('div');
    calcDiv.id = 'advanced-calculator';
    calcDiv.style.position = 'fixed';
    calcDiv.style.bottom = '10px';
    calcDiv.style.right = '10px';
    calcDiv.style.backgroundColor = '#1e1e2e';
    calcDiv.style.padding = '15px';
    calcDiv.style.border = '2px solid #6272a4';
    calcDiv.style.borderRadius = '12px';
    calcDiv.style.zIndex = '9999';
    calcDiv.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    calcDiv.style.fontFamily = "'Segoe UI', 'Arial', sans-serif";
    calcDiv.style.width = '300px';
    calcDiv.style.color = '#f8f8f2';
    let title = document.createElement('div');
    title.textContent = 'Gelişmiş Hesap Makinesi v2.0';
    title.style.textAlign = 'center';
    title.style.fontSize = '16px';
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '10px';
    title.style.color = '#bd93f9';
    calcDiv.appendChild(title);
    let displayField = document.createElement('textarea');
    displayField.id = 'calc-display';
    displayField.style.width = '100%';
    displayField.style.height = '60px';
    displayField.style.backgroundColor = '#44475a';
    displayField.style.color = '#f8f8f2';
    displayField.style.padding = '10px';
    displayField.style.fontSize = '20px';
    displayField.style.border = '2px solid #6272a4';
    displayField.style.borderRadius = '8px';
    displayField.style.marginBottom = '10px';
    displayField.style.resize = 'none';
    displayField.style.fontFamily = "'Consolas', monospace";
    displayField.style.boxSizing = 'border-box';
    displayField.placeholder = 'Matematiksel ifade girin...';
    displayField.value = '';
    calcDiv.appendChild(displayField);
    let quickButtons = document.createElement('div');
    quickButtons.style.display = 'flex';
    quickButtons.style.gap = '5px';
    quickButtons.style.marginBottom = '10px';
    quickButtons.style.flexWrap = 'wrap';
    const quickOps = [
        { text: 'x²', value: '^2' },
        { text: 'x³', value: '^3' },
        { text: '√', value: 'sqrt(' },
        { text: 'π', value: '3,1415' },
        { text: '(', value: '(' },
        { text: ')', value: ')' },
        { text: 'sin', value: 'sin(' },
        { text: 'cos', value: 'cos(' },
        { text: 'tan', value: 'tan(' }
    ];
    quickOps.forEach(op => {
        let btn = document.createElement('button');
        btn.textContent = op.text;
        btn.style.padding = '6px 10px';
        btn.style.backgroundColor = '#44475a';
        btn.style.color = '#f8f8f2';
        btn.style.border = '1px solid #6272a4';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '14px';
        btn.style.flex = '1';
        btn.style.minWidth = '50px';
        btn.addEventListener('click', function() {
            insertAtCursor(displayField, op.value);
            displayField.focus();
        });
        quickButtons.appendChild(btn);
    });
    calcDiv.appendChild(quickButtons);
    let buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'grid';
    buttonsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    buttonsContainer.style.gap = '8px';
    buttonsContainer.style.marginBottom = '15px';
    const buttons = [
        { text: 'AC', class: 'clear' },
        { text: 'C', class: 'clear' },
        { text: '(', class: 'paren' },
        { text: ')', class: 'paren' },
        { text: '7', class: 'number' },
        { text: '8', class: 'number' },
        { text: '9', class: 'number' },
        { text: '÷', value: '/', class: 'operator' },
        { text: '4', class: 'number' },
        { text: '5', class: 'number' },
        { text: '6', class: 'number' },
        { text: '×', value: '*', class: 'operator' },
        { text: '1', class: 'number' },
        { text: '2', class: 'number' },
        { text: '3', class: 'number' },
        { text: '-', class: 'operator' },
        { text: '0', class: 'number' },
        { text: '.', class: 'decimal' },
        { text: '=', class: 'equals' },
        { text: '+', class: 'operator' }
    ];
    buttons.forEach(button => {
        let btn = document.createElement('button');
        btn.textContent = button.text;
        btn.style.padding = '12px';
        btn.style.border = 'none';
        btn.style.borderRadius = '6px';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '16px';
        btn.style.fontWeight = 'bold';
        if (button.class === 'number') {
            btn.style.backgroundColor = '#6272a4';
            btn.style.color = '#f8f8f2';
        } else if (button.class === 'operator') {
            btn.style.backgroundColor = '#ff79c6';
            btn.style.color = '#000';
        } else if (button.class === 'clear') {
            btn.style.backgroundColor = '#ff5555';
            btn.style.color = '#000';
        } else if (button.class === 'equals') {
            btn.style.backgroundColor = '#50fa7b';
            btn.style.color = '#000';
        } else if (button.class === 'paren') {
            btn.style.backgroundColor = '#f1fa8c';
            btn.style.color = '#000';
        } else if (button.class === 'decimal') {
            btn.style.backgroundColor = '#6272a4';
            btn.style.color = '#f8f8f2';
        }
        btn.addEventListener('click', function() {
            if (button.text === '=') {
                try {
                    let expression = displayField.value;
                    expression = expression.replace(/÷/g, '/').replace(/×/g, '*');
                    expression = expression.replace(/\^/g, '**');
                    expression = expression.replace(/sin\(/g, 'math.sin(');
                    expression = expression.replace(/cos\(/g, 'math.cos(');
                    expression = expression.replace(/tan\(/g, 'math.tan(');
                    expression = expression.replace(/sqrt\(/g, 'math.sqrt(');
                    expression = expression.replace(/pi/g, 'math.pi');
                    expression = expression.replace(/log\(/g, 'math.log(');
                    let result = eval(expression);
                    displayField.value = result;
                } catch (e) {
                    displayField.value = 'Hata';
                }
            } else if (button.text === 'AC') {
                displayField.value = '';
            } else if (button.text === 'C') {
                displayField.value = displayField.value.slice(0, -1);
            } else {
                let valueToAdd = button.value || button.text;
                insertAtCursor(displayField, valueToAdd);
            }
            displayField.focus();
        });
        buttonsContainer.appendChild(btn);
    });
    calcDiv.appendChild(buttonsContainer);
    function insertAtCursor(textarea, text) {
        let start = textarea.selectionStart;
        let end = textarea.selectionEnd;
        textarea.value = textarea.value.substring(0, start) + text + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    let hideButton = document.createElement('button');
    hideButton.textContent = 'Hide';
    hideButton.style.padding = '10px';
    hideButton.style.backgroundColor = '#ffb86c';
    hideButton.style.color = '#000';
    hideButton.style.border = 'none';
    hideButton.style.borderRadius = '4px';
    hideButton.style.cursor = 'pointer';
    hideButton.style.fontSize = '16px';
    hideButton.style.marginTop = '10px';
    hideButton.style.width = '100%';
    hideButton.style.fontWeight = 'bold';
    hideButton.addEventListener('click', function() {
        calcDiv.style.display = 'none';
        bringBackButton.style.display = 'block';
    });
    calcDiv.appendChild(hideButton);
    let bringBackButton = document.createElement('button');
    bringBackButton.textContent = 'Bring It Back';
    bringBackButton.style.padding = '10px';
    bringBackButton.style.backgroundColor = '#50fa7b';
    bringBackButton.style.color = '#000';
    bringBackButton.style.border = 'none';
    bringBackButton.style.borderRadius = '4px';
    bringBackButton.style.cursor = 'pointer';
    bringBackButton.style.fontSize = '16px';
    bringBackButton.style.display = 'none';
    bringBackButton.style.position = 'absolute';
    bringBackButton.style.left = '50%';
    bringBackButton.style.transform = 'translateX(-50%)';
    bringBackButton.style.top = '50%';
    bringBackButton.style.zIndex = '9998';
    bringBackButton.addEventListener('click', function() {
        calcDiv.style.display = 'block';
        bringBackButton.style.display = 'none';
    });
    document.body.appendChild(calcDiv);
    document.body.appendChild(bringBackButton);
    displayField.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            try {
                let expression = displayField.value;
                expression = expression.replace(/÷/g, '/').replace(/×/g, '*');
                expression = expression.replace(/\^/g, '**');
                expression = expression.replace(/sin\(/g, 'math.sin(');
                expression = expression.replace(/cos\(/g, 'math.cos(');
                expression = expression.replace(/tan\(/g, 'math.tan(');
                expression = expression.replace(/sqrt\(/g, 'math.sqrt(');
                expression = expression.replace(/pi/g, 'math.pi');
                expression = expression.replace(/log\(/g, 'math.log(');
                let result = eval(expression);
                displayField.value = result;
            } catch (error) {
                displayField.value = 'Hata';
            }
        }
    });
})();