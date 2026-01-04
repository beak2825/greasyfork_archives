// ==UserScript==
// @name         Universal Zoom Control
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add zoom in/out buttons to every website
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/538691/Universal%20Zoom%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/538691/Universal%20Zoom%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    let currentZoom = 1.0;
    let zoomContainer = null;
    let isHidden = false;
    let transparency = 0.9; // Default transparency (0.1 = very transparent, 1.0 = opaque)
    
    // Create zoom controls
    function createZoomControls() {
        // Create container
        zoomContainer = document.createElement('div');
        zoomContainer.id = 'zoom-controls';
        updateContainerStyle();
        
        // Create zoom out button
        const zoomOutBtn = document.createElement('button');
        zoomOutBtn.innerHTML = '−';
        zoomOutBtn.title = 'Zoom Out (Ctrl + -)';
        zoomOutBtn.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            margin-right: 4px;
            transition: background 0.2s;
        `;
        zoomOutBtn.onmouseover = () => zoomOutBtn.style.background = '#45a049';
        zoomOutBtn.onmouseout = () => zoomOutBtn.style.background = '#4CAF50';
        zoomOutBtn.onclick = () => zoomOut();
        
        // Create zoom level display
        const zoomLevel = document.createElement('span');
        zoomLevel.id = 'zoom-level';
        zoomLevel.style.cssText = `
            color: white;
            font-size: 12px;
            font-weight: bold;
            margin: 0 8px;
            min-width: 35px;
            text-align: center;
            display: inline-block;
        `;
        zoomLevel.textContent = '100%';
        
        // Create zoom in button
        const zoomInBtn = document.createElement('button');
        zoomInBtn.innerHTML = '+';
        zoomInBtn.title = 'Zoom In (Ctrl + +)';
        zoomInBtn.style.cssText = `
            background: #2196F3;
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            margin-left: 4px;
            transition: background 0.2s;
        `;
        zoomInBtn.onmouseover = () => zoomInBtn.style.background = '#1976D2';
        zoomInBtn.onmouseout = () => zoomInBtn.style.background = '#2196F3';
        zoomInBtn.onclick = () => zoomIn();
        
        // Create transparency slider
        const transparencyContainer = document.createElement('div');
        transparencyContainer.style.cssText = `
            margin-top: 8px;
            padding-top: 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        
        const transparencyLabel = document.createElement('span');
        transparencyLabel.textContent = '👁';
        transparencyLabel.style.cssText = `
            color: white;
            font-size: 12px;
        `;
        
        const transparencySlider = document.createElement('input');
        transparencySlider.type = 'range';
        transparencySlider.min = '0.3';
        transparencySlider.max = '1.0';
        transparencySlider.step = '0.1';
        transparencySlider.value = transparency;
        transparencySlider.style.cssText = `
            width: 60px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            outline: none;
            border-radius: 2px;
        `;
        transparencySlider.oninput = (e) => {
            transparency = parseFloat(e.target.value);
            updateContainerStyle();
            saveSettings();
        };
        
        transparencyContainer.appendChild(transparencyLabel);
        transparencyContainer.appendChild(transparencySlider);
        
        // Create hide/show toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.innerHTML = '👁';
        toggleBtn.title = 'Hide/Show Controls (Alt + H)';
        toggleBtn.style.cssText = `
            background: #9C27B0;
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            margin-left: 8px;
            transition: background 0.2s;
        `;
        toggleBtn.onmouseover = () => toggleBtn.style.background = '#7B1FA2';
        toggleBtn.onmouseout = () => toggleBtn.style.background = '#9C27B0';
        toggleBtn.onclick = () => toggleVisibility();
        
        // Create reset button
        const resetBtn = document.createElement('button');
        resetBtn.innerHTML = '⌂';
        resetBtn.title = 'Reset Zoom (Ctrl + 0)';
        resetBtn.style.cssText = `
            background: #FF9800;
            color: white;
            border: none;
            width: 32px;
            height: 32px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            margin-left: 8px;
            transition: background 0.2s;
        `;
        resetBtn.onmouseover = () => resetBtn.style.background = '#F57C00';
        resetBtn.onmouseout = () => resetBtn.style.background = '#FF9800';
        resetBtn.onclick = () => resetZoom();
        
        // Create main controls container
        const mainControls = document.createElement('div');
        mainControls.id = 'main-controls';
        mainControls.style.cssText = `
            display: flex;
            align-items: center;
        `;
        
        // Assemble main controls
        mainControls.appendChild(zoomOutBtn);
        mainControls.appendChild(zoomLevel);
        mainControls.appendChild(zoomInBtn);
        mainControls.appendChild(resetBtn);
        mainControls.appendChild(toggleBtn);
        
        // Assemble all controls
        zoomContainer.appendChild(mainControls);
        zoomContainer.appendChild(transparencyContainer);
        
        // Add to page
        document.body.appendChild(zoomContainer);
        
        // Load saved settings
        loadSettings();
        
        // Make draggable
        makeDraggable(zoomContainer);
    }
    
    // Update container transparency and style
    function updateContainerStyle() {
        if (!zoomContainer) return;
        
        const bgAlpha = transparency * 0.8; // Background is slightly more transparent
        zoomContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 999999;
            background: rgba(0, 0, 0, ${bgAlpha});
            border-radius: 8px;
            padding: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, ${transparency * 0.3});
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            user-select: none;
            backdrop-filter: blur(10px);
            opacity: ${transparency};
            transition: opacity 0.3s ease, transform 0.3s ease;
            cursor: grab;
        `;
        
        // Apply hidden state if needed
        if (isHidden) {
            zoomContainer.style.transform = 'translateX(calc(100% - 40px))';
            zoomContainer.style.opacity = '0.3';
        } else {
            zoomContainer.style.transform = 'translateX(0)';
        }
    }
    
    // Toggle visibility
    function toggleVisibility() {
        isHidden = !isHidden;
        updateContainerStyle();
        saveSettings();
        
        // Change toggle button appearance
        const toggleBtn = zoomContainer.querySelector('button[title*="Hide/Show"]');
        if (toggleBtn) {
            toggleBtn.innerHTML = isHidden ? '👀' : '👁';
            toggleBtn.title = isHidden ? 'Show Controls (Alt + H)' : 'Hide/Show Controls (Alt + H)';
        }
    }
    
    // Zoom functions
    function zoomIn() {
        currentZoom = Math.min(currentZoom + 0.1, 3.0);
        applyZoom();
    }
    
    function zoomOut() {
        currentZoom = Math.max(currentZoom - 0.1, 0.5);
        applyZoom();
    }
    
    function resetZoom() {
        currentZoom = 1.0;
        applyZoom();
    }
    
    function applyZoom() {
        document.body.style.zoom = currentZoom;
        document.body.style.transform = `scale(${currentZoom})`;
        document.body.style.transformOrigin = 'top left';
        
        // Update zoom level display
        const zoomLevelElement = document.getElementById('zoom-level');
        if (zoomLevelElement) {
            zoomLevelElement.textContent = Math.round(currentZoom * 100) + '%';
        }
        
        // Save zoom level and settings to localStorage
        saveSettings();
    }
    
    // Save settings to localStorage
    function saveSettings() {
        try {
            const settings = {
                zoom: currentZoom,
                transparency: transparency,
                hidden: isHidden,
                position: {
                    left: zoomContainer ? zoomContainer.style.left : '',
                    top: zoomContainer ? zoomContainer.style.top : '',
                    right: zoomContainer ? zoomContainer.style.right : ''
                }
            };
            localStorage.setItem('userscript-zoom-settings', JSON.stringify(settings));
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    // Load saved settings
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('userscript-zoom-settings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                currentZoom = settings.zoom || 1.0;
                transparency = settings.transparency || 0.9;
                isHidden = settings.hidden || false;
                
                // Apply zoom
                applyZoom();
                
                // Update transparency slider
                const slider = zoomContainer.querySelector('input[type="range"]');
                if (slider) slider.value = transparency;
                
                // Apply position
                if (settings.position && settings.position.left) {
                    zoomContainer.style.left = settings.position.left;
                    zoomContainer.style.top = settings.position.top;
                    zoomContainer.style.right = 'auto';
                }
                
                // Update container style with saved settings
                updateContainerStyle();
                
                // Update toggle button if hidden
                if (isHidden) {
                    const toggleBtn = zoomContainer.querySelector('button[title*="Hide/Show"]');
                    if (toggleBtn) {
                        toggleBtn.innerHTML = '👀';
                        toggleBtn.title = 'Show Controls (Alt + H)';
                    }
                }
            }
        } catch (e) {
            // Ignore localStorage errors
        }
    }
    
    // Make element draggable
    function makeDraggable(element) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };
        
        element.onmousedown = function(e) {
            // Don't drag if clicking on interactive elements
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'BUTTON') {
                return;
            }
            
            isDragging = true;
            dragOffset.x = e.clientX - element.offsetLeft;
            dragOffset.y = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        };
        
        document.onmousemove = function(e) {
            if (!isDragging) return;
            
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // Keep within viewport bounds
            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;
            
            element.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
            element.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            element.style.right = 'auto';
            
            // Save position
            saveSettings();
        };
        
        document.onmouseup = function() {
            isDragging = false;
            element.style.cursor = 'grab';
        };
        
        element.style.cursor = 'grab';
    }
    
    // Keyboard shortcuts
    function setupKeyboardShortcuts() {
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '+':
                    case '=':
                        e.preventDefault();
                        zoomIn();
                        break;
                    case '-':
                        e.preventDefault();
                        zoomOut();
                        break;
                    case '0':
                        e.preventDefault();
                        resetZoom();
                        break;
                }
            }
            
            // Alt + H for hide/show toggle
            if (e.altKey && e.key.toLowerCase() === 'h') {
                e.preventDefault();
                toggleVisibility();
            }
        });
    }
    
    // Initialize when DOM is ready
    function init() {
        if (document.body) {
            createZoomControls();
            setupKeyboardShortcuts();
        } else {
            // Wait for body to be available
            const observer = new MutationObserver(function(mutations) {
                if (document.body) {
                    observer.disconnect();
                    createZoomControls();
                    setupKeyboardShortcuts();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();