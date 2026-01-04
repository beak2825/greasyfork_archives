// ==UserScript==
// @name         ChatGPT Mini Panel with AI Conversation and Google Search [BETA]
// @namespace    http://your.domain.com
// @version      1.4.3.5
// @description  Mini chat panel with ChatGPT that relays messages between the user and AI, along with Google search functionality and additional features
// @match        https://*/*
// @match        http://*/*
// @grant        GM_xmlhttpRequest
// @icon         https://img.icons8.com/nolan/77/chatgpt.png
// @downloadURL https://update.greasyfork.org/scripts/491882/ChatGPT%20Mini%20Panel%20with%20AI%20Conversation%20and%20Google%20Search%20%5BBETA%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/491882/ChatGPT%20Mini%20Panel%20with%20AI%20Conversation%20and%20Google%20Search%20%5BBETA%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let panelColor = 'linear-gradient(135deg, #ff6ec4, #7873f5)';
    let headerColor = '#ff6ec4';
    let messageColor = '#7873f5';
    let apiKey = ''; // User's API key
    let isGoogleSearchEnabled = true;
    let chatHistory = []; // Array to store chat history
    let selectedLanguage = 'en'; // Default language is English

    // Load Font Awesome
    const faStylesheet = document.createElement('link');
    faStylesheet.rel = 'stylesheet';
    faStylesheet.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(faStylesheet);

    // Create draggable icon
    const chatIcon = document.createElement('div');
    chatIcon.innerHTML = `
        <img src="https://img.icons8.com/nolan/77/chatgpt.png" alt="ChatGPT Icon" style="width: 40px; height: 40px; cursor: pointer;">
    `;
    chatIcon.style.position = 'fixed';
    chatIcon.style.bottom = '20px';
    chatIcon.style.right = '20px';
    chatIcon.style.zIndex = '9999'; // Ensure the icon stays above other elements
    document.body.appendChild(chatIcon);

    // Function to handle spinning animation
    function spinIcon() {
        chatIcon.querySelector('img').style.animation = 'spin 1s linear infinite';
        setTimeout(() => {
            chatIcon.querySelector('img').style.animation = 'none';
        }, 1000);
    }

    // Create fade in animation
    function fadeIn(element) {
        element.style.opacity = 0;
        let opacity = 0;
        const fadeInInterval = setInterval(function() {
            if (opacity < 1) {
                opacity += 0.1;
                element.style.opacity = opacity;
            } else {
                clearInterval(fadeInInterval);
            }
        }, 50);
    }

    // Create fade out animation
    function fadeOut(element) {
        let opacity = 1;
        const fadeOutInterval = setInterval(function() {
            if (opacity > 0) {
                opacity -= 0.1;
                element.style.opacity = opacity;
            } else {
                clearInterval(fadeOutInterval);
                element.style.display = 'none';
            }
        }, 50);
    }

  // Create mini chat panel
    const chatPanel = document.createElement('div');
    chatPanel.innerHTML = `
        <div id="chat-header" style="background-color: ${headerColor}; padding: 10px; cursor: pointer; border-top-left-radius: 15px; border-top-right-radius: 15px;">ChatGPT</div>
        <div id="chat-messages" style="max-height: 300px; overflow-y: auto; padding: 20px; background-color: ${messageColor}; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px;"></div>
        <input type="text" id="chat-input" placeholder="Type your message..." style="width: calc(100% - 42px); padding: 10px; margin: 10px; border: 1px solid #ccc; border-radius: 5px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin: 0 10px;">
            <button id="send-btn" style="background-color: ${headerColor}; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;"><i class="fas fa-paper-plane"></i> Send</button>
            <button id="google-btn" style="background-color: ${headerColor}; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;"><i class="fab fa-google"></i> Google</button>
            <button id="settings-btn" style="background-color: ${headerColor}; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;"><i class="fas fa-cog"></i> Settings</button>
        </div>
        <input type="file" id="file-upload" style="display: none;">
        <div id="warning-message" style="color: red; font-size: 12px; padding: 10px;">Note: Some features do not work .</div>
    `;
    chatPanel.style.position = 'fixed';
    chatPanel.style.bottom = '20px';
    chatPanel.style.right = '20px';
    chatPanel.style.width = '300px';
    chatPanel.style.borderRadius = '15px';
    chatPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    chatPanel.style.display = 'none'; // Initially hide the panel
    chatPanel.style.zIndex = '9998'; // Ensure the panel stays above other elements but behind the icon
    document.body.appendChild(chatPanel);

    // Toggle chat panel visibility when icon is clicked
    chatIcon.addEventListener('click', function() {
        if (chatPanel.style.display === 'none') {
            chatPanel.style.display = 'block';
            fadeIn(chatPanel);
            // Display welcome message
            displayMessage("Welcome to ChatGPT! Type your message below to start chatting.");
        } else {
            fadeOut(chatPanel);
        }
        spinIcon(); // Add spinning animation
    });

    // Function to send message
    function sendMessage(message) {
        if (message.trim() === '') return;
        const messageDiv = document.createElement('div');
        messageDiv.textContent = 'You: ' + message;
        document.getElementById('chat-messages').appendChild(messageDiv);
        // Add message to chat history
        chatHistory.push('You: ' + message);
        // Scroll to the bottom of the chat messages
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    }

    // Display a message in the chat panel
    function displayMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        document.getElementById('chat-messages').appendChild(messageDiv);
        // Scroll to the bottom of the chat messages
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    }

    // Google search button functionality
    document.getElementById('google-btn').addEventListener('click', function() {
        if (isGoogleSearchEnabled) {
            performGoogleSearch();
        }
    });

    // Perform Google search
    function performGoogleSearch() {
        window.open('https://www.google.com/', '_blank');
    }

    // Settings button functionality
    document.getElementById('settings-btn').addEventListener('click', function() {
        const settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel.style.display === 'none') {
            settingsPanel.style.display = 'block';
            fadeIn(settingsPanel);
            // Hide chat panel when settings panel is opened
            chatPanel.style.display = 'none';
        } else {
            fadeOut(settingsPanel);
        }
    });

 // Create settings panel
