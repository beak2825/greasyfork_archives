// ==UserScript==
// @name         PICheat
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Cheat that shows the test answers on pasja-informatyki.pl
// @author       nyxiereal
// @match        https://pasja-informatyki.pl/*/test/*
// @grant        none
// @license GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/529427/PICheat.user.js
// @updateURL https://update.greasyfork.org/scripts/529427/PICheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Extract the ans array from the HTML content
    const ansLine = document.body.innerHTML.match(/ans\[\d+\] = "[a-z]";/g);
    if (ansLine) {
        const ansArray = ansLine.map(item => item.match(/"([a-z])"/)[1]);

        // Create a container for the list
        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '50px';
        container.style.left = '0';
        container.style.width = '75px';
        container.style.backgroundColor = '#f8f9fa';
        container.style.zIndex = '1000';
        container.style.padding = '10px';
        container.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        container.style.overflowY = 'auto';
        container.style.maxHeight = '90vh';

        // Create the list
        const list = document.createElement('ol');
        ansArray.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${item}`;
            list.appendChild(listItem);
        });

        // Create the hide button
        const hideButton = document.createElement('button');
        hideButton.textContent = 'Hide';
        hideButton.style.padding = '5px 10px';
        hideButton.style.backgroundColor = '#007bff';
        hideButton.style.color = 'white';
        hideButton.style.border = 'none';
        hideButton.style.borderRadius = '3px';
        hideButton.style.cursor = 'pointer';
        hideButton.style.marginTop = '10px';

        // Append the list and button to the container
        container.appendChild(list);
        container.appendChild(hideButton);

        // Append the container to the body
        document.body.appendChild(container);

        // Add event listener to the hide button
        hideButton.addEventListener('click', () => {
            container.style.display = 'none';
        });
    }
})();