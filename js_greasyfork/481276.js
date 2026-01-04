// ==UserScript==
// @name         Custom Crosshairs for Krunker, 1v1.lol, and Anything Else.
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Custom Crosshiars For Literally ANYTHING--Hide The Menu Using "P"
// @author       LCM
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481276/Custom%20Crosshairs%20for%20Krunker%2C%201v1lol%2C%20and%20Anything%20Else.user.js
// @updateURL https://update.greasyfork.org/scripts/481276/Custom%20Crosshairs%20for%20Krunker%2C%201v1lol%2C%20and%20Anything%20Else.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a container for the menu
    const menuContainer = document.createElement('div');
    menuContainer.style.position = 'fixed';
    menuContainer.style.top = '10px';
    menuContainer.style.left = '10px';
    menuContainer.style.zIndex = '10000';
    menuContainer.style.backgroundColor = 'black';
    menuContainer.style.padding = '50px'; // Increased padding for more space
    menuContainer.style.borderRadius = '10px';
    menuContainer.style.display = 'flex'; // Use flexbox for better layout control
    menuContainer.style.flexDirection = 'column'; // Align buttons vertically
    menuContainer.style.userSelect = 'none'; // Disable text selection

    // Make the menu draggable
    makeDraggable(menuContainer);

    // Make the menu resizable
    makeResizable(menuContainer);

    // Create an "Authors" title
    const authorsTitle = document.createElement('div');
    authorsTitle.innerText = 'Made By - LCM';
    authorsTitle.style.color = 'white';
    authorsTitle.style.fontWeight = 'bold';
    authorsTitle.style.marginBottom = '10px';
    menuContainer.appendChild(authorsTitle);

    // Create buttons to toggle different shapes
    const shapeButtons = ['Square', 'Circle', 'ESP Rectangle'].map(createShapeButton);

    // Create shape elements
    const shapes = {
        Square: createShape('20px', '20px', '2px solid white'),
        Circle: createShape('20px', '20px', '2px solid white', '50%', '50%'),
        'ESP Rectangle': createShape('60px', '30px', '2px solid white', '0deg', '50%', '50%'),
    };

    // Append the shapes to the body
    Object.values(shapes).forEach(shape => document.body.appendChild(shape));

    // Append the menu container to the body
    document.body.appendChild(menuContainer);

    // Append the buttons to the menu container
    shapeButtons.forEach(button => menuContainer.appendChild(button));

    // Add buttons for Red, Blue, Green, Purple, White Crosshairs
    const redCrosshairsButton = createColorButton('Red Crosshairs', 'red');
    const blueCrosshairsButton = createColorButton('Blue Crosshairs', 'blue');
    const greenCrosshairsButton = createColorButton('Green Crosshairs', 'green');
    const purpleCrosshairsButton = createColorButton('Purple Crosshairs', 'purple');
    const whiteCrosshairsButton = createColorButton('White Crosshairs', 'white');
    menuContainer.appendChild(redCrosshairsButton);
    menuContainer.appendChild(blueCrosshairsButton);
    menuContainer.appendChild(greenCrosshairsButton);
    menuContainer.appendChild(purpleCrosshairsButton);
    menuContainer.appendChild(whiteCrosshairsButton);

    // Hotkey to toggle menu visibility
    document.addEventListener('keydown', (event) => {
        if (event.key === 'p' || event.key === 'P') {
            toggleMenuVisibility();
        }
    });

    // Function to toggle the display of the menu
    function toggleMenuVisibility() {
        if (menuContainer.style.display === 'none') {
            menuContainer.style.display = 'flex';
        } else {
            menuContainer.style.display = 'none';
        }
    }

    // Function to make an element draggable
    function makeDraggable(element) {
        let offsetX, offsetY;
        let isDragging = false;

        element.addEventListener('mousedown', (event) => {
            isDragging = true;
            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;
        });

        document.addEventListener('mousemove', (event) => {
            if (isDragging) {
                element.style.left = event.clientX - offsetX + 'px';
                element.style.top = event.clientY - offsetY + 'px';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // Function to make an element resizable
    function makeResizable(element) {
        const handle = document.createElement('div');
        handle.style.position = 'absolute';
        handle.style.width = '10px';
        handle.style.height = '10px';
        handle.style.background = 'white';
        handle.style.right = '0';
        handle.style.bottom = '0';
        handle.style.cursor = 'se-resize';

        handle.addEventListener('mousedown', (event) => {
            event.preventDefault();
            const startX = event.clientX;
            const startY = event.clientY;
            const startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
            const startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

            function handleMouseMove(e) {
                const newWidth = startWidth + e.clientX - startX;
                const newHeight = startHeight + e.clientY - startY;
                element.style.width = `${newWidth}px`;
                element.style.height = `${newHeight}px`;
            }

            function handleMouseUp() {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        element.appendChild(handle);
    }

    // Function to create a button for a shape
    function createShapeButton(shape) {
        const button = document.createElement('button');
        button.innerText = `Toggle ${shape}`;
        button.style.marginBottom = '10px'; // Adjust the margin
        button.style.width = '100%';
        button.addEventListener('click', () => toggleShape(shape));
        return button;
    }

    // Function to toggle the display of a shape
    function toggleShape(shape) {
        const currentShape = shapes[shape];
        if (currentShape.style.display === 'none') {
            currentShape.style.display = 'block';
        } else {
            currentShape.style.display = 'none';
        }
    }

    // Function to create a button for a color
    function createColorButton(label, color) {
        const button = document.createElement('button');
        button.innerText = label;
        button.style.marginTop = '10px'; // Adjusted margin to separate from other buttons
        button.style.width = '100%';
        button.style.height = '40px'; // Set the height for a square button
        button.style.backgroundColor = color;
        button.addEventListener('click', () => toggleColorCrosshairs(color));
        return button;
    }

    // Function to toggle the color of all shapes to the specified color
    function toggleColorCrosshairs(color) {
        Object.values(shapes).forEach(shape => {
            shape.style.borderColor = color;
        });
    }

    // Function to create a basic shape element
    function createShape(width, height, border, borderRadius = '0', positionTop = '50%', positionLeft = '50%', transform = '0') {
        const shape = document.createElement('div');
        shape.style.position = 'fixed';
        shape.style.top = positionTop;
        shape.style.left = positionLeft;
        shape.style.transform = `translate(-${positionLeft}, -${positionTop}) rotate(${transform})`;
        shape.style.width = width;
        shape.style.height = height;
        shape.style.border = border;
        shape.style.borderRadius = borderRadius;
        shape.style.boxSizing = 'border-box';
        shape.style.zIndex = '9999';
        shape.style.display = 'none';
        return shape;
    }
})();
