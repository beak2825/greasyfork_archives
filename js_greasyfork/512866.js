// ==UserScript==
// @name         Edmentum Calculator and Search Popup
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Open a calculator and search stuff
// @author       skittlez
// @match        https://f2.app.edmentum.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512866/Edmentum%20Calculator%20and%20Search%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/512866/Edmentum%20Calculator%20and%20Search%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const popupContainer = document.createElement('div');
    popupContainer.style.position = 'fixed';
    popupContainer.style.bottom = '10px';
    popupContainer.style.right = '10px';
    popupContainer.style.width = '220px';
    popupContainer.style.padding = '10px';
    popupContainer.style.backgroundColor = 'white';
    popupContainer.style.border = '1px solid #ccc';
    popupContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    popupContainer.style.display = 'none';
    popupContainer.style.zIndex = '9999';

    popupContainer.innerHTML = `
        <h3 style="margin: 0;">Calculator</h3>
        <input type="text" id="calc-input" style="width: 100%; height: 30px; margin-bottom: 5px;" placeholder="Enter expression" />
        <button id="calc-equal" style="width: 100%;">=</button>
        <div id="calc-result" style="margin-top: 5px;"></div>

        <h3 style="margin: 10px 0 0 0;">Search</h3>
        <input type="text" id="search-input" style="width: 100%; height: 30px; margin-bottom: 5px;" placeholder="Search here" />
        <button id="search-button" style="width: 100%;">Search</button>

        <button id="calc-close" style="width: 100%; margin-top: 5px;">Close</button>
    `;

    document.body.appendChild(popupContainer);

    function showPopup() {
        popupContainer.style.display = 'block';
    }

    function hidePopup() {
        popupContainer.style.display = 'none';
    }

    function evaluateExpression() {
        const input = document.getElementById('calc-input').value;
        try {
            const result = eval(input);
            document.getElementById('calc-result').innerText = 'Result: ' + result;
        } catch (error) {
            document.getElementById('calc-result').innerText = 'Error';
        }
    }

    function performSearch() {
        const searchTerm = document.getElementById('search-input').value;
        if (searchTerm) {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
            window.open(searchUrl, '_blank');
        }
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'h' || event.key === 'H') {
            event.preventDefault();
            showPopup();
        }
    });

    document.getElementById('calc-equal').addEventListener('click', evaluateExpression);
    document.getElementById('search-button').addEventListener('click', performSearch);
    document.getElementById('calc-close').addEventListener('click', hidePopup);

})();
