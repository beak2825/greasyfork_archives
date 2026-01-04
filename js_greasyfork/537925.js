// ==UserScript==
// @name         PLDT IMEI and HTTP Request Sender
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Two separate minimizable panels for sending IMEI-specific POST requests and general HTTP requests on pldthomewifisettings.net and 192.168.1.1
// @author       Grok
// @match        https://pldthomewifisettings.net/*
// @match        http://192.168.1.1/*
// @match        https://192.168.1.1/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/537925/PLDT%20IMEI%20and%20HTTP%20Request%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/537925/PLDT%20IMEI%20and%20HTTP%20Request%20Sender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Only run on the specified URLs
    const allowedUrls = [
        'https://pldthomewifisettings.net/',
        'http://192.168.1.1/',
        'https://192.168.1.1/'
    ];
    if (!allowedUrls.some(url => window.location.href.startsWith(url))) {
        return;
    }

    // Create the IMEI Sender UI
    function createImeiUI() {
        // Check for existing IMEI panel and hide it if found
        const existingImeiPanel = document.getElementById('imeiPanel');
        const existingImeiToggle = document.getElementById('imeiToggleBtn');
        if (existingImeiPanel) {
            existingImeiPanel.style.display = 'none';
        }
        if (existingImeiToggle) {
            existingImeiToggle.style.display = 'none';
        }

        // IMEI panel
        const imeiPanel = document.createElement('div');
        imeiPanel.id = 'imeiPanel';
        imeiPanel.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            border: none;
            border-radius: 8px;
            padding: 15px;
            z-index: 10001;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 400px;
            width: 90%;
            display: none;
            transition: all 0.3s ease;
        `;

        imeiPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #333;">PLDT IMEI Sender</h3>
                <button id="imeiMinimizeBtn" style="cursor: pointer; background: none; border: none; font-size: 16px; color: #666; transition: color 0.2s ease;">−</button>
            </div>
            <label style="font-size: 14px; color: #555; margin-bottom: 5px; display: block;">IMEI:</label>
            <input type="text" id="imeiInput" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s ease;" placeholder="e.g., 354406082299349">
            <button id="imeiSendBtn" style="width: 100%; padding: 10px; background: #6200ea; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.2s ease;">Send IMEI</button>
            <div id="imeiResponse" style="margin-top: 10px; max-height: 100px; overflow-y: auto; font-size: 14px; color: #333; background: #f8f9fa; padding: 8px; border-radius: 4px;"></div>
        `;

        // IMEI toggle button
        const imeiToggleBtn = document.createElement('button');
        imeiToggleBtn.id = 'imeiToggleBtn';
        imeiToggleBtn.innerText = 'Show IMEI Sender';
        imeiToggleBtn.style.cssText = `
            position: fixed;
            bottom: 50px;
            left: 10px;
            transform: none;
            background: #6200ea;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            z-index: 10002;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s ease, transform 0.2s ease;
        `;

        document.body.appendChild(imeiPanel);
        document.body.appendChild(imeiToggleBtn);

        // IMEI panel toggle functionality
        imeiToggleBtn.addEventListener('click', () => {
            const httpPanel = document.getElementById('httpRequestPanel');
            const httpToggleBtn = document.getElementById('httpToggleBtn');
            if (imeiPanel.style.display === 'none') {
                imeiPanel.style.display = 'block';
                imeiToggleBtn.innerText = 'Hide IMEI Sender';
                // Minimize HTTP panel if open
                if (httpPanel && httpToggleBtn) {
                    httpPanel.style.display = 'none';
                    httpToggleBtn.innerText = 'Show HTTP Sender';
                }
            } else {
                imeiPanel.style.display = 'none';
                imeiToggleBtn.innerText = 'Show IMEI Sender';
            }
        });

        document.getElementById('imeiMinimizeBtn').addEventListener('click', () => {
            imeiPanel.style.display = 'none';
            imeiToggleBtn.innerText = 'Show IMEI Sender';
            imeiToggleBtn.style.display = 'block';
        });

        // Hover and focus effects for IMEI panel
        const imeiInput = imeiPanel.querySelector('#imeiInput');
        imeiInput.addEventListener('focus', () => {
            imeiInput.style.borderColor = '#6200ea';
        });
        imeiInput.addEventListener('blur', () => {
            imeiInput.style.borderColor = '#ddd';
        });

        const imeiSendBtn = imeiPanel.querySelector('#imeiSendBtn');
        imeiSendBtn.addEventListener('mouseover', () => {
            imeiSendBtn.style.background = '#7c4dff';
        });
        imeiSendBtn.addEventListener('mouseout', () => {
            imeiSendBtn.style.background = '#6200ea';
        });

        imeiToggleBtn.addEventListener('mouseover', () => {
            imeiToggleBtn.style.background = '#7c4dff';
            imeiToggleBtn.style.transform = 'scale(1.05)';
        });
        imeiToggleBtn.addEventListener('mouseout', () => {
            imeiToggleBtn.style.background = '#6200ea';
            imeiToggleBtn.style.transform = 'none';
        });

        // IMEI send button event listener
        document.getElementById('imeiSendBtn').addEventListener('click', sendImeiRequest);
    }

    // Create the HTTP Request Sender UI
    function createHttpUI() {
        // Check for existing HTTP panel and hide it if found
        const existingHttpPanel = document.getElementById('httpRequestPanel');
        const existingHttpToggle = document.getElementById('httpToggleBtn');
        if (existingHttpPanel) {
            existingHttpPanel.style.display = 'none';
        }
        if (existingHttpToggle) {
            existingHttpToggle.style.display = 'none';
        }

        // HTTP request panel
        const httpPanel = document.createElement('div');
        httpPanel.id = 'httpRequestPanel';
        httpPanel.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            border: none;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 450px;
            width: 90%;
            display: none;
            transition: all 0.3s ease;
        `;

        httpPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">HTTP Request Sender</h3>
                <button id="httpMinimizeBtn" style="cursor: pointer; background: none; border: none; font-size: 18px; color: #666; transition: color 0.2s ease;">−</button>
            </div>
            <div id="requestForm">
                <label style="font-size: 14px; color: #555; margin-bottom: 5px; display: block;">Request Name:</label>
                <input type="text" id="reqName" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s ease;" placeholder="e.g., Update WiFi Settings">
                <label style="font-size: 14px; color: #555; margin-bottom: 5px; display: block;">URL:</label>
                <input type="text" id="reqUrl" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; outline: none; transition: border-color 0.2s ease;" value="https://pldthomewifisettings.net/apply.cgi" placeholder="Enter URL">
                <label style="font-size: 14px; color: #555; margin-bottom: 5px; display: block;">Method:</label>
                <select id="reqMethod" style="width: 100%; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; background: #fff; outline: none; transition: border-color 0.2s ease;">
                    <option value="GET">GET</option>
                    <option value="POST" selected>POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                </select>
                <label style="font-size: 14px; color: #555; margin-bottom: 5px; display: block;">Body (for POST/PUT):</label>
                <textarea id="reqBody" style="width: 100%; height: 80px; padding: 8px; margin-bottom: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; resize: vertical; outline: none; transition: border-color 0.2s ease;" placeholder='{"key": "value"}'></textarea>
                <div style="display: flex; gap: 10px; margin-bottom: 12px;">
                    <button id="saveRequest" style="flex: 1; padding: 10px; background: #4a90e2; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.2s ease;">Save Request</button>
                    <button id="sendRequest" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; font-size: 14px; cursor: pointer; transition: background 0.2s ease;">Send Request</button>
                </div>
                <div id="response" style="margin-top: 10px; max-height: 150px; overflow-y: auto; font-size: 14px; color: #333; background: #f8f9fa; padding: 10px; border-radius: 4px;"></div>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <h4 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #333;">Saved Requests</h4>
                <div id="savedRequestsList" style="max-height: 150px; overflow-y: auto;"></div>
            </div>
        `;

        // HTTP toggle button
        const httpToggleBtn = document.createElement('button');
        httpToggleBtn.id = 'httpToggleBtn';
        httpToggleBtn.innerText = 'Show HTTP Sender';
        httpToggleBtn.style.cssText = `
            position: fixed;
            bottom: 10px;
            left: 10px;
            transform: none;
            background: #304ffe;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 16px;
            z-index: 10000;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s ease, transform 0.2s ease;
        `;

        document.body.appendChild(httpPanel);
        document.body.appendChild(httpToggleBtn);

        // HTTP panel toggle functionality
        httpToggleBtn.addEventListener('click', () => {
            const imeiPanel = document.getElementById('imeiPanel');
            const imeiToggleBtn = document.getElementById('imeiToggleBtn');
            if (httpPanel.style.display === 'none') {
                httpPanel.style.display = 'block';
                httpToggleBtn.innerText = 'Hide HTTP Sender';
                // Minimize IMEI panel if open
                if (imeiPanel && imeiToggleBtn) {
                    imeiPanel.style.display = 'none';
                    imeiToggleBtn.innerText = 'Show IMEI Sender';
                }
            } else {
                httpPanel.style.display = 'none';
                httpToggleBtn.innerText = 'Show HTTP Sender';
            }
        });

        document.getElementById('httpMinimizeBtn').addEventListener('click', () => {
            httpPanel.style.display = 'none';
            httpToggleBtn.innerText = 'Show HTTP Sender';
            httpToggleBtn.style.display = 'block';
        });

        // Hover and focus effects for HTTP panel
        const inputs = httpPanel.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.style.borderColor = '#6200ea';
            });
            input.addEventListener('blur', () => {
                input.style.borderColor = '#ddd';
            });
        });

        const buttons = httpPanel.querySelectorAll('button#saveRequest, button#sendRequest');
        buttons.forEach(button => {
            button.addEventListener('mouseover', () => {
                button.style.background = button.id === 'saveRequest' ? '#357abd' : '#218838';
            });
            button.addEventListener('mouseout', () => {
                button.style.background = button.id === 'saveRequest' ? '#4a90e2' : '#28a745';
            });
        });

        httpToggleBtn.addEventListener('mouseover', () => {
            httpToggleBtn.style.background = '#536dfe';
            httpToggleBtn.style.transform = 'scale(1.05)';
        });
        httpToggleBtn.addEventListener('mouseout', () => {
            httpToggleBtn.style.background = '#304ffe';
            httpToggleBtn.style.transform = 'none';
        });

        // Add event listeners for HTTP request buttons
        document.getElementById('sendRequest').addEventListener('click', sendHttpRequest);
        document.getElementById('saveRequest').addEventListener('click', saveHttpRequest);

        // Load and display saved HTTP requests
        loadSavedHttpRequests();
    }

    // Function to send the IMEI POST request
    function sendImeiRequest() {
        const imei = document.getElementById('imeiInput').value.trim();
        const responseDiv = document.getElementById('imeiResponse');

        if (!imei) {
            responseDiv.innerHTML = `<strong style="color: #dc3545;">Error:</strong> Please enter an IMEI value`;
            return;
        }

        responseDiv.innerHTML = 'Sending request...';

        const url = 'https://pldthomewifisettings.net/apply.cgi';
        const data = `action=refresh&next_page=private/PLDT/command_shell_live.asp&cmd=at%25gimei=%22${encodeURIComponent(imei)}%22`;

        GM_xmlhttpRequest({
            method: 'POST',
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data,
            onload: function(response) {
                responseDiv.innerHTML = `
                    <strong style="color: #333;">Status:</strong> ${response.status} ${response.statusText}<br>
                    <strong style="color: #333;">Response:</strong><br>
                    <pre style="margin: 5px 0; font-size: 12px; color: #333;">${response.responseText}</pre>
                `;
            },
            onerror: function(error) {
                responseDiv.innerHTML = `
                    <strong style="color: #dc3545;">Error:</strong> ${error}
                `;
            }
        });
    }

    // Function to save the HTTP request
    function saveHttpRequest() {
        const reqName = document.getElementById('reqName').value || 'Unnamed Request';
        const method = document.getElementById('reqMethod').value;
        const body = document.getElementById('reqBody').value;
        const url = document.getElementById('reqUrl').value;

        // Load existing saved requests from localStorage
        const savedRequests = JSON.parse(localStorage.getItem('savedHttpRequests') || '[]');

        // Add new request with a unique ID
        const request = {
            id: Date.now(),
            name: reqName,
            method: method,
            body: body,
            url: url
        };

        savedRequests.push(request);
        localStorage.setItem('savedHttpRequests', JSON.stringify(savedRequests));

        // Refresh the saved requests list
        loadSavedHttpRequests();

        // Notify user
        document.getElementById('response').innerHTML = `<strong>Saved:</strong> ${reqName}`;
    }

    // Function to load and display saved HTTP requests
    function loadSavedHttpRequests() {
        const savedRequestsList = document.getElementById('savedRequestsList');
        const savedRequests = JSON.parse(localStorage.getItem('savedHttpRequests') || '[]');

        savedRequestsList.innerHTML = '';

        savedRequests.forEach(request => {
            const requestDiv = document.createElement('div');
            requestDiv.style.cssText = `
                margin-bottom: 10px;
                padding: 8px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
                border-radius: 4px;
                transition: background 0.2s ease;
            `;
            requestDiv.innerHTML = `
                <strong style="font-size: 14px; color: #333;">${request.name}</strong> <span style="color: #666; font-size: 12px;">(${request.method})</span><br>
                <button class="loadBtn" data-id="${request.id}" style="padding: 4px 8px; margin-right: 5px; margin-top: 5px; background: #6c757d; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; transition: background 0.2s ease;">Load</button>
                <button class="deleteBtn" data-id="${request.id}" style="padding: 4px 8px; margin-top: 5px; background: #dc3545; color: white; border: none; border-radius: 4px; font-size: 12px; cursor: pointer; transition: background 0.2s ease;">Delete</button>
            `;
            savedRequestsList.appendChild(requestDiv);

            // Add hover effects for load and delete buttons
            const loadBtn = requestDiv.querySelector('.loadBtn');
            const deleteBtn = requestDiv.querySelector('.deleteBtn');
            loadBtn.addEventListener('mouseover', () => {
                loadBtn.style.background = '#5a6268';
            });
            loadBtn.addEventListener('mouseout', () => {
                loadBtn.style.background = '#6c757d';
            });
            deleteBtn.addEventListener('mouseover', () => {
                deleteBtn.style.background = '#c82333';
            });
            deleteBtn.addEventListener('mouseout', () => {
                deleteBtn.style.background = '#dc3545';
            });
        });

        // Add event listeners for load and delete buttons
        document.querySelectorAll('.loadBtn').forEach(btn => {
            btn.addEventListener('click', () => loadHttpRequest(btn.dataset.id));
        });
        document.querySelectorAll('.deleteBtn').forEach(btn => {
            btn.addEventListener('click', () => deleteHttpRequest(btn.dataset.id));
        });
    }

    // Function to load a saved HTTP request into the form
    function loadHttpRequest(id) {
        const savedRequests = JSON.parse(localStorage.getItem('savedHttpRequests') || '[]');
        const request = savedRequests.find(req => req.id == id);

        if (request) {
            document.getElementById('reqName').value = request.name;
            document.getElementById('reqMethod').value = request.method;
            document.getElementById('reqBody').value = request.body;
            document.getElementById('reqUrl').value = request.url || 'https://pldthomewifisettings.net/apply.cgi';
            document.getElementById('response').innerHTML = `<strong>Loaded:</strong> ${request.name}`;
        }
    }

    // Function to delete a saved HTTP request
    function deleteHttpRequest(id) {
        const savedRequests = JSON.parse(localStorage.getItem('savedHttpRequests') || '[]');
        const request = savedRequests.find(req => req.id == id);
        if (!request) return;

        // Show confirmation prompt
        if (!confirm(`Are you sure you want to delete the request "${request.name}"?`)) {
            return;
        }

        // Proceed with deletion
        const updatedRequests = savedRequests.filter(req => req.id != id);
        localStorage.setItem('savedHttpRequests', JSON.stringify(updatedRequests));
        loadSavedHttpRequests();
        document.getElementById('response').innerHTML = `<strong>Deleted:</strong> ${request.name} removed`;
    }

    // Function to send the HTTP request
    function sendHttpRequest() {
        const url = document.getElementById('reqUrl').value.trim();
        const method = document.getElementById('reqMethod').value;
        const body = document.getElementById('reqBody').value;
        const reqName = document.getElementById('reqName').value || 'Unnamed Request';
        const responseDiv = document.getElementById('response');

        if (!url) {
            responseDiv.innerHTML = `<strong style="color: #dc3545;">Error:</strong> Please enter a URL`;
            return;
        }

        responseDiv.innerHTML = 'Sending request...';

        GM_xmlhttpRequest({
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: (method === 'POST' || method === 'PUT') ? body : null,
            onload: function(response) {
                responseDiv.innerHTML = `
                    <strong style="color: #333;">Request Name:</strong> ${reqName}<br>
                    <strong style="color: #333;">Status:</strong> ${response.status} ${response.statusText}<br>
                    <strong style="color: #333;">Response:</strong><br>
                    <pre style="margin: 5px 0; font-size: 12px; color: #333;">${response.responseText}</pre>
                `;
            },
            onerror: function(error) {
                responseDiv.innerHTML = `
                    <strong style="color: #333;">Request Name:</strong> ${reqName}<br>
                    <strong style="color: #dc3545;">Error:</strong> ${error}
                `;
            }
        });
    }

    // Initialize both UIs when the page loads
    window.addEventListener('load', () => {
        createImeiUI();
        createHttpUI();
    });
})();