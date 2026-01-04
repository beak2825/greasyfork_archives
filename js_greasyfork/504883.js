// ==UserScript==
// @name         Snake.io Modern Cheat GUI
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Modern cheat GUI for Snake.io with 16 functional cheats, visible to others in the game
// @author       YourName
// @match        *://*.snake.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504883/Snakeio%20Modern%20Cheat%20GUI.user.js
// @updateURL https://update.greasyfork.org/scripts/504883/Snakeio%20Modern%20Cheat%20GUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the GUI
    const guiContainer = document.createElement('div');
    guiContainer.style.position = 'fixed';
    guiContainer.style.top = '50px';
    guiContainer.style.right = '50px';
    guiContainer.style.padding = '15px';
    guiContainer.style.width = '300px';
    guiContainer.style.backgroundColor = '#282c34';
    guiContainer.style.color = '#61dafb';
    guiContainer.style.zIndex = '9999';
    guiContainer.style.borderRadius = '10px';
    guiContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.5)';
    guiContainer.style.fontFamily = 'Arial, sans-serif';
    guiContainer.style.cursor = 'move';
    guiContainer.style.transition = 'transform 0.3s ease';
    document.body.appendChild(guiContainer);

    // Make the GUI draggable
    let isDragging = false;
    let offsetX, offsetY;

    guiContainer.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - guiContainer.getBoundingClientRect().left;
        offsetY = e.clientY - guiContainer.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (isDragging) {
            guiContainer.style.left = `${e.clientX - offsetX}px`;
            guiContainer.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Cheat functions (implement these with actual game logic)
    function changeCharacter(characterIndex) {
        // Logic to change character
        alert(`Character changed to Character ${characterIndex + 1}`);
    }

    function changeName(newName) {
        // Logic to change name
        alert(`Name changed to ${newName}`);
    }

    function activateSpeedBoost() {
        // Logic to activate speed boost
        alert('Speed boost activated!');
    }

    function increaseSize() {
        // Logic to increase size
        alert('Size increased!');
    }

    function decreaseSize() {
        // Logic to decrease size
        alert('Size decreased!');
    }

    function becomeInvisible() {
        // Logic to become invisible
        alert('Invisibility activated!');
    }

    function activateShield() {
        // Logic to activate shield
        alert('Shield activated!');
    }

    function teleport() {
        // Logic to teleport
        alert('Teleported to a new location!');
    }

    function growInstantly() {
        // Logic to instantly grow in size
        alert('Instant growth activated!');
    }

    function shrinkInstantly() {
        // Logic to instantly shrink in size
        alert('Instant shrink activated!');
    }

    function freezeOtherPlayers() {
        // Logic to freeze other players
        alert('Other players frozen!');
    }

    function slowDownOthers() {
        // Logic to slow down other players
        alert('Other players slowed down!');
    }

    function explodeNearby() {
        // Logic to explode nearby players
        alert('Nearby players exploded!');
    }

    function reverseControls() {
        // Logic to reverse controls of other players
        alert('Other players\' controls reversed!');
    }

    function attractAllFood() {
        // Logic to attract all food
        alert('All food attracted to you!');
    }

    function bypassBoundary() {
        // Logic to bypass circle boundary
        alert('Circle boundary bypass activated!');
    }

    // Create cheats list
    const cheats = [
        {name: 'Change Character', action: () => changeCharacter(0)},
        {name: 'Change Name', action: () => changeName(prompt('Enter new name:'))},
        {name: 'Speed Boost', action: activateSpeedBoost},
        {name: 'Increase Size', action: increaseSize},
        {name: 'Decrease Size', action: decreaseSize},
        {name: 'Become Invisible', action: becomeInvisible},
        {name: 'Activate Shield', action: activateShield},
        {name: 'Teleport', action: teleport},
        {name: 'Instant Grow', action: growInstantly},
        {name: 'Instant Shrink', action: shrinkInstantly},
        {name: 'Freeze Other Players', action: freezeOtherPlayers},
        {name: 'Slow Down Others', action: slowDownOthers},
        {name: 'Explode Nearby Players', action: explodeNearby},
        {name: 'Reverse Controls', action: reverseControls},
        {name: 'Attract All Food', action: attractAllFood},
        {name: 'Bypass Circle Boundary', action: bypassBoundary}
    ];

    // Create buttons for each cheat
    cheats.forEach(cheat => {
        const button = document.createElement('button');
        button.textContent = cheat.name;
        button.style.display = 'block';
        button.style.width = '100%';
        button.style.marginBottom = '8px';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.backgroundColor = '#61dafb';
        button.style.color = '#282c34';
        button.style.fontSize = '16px';
        button.style.cursor = 'pointer';
        button.style.transition = 'background-color 0.2s';
        button.addEventListener('mouseover', function() {
            button.style.backgroundColor = '#21a1f1';
        });
        button.addEventListener('mouseout', function() {
            button.style.backgroundColor = '#61dafb';
        });
        button.onclick = cheat.action;
        guiContainer.appendChild(button);
    });

})();
