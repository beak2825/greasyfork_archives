// ==UserScript==
// @name         Arras.io Dreadnought Security Alerts
// @description  Click a button to send short security alerts against Dreadnoughts—No warnings, only immediate termination.
// @author       Shovel
// @match        *://arras.io/*
// @version      2.4
// @namespace    https://greasyfork.org/users/your-profile
// @downloadURL https://update.greasyfork.org/scripts/526118/Arrasio%20Dreadnought%20Security%20Alerts.user.js
// @updateURL https://update.greasyfork.org/scripts/526118/Arrasio%20Dreadnought%20Security%20Alerts.meta.js
// ==/UserScript==

// Short security alert-style Dreadnought execution messages
const warningMessages = [
    "⚠️ Dreadnought detected. Termination initiated.",
    "⚠️ Dreadnought in restricted zone. Eliminate now.",
    "⚠️ Dreadnought breach. Eradication underway.",
    "⚠️ Alert: Dreadnought found. Prepare for deletion.",
    "⚠️ Unauthorized Dreadnought. Extermination in progress.",
    "⚠️ Dreadnought spotted. Neutralizing target.",
    "⚠️ Dreadnought detected. Instant termination.",
    "⚠️ Dreadnought alert! Initiating eradication.",
    "⚠️ Dreadnought identified. Eliminating now.",
    "⚠️ Security breach: Dreadnought found. Deletion engaged.",
    "⚠️ Dreadnought breach confirmed. Nullification activated.",
    "⚠️ Dreadnought in restricted zone. Removing immediately.",
    "⚠️ Dreadnought alert! Deletion in process.",
    "⚠️ Unauthorized Dreadnought. Nullify target.",
    "⚠️ Dreadnought spotted. Removal now.",
    "⚠️ Dreadnoughts are not allowed here!",
    "⚠️ No Dreadnoughts beyond this point!",
    "⚠️ Dreadnoughts will be removed immediately!",
    "⚠️ Security alert: No Dreadnoughts allowed!"
];

// Function to send the final death message
function sendChatMessage() {
    let chatInput = document.querySelector('input:not([type="hidden"])'); // Get visible input field
    if (chatInput) {
        let randomMessage = warningMessages[Math.floor(Math.random() * warningMessages.length)];
        chatInput.focus(); // Focus the input box
        chatInput.value = randomMessage;

        // Simulate Enter key to send message
        let enterEvent = new KeyboardEvent('keydown', {
            bubbles: true,
            cancelable: true,
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13
        });
        chatInput.dispatchEvent(enterEvent);
    } else {
        alert("Chat input not found! Try clicking on the chat box manually first.");
    }
}

// Create the warning button with smaller size
let warningButton = document.createElement("button");
warningButton.style = "position: fixed; top: 10px; left: 10px; z-index: 1000; background: black; color: red; border: none; padding: 6px 12px; cursor: pointer; font-size: 14px; font-weight: bold; text-transform: uppercase;";
warningButton.innerText = '⚠ DREADNOUGHT EXECUTION ⚠';
document.body.appendChild(warningButton);

// Button click event
warningButton.onclick = function() {
    sendChatMessage();
};

// Toggle button visibility with 'K' key
document.addEventListener("keydown", function(event) {
    if (event.code === 'KeyK' && event.target.tagName.toLowerCase() !== 'textarea' && event.target.tagName.toLowerCase() !== 'input') {
        warningButton.style.visibility = warningButton.style.visibility == "hidden" ? "visible" : "hidden";
    }
});
