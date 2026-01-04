// ==UserScript==
// @name         Typtest
// @namespace    http://tampermonkey.net/
// @version      2024-06-22
// @description  try to take over the world!
// @author       You
// @match        http://545959.leerlingsites.nl/typingtest/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leerlingsites.nl
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498660/Typtest.user.js
// @updateURL https://update.greasyfork.org/scripts/498660/Typtest.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ms;
    var inputElement;

    function promptForDelay() {
        var userInput = prompt("Woorden per milliseconde (bijv. 1000 = sec)");
        if (userInput === null) {
            return;
        }
        var parsedInput = parseInt(userInput, 10);
        if (isNaN(parsedInput) || parsedInput <= 0) {
            alert("Invalid input. Please enter a valid positive number.");
            promptForDelay();
        } else {
            ms = parsedInput;
        }
    }

    promptForDelay();

    function typeAndDispatchEvents() {

        inputElement.value += ' ';

        var keyupEvent = new KeyboardEvent('keyup', {
            key: ' ',
            code: 'Space',
            keyCode: 32,
            charCode: 32,
            which: 32,
            bubbles: true,
            cancelable: true
        });
        inputElement.dispatchEvent(keyupEvent);
    }

    function enter() {
        var iframe = document.querySelector("#typingTest iframe");

        if (iframe) {
            function handleIframeLoad() {
                console.log("iframe loaded");
                var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                var wordElement = iframeDocument.getElementById('currentword');
                inputElement = iframeDocument.getElementById('input');

                if (wordElement && inputElement) {
                    var word = wordElement.innerText.trim();
                    console.log("Word:", word);
                    inputElement.value = word;

                    typeAndDispatchEvents();

                } else {
                    console.log("Element with id 'currentword' or 'input' not found inside the iframe.");
                }
            }

            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                console.log("iframe already loaded");
                handleIframeLoad();
            } else {
                iframe.addEventListener('load', handleIframeLoad);
            }
        } else {
            console.log("iframe with id 'typingTest' not found.");
        }

        setTimeout(enter, ms);
    }

    var button = document.createElement("button");
    button.style.backgroundColor = 'transparent';
    button.style.border = 'none';
    button.style.color = 'transparent';
    button.style.cursor = 'pointer';
    button.addEventListener("click", typeAndDispatchEvents);
    document.body.appendChild(button);

    enter();
})();
