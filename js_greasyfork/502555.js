// ==UserScript==
// @name         Energy Manager Beautifier
// @namespace    buluma
// @version      2024-08-04
// @description  Custom Enhancements I dream of seeing in EnergyManager Game.
// @author       Shadow Walker
// @match        https://energymanager.trophyapi.com/*
// @match        https://energymanagergame.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502555/Energy%20Manager%20Beautifier.user.js
// @updateURL https://update.greasyfork.org/scripts/502555/Energy%20Manager%20Beautifier.meta.js
// ==/UserScript==

console.log("254 Oil EM UnlockALL");

function waitForKeyElements(selector, callback) {
    const observer = new MutationObserver((mutations, observer) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
            elements.forEach(el => callback(el));
            observer.disconnect();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Your custom function to remove the class and element
function removeDSclass(jNode) {
    console.log("Cleaned node: ", jNode);
    jNode.classList.remove("not-active-light");
    document.querySelectorAll('div').forEach(el => {
        if (el.getAttribute('style') === 'z-index:10;position:absolute;width:100%;height:100%;text-align:center;display:flex;justify-content:center;align-items:center;flex-direction:column;') {
            el.remove();
        }
    });
}

// Function to add the overlay
function addOverlay() {
    const overlay = document.createElement('div');
    overlay.textContent = "254 OIL owned";
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0.2%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '25%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        textAlign: 'center',
        padding: '8px',
        fontSize: '16px',
        zIndex: '10000'
    });
    document.body.appendChild(overlay);
}

// Call the waitForKeyElements function with your selector and callback function
waitForKeyElements(".not-active-light", removeDSclass);

// Add the overlay to the screen
addOverlay();
