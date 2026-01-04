// ==UserScript==
// @name         AutoVerify and Chat Compact
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AutoVerify StumbleChat and chat compact style
// @author       MeKLiN
// @match        https://stumblechat.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485783/AutoVerify%20and%20Chat%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/485783/AutoVerify%20and%20Chat%20Compact.meta.js
// ==/UserScript==

(function() {
    let css = `
        .message .nickname ~ .content {
            display: inline-block;
            top: -7px;
            position: relative;
            margin-left: 2px;
            margin-right: 1em;
        }
        .content + .content {
            display: inline-block!important;
            margin-right: 1em;
        }
        .message .nickname ~ .content span {
            line-height: 1.5em;
        }
    `;
    if (typeof GM_addStyle !== "undefined") {
      GM_addStyle(css);
    } else {
      let styleNode = document.createElement("style");
      styleNode.appendChild(document.createTextNode(css));
      (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})();

var scripts = document.getElementsByTagName("script");
var script = null;
var found = false;

for (var i = 0; i < scripts.length; i++) {
    script = scripts[i];
    if (/^jQuery.*\.js$/i.test(script.src)) {
        found = true;
        break;
    }
}

if (!found) {
    try {
        $ || jQuery || $ === jQuery;
        found = true;
    } catch (err) {

    }
}

if (!found) {
    // inject jQuery.
    script = document.createElement("script");
    script.type = "text/javascript";

    var protocol = /^https:/i.test(document.location) ? "https" : "http";
    script.src = protocol + "://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js";
    document.getElementsByTagName("body")[0].appendChild(script);
}

// Define App globally
window.App = {
    Init: () => {
        // Define the behavior of App.Init() here
        console.log('App.Init() called');
    }
};

class VerifyScript {
    constructor() {
        this.observeDOM();
        this.setupConsoleOverlay();
        this.clickCount = 0;
    }

    clickVerifyButton = (verifyButton) => {
        this.clickCount++;
        this.logToOverlay(`Attempting to click VERIFY button ${this.clickCount} time(s)...`);
        if (verifyButton) {
            this.logToOverlay('VERIFY button found.');
            // Remove any existing event listeners on the button
            verifyButton.removeEventListener('click', this.clickVerifyButton);
            // Manually create and dispatch a click event
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            this.logToOverlay('Before dispatchEvent');
            verifyButton.dispatchEvent(clickEvent);
            this.logToOverlay('After dispatchEvent');

            if (this.clickCount < 3) {
                setTimeout(() => {
                    if (this.isMouseLocked()) {
                        this.sendMouseUp();
                    }
                    this.clickVerifyButton(verifyButton);
                }, 500); // Delay between clicks
            } else if (this.clickCount === 3) {
                // After the third click, call App.Init()
                this.logToOverlay('Third click completed, calling App.Init()...');
                setTimeout(() => {
                    this.logToOverlay('Calling App.Init()...');
                    App.Init();
                }, 500); // Adjust the delay as needed
            }
        } else {
            this.logToOverlay('VERIFY button not found.');
        }
    }

    isMouseLocked = () => {
        return document.pointerLockElement === document.body ||
            document.mozPointerLockElement === document.body ||
            document.webkitPointerLockElement === document.body;
    }

    sendMouseUp = () => {
        this.logToOverlay('Mouse is locked, sending mouseup command...');
        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        document.body.dispatchEvent(mouseUpEvent);
    }

    observeDOM = () => {
        this.logToOverlay('Setting up MutationObserver...');
        const observer = new MutationObserver((mutationsList) => {
            this.logToOverlay(`Mutation observed... ${mutationsList.length} mutation(s) in total.`);
            for (const mutation of mutationsList) {
                this.logToOverlay(`Mutation type: ${mutation.type}`);
                this.logToOverlay(`Mutation target: ${mutation.target.outerHTML}`);
                this.logToOverlay(`Added nodes: ${mutation.addedNodes.length}`);
                mutation.addedNodes.forEach((node) => {
                    if (node instanceof HTMLElement) {
                        this.logToOverlay(`Added node: ${node.nodeName}`);
                        // Check if the added node is the VERIFY button
                        if (node.id === 'interact') {
                            // Add a slight delay to ensure modal visibility
                            setTimeout(() => {
                                // If so, click the button without scrolling
                                this.clickVerifyButton(node);
                                // Attempt other ways to click the button
                                document.querySelector('#modal #interact').click(); // First attempt
                                document.querySelector('#modal button#interact').click(); // Second attempt

                                // Additional attempts
                                node.click(); // Third attempt
                                const customClickEvent = new CustomEvent('click', { bubbles: true });
                                node.dispatchEvent(customClickEvent); // Fourth attempt
                                const mouseDownEvent = new MouseEvent('mousedown', { bubbles: true });
                                node.dispatchEvent(mouseDownEvent);
                                const mouseUpEvent = new MouseEvent('mouseup', { bubbles: true });
                                node.dispatchEvent(mouseUpEvent); // Fifth attempt
                                node.parentElement.click(); // Sixth attempt
                                console.log(`Attempt ${this.clickCount + 6}: jQuery click`);
                                $(node).trigger('click'); // Seventh attempt
                                console.log(`Attempt ${this.clickCount + 7}: Focus and simulate Enter key`);
                                node.focus();
                                const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                                node.dispatchEvent(keyboardEvent); // Eighth attempt
                                const pointerDownEvent = new PointerEvent('pointerdown', { bubbles: true });
                                node.dispatchEvent(pointerDownEvent);
                                const pointerUpEvent = new PointerEvent('pointerup', { bubbles: true });
                                node.dispatchEvent(pointerUpEvent); // Ninth attempt
                                const touchEvent = new TouchEvent('touchstart', { bubbles: true });
                                node.dispatchEvent(touchEvent); // Tenth attempt
                            }, 500); // Adjust the delay as needed
                        }
                    }
                });
                this.logToOverlay(`Removed nodes: ${mutation.removedNodes.length}`);
                mutation.removedNodes.forEach((node) => {
                    this.logToOverlay(`Removed node: ${node.nodeName}`);
                });
            }
        });

        // Start observing changes in the sc-modal element
        this.logToOverlay('Attempting to observe sc-modal element...');
        const scModal = document.querySelector('#modal');
        if (scModal) {
            this.logToOverlay('sc-modal element found. Starting observation...');
            observer.observe(scModal, { childList: true, subtree: true });
        } else {
            this.logToOverlay('sc-modal element not found.');
        }
    }

    setupConsoleOverlay = () => {
        const consoleOverlay = document.createElement('div');
        consoleOverlay.setAttribute('id', 'console-overlay');
        consoleOverlay.style.position = 'fixed';
        consoleOverlay.style.top = '10px';
        consoleOverlay.style.left = '10px';
        consoleOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        consoleOverlay.style.padding = '10px';
        consoleOverlay.style.border = '1px solid #ccc';
        consoleOverlay.style.zIndex = '9999';

        // Minimize button
        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = 'Minimize';
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '5px';
        minimizeButton.style.right = '5px';
        minimizeButton.addEventListener('click', () => {
            consoleOverlay.style.display = 'none';
        });
        consoleOverlay.appendChild(minimizeButton);

        document.body.appendChild(consoleOverlay);
        this.consoleOverlay = consoleOverlay;
    }

    logToOverlay = (message) => {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        if (this.consoleOverlay) {
            this.consoleOverlay.appendChild(logEntry);
        }
        console.log(message);
    }
}

// Start the script
new VerifyScript();
