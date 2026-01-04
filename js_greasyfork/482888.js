// ==UserScript==
// @name         Twitter - Remove elements
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Remove elements on Twitter.com
// @author       You
// @match        https://twitter.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482888/Twitter%20-%20Remove%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/482888/Twitter%20-%20Remove%20elements.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let keywords = [];

    function updateKeywords(text) {
        keywords = text.split(',').map(word => word.trim()).filter(word => word !== '');
    }

    function containsKeyword(element) {
        const text = element.textContent.toLowerCase();
        return keywords.some(keyword => text.includes(keyword));
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    const icon = document.createElement('div');
    icon.id = 'filterIcon';
    icon.innerHTML = '<div style="position: fixed; right: 20px; top: 50%; transform: translate(0, -50%); cursor: pointer; z-index: 9999;">🔍</div>';

    document.body.appendChild(icon);

    const windowDiv = document.createElement('div');
    windowDiv.style.position = 'fixed';
    windowDiv.style.left = '600px';
    windowDiv.style.top = '50%';
    windowDiv.style.transform = 'translate(0, -50%)';
    windowDiv.style.padding = '30px';
    windowDiv.style.height = '600px';
    windowDiv.style.backgroundColor = '#fff';
    windowDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    windowDiv.style.zIndex = '9998';
    windowDiv.style.display = 'none';

    const description = document.createElement('div');
    description.textContent = 'Block keywors:';
    description.style.marginBottom = '10px';

    const inputField = document.createElement('textarea');
    inputField.style.height = 'calc(100% - 40px)';
    inputField.style.width = '100%';
    inputField.style.resize = 'none';
    inputField.style.fontSize = '18px';
    inputField.placeholder = 'Enter text.';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'SAVE';
    saveButton.style.cursor = 'pointer';

    windowDiv.appendChild(description);
    windowDiv.appendChild(inputField);
    windowDiv.appendChild(saveButton);

    document.body.appendChild(windowDiv);

    icon.addEventListener('click', function () {
        windowDiv.style.display = windowDiv.style.display === 'none' ? 'block' : 'none';
    });

    saveButton.addEventListener('click', function () {
        const enteredText = inputField.value;
        localStorage.setItem('savedText', enteredText);
        windowDiv.style.display = 'none';
        updateKeywords(enteredText);
        location.reload();
    });

    const savedText = localStorage.getItem('savedText');
    if (savedText) {
        inputField.value = savedText;
        updateKeywords(savedText);
    }

    let removedElementsCount = 0;

    const infoDiv = document.createElement('div');
    infoDiv.style.position = 'fixed';
    infoDiv.style.top = '0px';
    infoDiv.style.left = '1150px';
    infoDiv.style.backgroundColor = '#CCC';
    infoDiv.style.padding = '10px';
    infoDiv.style.zIndex = '9999';
    document.body.appendChild(infoDiv);

    // Function to handle changes in the DOM
    function handleDOMChanges(mutationsList, observer) {
        const elementsToCheck = ['article'];

        elementsToCheck.forEach(elementType => {
            const elements = document.querySelectorAll(elementType);
            elements.forEach(element => {
                if (containsKeyword(element)) {
                    removeElement(element);
                    removedElementsCount++;
                }
            });
        });

        infoDiv.textContent = `Remove ${removedElementsCount} elements`;
        infoDiv.style.display = 'block';

        // Hide the information after 5 seconds
        setTimeout(() => {
            infoDiv.style.display = 'none';
        }, 5000);
    }

    // Use a MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(handleDOMChanges);
    const observerConfig = { childList: true, subtree: true };
    observer.observe(document.body, observerConfig);

})();
