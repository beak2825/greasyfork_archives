// ==UserScript==
// @name         Numeric Data Operator
// @namespace    http://your.namespace.com
// @version      0.4
// @description  Allows calculation of sum or product on numeric data pasted in a textbox, uses cmd [ to summon text boxes
// @author       Andrew Lakkis
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492182/Numeric%20Data%20Operator.user.js
// @updateURL https://update.greasyfork.org/scripts/492182/Numeric%20Data%20Operator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to parse and process the numeric data
    function processData(data) {
        const rows = data.trim().split('\n');
        const columns = rows.map(row => row.split(/\s+/));
        const numericColumns = columns[0].map((_, i) => columns.map(row => parseFloat(row[i])).filter(num => !isNaN(num)));

        return numericColumns;
    }

    // Function to calculate the sum of a column
    function sum(column, useComma) {
        const sumValue = column.reduce((acc, curr) => acc + curr, 0);
        const expression = useComma ? column.join(', ') : column.join(' + ');
        return `${expression} = ${sumValue}`;
    }

    // Function to calculate the product of a column
    function product(column, useComma) {
        const productValue = column.reduce((acc, curr) => acc * curr, 1);
        const expression = useComma ? column.join(', ') : column.join(' * ');
        return `${expression} = ${productValue}`;
    }

    // Function to create and display the user interface
    function createUI(data) {
        if (!document.querySelector('[placeholder="Paste numeric data here..."]')) {
            const container = document.createElement('div');
            container.style.position = 'fixed';
            container.style.top = '50%';
            container.style.left = '50%';
            container.style.transform = 'translate(-50%, -50%)';
            container.style.backgroundColor = '#fff';
            container.style.padding = '20px';
            container.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
            container.style.zIndex = '9999';

            const textArea = document.createElement('textarea');
            textArea.style.width = '300px';
            textArea.style.height = '200px';
            textArea.placeholder = 'Paste numeric data here...';
            container.appendChild(textArea);

            const select = document.createElement('select');
            const sumOption = document.createElement('option');
            sumOption.text = 'Sum';
            select.add(sumOption);
            const productOption = document.createElement('option');
            productOption.text = 'Product';
            select.add(productOption);
            container.appendChild(select);

            const commaCheckbox = document.createElement('input');
            commaCheckbox.type = 'checkbox';
            commaCheckbox.id = 'commaCheckbox';
            const commaLabel = document.createElement('label');
            commaLabel.htmlFor = 'commaCheckbox';
            commaLabel.textContent = 'Use comma separation';
            container.appendChild(commaCheckbox);
            container.appendChild(commaLabel);

            const calculateButton = document.createElement('button');
            calculateButton.textContent = 'Calculate';
            calculateButton.onclick = function() {
                const selectedOption = select.options[select.selectedIndex].text;
                const useComma = commaCheckbox.checked;
                const numericData = processData(textArea.value);
                const result = selectedOption === 'Sum' ? numericData.map(column => sum(column, useComma)) : numericData.map(column => product(column, useComma));
                resultTextBox.value = result.join('\n\n');
            };
            container.appendChild(calculateButton);

            const resultTextBox = document.createElement('textarea');
            resultTextBox.style.width = '300px';
            resultTextBox.style.height = '200px';
            resultTextBox.placeholder = 'Calculation results will appear here...';
            resultTextBox.disabled = true;
            container.appendChild(resultTextBox);

            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.onclick = function() {
                document.body.removeChild(container);
            };
            container.appendChild(closeButton);

            document.body.appendChild(container);
        }
    }

    // Check if the user presses Cmd + [
    document.addEventListener('keydown', function(event) {
        if (event.metaKey && event.key === '[') {
            event.preventDefault();
            createUI();
        }
    });
})();
