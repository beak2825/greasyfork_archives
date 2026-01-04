// ==UserScript==
// @name         chatgpt menutemp
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Mod menu for Krunker (UND)
// @author       Chatgpt
// @match        https://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488378/chatgpt%20menutemp.user.js
// @updateURL https://update.greasyfork.org/scripts/488378/chatgpt%20menutemp.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var modMenu = document.createElement('div');
    modMenu.id = 'modMenu';
    modMenu.innerHTML = `
        <h2>Mod Menu</h2>
        <button id="toggleButton">Toggle Menu</button>
        <div id="options">
            <label for="option1">Option 1:</label>
            <input type="checkbox" id="option1">
            <label for="option2">Option 2:</label>
            <input type="checkbox" id="option2">
            <!-- Add more options as needed -->
        </div>
    `;
    document.body.appendChild(modMenu);

    modMenu.style.position = 'fixed';
    modMenu.style.top = '20px';
    modMenu.style.right = '20px';
    modMenu.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modMenu.style.color = 'white';
    modMenu.style.padding = '10px';
    modMenu.style.borderRadius = '5px';
    modMenu.style.display = 'none';

    var options = document.getElementById('options');
    options.style.marginTop = '10px';

    var optionLabels = document.querySelectorAll('#options label');
    optionLabels.forEach(function(label) {
        label.style.display = 'block';
        label.style.marginBottom = '5px';
    });

    document.addEventListener('mousedown', function(event) {
        if (event.button === 1) {
            modMenu.style.display = modMenu.style.display === 'none' ? 'block' : 'none';
        }
    });

    var toggleButton = document.getElementById('toggleButton');
    toggleButton.addEventListener('click', function() {
        options.style.display = options.style.display === 'none' ? 'block' : 'none';
    });

    var option1 = document.getElementById('option1');
    option1.addEventListener('change', function() {

    });

    var option2 = document.getElementById('option2');
    option2.addEventListener('change', function() {

    });

})();