// ==UserScript==
// @name         HSS
// @namespace    http://tampermonkey.net/
// @version      BETA2
// @description  HELL STUMBLECHAT SCRIPT
// @author       MeKLiN
// @match        https://stumblechat.com/room/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stumblechat.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485841/HSS.user.js
// @updateURL https://update.greasyfork.org/scripts/485841/HSS.meta.js
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
        this.setupVerifyButton(); // Call the setupVerifyButton method first
        this.observeDOM();
        this.setupConsoleOverlay();
        this.clickCount = 0;
    }

    setupVerifyButton = () => {
        // Define the setupVerifyButton behavior here
        console.log('setupVerifyButton called');
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


        // Start observing changes in the chat content
        this.logToOverlay('Attempting to observe chat content...');
        const chatContent = document.querySelector('#chat-content');
        if (chatContent) {
            this.logToOverlay('Chat content found. Starting observation...');
            observer.observe(chatContent, { childList: true });
        } else {
            this.logToOverlay2('Chat content not found.');
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

    logToOverlay2 = (message, target = this.consoleOverlay2) => {
        const logEntry = document.createElement('div');
        logEntry.textContent = message;
        if (target) {
            target.appendChild(logEntry);
        }
        console.log(message);
    }
}

// Start the script
new VerifyScript();

// Create draggable div window for system messages
const systemMessageWindow = document.createElement('div');
systemMessageWindow.classList.add('system-message-window');
systemMessageWindow.style.position = 'fixed';
systemMessageWindow.style.top = '120px';
systemMessageWindow.style.right = '20px';
systemMessageWindow.style.background = 'rgba(255, 255, 255, 0.9)';
systemMessageWindow.style.border = '1px solid #ccc';
systemMessageWindow.style.padding = '10px';
systemMessageWindow.style.cursor = 'move';
systemMessageWindow.style.maxWidth = '400px'; // Limit the width to prevent infinite length
systemMessageWindow.innerHTML = 'Bot window';

// Make the window draggable
let isDragging = false;
let offsetX, offsetY;
systemMessageWindow.addEventListener('mousedown', e => {
    isDragging = true;
    offsetX = e.clientX - systemMessageWindow.getBoundingClientRect().left;
    offsetY = e.clientY - systemMessageWindow.getBoundingClientRect().top;
});

document.addEventListener('mousemove', e => {
    if (isDragging) {
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;
        systemMessageWindow.style.left = `${x}px`;
        systemMessageWindow.style.top = `${y}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Append the window to the body
document.body.appendChild(systemMessageWindow);

class SystemMessages {
    constructor() {
        this.setupSystemMessageWindow();
    }

    setupSystemMessageWindow() {
        const systemMessageWindow = document.createElement('div');
        systemMessageWindow.classList.add('message-window');
        systemMessageWindow.classList.add('system-message-window');
        systemMessageWindow.style.position = 'fixed';
        systemMessageWindow.style.top = '20px';
        systemMessageWindow.style.right = '20px';
        systemMessageWindow.style.background = 'rgba(255, 255, 255, 0.9)';
        systemMessageWindow.style.border = '1px solid #ccc';
        systemMessageWindow.style.padding = '10px';
        systemMessageWindow.style.cursor = 'move';
        systemMessageWindow.style.maxWidth = '400px'; // Limit the width to prevent infinite length
        systemMessageWindow.style.overflowY = 'auto'; // Add scrollbar
        systemMessageWindow.style.maxHeight = '200px'; // Limit height to enable scrollbar
        systemMessageWindow.innerHTML = 'System Messages Window';

        // Add auto-scroll functionality
        systemMessageWindow.addEventListener('DOMNodeInserted', () => {
            systemMessageWindow.scrollTop = systemMessageWindow.scrollHeight;
        });

        // Minimize button
        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = 'Minimize';
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '5px';
        minimizeButton.style.right = '5px';
        minimizeButton.addEventListener('click', () => {
            systemMessageWindow.style.display = 'none';
        });
        systemMessageWindow.appendChild(minimizeButton);

        // Make the window draggable
        let isDragging = false;
        let offsetX, offsetY;
        systemMessageWindow.addEventListener('mousedown', e => {
            isDragging = true;
            const rect = systemMessageWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                const maxX = window.innerWidth - systemMessageWindow.offsetWidth;
                const maxY = window.innerHeight - systemMessageWindow.offsetHeight;
                systemMessageWindow.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
                systemMessageWindow.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Append the window to the body
        document.body.appendChild(systemMessageWindow);

        // Observe mutations in the chat content
        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement && node.classList.contains('message') && node.classList.contains('system')) {
                        // Move the system message to the system message window
                        const messageText = node.innerText.trim();
                        const messageElement = document.createElement('div');
                        messageElement.textContent = messageText;
                        systemMessageWindow.appendChild(messageElement);
                        // Hide the system message in the main chat box
                        node.style.display = 'none';
                    }
                });
            });
        });

        const chatContent = document.querySelector('#chat-content');
        if (chatContent) {
            observer.observe(chatContent, { childList: true });
        } else {
            console.error('Chat content not found.');
        }
    }
}

// Start the SystemMessages script
new SystemMessages();



class UserMessages {
    constructor() {
        this.setupUserMessageWindow();
    }

    setupUserMessageWindow() {
        const userMessageWindow = document.createElement('div');
        userMessageWindow.classList.add('message-window');
        userMessageWindow.classList.add('user-message-window');
        userMessageWindow.style.position = 'fixed';
        userMessageWindow.style.top = '20px';
        userMessageWindow.style.left = '20px'; // Adjusted position for user messages
        userMessageWindow.style.background = 'rgba(255, 255, 255, 0.9)';
        userMessageWindow.style.border = '1px solid #ccc';
        userMessageWindow.style.padding = '10px';
        userMessageWindow.style.cursor = 'move';
        userMessageWindow.style.maxWidth = '400px'; // Limit the width to prevent infinite length
        userMessageWindow.style.overflowY = 'auto'; // Add scrollbar
        userMessageWindow.style.maxHeight = '200px'; // Limit height to enable scrollbar
        userMessageWindow.innerHTML = 'User Messages Window';

        // Add auto-scroll functionality
        userMessageWindow.addEventListener('DOMNodeInserted', () => {
            userMessageWindow.scrollTop = userMessageWindow.scrollHeight;
        });

        // Minimize button
        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = 'Minimize';
        minimizeButton.style.position = 'absolute';
        minimizeButton.style.top = '5px';
        minimizeButton.style.right = '5px';
        minimizeButton.addEventListener('click', () => {
            userMessageWindow.style.display = 'none';
        });
        userMessageWindow.appendChild(minimizeButton);

        // Make the window draggable
        let isDragging = false;
        let offsetX, offsetY;
        userMessageWindow.addEventListener('mousedown', e => {
            isDragging = true;
            const rect = userMessageWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
        });

        document.addEventListener('mousemove', e => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                const maxX = window.innerWidth - userMessageWindow.offsetWidth;
                const maxY = window.innerHeight - userMessageWindow.offsetHeight;
                userMessageWindow.style.left = `${Math.min(Math.max(0, x), maxX)}px`;
                userMessageWindow.style.top = `${Math.min(Math.max(0, y), maxY)}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        // Append the window to the body
        document.body.appendChild(userMessageWindow);

        // Observe mutations in the chat content
        const observer = new MutationObserver(mutationsList => {
            mutationsList.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node instanceof HTMLElement && node.classList.contains('message') && node.classList.contains('common')) {
                        // Check if the added node is a common message and from the user "u_u"
                        const nicknameElement = node.querySelector('.nickname');
                        if (nicknameElement && nicknameElement.innerText.trim() === 'u_u') {
                            const messageText = node.innerText.trim();
                            const messageElement = document.createElement('div');
                            messageElement.textContent = messageText;
                            userMessageWindow.appendChild(messageElement);
                            // Hide the user's message in the main chat box
                            node.style.display = 'none';
                        }
                    }
                });
            });
        });

        const chatContent = document.querySelector('#chat-content');
        if (chatContent) {
            observer.observe(chatContent, { childList: true });
        } else {
            console.error('Chat content not found.');
        }
    }
}

// Start the UserMessages script
new UserMessages();