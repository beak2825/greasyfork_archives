// ==UserScript==
// @name         FirstTrade Option Filler
// @namespace    http://www.example.com/
// @version      1.0
// @description  fillout options form of firstrade
// @author       Jiakuan Li
// @match        https://invest.firstrade.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477386/FirstTrade%20Option%20Filler.user.js
// @updateURL https://update.greasyfork.org/scripts/477386/FirstTrade%20Option%20Filler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function analyze(instruction) {
        var substrings = instruction.split(' ');

        if (/^[A-Za-z]/.test(substrings[0]) == false) {
            substrings = substrings.slice(1);
        }
        console.log(substrings);
        var symbolIndex = 0
        if (substrings[0] == "ALL") {
            changeType("SC");
            symbolIndex = 2
        } else if (substrings[0] == "SOLD") {
            changeType("SC");
            symbolIndex = 3
        } else {
           changeType("BO");
        }

        var priceIndex = symbolIndex+1;
        var expDateIndex = priceIndex + 1;
        var currentYear = new Date().getFullYear();
        var expDate = substrings[expDateIndex] + "/" + currentYear;


        fillSymbol(substrings[symbolIndex]);
        fillExpDate(expDate);

        var strikePrice = substrings[priceIndex];
        var direction = strikePrice.charAt(strikePrice.length - 1).toUpperCase();
        strikePrice = fotmatStrikePrice(strikePrice.slice(0, -1));

        fillStrikePrice(strikePrice);
        changeDirection(direction);
    }

    function fotmatStrikePrice(price) {
        var number = Number(price);
        var formattedString = number.toFixed(3);
        return formattedString;
    }

    function fillStrikePrice(strikePrice) {
        console.log("Price:", strikePrice);
        let t = setInterval(function () {
            
            var selectElement = document.getElementById('option_strike1');
            selectElement.focus();
            console.log(selectElement.options.length);
            if (selectElement.options.length > 1) {
                
                var optionToSelect = selectElement.querySelector('option[value="' + strikePrice + '"]');
                console.log(optionToSelect);
                if (optionToSelect) {
                    optionToSelect.selected = true;
                    // Trigger the change event to reflect the change on the screen
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                }
                clearInterval(t);
                selectElement.blur();
            }
        }, 300);
    }

    function changeDirection(direction) {
        var radioButtons = document.querySelectorAll('input[type="radio"][name="callputtype"]'); // Replace with the name of your radio button group

        if (radioButtons.length > 0) {
            // Loop through the radio buttons and change the values
            for (var i = 0; i < radioButtons.length; i++) {
                var radioButton = radioButtons[i];

                // Check the radio button with the desired value
                if (radioButton.value === direction) { // Replace 'new-value' with the value you want to select
                    radioButton.checked = true;
                }
            }
        }
    }

    function fillExpDate(expDate) {
        console.log("Date:", expDate);
        let t = setInterval(function () {
            
            let selectElement = document.getElementById('option_expdate1');
            selectElement.focus();

            if (selectElement.options.length > 1) {
                
                var optionToSelect = selectElement.querySelector('option[value="' + expDate + '"]');
                console.log(optionToSelect);
                if (optionToSelect) {
                    optionToSelect.selected = true;
                    // Trigger the change event to reflect the change on the screen
                    selectElement.dispatchEvent(new Event('change', { bubbles: true }));
                }
                clearInterval(t); 
                selectElement.blur();
            }
        }, 300);
    }


    function fillSymbol(symbol) {
        var inputElement = document.getElementById('option_underlyingsymbol1'); // Replace with the actual ID of your input element
        inputElement.focus();

        if (inputElement) {
            // Set the value of the input element
            inputElement.value = symbol;

            // Trigger the 'input' event to reflect the change on the screen
            var event = new Event('input', {
                bubbles: true,
                cancelable: true,

            });
            inputElement.dispatchEvent(event);
        }
        inputElement.blur();
    }

    function changeType(newOptionValue) {
        var selectElement = document.getElementById('option_transactionType1'); // Replace with the actual ID of your <select> element
        console.log(selectElement);
        if (selectElement) {
            // Find the <option> element with the specified value and set it as selected
            var optionToSelect = selectElement.querySelector('option[value="' + newOptionValue + '"]');
            console.log(optionToSelect);
            if (optionToSelect) {
                optionToSelect.selected = true;
                // Trigger the change event to reflect the change on the screen
                selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            }
        }
    }

    function main(selection, fn) {
        let t = setInterval(function () {
            
            let obj = document.querySelector(selection);
            if (obj) {
                
                fn(obj);
                clearInterval(t);
            }
        }, 300);
    }
    main("#optionorder_content > div.list > div.title_list", function (targetElement) {
        console.log(targetElement);

        var textInput = document.createElement('input');
        textInput.id = 'instruction';


        var button = document.createElement('a');
        button.classList.add('btn');
        button.classList.add('preview');
        button.classList.add('btn-primary');
        button.setAttribute('href', 'javascript:void(0)');
        button.addEventListener('click', function(event) {
            var instruction = document.getElementById("instruction").value;
            console.log(instruction);
            analyze(instruction);
        });

        button.innerHTML = "RUN";

        targetElement.appendChild(textInput);
        targetElement.appendChild(button);
    });

})();
