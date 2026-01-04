// ==UserScript==
// @name         RGB Script Manager
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Control panel for RGB scripts with page load alerts
// @author       Jyomama28
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/534781/RGB%20Script%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/534781/RGB%20Script%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rgbTyperEnabled = GM_getValue('rgbTyperEnabled', true);
    const rgbCursorEnabled = GM_getValue('rgbCursorEnabled', true);
    const pageAlertsEnabled = GM_getValue('pageAlertsEnabled', true);

    function initRGBTyper() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes rgbText {
                0% { color: rgb(255, 0, 0); }
                33% { color: rgb(0, 255, 0); }
                66% { color: rgb(0, 0, 255); }
                100% { color: rgb(255, 0, 0); }
            }
            .rgb-animated {
                animation: rgbText 3s linear infinite;
            }
        `;
        document.head.appendChild(style);

        function handleInput(event) {
            const element = event.target;
            if (
                element.tagName === 'INPUT' ||
                element.tagName === 'TEXTAREA' ||
                element.getAttribute('contenteditable') === 'true'
            ) {
                element.classList.add('rgb-animated');
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.style.animation = 'rgbText 3s linear infinite';
                }
            }
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const inputs = node.querySelectorAll('input, textarea, [contenteditable="true"]');
                        inputs.forEach(input => {
                            input.addEventListener('input', handleInput);
                        });
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.querySelectorAll('input, textarea, [contenteditable="true"]').forEach(input => {
            input.addEventListener('input', handleInput);
        });
    }

    function initRGBCursor() {
        const cursor = document.createElement('div');
        cursor.id = 'rainbow-cursor';
        
        const trailCount = 20;
        const trail = [];
        
        for (let i = 0; i < trailCount; i++) {
            const dot = document.createElement('div');
            dot.className = 'rainbow-trail-dot';
            document.body.appendChild(dot);
            trail.push({
                element: dot,
                x: 0,
                y: 0
            });
        }
        
        const style = document.createElement('style');
        style.innerHTML = `
            html, body {
                cursor: none !important;
            }
            
            #rainbow-cursor {
                position: fixed;
                pointer-events: none;
                width: 10px;
                height: 10px;
                background: white;
                border-radius: 50%;
                box-shadow: 0 0 5px rgba(0,0,0,0.5);
                z-index: 9999;
                transform: translate(-50%, -50%);
            }
            
            .rainbow-trail-dot {
                position: fixed;
                pointer-events: none;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                z-index: 9998;
                transform: translate(-50%, -50%);
                opacity: 0.8;
                transition: width 0.1s, height 0.1s;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(cursor);
        
        let mouseX = 0;
        let mouseY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.left = mouseX + 'px';
            cursor.style.top = mouseY + 'px';
        });
        
        function updateTrail() {
            for (let i = trail.length - 1; i > 0; i--) {
                trail[i].x = trail[i-1].x;
                trail[i].y = trail[i-1].y;
            }
            
            trail[0].x = mouseX;
            trail[0].y = mouseY;
            
            trail.forEach((dot, index) => {
                const hue = (Date.now() / 20 + index * 10) % 360;
                dot.element.style.left = dot.x + 'px';
                dot.element.style.top = dot.y + 'px';
                dot.element.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;
                
                const size = 8 - (index * 0.3);
                if (size > 0) {
                    dot.element.style.width = size + 'px';
                    dot.element.style.height = size + 'px';
                    dot.element.style.opacity = 1 - (index / trail.length);
                }
            });
            
            requestAnimationFrame(updateTrail);
        }
        
        updateTrail();
        
        window.addEventListener('blur', () => {
            cursor.style.display = 'none';
            trail.forEach(dot => {
                dot.element.style.display = 'none';
            });
        });
        
        window.addEventListener('focus', () => {
            cursor.style.display = 'block';
            trail.forEach(dot => {
                dot.element.style.display = 'block';
            });
        });
    }

    function showPageAlert() {
        if (pageAlertsEnabled) {
            alert('Thank you for using my RGB scripts! Enjoy your colorful browsing experience!');
        }
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'rgb-script-menu';
        
        const style = document.createElement('style');
        style.innerHTML = `
            #rgb-script-menu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a1a, #333);
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
                z-index: 10000;
                color: white;
                font-family: Arial, sans-serif;
                min-width: 300px;
                border: 2px solid transparent;
                animation: rgbBorder 3s linear infinite;
                display: none;
            }
            
            @keyframes rgbBorder {
                0% { border-color: rgb(255, 0, 0); }
                33% { border-color: rgb(0, 255, 0); }
                66% { border-color: rgb(0, 0, 255); }
                100% { border-color: rgb(255, 0, 0); }
            }
            
            #rgb-script-menu h2 {
                margin-top: 0;
                text-align: center;
                color: white;
                animation: rgbText 3s linear infinite;
            }
            
            @keyframes rgbText {
                0% { color: rgb(255, 0, 0); }
                33% { color: rgb(0, 255, 0); }
                66% { color: rgb(0, 0, 255); }
                100% { color: rgb(255, 0, 0); }
            }
            
            .menu-button {
                background: linear-gradient(135deg, #444, #222);
                color: white;
                border: none;
                padding: 10px 15px;
                margin: 5px;
                border-radius: 5px;
                cursor: pointer;
                width: 100%;
                transition: all 0.3s;
            }
            
            .menu-button:hover {
                background: linear-gradient(135deg, #555, #333);
                transform: translateY(-2px);
            }
            
            .toggle-on {
                background: linear-gradient(135deg, #4CAF50, #2E7D32);
            }
            
            .toggle-off {
                background: linear-gradient(135deg, #F44336, #C62828);
            }
            
            .tab-content {
                display: none;
            }
            
            .tab-content.active {
                display: block;
            }
            
            .tab-buttons {
                display: flex;
                margin-bottom: 10px;
            }
            
            .tab-button {
                flex: 1;
                padding: 8px;
                background: #444;
                border: none;
                color: white;
                cursor: pointer;
            }
            
            .tab-button.active {
                background: #666;
            }
            
            .close-button {
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
        
        menu.innerHTML = `
            <button class="close-button">&times;</button>
            <h2>RGB Script Manager</h2>
            
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="main">Main</button>
                <button class="tab-button" data-tab="about">About</button>
                <button class="tab-button" data-tab="help">Help</button>
            </div>
            
            <div id="main-tab" class="tab-content active">
                <button id="toggle-typer" class="menu-button ${rgbTyperEnabled ? 'toggle-on' : 'toggle-off'}">
                    RGB Typer: ${rgbTyperEnabled ? 'ON' : 'OFF'}
                </button>
                
                <button id="toggle-cursor" class="menu-button ${rgbCursorEnabled ? 'toggle-on' : 'toggle-off'}">
                    RGB Cursor: ${rgbCursorEnabled ? 'ON' : 'OFF'}
                </button>
                
                <button id="toggle-alerts" class="menu-button ${pageAlertsEnabled ? 'toggle-on' : 'toggle-off'}">
                    Page Alerts: ${pageAlertsEnabled ? 'ON' : 'OFF'}
                </button>
            </div>
            
            <div id="about-tab" class="tab-content">
                <p>RGB Script Manager v1.0</p>
                <p>Created by Jyomama28</p>
                <p>Control your RGB scripts with this handy panel.</p>
            </div>
            
            <div id="help-tab" class="tab-content">
                <p><strong>Hotkey:</strong> Press \` (backtick) to toggle this menu</p>
                <p><strong>RGB Typer:</strong> Animates text in input fields with RGB colors</p>
                <p><strong>RGB Cursor:</strong> Replaces your cursor with a rainbow trail</p>
                <p><strong>Page Alerts:</strong> Shows a welcome message on new pages</p>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        const closeButton = menu.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            menu.style.display = 'none';
        });
        
        const tabButtons = menu.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const tabId = button.getAttribute('data-tab') + '-tab';
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        const toggleTyper = menu.querySelector('#toggle-typer');
        toggleTyper.addEventListener('click', () => {
            const newState = !GM_getValue('rgbTyperEnabled', true);
            GM_setValue('rgbTyperEnabled', newState);
            toggleTyper.textContent = `RGB Typer: ${newState ? 'ON' : 'OFF'}`;
            toggleTyper.className = `menu-button ${newState ? 'toggle-on' : 'toggle-off'}`;
            if (newState) initRGBTyper();
        });
        
        const toggleCursor = menu.querySelector('#toggle-cursor');
        toggleCursor.addEventListener('click', () => {
            const newState = !GM_getValue('rgbCursorEnabled', true);
            GM_setValue('rgbCursorEnabled', newState);
            toggleCursor.textContent = `RGB Cursor: ${newState ? 'ON' : 'OFF'}`;
            toggleCursor.className = `menu-button ${newState ? 'toggle-on' : 'toggle-off'}`;
            if (newState) initRGBCursor();
        });
        
        const toggleAlerts = menu.querySelector('#toggle-alerts');
        toggleAlerts.addEventListener('click', () => {
            const newState = !GM_getValue('pageAlertsEnabled', true);
            GM_setValue('pageAlertsEnabled', newState);
            toggleAlerts.textContent = `Page Alerts: ${newState ? 'ON' : 'OFF'}`;
            toggleAlerts.className = `menu-button ${newState ? 'toggle-on' : 'toggle-off'}`;
        });
        
        return menu;
    }

    let menu = null;
    let menuVisible = false;

    function toggleMenu() {
        if (!menu) {
            menu = createMenu();
        }
        
        menuVisible = !menuVisible;
        menu.style.display = menuVisible ? 'block' : 'none';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            toggleMenu();
        }
    });

    if (rgbTyperEnabled) initRGBTyper();
    if (rgbCursorEnabled) initRGBCursor();

    window.addEventListener('load', showPageAlert);
    window.addEventListener('hashchange', showPageAlert);
    window.addEventListener('popstate', showPageAlert);
})();