const settingsPanel = document.createElement('div');
settingsPanel.id = 'settings-panel';
settingsPanel.innerHTML = `
    <div id="settings-header" style="background-color: ${headerColor}; padding: 10px; cursor: pointer; border-top-left-radius: 15px; border-top-right-radius: 15px;">Settings</div>
    <div id="settings-content" style="padding: 20px; background-color: ${messageColor}; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; max-height: 300px; overflow-y: auto;">
        <label for="panel-color">Panel Color:</label>
        <input type="color" id="panel-color" value="${panelColor}" style="margin-right: 10px;"><br><br>
        <label for="header-color">Header Color:</label>
        <input type="color" id="header-color" value="${headerColor}" style="margin-right: 10px;"><br><br>
        <label for="message-color">Message Color:</label>
        <input type="color" id="message-color" value="${messageColor}" style="margin-right: 10px;"><br><br>
        <label for="google-search">Enable Google Search:</label>
        <input type="checkbox" id="google-search" checked><br><br>
        <label for="api-key">API Key:</label>
        <input type="text" id="api-key" placeholder="Enter your API key" style="margin-right: 10px;"><br><br>
        <label for="language-select">Language:</label>
        <select id="language-select">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="zh">Chinese</option>
            <option value="hi">Hindi</option>
            <option value="ar">Arabic</option>
            <option value="fr">French</option>
            <option value="ru">Russian</option>
            <option value="ja">Japanese</option>
            <option value="de">German</option>
            <option value="pt">Portuguese</option>
        </select>
        <br><br>
        <!-- Add more options here -->
        <label for="theme-select">Theme:</label>
        <select id="theme-select">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
        <br><br>
        <label for="auto-reply">Auto-Reply:</label>
        <input type="checkbox" id="auto-reply" checked><br><br>
        <label for="show-typing">Show Typing Indicator:</label>
        <input type="checkbox" id="show-typing" checked><br><br>
        <label for="voice-input">Voice Input:</label>
        <input type="checkbox" id="voice-input"><br><br>
        <label for="file-upload">File Upload:</label>
        <input type="checkbox" id="file-upload"><br><br>
        <label for="theme-options">Theme Options:</label>
        <input type="checkbox" id="theme-options"><br><br>
        <label for="language-support">Language Support:</label>
        <input type="checkbox" id="language-support"><br><br>
        <label for="chatbot">Chatbot:</label>
        <input type="checkbox" id="chatbot"><br><br>
        <label for="emoji">Emoji:</label>
        <input type="checkbox" id="emoji"><br><br>
        <label for="video">Video:</label>
        <input type="checkbox" id="video"><br><br>
        <label for="pet">Pet:</label>
        <input type="checkbox" id="pet"><br><br>
        <!-- Add more options here -->
        <button id="save-settings-btn" style="background-color: ${headerColor}; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 5px;">Save Settings</button>
    </div>
`;
    settingsPanel.style.position = 'fixed';
    settingsPanel.style.bottom = '20px';
    settingsPanel.style.right = '20px';
    settingsPanel.style.width = '300px';
    settingsPanel.style.borderRadius = '15px';
    settingsPanel.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    settingsPanel.style.display = 'none'; // Initially hide the panel
    settingsPanel.style.zIndex = '9997'; // Ensure the panel stays above other elements but behind the chat panel
    document.body.appendChild(settingsPanel);

  // Save settings button functionality
    const saveSettingsButton = document.getElementById('save-settings-btn');
    saveSettingsButton.addEventListener('click', function() {
        // Save settings logic here
        panelColor = document.getElementById('panel-color').value;
        headerColor = document.getElementById('header-color').value;
        messageColor = document.getElementById('message-color').value;
        apiKey = document.getElementById('api-key').value;
        isGoogleSearchEnabled = document.getElementById('google-search').checked;
        selectedLanguage = document.getElementById('language-select').value;
        // Apply new colors to elements
        chatPanel.style.background = panelColor;
        document.getElementById('chat-header').style.backgroundColor = headerColor;
        document.getElementById('chat-messages').style.backgroundColor = messageColor;
        // Close settings panel
        fadeOut(settingsPanel);
    });
    // Send button functionality
    document.getElementById('send-btn').addEventListener('click', function() {
        const message = document.getElementById('chat-input').value.trim();
        sendMessage(message);
        document.getElementById('chat-input').value = ''; // Clear input field after sending
    });

    // Enter key functionality for sending messages
    document.getElementById('chat-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const message = this.value.trim();
            sendMessage(message);
            this.value = ''; // Clear input field after sending
        }
    });

    // Auto-scrolling functionality
    document.getElementById('chat-messages').addEventListener('DOMNodeInserted', function(event) {
        this.scrollTop = this.scrollHeight;
    });

    // Typing indicator functionality
    function showTypingIndicator() {
        const typingIndicator = document.createElement('div');
        typingIndicator.textContent = 'ChatGPT is typing...';
        typingIndicator.classList.add('typing-indicator');
        document.getElementById('chat-messages').appendChild(typingIndicator);
    }

    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Timestamps functionality
    function addTimestamp() {
        const timestamp = new Date().toLocaleString();
        return '[' + timestamp + '] ';
    }

    // Emojis functionality
    function insertEmoji(emoji) {
        document.getElementById('chat-input').value += emoji;
    }

    // Voice input functionality
    // This feature would require additional libraries or APIs for speech recognition.

    // File upload functionality
    // This feature would require implementing file upload logic and handling on the server-side.

    // Theme options functionality
    // You can provide predefined themes and allow users to switch between them.

    // Multi-language support functionality
    // This feature would involve integrating translation APIs or libraries for multilingual chat support.

    // Chatbot functionality
    // This feature involves integrating a chatbot that responds to user queries or interacts with the user.

})();
