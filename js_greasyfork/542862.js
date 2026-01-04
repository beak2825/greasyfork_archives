// ==UserScript==
// @name         Quick Message Copier (Torn PDA)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Save and copy your common messages easily with themes (non-intrusive warnings)
// @author       Mr_Awaken [3255504]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542862/Quick%20Message%20Copier%20%28Torn%20PDA%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542862/Quick%20Message%20Copier%20%28Torn%20PDA%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const maxMessages = 50;
    let messages = [];
    let isDarkMode = false;
    let isMinimized = false;

    // 🔔 Reusable notification function
    function showNotification(message, color = '#dc3545') {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '50px';
        notification.style.right = '10px';
        notification.style.background = color;
        notification.style.color = 'white';
        notification.style.padding = '10px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000000';
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function isLocalStorageAvailable() {
        try {
            return typeof localStorage !== 'undefined' && localStorage !== null;
        } catch (e) {
            return false;
        }
    }

    // 🔄 Non-intrusive warning instead of alert()
    if (!isLocalStorageAvailable()) {
        showNotification('⚠️ Messages won\'t persist (localStorage unavailable).');
        return;
    }

    // Load saved data
    messages = JSON.parse(localStorage.getItem('quickMessages') || '[]');
    isDarkMode = JSON.parse(localStorage.getItem('quickMessagesDarkMode') || 'false');
    isMinimized = JSON.parse(localStorage.getItem('quickMessagesMinimized') || 'false');

    function saveMessages() {
        localStorage.setItem('quickMessages', JSON.stringify(messages));
    }

    function saveTheme() {
        localStorage.setItem('quickMessagesDarkMode', JSON.stringify(isDarkMode));
    }

    function saveMinimizedState() {
        localStorage.setItem('quickMessagesMinimized', JSON.stringify(isMinimized));
    }

    function getThemeStyles() {
        if (isDarkMode) {
            return {
                background: '#2a2a2a',
                color: '#e0e0e0',
                border: '2px solid #555',
                inputBg: '#3a3a3a',
                inputColor: '#e0e0e0',
                buttonBg: '#4a4a4a',
                buttonColor: '#e0e0e0',
                itemBg: '#333',
                itemBorder: '#555',
                copyButtonBg: '#0066cc',
                addButtonBg: '#4CAF50'
            };
        } else {
            return {
                background: '#fff',
                color: '#333',
                border: '2px solid #333',
                inputBg: '#fff',
                inputColor: '#333',
                buttonBg: '#f5f5f5',
                buttonColor: '#333',
                itemBg: '#f5f5f5',
                itemBorder: '#ddd',
                copyButtonBg: '#007bff',
                addButtonBg: '#4CAF50'
            };
        }
    }

    function createMinimizedButton() {
        const button = document.createElement('div');
        button.id = 'quickMessageMinimized';
        button.style.position = 'fixed';
        button.style.right = '50%';
        button.style.top = '10px';
        button.style.transform = 'translateX(50%)';
        button.style.width = '40px';
        button.style.height = '40px';
        button.style.borderRadius = '50%';
        button.style.background = isDarkMode ? '#4a4a4a' : '#007bff';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.zIndex = '999999';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
        button.style.fontSize = '18px';
        button.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
        button.textContent = '📋';
        button.title = 'Quick Messages';

        button.onclick = function() {
            isMinimized = false;
            saveMinimizedState();
            createPanel();
        };

        return button;
    }

    function createPanel() {
        // Remove existing elements
        const existingPanel = document.getElementById('quickMessagePanel');
        const existingMinimized = document.getElementById('quickMessageMinimized');
        if (existingPanel) existingPanel.remove();
        if (existingMinimized) existingMinimized.remove();

        if (isMinimized) {
            document.body.appendChild(createMinimizedButton());
            return;
        }

        const theme = getThemeStyles();
        
        const panel = document.createElement('div');
        panel.id = 'quickMessagePanel';
        panel.style.position = 'fixed';
        panel.style.right = '10px';
        panel.style.top = '10px';
        panel.style.width = '300px';
        panel.style.maxHeight = '400px';
        panel.style.overflowY = 'auto';
        panel.style.background = theme.background;
        panel.style.border = theme.border;
        panel.style.borderRadius = '8px';
        panel.style.padding = '10px';
        panel.style.zIndex = '999999';
        panel.style.fontSize = '14px';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.boxShadow = '0 4px 20px rgba(0,0,0,0.5)';
        panel.style.color = theme.color;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong>📋 Quick Messages</strong>
                <div style="display: flex; gap: 5px; align-items: center;">
                    <button id="themeToggle" style="background: none; border: 1px solid ${theme.color}; border-radius: 4px; color: ${theme.color}; font-size: 12px; cursor: pointer; padding: 2px 6px;" title="Toggle Theme">${isDarkMode ? '☀️' : '🌙'}</button>
                    <button id="togglePanel" style="background: none; border: none; font-size: 16px; cursor: pointer; color: ${theme.color};">−</button>
                </div>
            </div>
            <div id="panelContent">
                <textarea id="newMsg" rows="2" style="width: 100%; margin-bottom: 5px; background: ${theme.inputBg}; color: ${theme.inputColor}; border: 1px solid ${theme.itemBorder}; border-radius: 4px; padding: 5px; resize: vertical;"></textarea>
                <button id="addMsg" style="margin-bottom: 10px; background: ${theme.addButtonBg}; color: white; border: none; border-radius: 4px; padding: 5px 10px; cursor: pointer;">Add Message</button>
                <hr style="border-color: ${theme.itemBorder};">
                <div id="msgList"></div>
            </div>
        `;
        document.body.appendChild(panel);

        // Theme toggle functionality
        document.getElementById('themeToggle').onclick = function() {
            isDarkMode = !isDarkMode;
            saveTheme();
            createPanel();
        };

        // Minimize toggle functionality
        document.getElementById('togglePanel').onclick = function() {
            isMinimized = true;
            saveMinimizedState();
            createPanel();
        };

        document.getElementById('addMsg').onclick = function() {
            const newMsg = document.getElementById('newMsg').value.trim();
            if (!newMsg) return;
            if (messages.includes(newMsg)) {
                showNotification('This message already exists!', '#dc3545');
                return;
            }
            if (messages.length >= maxMessages) {
                showNotification('Maximum message limit reached!', '#dc3545');
                return;
            }
            messages.push(newMsg);
            saveMessages();
            addMessageToList(newMsg);
            document.getElementById('newMsg').value = '';
        };

        const msgList = document.getElementById('msgList');
        messages.forEach(msg => addMessageToList(msg));

        function addMessageToList(msg) {
            const div = document.createElement('div');
            div.style.marginBottom = '8px';
            div.style.padding = '5px';
            div.style.backgroundColor = theme.itemBg;
            div.style.borderRadius = '4px';
            div.style.border = `1px solid ${theme.itemBorder}`;
            div.innerHTML = `
                <button style="margin-right:8px; padding:4px 8px; background:${theme.copyButtonBg}; color:white; border:none; border-radius:4px; cursor:pointer;">📋</button>
                <button style="margin-right:8px; padding:4px 8px; background:#dc3545; color:white; border:none; border-radius:4px; cursor:pointer;">🗑️</button>
                <span style="font-size:12px;">${msg.substring(0, 50)}${msg.length > 50 ? '...' : ''}</span>
            `;
            const buttons = div.querySelectorAll('button');
            const copyBtn = buttons[0];
            const deleteBtn = buttons[1];
            
            copyBtn.onclick = function() {
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        navigator.clipboard.writeText(msg).then(() => {
                            showNotification('Message copied!', '#4CAF50');
                        }).catch(() => {
                            fallbackCopy(msg);
                        });
                    } else {
                        fallbackCopy(msg);
                    }
                } catch (e) {
                    fallbackCopy(msg);
                }
            };
            
            deleteBtn.onclick = function() {
                if (confirm('Are you sure you want to delete this message?')) {
                    const index = messages.indexOf(msg);
                    if (index > -1) {
                        messages.splice(index, 1);
                        saveMessages();
                        div.remove();
                        showNotification('Message deleted!', '#4CAF50');
                    }
                }
            };
            
            function fallbackCopy(text) {
                const tempInput = document.createElement('input');
                tempInput.value = text;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showNotification('Message copied!', '#4CAF50');
            }
            
            msgList.appendChild(div);
        }
    }

    // Wait for the page to load and ensure DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createPanel);
    } else {
        createPanel();
    }
    
    // Also try on window load as fallback
    window.addEventListener('load', createPanel);
})();