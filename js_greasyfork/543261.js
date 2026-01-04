// ==UserScript==
// @name        OBG-Ventana de capacidad de rampas
// @description Permite visualizar de manera sencilla la capacidad de las rampas basado en el tipo de material, se actualiza de manera automática.
// @namespace   CBI_P44_Plugins
// @version     2.1.4
// @author      tomasmoralescbi
// @include     https://yard-visibility-na12.voc.project44.com/dock/console
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/543261/OBG-Ventana%20de%20capacidad%20de%20rampas.user.js
// @updateURL https://update.greasyfork.org/scripts/543261/OBG-Ventana%20de%20capacidad%20de%20rampas.meta.js
// ==/UserScript==
/*
Instructions:
This code creates a draggable window that shows the status of docks in a yard.
It listens for requests to yard-visibility-na12.api.project44.com to capture authentication headers.
Then it makes API requests to get dock status information and displays available spaces.

Features:
- Captures Authorization and Cookie headers from API requests
- Creates a draggable status window
- Shows available docks for various categories
- Updates status automatically every minute
- Provides a clean, minimalistic UI
*/

(function() {
    console.log('Dock status monitor script initialized');
    
    // Authentication data storage
    let authData = {
        authorization: null,
        cookie: null
    };
    
    // Track if window is already created
    let isWindowCreated = false;
    
    console.log('Setting up XHR and fetch interceptors');
    
    // Use document.cookie directly
    function getCurrentCookies() {
        return document.cookie;
    }
    
    // Capture the Authorization and Cookie headers
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;
    const originalFetch = window.fetch;
    
    // Intercept XMLHttpRequest
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        
        // Create a reference to this XHR headers
        if (!this._requestHeaders) {
            this._requestHeaders = {};
        }
        
        if (url.includes('yard-visibility-na12.api.project44.com')) {
            console.log('XHR intercepted: ' + method + ' ' + url);
            
            // Store all document cookies
            authData.cookie = getCurrentCookies();
            console.log('Document cookies captured - length: ' + authData.cookie.length);
        }
        
        return originalXHROpen.apply(this, arguments);
    };
    
    // Override setRequestHeader to capture headers
    const originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
        if (!this._requestHeaders) {
            this._requestHeaders = {};
        }
        
        this._requestHeaders[name] = value;
        
        if (name.toLowerCase() === 'authorization') {
            console.log('Captured authorization header in XHR request');
            authData.authorization = value;
        }
        
        return originalSetRequestHeader.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.send = function(body) {
        const xhr = this;
        
        if (xhr._url && xhr._url.includes('yard-visibility-na12.api.project44.com')) {
            console.log('Sending XHR request to: ' + xhr._url);
            
            if (xhr._requestHeaders) {
                console.log('Request headers present:', Object.keys(xhr._requestHeaders).join(', '));
                
                if (xhr._requestHeaders['Authorization'] || xhr._requestHeaders['authorization']) {
                    authData.authorization = xhr._requestHeaders['Authorization'] || xhr._requestHeaders['authorization'];
                    console.log('Authorization header captured from XHR');
                }
            }
            
            // Always update cookies
            authData.cookie = getCurrentCookies();
            
            // Create window if we have auth data
            if (authData.authorization && !isWindowCreated) {
                console.log('Creating window with authorization from XHR');
                createStatusWindow();
            }
        }
        
        return originalXHRSend.apply(this, arguments);
    };
    
    // Intercept fetch
    window.fetch = async function(resource, init) {
        let url = resource;
        if (resource instanceof Request) {
            url = resource.url;
        }
        
        if (typeof url === 'string' && url.includes('yard-visibility-na12.api.project44.com')) {
            console.log('Fetch intercepted: ' + url);
            
            // Always capture current cookies
            authData.cookie = getCurrentCookies();
            console.log('Document cookies captured from fetch - length: ' + authData.cookie.length);
            
            if (init && init.headers) {
                // Get authorization from headers
                const headers = init.headers;
                
                if (headers instanceof Headers) {
                    const authorization = headers.get('Authorization') || headers.get('authorization');
                    
                    if (authorization) {
                        console.log('Authorization header captured from fetch Headers');
                        authData.authorization = authorization;
                    }
                } else if (typeof headers === 'object') {
                    const authorization = headers['Authorization'] || headers['authorization'];
                    
                    if (authorization) {
                        console.log('Authorization header captured from fetch object');
                        authData.authorization = authorization;
                    }
                }
                
                // Create window if we have auth data
                if (authData.authorization && !isWindowCreated) {
                    console.log('Creating window with authorization from fetch');
                    createStatusWindow();
                }
            }
        }
        
        return originalFetch.apply(this, arguments);
    };
    
    // Added manual trigger with timeout as a fallback
    setTimeout(function() {
        console.log('Timeout reached. Current auth data:', {
            authorization: authData.authorization ? authData.authorization.substring(0, 20) + '...' : 'missing',
            cookie: authData.cookie ? authData.cookie.substring(0, 20) + '...' : 'missing'
        });
        
        // Always get current cookies
        authData.cookie = getCurrentCookies();
        
        if (!isWindowCreated) {
            console.log('Attempting to create window after timeout');
            createStatusWindow();
        }
    }, 5000);
    
    // Function to create the status window
    function createStatusWindow() {
        console.log('Creating status window function called');
        
        if (isWindowCreated) {
            console.log('Window already created, skipping');
            return;
        }
        
        isWindowCreated = true;
        console.log('Setting up status window');
        
        try {
            // Create the container
            const container = document.createElement('div');
            container.id = 'dock-status-container';
            container.style.cssText = 
                'position: fixed;' +
                'top: 20px;' +
                'right: 20px;' +
                'width: 250px;' +
                'background-color: #fff;' +
                'border: 1px solid #ccc;' +
                'border-radius: 5px;' +
                'box-shadow: 0 2px 10px rgba(0,0,0,0.2);' +
                'z-index: 99999;' +
                'font-family: Arial, sans-serif;' +
                'overflow: hidden;';
            
            // Create header
            const header = document.createElement('div');
            header.style.cssText = 
                'background-color: #4285f4;' +
                'color: white;' +
                'padding: 10px;' +
                'font-weight: bold;' +
                'cursor: move;' +
                'display: flex;' +
                'justify-content: space-between;' +
                'align-items: center;';
            header.innerHTML = '<span>Espacios disponibles</span>';
            
            // Add refresh button
            const refreshButton = document.createElement('button');
            refreshButton.innerHTML = '↻';
            refreshButton.style.cssText = 
                'background: none;' +
                'border: none;' +
                'color: white;' +
                'cursor: pointer;' +
                'font-size: 16px;' +
                'padding: 0;' +
                'margin: 0;';
            refreshButton.onclick = function(e) {
                console.log('Refresh button clicked');
                e.stopPropagation();
                // Update cookies before refresh
                authData.cookie = getCurrentCookies();
                updateAllDockStatus();
            };
            header.appendChild(refreshButton);
            
            // Add auth status indicators
            const authContainer = document.createElement('div');
            authContainer.style.cssText = 
                'display: flex;' +
                'align-items: center;';
            
            const authLabel = document.createElement('span');
            authLabel.style.cssText = 
                'font-size: 10px;' +
                'margin-right: 4px;';
            authLabel.textContent = 'A';
            
            const authStatus = document.createElement('div');
            authStatus.id = 'dock-auth-status';
            authStatus.style.cssText = 
                'background-color: ' + (authData.authorization ? '#4caf50' : '#f44336') + ';' +
                'height: 8px;' +
                'width: 8px;' +
                'border-radius: 50%;' +
                'margin-right: 4px;';
            
            const cookieLabel = document.createElement('span');
            cookieLabel.style.cssText = 
                'font-size: 10px;' +
                'margin-right: 4px;';
            cookieLabel.textContent = 'C';
            
            const cookieStatus = document.createElement('div');
            cookieStatus.id = 'dock-cookie-status';
            cookieStatus.style.cssText = 
                'background-color: ' + (authData.cookie && authData.cookie.length > 0 ? '#4caf50' : '#f44336') + ';' +
                'height: 8px;' +
                'width: 8px;' +
                'border-radius: 50%;';
            
            authContainer.appendChild(authLabel);
            authContainer.appendChild(authStatus);
            authContainer.appendChild(cookieLabel);
            authContainer.appendChild(cookieStatus);
            header.appendChild(authContainer);
            
            // Create content area
            const content = document.createElement('div');
            content.style.cssText = 'padding: 10px;';
            
            // Create status items
            const statusItems = [
                { name: 'Producto terminado', endpoint: 'carga%20pt' },
                { name: 'Vidrio full', endpoint: 'descarga%20full' },
                { name: 'Vidrio intermodal', endpoint: 'intermodal' },
                { name: 'West vacío', endpoint: 'west%20vacio' },
                { name: 'Bote', endpoint: 'descarga%20bote' },
                { name: 'Tarimas', endpoint: 't%20madera' },
                { name: 'Descarga Fase 2', endpoint: 'carga%20pt%202' }
            ];
            
            statusItems.forEach(function(item) {
                const statusElement = document.createElement('div');
                statusElement.classList.add('dock-status-item');
                statusElement.style.cssText = 
                    'display: flex;' +
                    'justify-content: space-between;' +
                    'margin-bottom: 8px;' +
                    'padding-bottom: 8px;' +
                    'border-bottom: 1px solid #eee;';
                
                // Create name span
                const nameSpan = document.createElement('span');
                nameSpan.textContent = item.name + ':';
                
                // Create value span
                const valueSpan = document.createElement('span');
                valueSpan.id = 'dock-status-' + item.endpoint.replace(/%20/g, '-');
                valueSpan.className = 'dock-status-value';
                valueSpan.textContent = 'Cargando...';
                
                statusElement.appendChild(nameSpan);
                statusElement.appendChild(valueSpan);
                content.appendChild(statusElement);
            });
            
            container.appendChild(header);
            container.appendChild(content);
            document.body.appendChild(container);
            
            console.log('Status window created and added to document');
            
            // Make the window draggable
            makeDraggable(container, header);
            
            // Update status immediately
            console.log('Initiating first status update');
            updateAllDockStatus();
            
            // Set interval for updates
            setInterval(function() {
                // Always update cookies before making requests
                authData.cookie = getCurrentCookies();
                updateAllDockStatus();
            }, 60000); // Update every minute
        } catch (error) {
            console.error('Error creating status window:', error);
        }
    }
    
    // Function to make an element draggable
    function makeDraggable(element, dragHandle) {
        console.log('Setting up draggable functionality');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        dragHandle.onmousedown = dragMouseDown;
        
        function dragMouseDown(e) {
            console.log('Drag started');
            e = e || window.event;
            e.preventDefault();
            // Get the mouse cursor position at startup
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // Call a function whenever the cursor moves
            document.onmousemove = elementDrag;
        }
        
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // Calculate the new cursor position
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // Set the element's new position
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
        }
        
        function closeDragElement() {
            console.log('Drag ended');
            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    
    // Function to update all dock statuses
    function updateAllDockStatus() {
        console.log('Updating all dock statuses');
        
        // Always refresh cookies
        authData.cookie = getCurrentCookies();
        
        console.log('Current auth data:', {
            authorization: authData.authorization ? authData.authorization.substring(0, 20) + '...' : 'missing',
            cookie: authData.cookie ? authData.cookie.substring(0, 20) + '...' : 'missing'
        });
        
        // Update status indicators
        const authStatus = document.getElementById('dock-auth-status');
        if (authStatus) {
            authStatus.style.backgroundColor = authData.authorization ? '#4caf50' : '#f44336';
        }
        
        const cookieStatus = document.getElementById('dock-cookie-status');
        if (cookieStatus) {
            cookieStatus.style.backgroundColor = (authData.cookie && authData.cookie.length > 0) ? '#4caf50' : '#f44336';
        }
        
        // Check if we have the necessary auth data
        if (!authData.authorization) {
            console.warn('Cannot update dock status: No authorization token available');
            
            // Show error message in all status items
            const statusValues = document.getElementsByClassName('dock-status-value');
            for (let i = 0; i < statusValues.length; i++) {
                statusValues[i].textContent = 'Sin autorización';
                statusValues[i].style.color = 'red';
            }
            
            return;
        }
        
        const statusItems = [
            { endpoint: 'carga%20pt' },
            { endpoint: 'descarga%20full' },
            { endpoint: 'intermodal' },
            { endpoint: 'west%20vacio' },
            { endpoint: 'descarga%20bote' },
            { endpoint: 't%20madera' },
            { endpoint: 'carga%20pt%202' }
        ];
        
        statusItems.forEach(function(item) {
            updateDockStatus(item.endpoint);
        });
    }
    
    // Function to update a single dock status with direct XHR for more control
    function updateDockStatus(dockGroup) {
        console.log('Updating dock status for: ' + dockGroup);
        
        const url = 'https://yard-visibility-na12.api.project44.com/v1/dock/console?site=obregon&dock_group=' + dockGroup;
        const elementId = 'dock-status-' + dockGroup.replace(/%20/g, '-');
        const statusElement = document.getElementById(elementId);
        
        // Show loading state
        if (statusElement) {
            statusElement.textContent = 'Cargando...';
            statusElement.style.color = '#666';
        }
        
        // Use XHR instead of fetch for more control
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.setRequestHeader('Authorization', authData.authorization);
        
        // Set common request headers
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        // Important: Do not set Cookie header manually as browsers send cookies automatically
        // for same-origin requests. Setting it manually can cause issues.
        // The browser will automatically include cookies from document.cookie
        
        xhr.withCredentials = true; // Important! This ensures cookies are sent with the request
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                console.log('XHR response for ' + dockGroup + ':', {
                    status: xhr.status,
                    responseText: xhr.responseText ? xhr.responseText.substring(0, 50) + '...' : 'empty'
                });
                
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('Data received for ' + dockGroup + ':', {
                            dataLength: data.data ? data.data.length : 0,
                            pagination: data.pagination
                        });
                        
                        if (data && data.data && data.pagination) {
                            const openDocks = data.data.filter(function(dock) {
                                return dock.dock_status === 'open';
                            }).length;
                            const totalDocks = data.pagination.total;
                            
                            console.log(dockGroup + ': ' + openDocks + '/' + totalDocks + ' docks open');
                            
                            if (statusElement) {
                                statusElement.textContent = openDocks + '/' + totalDocks;
                                
                                // Add color coding based on availability
                                if (openDocks === 0) {
                                    statusElement.style.color = 'red';
                                } else if (openDocks < totalDocks / 2) {
                                    statusElement.style.color = 'orange';
                                } else {
                                    statusElement.style.color = 'green';
                                }
                                
                                console.log('Updated element ' + elementId + ' with value ' + openDocks + '/' + totalDocks);
                            }
                        } else {
                            console.warn('Invalid data structure for ' + dockGroup);
                            if (statusElement) {
                                statusElement.textContent = 'Formato error';
                                statusElement.style.color = 'red';
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing JSON for ' + dockGroup + ':', error);
                        if (statusElement) {
                            statusElement.textContent = 'Error JSON';
                            statusElement.style.color = 'red';
                        }
                    }
                } else {
                    console.error('HTTP error for ' + dockGroup + ': ' + xhr.status);
                    if (statusElement) {
                        statusElement.textContent = 'Error ' + xhr.status;
                        statusElement.style.color = 'red';
                    }
                }
            }
        };
        
        xhr.onerror = function() {
            console.error('Network error for ' + dockGroup);
            if (statusElement) {
                statusElement.textContent = 'Error red';
                statusElement.style.color = 'red';
            }
        };
        
        console.log('Sending XHR for ' + dockGroup + ' with auth and cookies');
        xhr.send();
    }
    
    // Add a way to manually trigger the window for testing
    window.showDockStatus = function() {
        console.log('Manual trigger called');
        createStatusWindow();
    };
    
    // Add a way to set auth token manually for testing
    window.setDockAuthToken = function(token) {
        console.log('Setting auth token manually');
        authData.authorization = token;
        
        // Update auth status indicator
        const authStatus = document.getElementById('dock-auth-status');
        if (authStatus) {
            authStatus.style.backgroundColor = authData.authorization ? '#4caf50' : '#f44336';
        }
        
        // Refresh data
        updateAllDockStatus();
    };
    
    console.log('Dock status monitor script fully initialized');
})();