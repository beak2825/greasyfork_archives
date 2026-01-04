// ==UserScript==
// @name        Quick Dump
// @description Search the dump without the 4 second animation
// @namespace   Violentmonkey Scripts
// @license MIT
// @match       https://www.torn.com/dump.php*
// @version 0.0.1.20241218060543
// @downloadURL https://update.greasyfork.org/scripts/520989/Quick%20Dump.user.js
// @updateURL https://update.greasyfork.org/scripts/520989/Quick%20Dump.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to perform the search action and update the result
    function performSearch() {
        $.ajax({
            url: 'dump.php?step=search',
            type: 'POST',
            data: {},
            success: function(response) {
                var msg = JSON.parse(response);
                const resultBox = document.getElementById('resultBox');
                if (msg.success) {
                    resultBox.innerHTML = msg.text;
                } else {
                    resultBox.innerHTML = msg.text;
                }
            },
            error: function(error) {
                const resultBox = document.getElementById('resultBox');
                resultBox.textContent = 'Error: ' + error.message;
            },
        });
    }

    // Function to add a floating button and result text box
    // Function to add a floating button and result text box
    function addButtonAndResultBox() {
        // Add the floating button
        const newButton = document.createElement('button');
        newButton.textContent = 'Simulate Search';
        newButton.style.padding = '10px 20px';
        newButton.style.backgroundColor = '#007bff';
        newButton.style.color = '#fff';
        newButton.style.border = 'none';
        newButton.style.borderRadius = '5px';
        newButton.style.cursor = 'pointer';
        newButton.style.display = 'block'; // Ensure the button is displayed
        newButton.style.zIndex = '1000'; // Ensure the button is on top
        newButton.addEventListener('click', function(event) {
            event.preventDefault();
            performSearch();
        });

        // Add the result text box
        const resultBox = document.createElement('div');
        resultBox.id = 'resultBox';
        resultBox.style.padding = '10px 20px';
        resultBox.style.backgroundColor = '#f8f9fa';
        resultBox.style.color = '#000';
        resultBox.style.border = '1px solid #ddd';
        resultBox.style.borderRadius = '5px';
        resultBox.style.marginTop = '10px';
        resultBox.style.display = 'block'; // Ensure the result box is displayed
        resultBox.style.zIndex = '1000'; // Ensure the result box is on top

        // Append the button and result box to the end of the dump-main-page element
        const targetElement = document.querySelector('.dump-main-page');
        if (targetElement) {
            console.log('Target element found:', targetElement);
            targetElement.appendChild(newButton);
            targetElement.appendChild(resultBox);
            console.log('Button and result box added.');
        } else {
            console.log('Target element not found.');
        }
    }
    // Function to handle the element when it loads
    function handleElementLoad() {
        console.log('Element loaded');
        addButtonAndResultBox();
    }

    // Create a MutationObserver to observe changes in the DOM
    const observer = new MutationObserver(function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const targetElement = document.querySelector('.dump.search-block.cont-gray.bottom-round');
                if (targetElement) {
                    handleElementLoad();
                    observer.disconnect(); // Stop observing once the element is found
                    break;
                }
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();

