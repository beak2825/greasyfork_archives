// ==UserScript==
// @name         Key press visual representation
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Shows what keys you are hitting, **press escape to open the menu** Can be useful for .io game streaming, tutorials, etc.
// @author       MrBlank
// @match        *://lolbeans.io/*
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://*.smashkarts.io/*
// @match        *://*.sploop.io/*
// @match        *://*.yohoho.io/*
// @match        *://*.brutal.io/*
// @match        *://*.bonk.io/*
// @match        *://*.florr.io/*
// @match        *://*.copter.io/*
// @match        *://*.defly.io/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3qlribLz6iUSvZNdelROWb7FlW5yGDJGgog&s
// @downloadURL https://update.greasyfork.org/scripts/489194/Key%20press%20visual%20representation.user.js
// @updateURL https://update.greasyfork.org/scripts/489194/Key%20press%20visual%20representation.meta.js
// ==/UserScript==

//PRESS ESCAPE TO OEPN THE MENU

(function() {
    'use strict';

    var styles = `
        .key-press-menu {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #f0f0f0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 15px;
            font-family: Arial, sans-serif;
            z-index: 10000;
            display: none;
            resize: both;
            overflow: auto;
            min-width: 200px;
            min-height: 150px;
            max-width: 600px; /* Restrict max width */
            max-height: 400px; /* Restrict max height */
        }
        .key-press-menu h3 {
            margin-top: 0;
            color: #333;
        }
        .key-press-menu input, .key-press-menu button, .key-press-menu select {
            margin: 5px 0;
            padding: 5px;
            width: 100%;
            box-sizing: border-box;
        }
        .key-press-menu button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
        }
        .key-box {
            position: fixed;
            width: 50px;
            height: 50px;
            background-color: transparent;
            border: 2px solid #333;
            text-align: center;
            line-height: 50px;
            font-family: Arial, sans-serif;
            font-weight: bold;
            color: #333;
            cursor: move;
            user-select: none;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    `;

    // Add styles to the document
    var styleElement = document.createElement('style');
    styleElement.textContent = styles;
    document.head.appendChild(styleElement);

    function createMenu() {
        var menuContainer = document.createElement('div');
        menuContainer.className = 'key-press-menu';
        menuContainer.innerHTML = `
            <h3>Key Press Settings</h3>
            <input type="text" id="keyInput" placeholder="Enter key">
            <input type="color" id="colorInput" value="#ff0000">
            <button id="addKeyButton">Add Key</button>
            <select id="removeKeySelect"></select>
            <button id="removeKeyButton">Remove Selected Key</button>
        `;
        document.body.appendChild(menuContainer);

        // Add key
        document.getElementById('addKeyButton').addEventListener('click', function() {
            var key = document.getElementById('keyInput').value.toUpperCase();
            var color = document.getElementById('colorInput').value;
            if (key && color) {
                addKeyBox(key, color, {top: 100, left: 100});
                document.getElementById('keyInput').value = '';
                saveKeys();
                updateRemoveKeySelect();
            }
        });

        // Remove key
        document.getElementById('removeKeyButton').addEventListener('click', function() {
            var select = document.getElementById('removeKeySelect');
            var selectedKey = select.value;
            if (selectedKey) {
                removeKeyBox(selectedKey);
                saveKeys();
                updateRemoveKeySelect();
                trackRemovedKey(selectedKey);
            }
        });
    }

    function toggleMenu() {
        var menuContainer = document.querySelector('.key-press-menu');
        if (menuContainer.style.display === 'none' || menuContainer.style.display === '') {
            menuContainer.style.display = 'block';
        } else {
            menuContainer.style.display = 'none';
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            toggleMenu();
        }
    });

    function addKeyBox(key, color, pos) {
        var box = document.createElement('div');
        box.className = 'key-box';
        box.textContent = key;
        box.dataset.color = color;
        box.style.left = `${pos.left}px`;
        box.style.top = `${pos.top}px`;
        if (key === 'SPACE') {
            box.style.width = '200px';
            box.style.height = '50px';
        }
        document.body.appendChild(box);
        makeDraggable(box);
    }

    function removeKeyBox(key) {
        var keyBoxes = document.querySelectorAll('.key-box');
        keyBoxes.forEach(function(box) {
            if (box.textContent === key) {
                document.body.removeChild(box);
            }
        });
    }

    function makeDraggable(element) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = `${element.offsetTop - pos2}px`;
            element.style.left = `${element.offsetLeft - pos1}px`;
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            saveKeys();
        }
    }

    function saveKeys() {
        var keys = [];
        document.querySelectorAll('.key-box').forEach(function(box) {
            keys.push({
                key: box.textContent,
                color: box.dataset.color,
                top: parseInt(box.style.top),
                left: parseInt(box.style.left)
            });
        });
        localStorage.setItem('keyPressVisualKeys', JSON.stringify(keys));
    }

    function loadKeys() {
        var storedKeys = JSON.parse(localStorage.getItem('keyPressVisualKeys')) || [];
        var removedKeys = JSON.parse(localStorage.getItem('removedKeys')) || [];
        var existingKeys = new Set(storedKeys.map(item => item.key));

        storedKeys.forEach(function(item) {
            addKeyBox(item.key, item.color, { top: item.top, left: item.left });
        });

        var defaultKeys = [
            { key: 'W', color: '#ff0000', top: 50, left: 150 },
            { key: 'A', color: '#00ff00', top: 110, left: 90 },
            { key: 'S', color: '#0000ff', top: 110, left: 150 },
            { key: 'D', color: '#ffff00', top: 110, left: 210 },
            { key: 'SPACE', color: '#ff00ff', top: 170, left: 90 },
            { key: 'CONTROL', color: '#00ffff', top: 50, left: 60 }
        ];

        defaultKeys.forEach(function(item) {
            if (!existingKeys.has(item.key) && !removedKeys.includes(item.key)) {
                addKeyBox(item.key, item.color, { top: item.top, left: item.left });
                existingKeys.add(item.key);
            }
        });

        updateRemoveKeySelect();
    }

    function updateRemoveKeySelect() {
        var select = document.getElementById('removeKeySelect');
        select.innerHTML = ''; // Clear options
        document.querySelectorAll('.key-box').forEach(function(box) {
            var option = document.createElement('option');
            option.value = box.textContent;
            option.textContent = box.textContent;
            select.appendChild(option);
        });
    }

    function trackRemovedKey(key) {
        var removedKeys = JSON.parse(localStorage.getItem('removedKeys')) || [];
        if (!removedKeys.includes(key)) {
            removedKeys.push(key);
            localStorage.setItem('removedKeys', JSON.stringify(removedKeys));
        }
    }

    createMenu();
    loadKeys();

    function resetColor(box) {
        box.style.backgroundColor = 'transparent';
    }

    function changeColor(box, color) {
        box.style.backgroundColor = color;
    }

    document.addEventListener('keydown', function(event) {
        var key = event.key.toUpperCase();
        if (key === " ") key = "SPACE";
        if (key === "CONTROL") key = "CONTROL";

        var keyBoxes = document.querySelectorAll('.key-box');
        keyBoxes.forEach(function(box) {
            if (box.textContent === key) {
                changeColor(box, box.dataset.color);
            }
        });
    });

    document.addEventListener('keyup', function(event) {
        var key = event.key.toUpperCase();
        if (key === " ") key = "SPACE";
        if (key === "CONTROL") key = "CONTROL";

        var keyBoxes = document.querySelectorAll('.key-box');
        keyBoxes.forEach(function(box) {
            if (box.textContent === key) {
                resetColor(box);
            }
        });
    });
    setInterval(function() {
        var keyBoxes = document.querySelectorAll('.key-box');
        keyBoxes.forEach(function(box) {
            document.body.appendChild(box);
        });
    }, 1000);
})();
