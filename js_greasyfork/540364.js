// ==UserScript==
// @name         IPTV Xtreme Codes ↔ M3U Converter
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Bidirectional IPTV converter: XC credentials ↔ M3U URLs (Toggle with Ctrl+Shift+M)
// @author       MidniteRyder
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/540364/IPTV%20Xtreme%20Codes%20%E2%86%94%20M3U%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/540364/IPTV%20Xtreme%20Codes%20%E2%86%94%20M3U%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let widget = null;
    let isWidgetVisible = false;
    let currentMode = 'xc-to-m3u'; // 'xc-to-m3u' or 'm3u-to-xc'
    
    // Create floating widget
    function createWidget() {
        if (widget) return widget;
        
        widget = document.createElement('div');
        widget.id = 'iptv-converter-widget';
        widget.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: #2c3e50;
            color: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            display: none;
        `;
        
        widget.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #ecf0f1;">IPTV M3U Converter</h3>
                <div style="display: flex; gap: 10px;">
                    <button id="mode-toggle" style="
                        background: #f39c12;
                        color: white;
                        border: none;
                        border-radius: 15px;
                        padding: 5px 12px;
                        cursor: pointer;
                        font-size: 11px;
                        font-weight: bold;
                    ">↔ XC→M3U</button>
                    <button id="close-widget" style="
                        background: #e74c3c;
                        color: white;
                        border: none;
                        border-radius: 50%;
                        width: 25px;
                        height: 25px;
                        cursor: pointer;
                        font-weight: bold;
                    ">×</button>
                </div>
            </div>
            
            <div id="converter-form">
                <!-- XC to M3U Mode -->
                <div id="xc-to-m3u-mode">
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 5px; color: #bdc3c7;">Server URL (DNS):</label>
                        <input type="text" id="server-url" placeholder="http://example.com:8080" style="
                            width: 100%;
                            padding: 8px;
                            border: none;
                            border-radius: 5px;
                            background: #34495e;
                            color: white;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 12px;">
                        <label style="display: block; margin-bottom: 5px; color: #bdc3c7;">Username:</label>
                        <input type="text" id="username" placeholder="your_username" style="
                            width: 100%;
                            padding: 8px;
                            border: none;
                            border-radius: 5px;
                            background: #34495e;
                            color: white;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #bdc3c7;">Password:</label>
                        <input type="password" id="password" placeholder="your_password" style="
                            width: 100%;
                            padding: 8px;
                            border: none;
                            border-radius: 5px;
                            background: #34495e;
                            color: white;
                            box-sizing: border-box;
                        ">
                    </div>
                    
                    <button id="generate-m3u" style="
                        width: 100%;
                        padding: 10px;
                        background: #27ae60;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 10px;
                    ">Generate M3U URLs</button>
                    
                    <div id="results" style="display: none;">
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 5px; color: #f39c12; font-weight: bold;">Live TV M3U:</label>
                            <div style="background: #1a252f; padding: 8px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
                                <span id="live-m3u"></span>
                            </div>
                            <button class="copy-btn" data-target="live-m3u" style="
                                margin-top: 5px;
                                padding: 5px 10px;
                                background: #3498db;
                                color: white;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                                font-size: 12px;
                            ">Copy Live M3U</button>
                        </div>
                        
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 5px; color: #f39c12; font-weight: bold;">Movies M3U:</label>
                            <div style="background: #1a252f; padding: 8px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
                                <span id="movies-m3u"></span>
                            </div>
                            <button class="copy-btn" data-target="movies-m3u" style="
                                margin-top: 5px;
                                padding: 5px 10px;
                                background: #3498db;
                                color: white;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                                font-size: 12px;
                            ">Copy Movies M3U</button>
                        </div>
                        
                        <div style="margin: 10px 0;">
                            <label style="display: block; margin-bottom: 5px; color: #f39c12; font-weight: bold;">Series M3U:</label>
                            <div style="background: #1a252f; padding: 8px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
                                <span id="series-m3u"></span>
                            </div>
                            <button class="copy-btn" data-target="series-m3u" style="
                                margin-top: 5px;
                                padding: 5px 10px;
                                background: #3498db;
                                color: white;
                                border: none;
                                border-radius: 3px;
                                cursor: pointer;
                                font-size: 12px;
                            ">Copy Series M3U</button>
                        </div>
                    </div>
                </div>

                <!-- M3U to XC Mode -->
                <div id="m3u-to-xc-mode" style="display: none;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 5px; color: #bdc3c7;">M3U URL:</label>
                        <textarea id="m3u-url" placeholder="http://server.com/get.php?username=user&password=pass&type=m3u_plus&output=ts" style="
                            width: 100%;
                            height: 80px;
                            padding: 8px;
                            border: none;
                            border-radius: 5px;
                            background: #34495e;
                            color: white;
                            box-sizing: border-box;
                            resize: vertical;
                            font-family: monospace;
                            font-size: 12px;
                        "></textarea>
                    </div>
                    
                    <button id="parse-m3u" style="
                        width: 100%;
                        padding: 10px;
                        background: #9b59b6;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-weight: bold;
                        margin-bottom: 10px;
                    ">Extract XC Credentials</button>
                    
                    <div id="extracted-credentials" style="display: none;">
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px; color: #f39c12; font-weight: bold;">Extracted Server URL:</label>
                            <div style="background: #1a252f; padding: 8px; border-radius: 5px; font-family: monospace; font-size: 12px; word-break: break-all;">
                                <span id="extracted-server"></span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px; color: #f39c12; font-weight: bold;">Extracted Username:</label>
                            <div style="background: #1a252f; padding: 8px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                                <span id="extracted-username"></span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label style="display: block; margin-bottom: 5px; color: #f39c12; font-weight: bold;">Extracted Password:</label>
                            <div style="background: #1a252f; padding: 8px; border-radius: 5px; font-family: monospace; font-size: 12px;">
                                <span id="extracted-password"></span>
                            </div>
                        </div>
                        
                        <button id="copy-credentials" style="
                            width: 100%;
                            padding: 8px;
                            background: #3498db;
                            color: white;
                            border: none;
                            border-radius: 3px;
                            cursor: pointer;
                            font-size: 12px;
                            margin-top: 5px;
                        ">Copy All Credentials</button>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 15px; color: #95a5a6; font-size: 12px;">
                    Press <kbd style="background: #34495e; padding: 2px 6px; border-radius: 3px;">Ctrl+Shift+M</kbd> to toggle
                </div>
            </div>
        `;
        
        document.body.appendChild(widget);
        setupEventListeners();
        return widget;
    }
    
    function setupEventListeners() {
        if (!widget) return;
        
        // Mode toggle button
        const modeToggle = widget.querySelector('#mode-toggle');
        if (modeToggle) {
            modeToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('IPTV Converter: Mode toggle button clicked');
                toggleMode();
            });
        }
        
        // Close widget
        const closeBtn = widget.querySelector('#close-widget');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                hideWidget();
            });
        }
        
        // Generate M3U URLs (XC to M3U mode)
        const generateBtn = widget.querySelector('#generate-m3u');
        if (generateBtn) {
            generateBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const serverUrl = widget.querySelector('#server-url').value.trim();
                const username = widget.querySelector('#username').value.trim();
                const password = widget.querySelector('#password').value.trim();
                
                if (!serverUrl || !username || !password) {
                    alert('Please fill in all fields');
                    return;
                }
                
                // Save credentials for next time
                saveCredentials(serverUrl, username);
                
                // Remove trailing slash from server URL if present
                const cleanUrl = serverUrl.replace(/\/$/, '');
                
                // Generate M3U URLs for different content types
                const liveM3U = `${cleanUrl}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts`;
                const moviesM3U = `${cleanUrl}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts&category=movie`;
                const seriesM3U = `${cleanUrl}/get.php?username=${username}&password=${password}&type=m3u_plus&output=ts&category=series`;
                
                // Display results
                widget.querySelector('#live-m3u').textContent = liveM3U;
                widget.querySelector('#movies-m3u').textContent = moviesM3U;
                widget.querySelector('#series-m3u').textContent = seriesM3U;
                widget.querySelector('#results').style.display = 'block';
            });
        }
        
        // Parse M3U URL (M3U to XC mode)
        const parseBtn = widget.querySelector('#parse-m3u');
        if (parseBtn) {
            parseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const m3uUrl = widget.querySelector('#m3u-url').value.trim();
                
                if (!m3uUrl) {
                    alert('Please enter an M3U URL');
                    return;
                }
                
                try {
                    const parsedCredentials = parseM3UUrl(m3uUrl);
                    
                    if (parsedCredentials.error) {
                        alert('Error: ' + parsedCredentials.error);
                        return;
                    }
                    
                    // Display extracted credentials
                    widget.querySelector('#extracted-server').textContent = parsedCredentials.server;
                    widget.querySelector('#extracted-username').textContent = parsedCredentials.username;
                    widget.querySelector('#extracted-password').textContent = parsedCredentials.password;
                    widget.querySelector('#extracted-credentials').style.display = 'block';
                    
                } catch (error) {
                    alert('Failed to parse M3U URL. Please check the format and try again.');
                    console.error('M3U parsing error:', error);
                }
            });
        }
        
        // Copy credentials button
        const copyCredsBtn = widget.querySelector('#copy-credentials');
        if (copyCredsBtn) {
            copyCredsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const server = widget.querySelector('#extracted-server').textContent;
                const username = widget.querySelector('#extracted-username').textContent;
                const password = widget.querySelector('#extracted-password').textContent;
                
                const credentialsText = `Server URL: ${server}\nUsername: ${username}\nPassword: ${password}`;
                
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(credentialsText).then(() => {
                        showCopySuccess(this);
                    }).catch(() => {
                        copyWithTextarea(credentialsText, this);
                    });
                } else {
                    copyWithTextarea(credentialsText, this);
                }
            });
        }
        
        // Copy to clipboard functionality for M3U URLs
        const copyBtns = widget.querySelectorAll('.copy-btn');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-target');
                const targetElement = widget.querySelector('#' + targetId);
                const textToCopy = targetElement.textContent;
                
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        showCopySuccess(this);
                    }).catch(() => {
                        copyWithTextarea(textToCopy, this);
                    });
                } else {
                    copyWithTextarea(textToCopy, this);
                }
            });
        });
        
        // Make widget draggable
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        widget.addEventListener('mousedown', function(e) {
            if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && e.target.tagName !== 'TEXTAREA') {
                isDragging = true;
                const rect = widget.getBoundingClientRect();
                dragOffset.x = e.clientX - rect.left;
                dragOffset.y = e.clientY - rect.top;
                widget.style.cursor = 'grabbing';
                e.preventDefault();
            }
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                widget.style.left = (e.clientX - dragOffset.x) + 'px';
                widget.style.top = (e.clientY - dragOffset.y) + 'px';
                widget.style.right = 'auto';
            }
        });
        
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                isDragging = false;
                widget.style.cursor = 'default';
            }
        });
    }
    
    function copyWithTextarea(text, button) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        
        try {
            document.execCommand('copy');
            showCopySuccess(button);
        } catch (err) {
            console.error('Failed to copy: ', err);
            alert('Failed to copy to clipboard');
        }
        
        document.body.removeChild(textarea);
    }
    
    function showCopySuccess(button) {
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.style.background = '#27ae60';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '#3498db';
        }, 1500);
    }
    
    // Parse M3U URL to extract XC credentials
    function parseM3UUrl(url) {
        try {
            const urlObj = new URL(url);
            
            // Check if it's a valid Xtreme Codes URL
            if (!urlObj.pathname.includes('get.php')) {
                return { error: 'This doesn\'t appear to be a valid Xtreme Codes M3U URL. URLs should contain "get.php".' };
            }
            
            const params = urlObj.searchParams;
            const username = params.get('username');
            const password = params.get('password');
            
            if (!username || !password) {
                return { error: 'Could not find username or password parameters in the URL.' };
            }
            
            // Extract server URL (protocol + hostname + port)
            let server = `${urlObj.protocol}//${urlObj.hostname}`;
            if (urlObj.port) {
                server += `:${urlObj.port}`;
            }
            
            return {
                server: server,
                username: username,
                password: password
            };
            
        } catch (error) {
            return { error: 'Invalid URL format. Please check the URL and try again.' };
        }
    }
    
    // Toggle between XC to M3U and M3U to XC modes
    function toggleMode() {
        const xcToM3uMode = widget.querySelector('#xc-to-m3u-mode');
        const m3uToXcMode = widget.querySelector('#m3u-to-xc-mode');
        const resultsDiv = widget.querySelector('#results');
        const extractedDiv = widget.querySelector('#extracted-credentials');
        const modeToggle = widget.querySelector('#mode-toggle');
        
        console.log('IPTV Converter: toggleMode called');
        
        if (!xcToM3uMode || !m3uToXcMode || !modeToggle) {
            console.error('IPTV Converter: Required elements not found for mode toggle');
            return;
        }
        
        if (currentMode === 'xc-to-m3u') {
            // Switch to M3U to XC mode
            currentMode = 'm3u-to-xc';
            xcToM3uMode.style.display = 'none';
            m3uToXcMode.style.display = 'block';
            modeToggle.textContent = '↔ M3U→XC';
            modeToggle.style.background = '#9b59b6';
            if (resultsDiv) resultsDiv.style.display = 'none';
            console.log('IPTV Converter: Switched to M3U→XC mode');
        } else {
            // Switch to XC to M3U mode
            currentMode = 'xc-to-m3u';
            xcToM3uMode.style.display = 'block';
            m3uToXcMode.style.display = 'none';
            modeToggle.textContent = '↔ XC→M3U';
            modeToggle.style.background = '#f39c12';
            if (extractedDiv) extractedDiv.style.display = 'none';
            console.log('IPTV Converter: Switched to XC→M3U mode');
        }
    }
    
    function showWidget() {
        if (!widget) {
            createWidget();
            loadSavedCredentials();
        }
        widget.style.display = 'block';
        isWidgetVisible = true;
        console.log('IPTV Converter: Widget shown');
    }
    
    function hideWidget() {
        if (widget) {
            widget.style.display = 'none';
            isWidgetVisible = false;
            console.log('IPTV Converter: Widget hidden');
        }
    }
    
    function toggleWidget() {
        console.log('IPTV Converter: Toggle called, current state:', isWidgetVisible);
        if (isWidgetVisible) {
            hideWidget();
        } else {
            showWidget();
        }
    }
    
    // Save credentials
    function saveCredentials(serverUrl, username) {
        try {
            if (typeof GM_setValue !== 'undefined') {
                GM_setValue('iptv_server', serverUrl);
                GM_setValue('iptv_username', username);
            } else {
                localStorage.setItem('iptv_server', serverUrl);
                localStorage.setItem('iptv_username', username);
            }
        } catch (e) {
            console.log('Could not save credentials:', e);
        }
    }
    
    // Load saved credentials
    function loadSavedCredentials() {
        try {
            let savedServer, savedUsername;
            
            if (typeof GM_getValue !== 'undefined') {
                savedServer = GM_getValue('iptv_server', '');
                savedUsername = GM_getValue('iptv_username', '');
            } else {
                savedServer = localStorage.getItem('iptv_server') || '';
                savedUsername = localStorage.getItem('iptv_username') || '';
            }
            
            if (widget) {
                const serverInput = widget.querySelector('#server-url');
                const usernameInput = widget.querySelector('#username');
                
                if (savedServer && serverInput) serverInput.value = savedServer;
                if (savedUsername && usernameInput) usernameInput.value = savedUsername;
            }
        } catch (e) {
            console.log('Could not load credentials:', e);
        }
    }
    
    // Keyboard shortcut: Ctrl+Shift+M (avoiding Chrome's Ctrl+Shift+I for DevTools)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyM') {
            e.preventDefault();
            e.stopPropagation();
            console.log('IPTV Converter: Keyboard shortcut triggered');
            toggleWidget();
        }
    }, true);
    
    // Alternative shortcut for Chrome users: Ctrl+Alt+I
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.altKey && e.code === 'KeyI') {
            e.preventDefault();
            e.stopPropagation();
            console.log('IPTV Converter: Alternative keyboard shortcut triggered');
            toggleWidget();
        }
    }, true);
    
    // Mode switching shortcut: Ctrl+Shift+T
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyT' && isWidgetVisible) {
            e.preventDefault();
            e.stopPropagation();
            console.log('IPTV Converter: Mode toggle shortcut triggered');
            toggleMode();
        }
    }, true);
    
    // Add menu command if supported
    try {
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('🔄 Toggle IPTV Converter', function() {
                console.log('IPTV Converter: Menu command clicked');
                toggleWidget();
            });
            console.log('IPTV Converter: Menu command registered');
        }
    } catch (e) {
        console.log('Could not register menu command:', e);
    }
    
    // Initialize
    console.log('IPTV Converter: Script loaded');
    
    // Show notification on first load
    setTimeout(() => {
        let firstRun = false;
        try {
            if (typeof GM_getValue !== 'undefined') {
                firstRun = !GM_getValue('first_run_done', false);
                if (firstRun) GM_setValue('first_run_done', true);
            } else {
                firstRun = !localStorage.getItem('iptv_first_run_done');
                if (firstRun) localStorage.setItem('iptv_first_run_done', 'true');
            }
        } catch (e) {
            console.log('Could not check first run:', e);
        }
        
        if (firstRun) {
            alert('IPTV Converter installed!\n\n• Use Ctrl+Shift+M to toggle\n• Or Ctrl+Alt+I (Chrome alternative)\n• Or Tampermonkey menu → "Toggle IPTV Converter"\n• Click the ↔ button to switch between XC→M3U and M3U→XC modes');
        }
    }, 2000);
    
})();