// ==UserScript==
// @name         Insert elements
// @description  Insert random elements to space
// @match        https://neal.fun/infinite-craft/
// @license      MIT
// @version 0.0.1.20250223132042
// @namespace https://greasyfork.org/users/1438939
// @downloadURL https://update.greasyfork.org/scripts/527834/Insert%20elements.user.js
// @updateURL https://update.greasyfork.org/scripts/527834/Insert%20elements.meta.js
// ==/UserScript==
// Creating UI for entering the number of clicks
function createClickUI() {
    let uiContainer = document.createElement('div');
    uiContainer.style.position = 'fixed';
    uiContainer.style.top = '10px';
    uiContainer.style.left = '10px';  // Changed to the left side
    uiContainer.style.background = 'rgba(0, 0, 0, 0.8)';
    uiContainer.style.color = 'white';
    uiContainer.style.padding = '10px';
    uiContainer.style.borderRadius = '8px';
    uiContainer.style.zIndex = '9999';
    uiContainer.style.fontFamily = 'Arial, sans-serif';
    uiContainer.innerHTML = `
        <h3 style="margin: 0 0 10px;">Enter the number of clicks:</h3>
        <input id="click-input" type="number" min="2" max="1000" style="width: 100%; padding: 5px; font-size: 16px; margin-bottom: 10px; border-radius: 5px; border: none;">
        <button id="click-btn" style="width: 100%; padding: 5px; background: #444; color: white; border-radius: 5px; border: none; cursor: pointer;">Start Clicking</button>
    `;

    document.body.appendChild(uiContainer);

    let clickButton = document.getElementById('click-btn');
    clickButton.addEventListener('click', () => {
        let inputValue = document.getElementById('click-input').value;
        if (inputValue >= 2 && inputValue <= 1000) {
            startClicking(parseInt(inputValue));
        } else {
            alert("Please enter a number between 2 and 1000.");
        }
    });
}

// Function to click a random item in the sidebar
function clickRandomItem() {
    let items = document.querySelectorAll('.sidebar-inner .items .item'); // Get the items inside the sidebar-inner
    if (items.length === 0) return;

    let randomIndex = Math.floor(Math.random() * items.length);
    items[randomIndex].click();
}

// Start clicking the selected number of times
function startClicking(times) {
    let counter = 0;

    let interval = setInterval(() => {
        if (counter >= times) {
            clearInterval(interval);
        } else {
            clickRandomItem();
            counter++;
        }
    }, 100); // Click every 100ms
}

// Start the script
createClickUI();
