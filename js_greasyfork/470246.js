// ==UserScript==
// @name         Major/Minors ALGs on Skill Page
// @namespace    your-namespace
// @version      2.0
// @description  Displays data from an Excel sheet on a webpage
// @match        https://glb.warriorgeneral.com/game/skill_points.pl?player_id=**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470246/MajorMinors%20ALGs%20on%20Skill%20Page.user.js
// @updateURL https://update.greasyfork.org/scripts/470246/MajorMinors%20ALGs%20on%20Skill%20Page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define the CSS
    var css = `
        .calculator {
            border: 1px solid #ccc;
            padding: 10px;
            margin-bottom: 20px;
        }
        .box {
            width: 25%;
        }
        .box input {
            width: calc(100% - 20px);
            margin-bottom: 5px;
            padding: 5px;
        }
        .box button {
            width: 100%;
            padding: 8px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        .box button:hover {
            background-color: #45a049;
        }
        .box div {
            margin-top: 10px;
        }
        .calculator-title {
            text-align: center;
            font-weight: bold;
            margin-bottom: 10px;
        }
    `;

    // Create style element and append CSS
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Define the CSV data
    var csvData = "LEVEL,3 majors,4 majors,5 majors\n" +
                  "10,26.17,19.6,15.78\n" +
                  "11,25.5,19.1,15.38\n" +
                  "12,24.83,18.6,14.98\n" +
                  "13,24.16,18.1,14.58\n" +
                  "14,23.49,17.6,14.18\n" +
                  "15,22.82,17.1,13.78\n" +
                  "16,22.15,16.6,13.38\n" +
                  "17,21.48,16.1,12.98\n" +
                  "18,20.81,15.6,12.58\n" +
                  "19,20.14,15.1,12.18\n" +
                  "20,19.47,14.6,11.78\n" +
                  "21,18.8,14.1,11.38\n" +
                  "22,18.3,13.72,11.08\n" +
                  "23,17.8,13.34,10.78\n" +
                  "24,17.3,12.96,10.48\n" +
                  "25,16.8,12.58,10.18\n" +
                  "26,16.3,12.2,9.88\n" +
                  "27,15.8,11.82,9.58\n" +
                  "28,15.3,11.44,9.28\n" +
                  "29,14.8,11.06,8.98\n" +
                  "30,14.42,10.78,8.75\n" +
                  "31,14.04,10.5,8.52\n" +
                  "32,13.66,10.22,8.29\n" +
                  "33,13.28,9.94,8.06\n" +
                  "34,12.9,9.66,7.83\n" +
                  "35,12.52,9.38,7.6\n" +
                  "36,12.14,9.1,7.37\n" +
                  "37,11.76,8.82,7.14\n" +
                  "38,11.48,8.61,6.97\n" +
                  "39,11.2,8.4,6.8\n" +
                  "40,10.92,8.19,6.63\n" +
                  "41,10.64,7.98,6.46\n" +
                  "42,10.36,7.77,6.29\n" +
                  "43,10.08,7.56,6.12\n" +
                  "44,9.8,7.35,5.95\n" +
                  "45,9.52,7.14,5.78\n" +
                  "46,9.24,6.93,5.61\n" +
                  "47,8.96,6.72,5.44\n" +
                  "48,8.68,6.51,5.27\n" +
                  "49,8.4,6.3,5.1\n" +
                  "50,8.12,6.09,4.93\n" +
                  "51,7.84,5.88,4.76\n" +
                  "52,7.56,5.67,4.59\n" +
                  "53,7.28,5.46,4.42\n" +
                  "54,7,5.25,4.25\n" +
                  "55,6.72,5.04,4.08\n" +
                  "56,6.44,4.83,3.91\n" +
                  "57,6.16,4.62,3.74\n" +
                  "58,5.88,4.41,3.57\n" +
                  "59,5.6,4.2,3.4\n" +
                  "60,5.32,3.99,3.23\n" +
                  "61,5.04,3.78,3.06\n" +
                  "62,4.76,3.57,2.89\n" +
                  "63,4.48,3.36,2.72\n" +
                  "64,4.2,3.15,2.55\n" +
                  "65,3.92,2.94,2.38\n" +
                  "66,3.64,2.73,2.21\n" +
                  "67,3.36,2.52,2.04\n" +
                  "68,3.08,2.31,1.87\n" +
                  "69,2.8,2.1,1.7\n" +
                  "70,2.52,1.89,1.53\n" +
                  "71,2.24,1.68,1.36\n" +
                  "72,1.96,1.47,1.19\n" +
                  "73,1.68,1.26,1.02\n" +
                  "74,1.4,1.05,0.85\n" +
                  "75,1.12,0.84,0.68\n" +
                  "76,0.84,0.63,0.51\n" +
                  "77,0.56,0.42,0.34\n" +
                  "78,0.28,0.21,0.17\n" +
                  "79,0,0,0";

    // Parse the CSV data
    function parseCSV() {
        var rows = csvData.trim().split('\n');
        var headers = rows[0].split(',').map(function (header) {
            return header.trim();
        });

        var data = [];
        for (var i = 1; i < rows.length; i++) {
            var values = rows[i].split(',').map(function (value) {
                return value.trim();
            });

            var entry = {};
            for (var j = 0; j < headers.length; j++) {
                entry[headers[j]] = values[j];
            }

            data.push(entry);
        }

        return data;
    }

    // Create the box container element for the first calculator
    var boxContainer1 = document.createElement('div');
    boxContainer1.classList.add('box');

    // Create the input elements for the first calculator
    var input1_1 = document.createElement('input');
    input1_1.type = 'text';
    input1_1.placeholder = 'Current Level';

    var input1_2 = document.createElement('input');
    input1_2.type = 'text';
    input1_2.placeholder = 'Number of Majors';

    var input1_3 = document.createElement('input');
    input1_3.type = 'text';
    input1_3.placeholder = 'Current Attribute Level';

    // Create the output element for the first calculator
    var output1 = document.createElement('div');

    // Create the button element for the first calculator
    var button1 = document.createElement('button');
    button1.textContent = 'Calculate Majors';

    // Append the input elements, button, and output element to the box container for the first calculator
    boxContainer1.appendChild(input1_1);
    boxContainer1.appendChild(input1_2);
    boxContainer1.appendChild(input1_3);
    boxContainer1.appendChild(button1);
    boxContainer1.appendChild(output1);

    // Create the box container element for the second calculator
    var boxContainer2 = document.createElement('div');
    boxContainer2.classList.add('box');

    // Create the input elements for the second calculator
    var input2_1 = document.createElement('input');
    input2_1.type = 'text';
    input2_1.placeholder = 'Current Level';

    var input2_2 = document.createElement('input');
    input2_2.type = 'text';
    input2_2.placeholder = 'Number of Majors';

    var input2_3 = document.createElement('input');
    input2_3.type = 'text';
    input2_3.placeholder = 'Current Attribute Level';

    // Create the output element for the second calculator
    var output2 = document.createElement('div');

    // Create the button element for the second calculator
    var button2 = document.createElement('button');
    button2.textContent = 'Calculate Minors';

    // Append the input elements, button, and output element to the box container for the second calculator
    boxContainer2.appendChild(input2_1);
    boxContainer2.appendChild(input2_2);
    boxContainer2.appendChild(input2_3);
    boxContainer2.appendChild(button2);
    boxContainer2.appendChild(output2);

    // Find the target element to insert the box (assuming the target element has the id "content")
    var targetElement = document.getElementById('content');
    targetElement.appendChild(boxContainer1);
    targetElement.appendChild(boxContainer2);

    // Calculate the resulting attribute level for the first calculator
    function calculateResult1() {
        var currentLevel = parseInt(input1_1.value);
        var numberOfMajors = parseInt(input1_2.value);
        var currentAttributeLevel = parseFloat(input1_3.value);

        var extractedData = parseCSV();

        if (currentLevel < 10 || currentLevel > 79) {
            output1.textContent = 'Invalid current level. Please enter a level between 10 and 79.';
            return;
        }

        if (numberOfMajors < 3 || numberOfMajors > 5) {
            output1.textContent = 'Invalid number of majors. Please enter a number between 3 and 5.';
            return;
        }

        if (currentAttributeLevel < 0 || currentAttributeLevel > 99.99) {
            output1.textContent = 'Invalid current attribute level. Please enter a level between 0 and 99.99.';
            return;
        }

        var dataIndex = currentLevel - 10;
        var targetAttributeLevel = extractedData[dataIndex][numberOfMajors + ' majors'];

        if (targetAttributeLevel === undefined) {
            output1.textContent = 'Invalid combination of current level and number of majors.';
            return;
        }

        var requiredAttributePoints = targetAttributeLevel - currentAttributeLevel + currentAttributeLevel;
        var result = currentAttributeLevel + requiredAttributePoints;
        output1.textContent = 'Result: ' + result.toFixed(2);
    }

    // Calculate the resulting attribute level for the second calculator
    function calculateResult2() {
        var currentLevel = parseInt(input2_1.value);
        var numberOfMajors = parseInt(input2_2.value);
        var currentAttributeLevel = parseFloat(input2_3.value);

        var extractedData = parseCSV();

        if (currentLevel < 10 || currentLevel > 79) {
            output2.textContent = 'Invalid current level. Please enter a level between 10 and 79.';
            return;
        }

        if (numberOfMajors < 3 || numberOfMajors > 5) {
            output2.textContent = 'Invalid number of majors. Please enter a number between 3 and 5.';
            return;
        }

        if (currentAttributeLevel < 0 || currentAttributeLevel > 99.99) {
            output2.textContent = 'Invalid current attribute level. Please enter a level between 0 and 99.99.';
            return;
        }

        var dataIndex = currentLevel - 10;
        var targetAttributeLevel = extractedData[dataIndex][numberOfMajors + ' majors'];

        if (targetAttributeLevel === undefined) {
            output2.textContent = 'Invalid combination of current level and number of majors.';
            return;
        }

        var requiredAttributePoints = targetAttributeLevel / 2 - currentAttributeLevel / 2 + currentAttributeLevel;
        var result = currentAttributeLevel / 2 + requiredAttributePoints;
        output2.textContent = 'Result: ' + result.toFixed(2);
    }

    // Add event listeners to the buttons
    button1.addEventListener('click', calculateResult1);
    button2.addEventListener('click', calculateResult2);
})();