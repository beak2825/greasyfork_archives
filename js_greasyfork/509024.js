// ==UserScript==
// @name         Cookie Clicker Ultimate Adder 🍪🍬🏆
// @namespace    https://www.cookieclicker.com/
// @version      1.3
// @description  Add cookies, sugar lumps, unlock achievements, and more with this advanced GUI for Cookie Clicker! 🍪🍬
// @author       RDNA
// @match        *://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509024/Cookie%20Clicker%20Ultimate%20Adder%20%F0%9F%8D%AA%F0%9F%8D%AC%F0%9F%8F%86.user.js
// @updateURL https://update.greasyfork.org/scripts/509024/Cookie%20Clicker%20Ultimate%20Adder%20%F0%9F%8D%AA%F0%9F%8D%AC%F0%9F%8F%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the GUI window
    let guiWindow = document.createElement('div');
    guiWindow.style.position = 'fixed';
    guiWindow.style.top = '50px';
    guiWindow.style.left = '50px';
    guiWindow.style.width = '300px';
    guiWindow.style.height = 'auto';
    guiWindow.style.backgroundColor = '#333';
    guiWindow.style.border = '2px solid #555';
    guiWindow.style.color = 'white';
    guiWindow.style.padding = '15px';
    guiWindow.style.zIndex = '9999';
    guiWindow.style.fontFamily = 'Arial, sans-serif';
    guiWindow.style.borderRadius = '8px';
    guiWindow.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
    guiWindow.id = 'cookieGUI';

    // Title
    let title = document.createElement('h2');
    title.innerText = '🍪 Cookie Clicker Ultimate Adder';
    title.style.marginTop = '0';
    title.style.marginBottom = '10px';
    title.style.textAlign = 'center';
    title.style.color = '#ffd700';
    guiWindow.appendChild(title);

    // Input for number of cookies
    let cookieInput = document.createElement('input');
    cookieInput.type = 'number';
    cookieInput.id = 'cookieAmount';
    cookieInput.placeholder = 'Enter number of cookies';
    cookieInput.style.width = '100%';
    cookieInput.style.padding = '10px';
    cookieInput.style.marginBottom = '10px';
    cookieInput.style.borderRadius = '5px';
    cookieInput.style.border = '1px solid #888';
    guiWindow.appendChild(cookieInput);

    // Add cookies button
    let addButton = document.createElement('button');
    addButton.innerText = 'Add Cookies 🍪';
    addButton.style.width = '100%';
    addButton.style.padding = '10px';
    addButton.style.backgroundColor = '#28a745';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '5px';
    addButton.style.cursor = 'pointer';
    addButton.onclick = function() {
        let amount = parseInt(document.getElementById('cookieAmount').value, 10);
        if (!isNaN(amount) && amount > 0) {
            Game.cookies = Game.cookies + amount;
            alert(`${amount} cookies added! 🍪`);
        } else {
            alert('🚨 Please enter a valid number. 🚨');
        }
    };
    guiWindow.appendChild(addButton);

    // Input for sugar lumps
    let lumpInput = document.createElement('input');
    lumpInput.type = 'number';
    lumpInput.id = 'lumpAmount';
    lumpInput.placeholder = 'Enter number of sugar lumps';
    lumpInput.style.width = '100%';
    lumpInput.style.padding = '10px';
    lumpInput.style.marginBottom = '10px';
    lumpInput.style.borderRadius = '5px';
    lumpInput.style.border = '1px solid #888';
    guiWindow.appendChild(lumpInput);

    // Add lumps button
    let addLumpButton = document.createElement('button');
    addLumpButton.innerText = 'Add Sugar Lumps 🍬';
    addLumpButton.style.width = '100%';
    addLumpButton.style.padding = '10px';
    addLumpButton.style.backgroundColor = '#ff69b4';
    addLumpButton.style.color = 'white';
    addLumpButton.style.border = 'none';
    addLumpButton.style.borderRadius = '5px';
    addLumpButton.style.cursor = 'pointer';
    addLumpButton.onclick = function() {
        let lumps = parseInt(document.getElementById('lumpAmount').value, 10);
        if (!isNaN(lumps) && lumps > 0) {
            Game.lumps = Game.lumps + lumps;
            alert(`${lumps} sugar lumps added! 🍬`);
        } else {
            alert('🚨 Please enter a valid number. 🚨');
        }
    };
    guiWindow.appendChild(addLumpButton);

    // Unlock all achievements button
    let unlockAchButton = document.createElement('button');
    unlockAchButton.innerText = 'Unlock All Achievements 🏆';
    unlockAchButton.style.width = '100%';
    unlockAchButton.style.padding = '10px';
    unlockAchButton.style.backgroundColor = '#007bff';
    unlockAchButton.style.color = 'white';
    unlockAchButton.style.border = 'none';
    unlockAchButton.style.borderRadius = '5px';
    unlockAchButton.style.cursor = 'pointer';
    unlockAchButton.style.marginTop = '10px';
    unlockAchButton.onclick = function() {
        for (let i in Game.Achievements) {
            Game.Achievements[i].unlock();
        }
        alert('All achievements unlocked! 🏆');
    };
    guiWindow.appendChild(unlockAchButton);

    // Close button
    let closeButton = document.createElement('button');
    closeButton.innerText = 'Close ❌';
    closeButton.style.width = '100%';
    closeButton.style.padding = '10px';
    closeButton.style.backgroundColor = '#dc3545';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.marginTop = '10px';
    closeButton.onclick = function() {
        document.body.removeChild(guiWindow);
    };
    guiWindow.appendChild(closeButton);

    // Append the window to the body
    document.body.appendChild(guiWindow);

    // Make the window draggable
    guiWindow.onmousedown = function(event) {
        let shiftX = event.clientX - guiWindow.getBoundingClientRect().left;
        let shiftY = event.clientY - guiWindow.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            guiWindow.style.left = pageX - shiftX + 'px';
            guiWindow.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        guiWindow.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            guiWindow.onmouseup = null;
        };
    };

    guiWindow.ondragstart = function() {
        return false;
    };
})();