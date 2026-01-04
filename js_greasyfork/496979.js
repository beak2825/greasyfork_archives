// ==UserScript==
// @name         Advanced Calculator
// @namespace    https://greasyfork.org/en/users/1291009
// @version      6.1.5
// @description  A unified calculator tool with chat history and draggable UI.
// @author       BadOrBest
// @license      MIT
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE4akrlePwM0brye6bimtz0ziOengL_C9rhQ&s
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496979/Advanced%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/496979/Advanced%20Calculator.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Load external libraries
    const scriptLoad = url => new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });

    Promise.all([
        scriptLoad('https://cdnjs.cloudflare.com/ajax/libs/mathjs/13.1.1/math.min.js'),
        scriptLoad('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.10.0/localforage.min.js')
    ]).then(() => {
        console.log('Libraries loaded successfully.');
        initCalculator();
    }).catch(error => console.error('Error loading libraries:', error));

    // General settings
    const settings = {
        theme: GM_getValue('theme', 'dark'),
        historyPageSize: GM_getValue('historyPageSize', 50),
        interpretXAsMultiply: GM_getValue('interpretXAsMultiply', true)  // Default to true
    };

    // Calculator Initialization
    function initCalculator() {
        const MAX_MESSAGES = 400;
        const STORAGE_KEY = 'chatHistory';
        let lastResult = null;  // Store the last result

        const chatBox = document.createElement('div');
        chatBox.id = 'calculator-chat-box';
        Object.assign(chatBox.style, {
            position: 'fixed',
            bottom: '10vh',
            right: '5vw',
            width: 'calc(90vw - 10px)',
            maxWidth: '350px',
            backgroundColor: settings.theme === 'dark' ? '#1f1f1f' : '#f9f9f9',
            borderRadius: '12px',
            padding: '10px',
            boxShadow: '0 0 15px rgba(0, 0, 0, 0.3)',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Arial, sans-serif'
        });

        const chatHeader = document.createElement('div');
        chatHeader.style.display = 'flex';
        chatHeader.style.justifyContent = 'space-between';
        chatHeader.style.alignItems = 'center';
        chatHeader.style.backgroundColor = settings.theme === 'dark' ? '#333' : '#ddd';
        chatHeader.style.color = settings.theme === 'dark' ? '#fff' : '#333';
        chatHeader.style.padding = '10px';
        chatHeader.style.borderRadius = '10px 10px 0 0';
        chatHeader.style.fontWeight = 'bold';
        chatHeader.textContent = 'Advanced Calculator';

        const collapseButton = document.createElement('button');
        collapseButton.textContent = '▼';
        collapseButton.style.padding = '5px 10px';
        collapseButton.style.border = 'none';
        collapseButton.style.backgroundColor = '#555';
        collapseButton.style.color = '#fff';
        collapseButton.style.cursor = 'pointer';
        collapseButton.style.borderRadius = '5px';
        collapseButton.addEventListener('click', toggleChatBox);

        chatHeader.appendChild(collapseButton);
        chatBox.appendChild(chatHeader);

        const chatHistory = document.createElement('div');
        chatHistory.id = 'chat-history';
        Object.assign(chatHistory.style, {
            height: '300px',
            overflowY: 'auto',
            backgroundColor: settings.theme === 'dark' ? '#333' : '#fff',
            color: settings.theme === 'dark' ? '#fff' : '#333',
            padding: '10px',
            borderRadius: '8px'
        });
        chatBox.appendChild(chatHistory);

        const chatInput = document.createElement('input');
        chatInput.id = 'chat-input';
        chatInput.type = 'text';
        Object.assign(chatInput.style, {
            width: 'calc(100% - 20px)',
            padding: '10px',
            margin: '10px auto',
            borderRadius: '10px',
            border: 'none',
            backgroundColor: '#444',
            color: 'white'
        });
        chatInput.placeholder = 'Type here...';
        chatInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                if (chatInput.value.trim() === '') {
                    if (lastResult !== null) {
                        chatInput.value = lastResult;  // Insert the last result into the input field
                    }
                } else {
                    sendMessage();
                }
            }
        });
        chatBox.appendChild(chatInput);

        // Draggable functionality
        let isDragging = false;
        let initialX, initialY;
        let offsetX = 0, offsetY = 0;

        chatBox.addEventListener('mousedown', startDragging);
        chatBox.addEventListener('touchstart', startDragging);

        document.addEventListener('mousemove', drag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchend', stopDragging);

        function startDragging(event) {
            if (event.target === chatInput) return;
            event.preventDefault();
            initialX = event.clientX - offsetX;
            initialY = event.clientY - offsetY;
            isDragging = true;
            chatBox.classList.add('chat-dragging');
            document.addEventListener('mousemove', drag); // Attach listeners only on start
            document.addEventListener('touchmove', drag);
        }

        function drag(event) {
            if (!isDragging) return;
            event.preventDefault();
            const currentX = event.clientX - initialX;
            const currentY = event.clientY - initialY;
            offsetX = currentX;
            offsetY = currentY;
            chatBox.style.transform = `translate(${currentX}px, ${currentY}px)`;
        }

        function stopDragging() {
            isDragging = false;
            chatBox.classList.remove('chat-dragging');
            document.removeEventListener('mousemove', drag); // Detach listeners on stop
            document.removeEventListener('touchmove', drag);
        }

        function toggleChatBox() {
            if (chatBox.style.height === '70px') {
                chatBox.style.height = 'auto';
                collapseButton.textContent = '▼';
                chatInput.style.display = 'block';
            } else {
                chatBox.style.height = '70px';
                collapseButton.textContent = '▲';
                chatInput.style.display = 'none';
            }
        }

        // Function to load messages from localStorage
        function loadMessagesFromStorage() {
            let messages = [];
            try {
                messages = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
            } catch (error) {
                console.error('Error loading chat history from localStorage:', error);
                clearLocalStorage();
            }
            return messages;
        }

        // Function to clear localStorage
        function clearLocalStorage() {
            try {
                localStorage.removeItem(STORAGE_KEY);
            } catch (error) {
                console.error('Error clearing localStorage:', error);
            }
        }

        // Function to add message to conversation and save to localStorage
        function addMessage(message, isInput) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message ' + (isInput ? 'input' : 'output');
            messageElement.innerHTML = message;
            chatHistory.appendChild(messageElement);

            if (!isInput) {
                const line = document.createElement('hr');
                line.style.borderTop = '1px solid white';
                line.style.margin = '5px 0';
                chatHistory.appendChild(line);
            }

            function scrollToBottom() {
                chatHistory.scrollTop = chatHistory.scrollHeight;
            }

            scrollToBottom();

            let messages = loadMessagesFromStorage();
            messages.push({ message: message, isInput: isInput });

            if (messages.length > MAX_MESSAGES) {
                messages = messages.slice(-MAX_MESSAGES);
            }

            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
            } catch (error) {
                if (error.name === 'QuotaExceededError') {
                    console.error('LocalStorage is full, clearing oldest messages.');
                    messages.shift(); // Remove the oldest message and try saving again
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
                } else {
                    console.error('Error saving chat history:', error);
                    clearLocalStorage();
                }
            }
        }

        function sendMessage() {
            const expression = chatInput.value.trim();
            if (expression !== '') {
                addMessage('<span class="user-label">(User):</span> ' + expression, true);
                evaluateExpression(expression);
                chatInput.value = '';
            }
        }

        function evaluateExpression(expression) {
            try {
                if (settings.interpretXAsMultiply) {
                    expression = expression.replace(/(\d+)\s*x\s*(\d+)/gi, '$1*$2'); // Handles better
                }
                const result = math.evaluate(expression);
                addMessage('<span class="result-label">(Result):</span> ' + result, false);
                lastResult = result;  // Store the result for reuse
            } catch (error) {
                addMessage('<span class="result-label">(Result):</span> Error: ' + error.message, false);
            }
        }

        window.addEventListener('load', () => {
            // Prevent duplicate loading of messages
            chatHistory.innerHTML = ''; // Clear existing content before loading new messages
            loadMessagesFromStorage().forEach(msg => {
                addMessage(msg.message, msg.isInput);
            });
            scrollToBottom();
        });

        GM_registerMenuCommand('Clear Chat History', clearLocalStorage);
        GM_registerMenuCommand('Toggle x as multiply/variable', () => {
            settings.interpretXAsMultiply = !settings.interpretXAsMultiply;
            GM_setValue('interpretXAsMultiply', settings.interpretXAsMultiply);
            alert(`x is now interpreted as ${settings.interpretXAsMultiply ? 'multiplication' : 'variable'}.`);
        });

        GM_addStyle(`
            #calculator-chat-box {
                font-family: Arial, sans-serif;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            }
            #calculator-chat-box .message {
                clear: both;
                padding: 5px 10px;
                color: white;
            }
            #calculator-chat-box .input {
                text-align: left;
            }
            #calculator-chat-box .result-label {
                float: left;
                margin-left: 5px;
                background-color: #1a73e8; /* Improved contrast */
                color: white;
                border-radius: 10px;
                padding: 3px 6px;
            }
            #calculator-chat-box .user-label {
                float: left;
                margin-left: 5px;
                background-color: #34a853; /* Improved contrast */
                color: white;
                border-radius: 10px;
                padding: 3px 6px;
            }
            #calculator-chat-box hr {
                border-top: 1px solid white;
                margin: 5px 0;
            }
            #calculator-chat-box.chat-dragging {
                cursor: move;
            }
        `);

        document.body.appendChild(chatBox);
    }
})();
