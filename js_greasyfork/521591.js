// ==UserScript==
// @name         Infinite Craft Helper - Enhanced by ChatGPT
// @namespace    https://chat.openai.com/
// @version      4.20
// @description  Adds helpful features to Infinite Craft, inspired by other user scripts but with added functionality.
// @author       ChatGPT
// @match        https://neal.fun/infinite-craft/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521591/Infinite%20Craft%20Helper%20-%20Enhanced%20by%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/521591/Infinite%20Craft%20Helper%20-%20Enhanced%20by%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a toolbar container
    const toolbar = document.createElement('div');
    toolbar.id = 'ic-helper-toolbar';
    toolbar.style.position = 'fixed';
    toolbar.style.top = '10px';
    toolbar.style.left = '10px';
    toolbar.style.width = '250px';
    toolbar.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    toolbar.style.color = 'white';
    toolbar.style.border = '1px solid white';
    toolbar.style.borderRadius = '10px';
    toolbar.style.padding = '10px';
    toolbar.style.zIndex = '1000';
    toolbar.style.fontFamily = 'Arial, sans-serif';
    document.body.appendChild(toolbar);

    // Add a title to the toolbar
    const title = document.createElement('div');
    title.innerText = 'Infinite Craft Helper';
    title.style.fontSize = '16px';
    title.style.marginBottom = '10px';
    title.style.textAlign = 'center';
    title.style.fontWeight = 'bold';
    toolbar.appendChild(title);

    // Add a button for random element
    const randomButton = document.createElement('button');
    randomButton.innerText = 'Random Element';
    randomButton.style.width = '100%';
    randomButton.style.marginBottom = '10px';
    randomButton.style.padding = '5px';
    randomButton.style.backgroundColor = '#007BFF';
    randomButton.style.color = 'white';
    randomButton.style.border = 'none';
    randomButton.style.borderRadius = '5px';
    randomButton.style.cursor = 'pointer';
    randomButton.addEventListener('click', () => {
        const elements = Array.from(document.querySelectorAll('.element'));
        if (elements.length > 0) {
            const randomElement = elements[Math.floor(Math.random() * elements.length)];
            randomElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            randomElement.classList.add('highlight');
            setTimeout(() => randomElement.classList.remove('highlight'), 1000);
        } else {
            alert('No elements found!');
        }
    });
    toolbar.appendChild(randomButton);

    // Add an element lookup feature
    const lookupContainer = document.createElement('div');
    lookupContainer.style.marginBottom = '10px';

    const lookupInput = document.createElement('input');
    lookupInput.type = 'text';
    lookupInput.placeholder = 'Enter element name';
    lookupInput.style.width = 'calc(100% - 60px)';
    lookupInput.style.marginRight = '5px';
    lookupInput.style.padding = '5px';
    lookupInput.style.borderRadius = '5px';
    lookupInput.style.border = '1px solid #ccc';
    lookupContainer.appendChild(lookupInput);

    const lookupButton = document.createElement('button');
    lookupButton.innerText = 'Lookup';
    lookupButton.style.width = '50px';
    lookupButton.style.padding = '5px';
    lookupButton.style.backgroundColor = '#28A745';
    lookupButton.style.color = 'white';
    lookupButton.style.border = 'none';
    lookupButton.style.borderRadius = '5px';
    lookupButton.style.cursor = 'pointer';

    lookupButton.addEventListener('click', () => {
        const elementName = lookupInput.value.trim();
        if (elementName) {
            const url = `https://infinibrowser.wiki/item/${encodeURIComponent(elementName)}`;
            fetch(url, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        const resultOverlay = document.createElement('div');
                        resultOverlay.style.position = 'fixed';
                        resultOverlay.style.top = '50%';
                        resultOverlay.style.left = '50%';
                        resultOverlay.style.transform = 'translate(-50%, -50%)';
                        resultOverlay.style.backgroundColor = 'white';
                        resultOverlay.style.color = 'black';
                        resultOverlay.style.padding = '20px';
                        resultOverlay.style.border = '2px solid black';
                        resultOverlay.style.borderRadius = '10px';
                        resultOverlay.style.zIndex = '2000';

                        const resultText = document.createElement('p');
                        resultText.innerText = `Found element: ${elementName}`;
                        resultOverlay.appendChild(resultText);

                        const openButton = document.createElement('button');
                        openButton.innerText = 'Open in Infinibrowser';
                        openButton.style.marginTop = '10px';
                        openButton.style.padding = '5px 10px';
                        openButton.style.backgroundColor = '#007BFF';
                        openButton.style.color = 'white';
                        openButton.style.border = 'none';
                        openButton.style.borderRadius = '5px';
                        openButton.style.cursor = 'pointer';

                        openButton.addEventListener('click', () => {
                            window.open(url, '_blank');
                            resultOverlay.remove();
                        });

                        resultOverlay.appendChild(openButton);

                        const closeButton = document.createElement('button');
                        closeButton.innerText = 'Close';
                        closeButton.style.marginTop = '10px';
                        closeButton.style.marginLeft = '10px';
                        closeButton.style.padding = '5px 10px';
                        closeButton.style.backgroundColor = '#DC3545';
                        closeButton.style.color = 'white';
                        closeButton.style.border = 'none';
                        closeButton.style.borderRadius = '5px';
                        closeButton.style.cursor = 'pointer';

                        closeButton.addEventListener('click', () => {
                            resultOverlay.remove();
                        });

                        resultOverlay.appendChild(closeButton);
                        document.body.appendChild(resultOverlay);
                    } else {
                        alert('Element not in infinibrowser!');
                    }
                })
                .catch(() => {
                    alert('Element not in infinibrowser!');
                });
        } else {
            alert('Please enter an element name.');
        }
    });

    lookupContainer.appendChild(lookupButton);
    toolbar.appendChild(lookupContainer);

    // Add quick links section
    const quickLinks = document.createElement('div');
    quickLinks.innerHTML = '<p style="margin: 5px 0; font-size: 14px;">Quick Links:</p>' +
        '<ul style="list-style: none; padding: 0; margin: 0; font-size: 12px;">' +
        '<li><a href="https://neal.fun/" target="_blank" style="color: #00C0FF;">Neal.fun</a></li>' +
        '<li><a href="https://infinibrowser.wiki/" target="_blank" style="color: #00C0FF;">Infinibrowser Wiki</a></li>' +
        '</ul>';
    toolbar.appendChild(quickLinks);

    // Highlight style for random element
    const highlightStyle = document.createElement('style');
    highlightStyle.innerText = `
        .highlight {
            outline: 3px solid #FF0000;
            transition: outline 0.5s ease-out;
        }
    `;
    document.head.appendChild(highlightStyle);
})();
