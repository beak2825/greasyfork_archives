// ==UserScript==
// @name         Vsad a Hrej Bonus sender
// @namespace    http://tampermonkey.net/
// @version      2024-02-24/2
// @description  let's you send promo codes and tell if they are right or wrong
// @author       You
// @match        https://www.vsadahrej.cz/bonuses
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vsadahrej.cz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488262/Vsad%20a%20Hrej%20Bonus%20sender.user.js
// @updateURL https://update.greasyfork.org/scripts/488262/Vsad%20a%20Hrej%20Bonus%20sender.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const token = '';
    const playerID = 0;
    const max = 3000;
    const min = 1800;
    var textInterval = Math.random() * (max - min) + min;

    // Function to get current time in a formatted string
    function getCurrentTime() {
        var now = new Date();
        return now.toLocaleString();
    }

    // Function to log messages to a file
    async function logToDump(message) {
        var logMessage = getCurrentTime() + ' - ' + message + '\n';
        console.log(message);
    }


    // Intercept XMLHttpRequest.prototype.open to log sent packets
    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        //logToDump('Packet sent - Method: ' + method + ', URL: ' + url);
        return originalOpen.apply(this, arguments);
    };

    // Intercept XMLHttpRequest.prototype.send to log response
    var originalSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        var self = this;
        this.addEventListener('load', function() {
            try {
                var response = JSON.parse(self.responseText);
                if (response && response.errors && response.errors.length > 0) {
                    var errorMessage = response.errors[0].errorMessage;
                    logToDump('Error Message: ' + errorMessage);
                    if (errorMessage === "Promo Code not exists") {
                        // Blink red
                        blinkColor('red', 100);
                    } else {
                        // Blink green
                        blinkColor('green', 100000000);
                        for(var i = 0; i < 10; i++) {
                            logToDump("bingo");
                        }
                    }
                }
            } catch (error) {
                logToDump('Error parsing response: ' + error);
            }
        });
        return originalSend.apply(this, arguments);
    };

    // Function to blink color
    function blinkColor(color, time) {
        var originalColor = document.body.style.backgroundColor;
        document.body.style.backgroundColor = color;
        setTimeout(function() {
            document.body.style.backgroundColor = originalColor;
        }, time);
    }

    // Function to create input box with submit button
    function createInputBox() {
        var inputBox = document.createElement('input');
        inputBox.setAttribute('type', 'text');
        inputBox.setAttribute('id', 'inputText');
        var submitButton = document.createElement('button');
        submitButton.innerText = 'Submit';
        submitButton.addEventListener('click', function() {
            var inputValue = document.getElementById('inputText').value;
            var inputArray = inputValue.split(',').map(item => item.trim());
            sendTexts(inputArray);
        });
        document.body.appendChild(inputBox);
        document.body.appendChild(submitButton);
    }

    // Function to send texts with a set interval
    function sendTexts(texts) {
        var index = 0;
        var interval = setInterval(function() {
            if (index < texts.length) {
                var text = texts[index];
                if (text !== '') {
                    logToDump(text);
                    // Send the text in a packet
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', 'https://modplay.cbcap.cz/capi/v2-onling/Bonuses/UseCode?code=' + encodeURIComponent(text) + '&playerId=' + playerID);
                    xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.setRequestHeader('Authorization', token);
                    xhr.send();
                }
                index++;
            } else {
                clearInterval(interval); // Stop the interval when all texts are sent
            }
        }, textInterval); // 1 second interval between sending texts
    }

    // Call the function to create input box
    createInputBox();
})();

