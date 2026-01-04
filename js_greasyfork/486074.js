// ==UserScript==
// @name         Trotec Ruby® - Move to Center
// @namespace    http://neoque.to
// @version      0.91
// @description  Enhances Trotec Ruby® interface with additional buttons for capturing positions and calculating center. This userscript is in no way, shape or form associated, supported or approved by Trotec Laser GmbH. By using it you understand that it may void your warranty or invalidate your Trotec Ruby® license. You are using it at your own risk. 
// @author       neoqueto
// @match        *://localhost:*/app/prepare/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486074/Trotec%20Ruby%C2%AE%20-%20Move%20to%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/486074/Trotec%20Ruby%C2%AE%20-%20Move%20to%20Center.meta.js
// ==/UserScript==

// How-to:
// 1. You have an item or a piece of material to cut/engrave on your Trotec laser and you want to know where its center is (rectangular boundaries)
// 2. Ensure that your piece is lined up on both axes and focused across the entire Z-plane.
//    Make absolutely sure that there are NO OBSTACLES anywhere within or near the boundaries of the rectangle that could cause a head crash
// 3. Manually move the red dot to your desired X1 position, this will be the first (likely left side) edge of the rectangle.
//    If you have an item to engrave, ensure that the red dot is halfway on the left edge of your item. If your item is circular or elliptic,
//    you may want to manually scan across the Y axis to check if the X1 line is on the point furthermost to the left of your item.
//    Then ensure that you are in the "Prepare mode", and click the "Capture x1" button at the bottom right. 
//    In no time that action will become second nature. 
// 4. Do it 3 more times, for Y1, X2 and Y2. The order doesn't matter. For Y lines, scan across the X axis if you need to. 
//    If you want to obtain just the horizontal or vertical center point,
//    click Y1 and Y2 or X1 and X2 (respectively) without manually adjusting the red dot
// 5. The order should not actually matter. X1 can be the right edge
// 6. Click on "Move to center", the laser head will automatically move to the center of the measured rectangle
// 7. Now you can snap the center of your design to the crosshair. Make sure that snapping is enabled
// 8. Additionally, size measures are displayed underneath the buttons.
// 9. This userscript is in no way, shape or form associated, supported or approved by Trotec Laser GmbH. 
//    By using it you understand that it may void your warranty or invalidate your Trotec Ruby® license. You are using it at your own risk. 
//
//
// Example of a measurement:
//
//             |                     |
//             |                     |
//             |                     |
// ------------+-------------Y1------+---------------
//             |                     |
//             |                     X2
//             |                     |
//             |          x          |
//            X1                     |
//             |                     |
//             |                     |
// ------------+---------Y2----------+---------------
//             |                     |
//             |                     |
//             |                     |
//
//DISTRIBUTED UNDER THE MIT LICENSE:
//Copyright © 2024 Michał Nowak (Neoqueto)
//
//Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function() {
    'use strict';

    let capturedX1, capturedY1, capturedX2, capturedY2;

    // Function to create and insert buttons
    function createButtons() {
        const laserPosition = document.querySelector('.laser-position');
        if (laserPosition && !document.getElementById('captureButtons')) {
            const captureButtonsDiv = document.createElement('div');
            captureButtonsDiv.id = 'captureButtons';
            captureButtonsDiv.style.display = 'block';
            captureButtonsDiv.innerHTML = `
                <button id="captureX1">Capture x1</button>
                <button id="captureY1">Capture y1</button>
                <button id="captureX2">Capture x2</button>
                <button id="captureY2">Capture y2</button>
                <button id="calculateCenter" disabled>Move to center</button>
                <div id="rectangleDimensions"></div>
            `;
            laserPosition.appendChild(captureButtonsDiv);

            // Add click event listeners to the capture buttons
            captureButtonsDiv.addEventListener('click', function(event) {
                const targetButton = event.target;
                if (targetButton.tagName === 'BUTTON' && targetButton.id !== 'calculateCenter') {
                    capturePosition(targetButton.id);
                } else if (targetButton.id === 'calculateCenter') {
                    calculateCenter();
                }
            });
        }
    }

    // Function to hide buttons when mat-icon is not present
    function hideButtons() {
        const laserPosition = document.querySelector('.laser-position');
        const captureButtonsDiv = document.getElementById('captureButtons');
        if (laserPosition && captureButtonsDiv) {
            const matIcon = laserPosition.querySelector('mat-icon');
            if (!matIcon) {
                captureButtonsDiv.style.display = 'none';
            }
        }
    }

    // Simulate click on mat-icon using dispatchEvent()
    function simulateMatIconClick() {
        const laserPosition = document.querySelector('.laser-position');
        const matIcon = laserPosition.querySelector('mat-icon');
        if (matIcon) {
            const clickEvent = new Event('click', { bubbles: true });
            matIcon.dispatchEvent(clickEvent);
        }
    }

    // Function to capture X and Y values
    function capturePosition(buttonId) {
        const laserPosition = document.querySelector('.laser-position');
        const positionDivs = laserPosition.querySelectorAll('.flex div');
        if (positionDivs.length >= 3) {
            const xValue = parseFloat(positionDivs[0].textContent.split('X:')[1]);
            const yValue = parseFloat(positionDivs[1].textContent.split('Y:')[1]);

            switch (buttonId) {
                case 'captureX1':
                    capturedX1 = xValue;
                    break;
                case 'captureY1':
                    capturedY1 = yValue;
                    break;
                case 'captureX2':
                    capturedX2 = xValue;
                    break;
                case 'captureY2':
                    capturedY2 = yValue;
                    break;
            }

            // Enable or disable "Calculate center" button based on captured positions
            const calculateCenterButton = document.getElementById('calculateCenter');
            if (calculateCenterButton) {
                calculateCenterButton.disabled = !(capturedX1 !== undefined && capturedY1 !== undefined && capturedX2 !== undefined && capturedY2 !== undefined);
            }
        }
    }

    // Function to calculate center and log results
    function calculateCenter() {
        if (capturedX1 !== undefined && capturedY1 !== undefined && capturedX2 !== undefined && capturedY2 !== undefined) {
            const centerX = (capturedX1 + capturedX2) / 2;
            const centerY = (capturedY1 + capturedY2) / 2;
            const width = Math.abs(capturedX2 - capturedX1);
            const height = Math.abs(capturedY2 - capturedY1);

            console.log('Center:', centerX, centerY);
            console.log('Width:', width);
            console.log('Height:', height);

            // Show width and height in the div underneath the buttons (truncated to 3 decimal points)
            const rectangleDimensionsDiv = document.getElementById('rectangleDimensions');
            if (rectangleDimensionsDiv) {
                rectangleDimensionsDiv.textContent = `Width: ${width.toFixed(3)} mm, Height: ${height.toFixed(3)} mm`;
            }

            // Simulate click on mat-icon
            simulateMatIconClick();

            // Wait 200 milliseconds before setting inputs and clicking widget button
            setTimeout(() => {
                setInputs(centerX, centerY);
                clickWidgetButton();
            }, 200);
        } else {
            console.error('Error: Please capture all four positions before calculating the center.');
        }
    }

    // Function to set inputs to calculated center values
    function setInputs(centerX, centerY) {
        const xInput = document.querySelector('#widgets .floating-widget > div > div > div > div > div:nth-of-type(5) input');
        const yInput = document.querySelector('#widgets .floating-widget > div > div > div > div > div:nth-of-type(2) input');
        if (xInput && yInput) {
            xInput.value = '';
            xInput.focus();
            document.execCommand('insertText', false, centerX);

            yInput.value = '';
            yInput.focus();
            document.execCommand('insertText', false, centerY);
        }
    }

    // Function to simulate click on widget button
    function clickWidgetButton() {
        const widgetButton = document.querySelector('#widgets .floating-widget div[role="button"] > div > div');
        if (widgetButton && ['Ustaw pozycję', 'Set position', 'Position einstellen'].includes(widgetButton.textContent.trim())) {
            widgetButton.click();
        }
    }

    // Insert custom styles
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #captureButtons {
            margin-top: 10px;
        }
        #rectangleDimensions {
            margin-top: 10px;
        }
        button#captureX1,
        button#captureY1,
        button#captureX2,
        button#captureY2,
        button#calculateCenter {
            color: black;
            background: white;
            padding: 2px 8px;
            border-radius: 4px;
            box-shadow: 0px 3px 5px rgba(0,0,0,.5);
        }
        button#captureX1:hover,
        button#captureY1:hover,
        button#captureX2:hover,
        button#captureY2:hover,
        button#calculateCenter:hover:not(:disabled) {
            background: #e6e6e6;
            box-shadow: 0px 3px 10px rgba(0,0,0,.5);
        }
        button#captureX1:active,
        button#captureY1:active,
        button#captureX2:active,
        button#captureY2:active,
        button#calculateCenter:active:not(:disabled) {
            background: #939393;
            box-shadow: 0px 0px 10px rgba(0,0,0,.5);
            transform: translateY(3px);
        }
        button#calculateCenter:disabled {
            opacity: .5;
        }
        #rectangleDimensions {
            color: black;
            text-align: right;
            padding-right: 4px;
        }
        app-laser-position > div:first-of-type {
            justify-content: flex-end;
        }
    `;
    document.head.appendChild(styleElement);

    // Check for mat-icon inside .laser-position and create buttons
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            const laserPosition = document.querySelector('.laser-position');
            if (laserPosition) {
                const matIcon = laserPosition.querySelector('mat-icon');
                if (matIcon) {
                    createButtons();
                } else {
                    hideButtons();
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();