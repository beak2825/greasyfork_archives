// ==UserScript==
// @name         Planning Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a dropdown and buttons to populate department numbers on Walmart Freight Planning Tool.
// @author       Your Name
// @match        https://*.test.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524579/Planning%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524579/Planning%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    try {
        // Function to create a button
        function createButton(text, top, value) {
            var button = document.createElement('button');
            button.textContent = text;
            button.style.position = 'fixed';
            button.style.top = top + 'px';
            button.style.left = '10px';
            button.style.zIndex = '1000';
            button.style.padding = '5px 10px';
            button.style.backgroundColor = '#0071ce';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.fontWeight = 'bold';

            button.addEventListener('click', function() {
                var inputField = document.getElementById('inpDeptNbr');
                if (inputField) {
                    inputField.value = value;
                } else {
                    alert('Input field with ID "inpDeptNbr" not found.');
                }
            });

            document.body.appendChild(button);
        }

        // Create a dropdown menu
        var dropdown = document.createElement('select');
        dropdown.style.position = 'fixed';
        dropdown.style.top = '10px';
        dropdown.style.left = '10px';
        dropdown.style.zIndex = '1000';
        dropdown.style.padding = '5px';
        dropdown.style.fontSize = '14px';

        // Add options to the dropdown
        var options = {
            "Electronics": "5,6,72,87",
            "Pets": "8",
            "Infants": "79",
            "Sporting Goods": "9",
            "Hardware & Stationery": "10,11,12",
            "Homelines": "16,17,20,22,74",
            "Toys/Garden": "56",
            "GM (General Merchandise)": "95,96"
        };
        for (var key in options) {
            var option = document.createElement('option');
            option.value = options[key];
            option.textContent = key;
            dropdown.appendChild(option);
        }

        // Create the "Apply" button
        var button = document.createElement('button');
        button.textContent = 'Apply';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.left = '10px';
        button.style.zIndex = '1000';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = '#0071ce';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            var inputField = document.getElementById('inpDeptNbr');
            if (inputField) {
                inputField.value = dropdown.value;
            } else {
                alert('Input field with ID "inpDeptNbr" not found.');
            }
        });

        // Append dropdown and button to the page
        document.body.appendChild(dropdown);
        document.body.appendChild(button);

    } catch (error) {
        console.error('An error occurred:', error);
    }
})();
