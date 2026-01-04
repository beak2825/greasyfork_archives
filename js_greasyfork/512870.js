// ==UserScript==
// @name         YAD Multi Auto Clicker
// @namespace    https://greasyfork.org/en/users/781396
// @version      2.9
// @description  Automates clicks at various locations on the screen with customizable intervals
// @author       YAD
// @license      MIT
// @icon         https://i.ibb.co/z7JVjSp/image.png
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512870/YAD%20Multi%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/512870/YAD%20Multi%20Auto%20Clicker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let buttons = [];
    let buttonId = 1;
    let isRunning = false;
    let clickIntervals = [];

    // Load button positions and settings from localStorage
    const loadButtonData = () => JSON.parse(localStorage.getItem('buttonData') || '[]');

    // Save button positions and settings to localStorage
    const saveButtonData = () => {
        const buttonData = buttons.map(button => ({
            id: button.id,
            top: button.style.top,
            left: button.style.left,
            interval: button.dataset.interval,
            clicks: button.dataset.clicks
        }));
        localStorage.setItem('buttonData', JSON.stringify(buttonData));
    };

    // Save the current running state in localStorage
    const saveRunningState = () => {
        localStorage.setItem('isRunning', JSON.stringify(isRunning));
    };

    // Load the running state from localStorage on page reload
    const loadRunningState = () => {
        return JSON.parse(localStorage.getItem('isRunning') || 'false');
    };

    // Create the main interface
    const mainInterface = document.createElement('div');
    mainInterface.style.position = 'fixed';
    mainInterface.style.right = '10px';
    mainInterface.style.top = '50%';
    mainInterface.style.transform = 'translateY(-50%)';
    mainInterface.style.zIndex = '9999';

    // Plus button to add new auto-click buttons
    const plusButton = document.createElement('button');
    plusButton.textContent = '➕';
    plusButton.style.display = 'block';
    plusButton.style.padding = '10px';
    plusButton.style.marginBottom = '5px';
    plusButton.style.fontSize = '16px';
    plusButton.style.cursor = 'pointer';
    plusButton.style.backgroundColor = '#28a745'; // Green background
    plusButton.style.border = 'none';
    plusButton.style.color = 'transparent';
    plusButton.style.textShadow = '0 0 0 white';
    plusButton.style.borderRadius = '5px';
    mainInterface.appendChild(plusButton);

    // Start/Stop button
    const startStopButton = document.createElement('button');
    startStopButton.textContent = '👆';
    startStopButton.style.display = 'block';
    startStopButton.style.padding = '10px';
    startStopButton.style.marginBottom = '5px';
    startStopButton.style.fontSize = '16px';
    startStopButton.style.cursor = 'pointer';
    startStopButton.style.backgroundColor = '#007bff'; // Blue background
    startStopButton.style.border = 'none';
    startStopButton.style.color = 'white';
    startStopButton.style.borderRadius = '5px';
    mainInterface.appendChild(startStopButton);

    // Reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = '♻️';
    resetButton.style.display = 'block';
    resetButton.style.padding = '10px';
    resetButton.style.fontSize = '16px';
    resetButton.style.cursor = 'pointer';
    resetButton.style.backgroundColor = '#dc3545'; // Red background
    resetButton.style.border = 'none';
    resetButton.style.color = 'transparent';
    resetButton.style.textShadow = '0 0 0 white';
    resetButton.style.borderRadius = '5px';
    mainInterface.appendChild(resetButton);

    document.body.appendChild(mainInterface);

    // Plus button functionality
    plusButton.addEventListener('click', () => {
        createAutoClickButton();
    });

    // Start/Stop button functionality
    startStopButton.addEventListener('click', () => {
        isRunning = !isRunning;
        saveRunningState();
        if (isRunning) {
            startStopButton.textContent = '🛑';
            startAutoClick();
        } else {
            startStopButton.textContent = '👆';
            stopAutoClick();
        }
    });

    // Reset button functionality
    resetButton.addEventListener('click', () => {
        stopAutoClick(); // Ensure all running intervals are stopped
        buttons.forEach(button => button.remove());
        buttons = [];
        localStorage.removeItem('buttonData');
        buttonId = 1;
        startStopButton.textContent = '👆';
        saveRunningState();
    });

    // Function to create a new auto-click button
    function createAutoClickButton(buttonData = null) {
        const autoButton = document.createElement('div');
        autoButton.id = buttonId++;
        autoButton.textContent = autoButton.id;
        autoButton.style.width = '50px';
        autoButton.style.height = '50px';
        autoButton.style.borderRadius = '50%';
        autoButton.style.backgroundColor = '#0061ffcc';
        autoButton.style.position = 'absolute';
        autoButton.style.top = buttonData?.top || '50%';
        autoButton.style.left = buttonData?.left || '50%';
        autoButton.style.display = 'flex';
        autoButton.style.alignItems = 'center';
        autoButton.style.justifyContent = 'center';
        autoButton.style.cursor = 'pointer';
        autoButton.style.zIndex = '9999';
        autoButton.style.color = 'white'; // Ensure text is visible
        autoButton.dataset.interval = buttonData?.interval || 1000; // Default interval
        autoButton.dataset.clicks = buttonData?.clicks || 1; // Default number of clicks
        document.body.appendChild(autoButton);
        makeDraggable(autoButton);

        buttons.push(autoButton);
        saveButtonData();

        // Open settings modal on right-click
        autoButton.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            openSettingsModal(autoButton);
        });
    }

    // Function to make the buttons draggable
    function makeDraggable(element) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
        element.onmousedown = function (e) {
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmousemove = moveElement;
            document.onmouseup = stopMovingElement;
        };

        function moveElement(e) {
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + 'px';
            element.style.left = (element.offsetLeft - posX) + 'px';
        }

        function stopMovingElement() {
            document.onmouseup = null;
            document.onmousemove = null;
            saveButtonData();
        }
    }

    // Function to open settings modal
    function openSettingsModal(button) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.zIndex = '10000';
        modal.style.padding = '15px';
        modal.style.backgroundColor = '#6f42c1';
        modal.style.borderRadius = '8px';
        modal.style.boxShadow = '0px 4px 12px rgba(0, 0, 0, 0.1)';
        modal.style.width = '300px'; // Make it more compact
        modal.style.fontFamily = 'Arial, sans-serif';

        const title = document.createElement('h3');
        title.textContent = 'Settings';
        title.style.marginTop = '0';
        title.style.marginBottom = '15px';
        title.style.color = '#fff';
        title.style.textAlign = 'center';
        title.style.fontSize = '18px';
        modal.appendChild(title);

        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '10px';
        modal.appendChild(form);

        const createInputField = (labelText, inputType, inputValue) => {
            const fieldWrapper = document.createElement('div');
            fieldWrapper.style.display = 'flex';
            fieldWrapper.style.flexDirection = 'column';

            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.fontSize = '14px';
            label.style.color = '#fff';
            label.style.marginBottom = '5px';
            fieldWrapper.appendChild(label);

            const input = document.createElement('input');
            input.type = inputType;
            input.value = inputValue;
            input.style.padding = '5px';
            input.style.borderRadius = '4px';
            input.style.border = '1px solid #ccc';
            input.style.fontSize = '14px';
            fieldWrapper.appendChild(input);

            form.appendChild(fieldWrapper);

            return input;
        };

        const intervalInput = createInputField('Interval (ms):', 'number', button.dataset.interval);
        const clicksInput = createInputField('Clicks per Interval:', 'number', button.dataset.clicks);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style.padding = '10px';
        saveButton.style.borderRadius = '5px';
        saveButton.style.border = 'none';
        saveButton.style.backgroundColor = '#28a745';
        saveButton.style.color = 'white';
        saveButton.style.cursor = 'pointer';
        form.appendChild(saveButton);

        saveButton.addEventListener('click', (e) => {
            e.preventDefault();
            button.dataset.interval = intervalInput.value;
            button.dataset.clicks = clicksInput.value;
            saveButtonData();
            document.body.removeChild(modal);
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.style.padding = '10px';
        cancelButton.style.borderRadius = '5px';
        cancelButton.style.border = 'none';
        cancelButton.style.backgroundColor = '#dc3545';
        cancelButton.style.color = 'white';
        cancelButton.style.cursor = 'pointer';
        form.appendChild(cancelButton);

        cancelButton.addEventListener('click', (e) => {
            e.preventDefault();
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    }

    // Function to simulate auto-clicking on buttons with a specified interval and number of clicks
    async function autoClick(button) {
        const rect = button.getBoundingClientRect();
        const interval = parseInt(button.dataset.interval) || 1000;
        const clicks = parseInt(button.dataset.clicks) || 1;
        button.style.visibility = 'hidden';

        const elemUnderButton = document.elementFromPoint(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
        );

        button.style.visibility = 'visible';

        if (elemUnderButton && isRunning) {
            button.style.opacity = '0.6';

            // Perform clicks at the specified interval
            for (let i = 0; i < clicks; i++) {
                if (!isRunning) break; // Stop the clicks if not running anymore
                simulateClick(elemUnderButton);
                await new Promise(resolve => setTimeout(resolve, interval));  // Wait for the interval between clicks
            }

            button.style.opacity = '1';
        }
    }

    // Function to simulate clicks anywhere, including on HTML5 game canvas elements
    function simulateClick(target, x = null, y = null) {
        const eventNames = ['mousedown', 'mouseup', 'click'];

        // If specific coordinates are provided, simulate the click there
        if (x !== null && y !== null) {
            const elementAtPoint = document.elementFromPoint(x, y);

            // If the element at the coordinates is a canvas, simulate a click on it
            if (elementAtPoint.tagName === 'CANVAS') {
                eventNames.forEach(eventName => {
                    const event = new MouseEvent(eventName, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: x,
                        clientY: y
                    });
                    elementAtPoint.dispatchEvent(event);
                });
            } else {
                // Simulate click at the provided coordinates for non-canvas elements
                eventNames.forEach(eventName => {
                    const event = new MouseEvent(eventName, {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: x,
                        clientY: y
                    });
                    elementAtPoint?.dispatchEvent(event);
                });
            }
            return;
        }

        // If no coordinates, click on the target element
        eventNames.forEach(eventName => {
            const event = new MouseEvent(eventName, {
                bubbles: true,
                cancelable: true,
                view: window
            });
            target.dispatchEvent(event);
        });

        // Handle specific cases like canvas, iframes, and shadow DOM

        // HTML5 Canvas
        if (target.tagName === 'CANVAS') {
            const rect = target.getBoundingClientRect();
            const canvasClickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: rect.left + rect.width / 2,  // Click at center
                clientY: rect.top + rect.height / 2
            });
            target.dispatchEvent(canvasClickEvent);
        }

        // Handle IFRAMEs
        if (target.tagName === 'IFRAME') {
            const iframeDoc = target.contentDocument || target.contentWindow.document;
            const clickableElement = iframeDoc?.body || iframeDoc?.querySelector('canvas');
            clickableElement?.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }

        // Handle Shadow DOM
        if (target.shadowRoot) {
            const clickableElement = target.shadowRoot.querySelector('canvas, [clickable], button, a');
            clickableElement?.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            }));
        }

        // Handle Flash or Java embedded objects (legacy games)
        if (target.tagName === 'OBJECT' || target.tagName === 'EMBED') {
            try {
                target.focus();
                const objectClickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                target.dispatchEvent(objectClickEvent);
            } catch (e) {
                console.warn("Flash or Java interaction failed:", e);
            }
        }
    }

    // Start auto-clicking in sequence
    async function startAutoClick() {
        for (const button of buttons) {
            const interval = parseInt(button.dataset.interval);
            await autoClick(button);  // Wait for the current button to finish before starting the next
        }
        if (isRunning) {
            setTimeout(startAutoClick, 0);  // Immediately restart the clicking sequence if still running
        }
    }

    // Stop auto-clicking
    function stopAutoClick() {
        isRunning = false;
    }

    // Load buttons and state on page load
    window.addEventListener('load', () => {
        loadButtonData().forEach(buttonData => createAutoClickButton(buttonData));
        if (loadRunningState()) {
            isRunning = true;
            startStopButton.textContent = '🛑';
            startAutoClick();
        }
    });
})();

