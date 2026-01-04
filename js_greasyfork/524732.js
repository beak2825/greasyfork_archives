// ==UserScript==
// @name        CONTROL PANLE
// @namespace   Violentmonkey Scripts
// @match       https://cavegame.io/*
// @grant       none
// @version     1.0
// @author      -DevzGod
// @license     MIT
// @description 1/24/2025, 3:40:56 AM
// @downloadURL https://update.greasyfork.org/scripts/524732/CONTROL%20PANLE.user.js
// @updateURL https://update.greasyfork.org/scripts/524732/CONTROL%20PANLE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the box and add it to the page
    const box = document.createElement('div');
    box.style.width = '200px';
    box.style.height = '200px';
    box.style.backgroundColor = 'blue';
    box.style.borderRadius = '20px';
    box.style.boxShadow = '0 0 20px rgba(0, 0, 255, 0.5), 0 0 60px rgba(0, 0, 255, 0.2)';
    box.style.position = 'absolute';
    box.style.cursor = 'grab';
    box.style.transition = 'box-shadow 0.3s ease';
    document.body.appendChild(box);

    // Create the "DevHAX" title inside the blue box
    const title = document.createElement('h1');
    title.innerText = 'DevHAX';
    title.style.position = 'absolute';
    title.style.top = '10px';
    title.style.left = '50%';
    title.style.transform = 'translateX(-50%)';
    title.style.color = 'white';
    title.style.fontSize = '18px';
    title.style.fontFamily = 'Arial, sans-serif';
    title.style.margin = '0';
    box.appendChild(title);

    // Create the "Person" button inside the blue box
    const personButton = document.createElement('button');
    personButton.innerText = 'Person';
    personButton.style.position = 'absolute';
    personButton.style.bottom = '20px';
    personButton.style.left = '50%';
    personButton.style.transform = 'translateX(-50%)';
    personButton.style.padding = '10px 20px';
    personButton.style.border = 'none';
    personButton.style.borderRadius = '5px';
    personButton.style.backgroundColor = 'white';
    personButton.style.cursor = 'pointer';
    personButton.style.fontSize = '16px';
    personButton.addEventListener('mouseover', () => {
        personButton.style.backgroundColor = '#f0f0f0';
    });
    personButton.addEventListener('mouseout', () => {
        personButton.style.backgroundColor = 'white';
    });
    box.appendChild(personButton);

    // Create the "Xray | On" button inside the blue box
    const xrayButton = document.createElement('button');
    xrayButton.innerText = 'Xray | On';
    xrayButton.style.position = 'absolute';
    xrayButton.style.bottom = '60px';
    xrayButton.style.left = '50%';
    xrayButton.style.transform = 'translateX(-50%)';
    xrayButton.style.padding = '10px 20px';
    xrayButton.style.border = 'none';
    xrayButton.style.borderRadius = '5px';
    xrayButton.style.backgroundColor = 'white';
    xrayButton.style.cursor = 'pointer';
    xrayButton.style.fontSize = '16px';
    xrayButton.addEventListener('mouseover', () => {
        xrayButton.style.backgroundColor = '#f0f0f0';
    });
    xrayButton.addEventListener('mouseout', () => {
        xrayButton.style.backgroundColor = 'white';
    });

    // Toggle the button text when clicked
    xrayButton.addEventListener('click', () => {
        if (xrayButton.innerText === 'Xray | On') {
            xrayButton.innerText = 'Xray | Off';
        } else {
            xrayButton.innerText = 'Xray | On';
        }
    });

    box.appendChild(xrayButton);

    // Movable Box Script
    let isDragging = false;
    let offsetX, offsetY;

    box.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - box.getBoundingClientRect().left;
        offsetY = e.clientY - box.getBoundingClientRect().top;
        box.style.boxShadow = '0 0 30px rgba(0, 0, 255, 0.7), 0 0 100px rgba(0, 0, 255, 0.3)';
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            box.style.left = `${e.clientX - offsetX}px`;
            box.style.top = `${e.clientY - offsetY}px`;
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        box.style.boxShadow = '0 0 20px rgba(0, 0, 255, 0.5), 0 0 60px rgba(0, 0, 255, 0.2)';
    });

    // Keypress detection for `[` key
    document.addEventListener('keydown', (e) => {
        if (e.key === '[') {
            // You can perform any action when `[` is pressed
            alert('You pressed the [ key!');
            // For example, you could move the box to a new position
            box.style.left = '100px';
            box.style.top = '100px';
        }
    });

    // Button click to create a transparent circle in the center of the screen
    personButton.addEventListener('click', () => {
        const circle = document.createElement('div');
        circle.style.width = '40px'; // Smaller width
        circle.style.height = '40px'; // Smaller height
        circle.style.backgroundColor = 'transparent'; // Make the middle clear
        circle.style.border = '5px solid blue'; // Make the rim more bold (increased from 3px to 5px)
        circle.style.borderRadius = '50%'; // Perfect circle
        circle.style.boxShadow = '0 0 10px rgba(0, 0, 255, 0.5), 0 0 30px rgba(0, 0, 255, 0.2)';
        circle.style.position = 'absolute';

        // Position the circle a bit more to the left and slightly less up
        const centerX = window.innerWidth / 2 - circle.offsetWidth / 2 - 25; // Shift left by 25px (slightly more)
        const centerY = window.innerHeight / 2 - circle.offsetHeight / 2 - 25; // Shift up by 25px (slightly less)
        circle.style.left = `${centerX}px`;
        circle.style.top = `${centerY}px`;

        // Do not make the circle draggable
        // Simply append the circle to the body
        document.body.appendChild(circle);
    });

})();
