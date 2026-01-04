// ==UserScript==
// @name         Chrome Extension Executor
// @namespace    http://your.namespace.com
// @version      1.0
// @description  Execute Chrome extensions by entering their URL
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492977/Chrome%20Extension%20Executor.user.js
// @updateURL https://update.greasyfork.org/scripts/492977/Chrome%20Extension%20Executor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default colors for GUI
    var backgroundColor = 'rgba(0, 0, 0, 0.8)';
    var textColor = '#fff';
    var buttonColor = '#d9534f';

    // Create the HTML GUI for the extension executor
    var guiHTML = `
        <style>
            #executor-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: ${backgroundColor};
                z-index: 9999;
                overflow: hidden;
                padding: 20px;
            }
            #executor-content {
                display: flex;
                height: 100%;
                transition: transform 0.3s ease;
                overflow-y: auto;
                scrollbar-color: ${buttonColor} ${backgroundColor};
            }
            #executor-sidebar {
                width: 200px;
                background-color: rgba(0, 0, 0, 0.5);
                color: #fff;
                padding: 20px;
                overflow-y: auto;
                scrollbar-color: ${buttonColor} ${backgroundColor};
            }
            .executor-option {
                background-color: ${buttonColor};
                border: none;
                padding: 15px 30px;
                cursor: pointer;
                width: 100%;
                border-radius: 10px;
                margin-bottom: 15px;
                color: ${textColor};
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            .executor-option:hover {
                background-color: #c9302c;
            }
            #executor-main {
                flex: 1;
                background-color: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                padding: 20px;
                overflow-y: auto;
                scrollbar-color: ${buttonColor} ${backgroundColor};
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            #executor-title {
                margin-bottom: 20px;
                text-align: center;
                color: ${textColor};
                font-size: 24px;
            }
            #extension-executor, #html-executor, #html-logs {
                width: 80%;
                margin-bottom: 15px;
            }
            #extension-url, #code-editor, #console-log {
                width: 100%;
                min-height: 200px;
                padding: 10px;
                border: 1px solid ${buttonColor};
                border-radius: 5px;
                color: ${textColor};
                background-color: rgba(255, 255, 255, 0.1);
                transition: border-color 0.3s ease;
                resize: vertical;
                overflow: auto;
            }
            #extension-url:focus, #code-editor:focus {
                border-color: #5bc0de;
            }
            #get-extension-button, #execute-button {
                background-color: ${buttonColor};
                border: none;
                padding: 10px 20px;
                cursor: pointer;
                border-radius: 5px;
                color: ${textColor};
                font-size: 16px;
                transition: background-color 0.3s ease;
            }
            #get-extension-button:hover, #execute-button:hover {
                background-color: #c9302c;
            }
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                background: ${backgroundColor};
            }
            ::-webkit-scrollbar-thumb {
                background: ${buttonColor};
                border-radius: 5px;
            }
            ::-webkit-scrollbar-thumb:hover {
                background: #c9302c;
            }
        </style>
        <div id="executor-panel" style="display: none;">
            <div id="executor-content">
                <div id="executor-sidebar">
                    <h3 style="margin-bottom: 20px; color: #f00; font-size: 20px; text-transform: uppercase;">Options</h3>
                    <button class="executor-option" data-target="html-executor">HTML Executor</button>
                    <button class="executor-option" data-target="extension-executor">Extension Executor</button>
                    <button class="executor-option" data-target="html-logs">HTML Logs</button>
                    <button class="executor-option" data-target="settings">Settings</button>
                </div>
                <div id="executor-main">
                    <h2 id="executor-title">Choose an option</h2>
                    <div id="html-executor" style="display: none;">
                        <textarea id="code-editor"></textarea>
                        <button id="execute-button">Execute Script</button>
                    </div>
                    <div id="extension-executor" style="display: none;">
                        <input type="text" id="extension-url" placeholder="Enter extension URL">
                        <button id="get-extension-button">Get Extension Source</button>
                    </div>
                    <div id="html-logs" style="display: none;">
                        <textarea id="console-log" readonly></textarea>
                    </div>
                    <div id="settings" style="display: none;">
                        <h3>Change GUI Colors</h3>
                        <label for="background-color">Background Color:</label>
                        <input type="color" id="background-color" value="${backgroundColor}">
                        <label for="text-color">Text Color:</label>
                        <input type="color" id="text-color" value="${textColor}">
                        <label for="button-color">Button Color:</label>
                        <input type="color" id="button-color" value="${buttonColor}">
                    </div>
                </div>
            </div>
        </div>
    `;

    // Inject the HTML GUI into the document body
    document.body.insertAdjacentHTML('beforeend', guiHTML);

    // Add event listener to toggle the GUI visibility
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 'm') {
            var executorPanel = document.getElementById('executor-panel');
            executorPanel.style.display = (executorPanel.style.display === 'none') ? 'block' : 'none';
        }
    });

    // Add event listener to handle option clicks
    document.querySelectorAll('.executor-option').forEach(function(option) {
        option.addEventListener('click', function(event) {
            event.preventDefault();
            var targetId = this.getAttribute('data-target');
            showOption(targetId);
        });
    });

    // Function to show the selected option
    function showOption(targetId) {
        document.querySelectorAll('.executor-option').forEach(function(option) {
            option.classList.remove('active');
        });
        document.getElementById('executor-title').textContent = targetId.charAt(0).toUpperCase() + targetId.slice(1);
        document.querySelectorAll('#executor-main > div').forEach(function(option) {
            option.style.display = 'none';
        });
        document.getElementById(targetId).style.display = 'flex';
        document.querySelector('.executor-option[data-target="' + targetId + '"]').classList.add('active');
    }

    // Add event listener to execute script
    document.getElementById('execute-button').addEventListener('click', function() {
        var code = document.getElementById('code-editor').value;
        executeScript(code);
    });

    // Function to execute the entered script
    function executeScript(code) {
        try {
            eval(code);
            logMessage('Successfully executed!', 'green');
        } catch (error) {
            console.error('Script execution error:', error);
            logMessage('Execution failed: ' + error, 'red');
        }
    }

    // Function to log messages with color
    function logMessage(message, color) {
        var consoleLog = document.getElementById('console-log');
        consoleLog.value += message + '\n';
        consoleLog.scrollTop = consoleLog.scrollHeight; // Auto-scroll to the bottom
        consoleLog.style.color = color;
    }

    // Capture console.log messages and display them in HTML Logs
    var oldLog = console.log;
    console.log = function(message) {
        oldLog.apply(console, arguments);
        logMessage(message, 'white');
    };

    // Capture alerts and display them in HTML Logs
    window.alert = function(message) {
        console.log('Alert:', message);
        window.originalAlert(message); // Call original alert function to display alert
    };

    // Save reference to the original alert function
    window.originalAlert = window.alert;

    // Add event listener to get extension source code
    document.getElementById('get-extension-button').addEventListener('click', function() {
        var extensionUrl = document.getElementById('extension-url').value;
        if (extensionUrl) {
            getExtensionSource(extensionUrl);
        } else {
            alert('Please enter an extension URL.');
        }
    });

    // Function to get extension source code
    function getExtensionSource(extensionUrl) {
        fetch(extensionUrl)
            .then(response => response.text())
            .then(data => {
                document.getElementById('code-editor').value = data;
                logMessage('Extension source code fetched successfully!', 'green');
            })
            .catch(error => {
                console.error('Error fetching extension source:', error);
                logMessage('Error fetching extension source: ' + error, 'red');
            });
    }

    // Add event listener to change GUI colors
    document.getElementById('background-color').addEventListener('input', function() {
        backgroundColor = this.value;
        document.getElementById('executor-panel').style.backgroundColor = backgroundColor;
    });

    document.getElementById('text-color').addEventListener('input', function() {
        textColor = this.value;
        var elements = document.querySelectorAll('#executor-panel, #executor-title, #executor-main, #code-editor, #console-log');
        elements.forEach(function(element) {
            element.style.color = textColor;
        });
    });

    document.getElementById('button-color').addEventListener('input', function() {
        buttonColor = this.value;
        var buttons = document.querySelectorAll('.executor-option, #execute-button, #get-extension-button');
        buttons.forEach(function(button) {
            button.style.backgroundColor = buttonColor;
        });
    });

})();
