// ==UserScript==
// @name       NYTimes Strands Drawing Overlay
// @namespace  http://mathemaniac.org/
// @version    1.0.0
// @description  Adds a togglable drawing canvas overlay to the NYTimes.com Strands game.
// @match      https://www.nytimes.com/games/strands
// @copyright  2025, Sebastian Paaske Tørholm
// @grant      none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/547208/NYTimes%20Strands%20Drawing%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/547208/NYTimes%20Strands%20Drawing%20Overlay.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Configuration ---
    const DEFAULT_BRUSH_SIZE = 30;
    const MIN_BRUSH_SIZE = 1;
    const MAX_BRUSH_SIZE = 60;
    const COLORS = ['#FF0000', '#0000FF', '#00FF00', '#FFFF00', '#000000']; // Red, Blue, Green, Yellow, Black
    const DEFAULT_COLOR = COLORS[0]; // Red
    const OVERLAY_OPACITY = 0.4; // 40%
    const CANVAS_BACKGROUND_COLOR = 'rgba(200, 200, 200, 0.3)'; // Slight gray tinge

    // --- Utility Functions ---
    const log = (...args) => console.log('[StrandsDrawingOverlay]', ...args);

    // --- State Management ---
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = DEFAULT_COLOR;
    let currentBrushSize = DEFAULT_BRUSH_SIZE;
    let isOverlayVisible = false;
    let dpr = window.devicePixelRatio || 1; // Store Device Pixel Ratio

    // --- DOM Elements ---
    let gameBoardContainer = null;
    let canvasOverlay = null;
    let ctx = null;
    let controlsContainer = null;
    let toggleButton = null;
    let colorButtons = [];
    let cursorPreview = null;

    // --- Storage ---
    const getGameDate = () => {
        const dateElement = document.getElementById('portal-game-date');
        return dateElement ? dateElement.textContent.trim() : new Date().toDateString();
    };

    const getStorageKey = (suffix) => `strands_drawing_${getGameDate()}_${suffix}`;

    const saveCanvasState = () => {
        if (!canvasOverlay) return;
        try {
            const dataURL = canvasOverlay.toDataURL();
            localStorage.setItem(getStorageKey('canvas'), dataURL);
            log('Canvas state saved.');
        } catch (e) {
            console.error('Failed to save canvas state:', e);
        }
    };

    const loadCanvasState = () => {
        if (!canvasOverlay || !ctx) return;
        const dataURL = localStorage.getItem(getStorageKey('canvas'));
        if (dataURL) {
            const img = new Image();
            img.onload = () => {
                ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
                ctx.drawImage(img, 0, 0);
                log('Canvas state loaded.');
            };
            img.src = dataURL;
        }
    };

    const saveSettings = () => {
        localStorage.setItem(getStorageKey('color'), currentColor);
        localStorage.setItem(getStorageKey('brushSize'), currentBrushSize.toString());
        log('Settings saved.');
    };

    const loadSettings = () => {
        const storedColor = localStorage.getItem(getStorageKey('color'));
        const storedBrushSize = localStorage.getItem(getStorageKey('brushSize'));

        if (storedColor && COLORS.includes(storedColor)) {
            currentColor = storedColor;
        }
        if (storedBrushSize) {
            const size = parseInt(storedBrushSize, 10);
            if (!isNaN(size) && size >= MIN_BRUSH_SIZE && size <= MAX_BRUSH_SIZE) {
                currentBrushSize = size;
            }
        }
        log('Settings loaded.');
    };

    // --- Canvas Logic ---
    const startDrawing = (e) => {
        isDrawing = true;
        [lastX, lastY] = getCanvasCoordinates(e); // Use canvas-specific coordinates
        lastX *= dpr;
        lastY *= dpr;
    };

    // Set canvas internal resolution to CSS size * DPR.
    // Keep context transform as default (no scaling).
    // Draw using CSS pixel coordinates directly.
    // This ensures lineWidth is interpreted correctly in CSS pixels.
    const draw = (e) => {
        if (!isDrawing || !isOverlayVisible) return;
        let [currentX, currentY] = getCanvasCoordinates(e); // Use canvas-specific coordinates

        ctx.globalCompositeOperation = 'source-over';
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentBrushSize * dpr;
        ctx.globalAlpha = 1;

        currentX *= dpr;
        currentY *= dpr;

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(currentX, currentY);
        ctx.stroke();

        [lastX, lastY] = [currentX, currentY];
    };

    const stopDrawing = () => {
        if (isDrawing) {
            isDrawing = false;
            saveCanvasState();
        }
    };

    // --- Coordinate Functions ---
    // For drawing on the canvas (relative to canvas)
    const getCanvasCoordinates = (e) => {
        const rect = canvasOverlay.getBoundingClientRect();
        let clientX, clientY;
        if (e.type.includes('touch')) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        // Return coordinates relative to the canvas top-left in CSS pixels
        return [(clientX - rect.left), (clientY - rect.top)];
    };

    // --- UI Creation ---
    const createCanvasOverlay = () => {
        if (canvasOverlay) return;

        canvasOverlay = document.createElement('canvas');
        canvasOverlay.id = 'strands-drawing-overlay';
        canvasOverlay.style.position = 'absolute';
        canvasOverlay.style.top = '0';
        canvasOverlay.style.left = '0';
        canvasOverlay.style.width = '100%';
        canvasOverlay.style.height = '100%';
        canvasOverlay.style.pointerEvents = 'none';
        canvasOverlay.style.opacity = OVERLAY_OPACITY.toString();
        canvasOverlay.style.zIndex = '1000';
        canvasOverlay.style.backgroundColor = 'transparent';
        canvasOverlay.style.boxSizing = 'border-box';
        canvasOverlay.style.cursor = 'none';

        ctx = canvasOverlay.getContext('2d');
        if (!ctx) {
            console.error('Could not get 2D context for the drawing canvas.');
            canvasOverlay = null;
            return;
        }

        // Event listeners for drawing
        const handleEvent = (handler) => (e) => {
            if (isOverlayVisible) {
                handler(e);
                // Aggressively prevent default and stop propagation for drawing events
                e.preventDefault();
                e.stopPropagation();
            }
        };

        canvasOverlay.addEventListener('mousedown', handleEvent(startDrawing));
        canvasOverlay.addEventListener('mousemove', handleEvent(draw));
        canvasOverlay.addEventListener('mouseup', handleEvent(stopDrawing));
        canvasOverlay.addEventListener('mouseout', handleEvent(stopDrawing));
        canvasOverlay.addEventListener('touchstart', handleEvent(startDrawing), { passive: false });
        canvasOverlay.addEventListener('touchmove', handleEvent(draw), { passive: false });
        canvasOverlay.addEventListener('touchend', handleEvent(stopDrawing), { passive: false });
        canvasOverlay.addEventListener('touchcancel', handleEvent(stopDrawing), { passive: false });

        gameBoardContainer.style.position = 'relative';
        gameBoardContainer.appendChild(canvasOverlay);
        log('Canvas overlay created.');
    };

    // --- Cursor Preview Logic ---
    const createCursorPreview = () => {
        if (cursorPreview) return;

        cursorPreview = document.createElement('div');
        cursorPreview.id = 'strands-drawing-cursor-preview';
        cursorPreview.style.position = 'absolute';
        cursorPreview.style.pointerEvents = 'none';
        cursorPreview.style.zIndex = '1001'; // Above canvas, below controls
        cursorPreview.style.borderRadius = '50%';
        cursorPreview.style.transform = 'translate(-50%, -50%)';
        cursorPreview.style.display = 'none';
        cursorPreview.style.boxSizing = 'border-box';

        updateCursorPreviewStyle();
        gameBoardContainer.appendChild(cursorPreview);

        const handleMove = (e) => {
            if (isOverlayVisible) {
                const [x, y] = getCanvasCoordinates(e);
                const rect = gameBoardContainer.getBoundingClientRect();
                const isInBounds = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

                if (isInBounds) {
                    cursorPreview.style.display = 'block';
                    cursorPreview.style.left = `${x}px`;
                    cursorPreview.style.top = `${y}px`;
                } else {
                    cursorPreview.style.display = 'none';
                }
            }
        };
        
        canvasOverlay.addEventListener('mousemove', handleMove);
        canvasOverlay.addEventListener('touchmove', (e) => { handleMove(e); e.preventDefault(); }, { passive: false });
        canvasOverlay.addEventListener('mouseleave', () => {
             if (isOverlayVisible) cursorPreview.style.display = 'none';
        });
        canvasOverlay.addEventListener('touchcancel', () => {
             if (isOverlayVisible) cursorPreview.style.display = 'none';
        });
        canvasOverlay.addEventListener('touchend', () => {
             if (isOverlayVisible) cursorPreview.style.display = 'none';
        });
    };

    const updateCursorPreviewStyle = () => {
        if (!cursorPreview) return;
        cursorPreview.style.width = `${currentBrushSize}px`;
        cursorPreview.style.height = `${currentBrushSize}px`;
        cursorPreview.style.border = `2px solid ${currentColor}`;
        cursorPreview.style.backgroundColor = `${currentColor}`;
        cursorPreview.style.opacity = '0.7';
    };

    const createControls = () => {
        if (controlsContainer) return;

        controlsContainer = document.createElement('div');
        controlsContainer.id = 'strands-drawing-controls';
        controlsContainer.style.position = 'absolute';
        controlsContainer.style.top = '10px';
        controlsContainer.style.right = '-130px';
        controlsContainer.style.zIndex = '1002';
        controlsContainer.style.display = 'none';
        controlsContainer.style.fontFamily = 'Arial, sans-serif';
        controlsContainer.style.fontSize = '14px';
        controlsContainer.style.minWidth = '100px';
        controlsContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)'; // Slightly more opaque
        controlsContainer.style.border = '1px solid #aaa';
        controlsContainer.style.borderRadius = '5px';
        controlsContainer.style.padding = '8px';
        controlsContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

        // Redesigned Color Picker
        const colorPickerContainer = document.createElement('div');
        colorPickerContainer.id = 'drawing-color-picker';
        colorPickerContainer.style.display = 'flex';
        colorPickerContainer.style.flexDirection = 'column';
        colorPickerContainer.style.gap = '5px';
        colorPickerContainer.style.alignItems = 'center';

        colorButtons = [];

        COLORS.forEach(color => {
            const colorButton = document.createElement('button');
            // --- Ensure button type ---
            colorButton.type = 'button';
            colorButton.className = 'drawing-color-button';
            colorButton.setAttribute('data-color', color);
            colorButton.style.width = '25px';
            colorButton.style.height = '25px';
            colorButton.style.border = '2px solid transparent';
            colorButton.style.borderRadius = '4px';
            colorButton.style.backgroundColor = color;
            colorButton.style.cursor = 'pointer';
            colorButton.style.padding = '0';
            colorButton.style.boxSizing = 'border-box';

            if (color === currentColor) {
                colorButton.style.border = '2px solid #000';
            }

            // --- Robust click handler ---
            colorButton.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                currentColor = color;
                colorButtons.forEach(btn => {
                    if (btn.getAttribute('data-color') === color) {
                        btn.style.border = '2px solid #000';
                    } else {
                        btn.style.border = '2px solid transparent';
                    }
                });
                saveSettings();
                updateCursorPreviewStyle();
            });

            colorButtons.push(colorButton);
            colorPickerContainer.appendChild(colorButton);
        });

        // Brush Size Slider
        const sizeSliderContainer = document.createElement('div');
        sizeSliderContainer.style.marginTop = '10px';
        sizeSliderContainer.style.display = 'flex';
        sizeSliderContainer.style.flexDirection = 'column';
        sizeSliderContainer.style.alignItems = 'center';
        sizeSliderContainer.style.width = '90px';

        const sizeLabel = document.createElement('span');
        sizeLabel.id = 'drawing-brush-size-label';
        sizeLabel.textContent = currentBrushSize;
        sizeLabel.style.fontSize = '12px';
        sizeLabel.style.marginBottom = '3px';

        const sizeSlider = document.createElement('input');
        sizeSlider.type = 'range';
        sizeSlider.id = 'drawing-brush-size';
        sizeSlider.min = MIN_BRUSH_SIZE;
        sizeSlider.max = MAX_BRUSH_SIZE;
        sizeSlider.value = currentBrushSize;
        sizeSlider.style.writingMode = 'bt-lr';
        sizeSlider.style.webkitAppearance = 'slider-vertical';
        sizeSlider.style.width = '90px';
        sizeSlider.style.height = '70px';
        sizeSlider.style.cursor = 'pointer';
        sizeSlider.addEventListener('input', () => {
            currentBrushSize = parseInt(sizeSlider.value, 10);
            sizeLabel.textContent = currentBrushSize;
            saveSettings();
            updateCursorPreviewStyle();
        });

        sizeSliderContainer.appendChild(sizeLabel);
        sizeSliderContainer.appendChild(sizeSlider);

        // Clear Button
        const clearButton = document.createElement('button');
        // --- Explicitly set type and prevent all actions ---
        clearButton.type = 'button';
        clearButton.textContent = '🗑️';
        clearButton.title = 'Clear Canvas';
        clearButton.style.display = 'block';
        clearButton.style.marginTop = '10px';
        clearButton.style.padding = '5px';
        clearButton.style.fontSize = '16px';
        clearButton.style.cursor = 'pointer';
        clearButton.style.border = '1px solid #ccc';
        clearButton.style.borderRadius = '4px';
        clearButton.style.backgroundColor = '#f9f9f9';
        clearButton.addEventListener('click', (event) => {
            // --- Aggressive prevention ---
            event.preventDefault();
            event.stopPropagation();
            if (event.target !== clearButton) return; // Extra check
            if (ctx && canvasOverlay) {
                log("Clearing canvas...");
                ctx.clearRect(0, 0, canvasOverlay.width, canvasOverlay.height);
                saveCanvasState();
            }
        }, true); // Use capture phase

        // Hide Button
        const hideButton = document.createElement('button');
        hideButton.type = 'button';
        hideButton.textContent = '✕';
        hideButton.title = 'Hide overlay';
        hideButton.style.display = 'block';
        hideButton.style.marginTop = '5px';
        hideButton.style.padding = '5px';
        hideButton.style.fontSize = '16px';
        hideButton.style.cursor = 'pointer';
        hideButton.style.border = '1px solid #ccc';
        hideButton.style.borderRadius = '4px';
        hideButton.style.backgroundColor = '#f9f9f9';
        hideButton.addEventListener('click', (event) => {
             // --- Aggressive prevention ---
             event.preventDefault();
             event.stopPropagation();
             if (event.target !== hideButton) return; // Extra check
             log("Hiding overlay...");
             toggleOverlay();
        }, true); // Use capture phase

        controlsContainer.appendChild(colorPickerContainer);
        controlsContainer.appendChild(sizeSliderContainer);
        controlsContainer.appendChild(clearButton);
        controlsContainer.appendChild(hideButton);

        gameBoardContainer.appendChild(controlsContainer);
        log('Controls created.');
    };

    // --- Canvas Size Update ---
    const updateCanvasSize = () => {
        if (!canvasOverlay || !gameBoardContainer) return;

        const containerRect = gameBoardContainer.getBoundingClientRect();
        dpr = window.devicePixelRatio || 1;

        // Set internal resolution (width/height attrs) based on CSS size * DPR
        // This makes the canvas render crisply without needing ctx.scale()
        canvasOverlay.width = Math.floor(containerRect.width * dpr);
        canvasOverlay.height = Math.floor(containerRect.height * dpr);

        // Ensure CSS size matches the container exactly
        canvasOverlay.style.width = `${containerRect.width}px`;
        canvasOverlay.style.height = `${containerRect.height}px`;

        // Reset context transform to identity
        // This ensures drawing commands use the CSS pixel coordinate system directly.
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        log(`Canvas updated: Display(${containerRect.width}x${containerRect.height}), Internal(${canvasOverlay.width}x${canvasOverlay.height}), DPR(${dpr})`);
    };

    // --- Main Logic ---
    const toggleOverlay = () => {
        if (!canvasOverlay || !controlsContainer || !cursorPreview) return;

        isOverlayVisible = !isOverlayVisible;

        if (isOverlayVisible) {
            canvasOverlay.style.pointerEvents = 'auto';
            canvasOverlay.style.backgroundColor = CANVAS_BACKGROUND_COLOR;
            canvasOverlay.style.display = 'block';
            controlsContainer.style.display = 'block';
            toggleButton.setAttribute('aria-label', 'Hide drawing notes overlay');
            cursorPreview.style.display = 'none'; // Start hidden, shown on move
        } else {
            canvasOverlay.style.pointerEvents = 'none';
            canvasOverlay.style.backgroundColor = 'transparent';
            canvasOverlay.style.display = 'none';
            controlsContainer.style.display = 'none';
            toggleButton.setAttribute('aria-label', 'Show drawing notes overlay');
            cursorPreview.style.display = 'none';
        }
        log(`Overlay ${isOverlayVisible ? 'shown' : 'hidden'}.`);
    };

    const createToggleButton = () => {
        if (toggleButton) return;

        const toolbar = document.querySelector('.pz-module.pz-flex-row.pz-game-toolbar-content');
        if (!toolbar) {
            log('Toolbar not found, retrying...');
            setTimeout(createToggleButton, 1000);
            return;
        }

        toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'ToolbarItem-module_toolbar_item__xrBr_ ToolbarItem-module_toolbar_itemDesktop__jFTZJ';
        toggleButton.id = 'drawing-overlay-toggle';
        toggleButton.setAttribute('aria-label', 'Show drawing notes overlay');

        const iconWrapper = document.createElement('div');
        iconWrapper.className = 'Icon-module_iconWrapper__ZfKPm';

        const svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svgIcon.setAttribute('aria-hidden', 'true');
        svgIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgIcon.setAttribute('height', '24');
        svgIcon.setAttribute('viewBox', '0 0 24 24');
        svgIcon.setAttribute('width', '24');
        svgIcon.setAttribute('class', 'game-icon');
        svgIcon.setAttribute('data-testid', 'icon-drawing-overlay');
        svgIcon.innerHTML = `
            <path fill="var(--text)" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 5.63l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83a.9959.9959 0 0 0 0-1.41z"/>
            <path fill="none" d="M0 0h24v24H0z"/>
        `;

        iconWrapper.appendChild(svgIcon);
        toggleButton.appendChild(iconWrapper);

        // --- Robust click handler for toggle button ---
        toggleButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            log("Toggle button clicked.");
            toggleOverlay();
        }, true); // Use capture phase

        const helpButton = document.getElementById('help-button');
        if (helpButton && helpButton.parentNode) {
            helpButton.parentNode.parentNode.insertBefore(toggleButton, helpButton.parentNode);
        } else {
            const toolbarSection = toolbar.querySelector('section');
            if (toolbarSection) {
                toolbarSection.appendChild(toggleButton);
            } else {
                toolbar.appendChild(toggleButton);
            }
        }
        log('Toggle button created.');
    };

    const init = () => {
        log('Initializing...');

        gameBoardContainer = document.querySelector("form[data-testid='strands-board'] > div:first-child > div:first-child");
        if (!gameBoardContainer) {
            log('Game board container not found, retrying...');
            setTimeout(init, 1000);
            return;
        }

        loadSettings();
        createCanvasOverlay();
        createControls();
        createToggleButton();
        createCursorPreview();

        if (canvasOverlay) {
            setTimeout(() => {
                 updateCanvasSize();
                 loadCanvasState();
                 if (colorButtons.length > 0) {
                     colorButtons.forEach(btn => {
                         if (btn.getAttribute('data-color') === currentColor) {
                             btn.style.border = '2px solid #000';
                         } else {
                             btn.style.border = '2px solid transparent';
                         }
                     });
                 }
                 updateCursorPreviewStyle();

                 window.addEventListener('resize', () => {
                     clearTimeout(window.strandsResizeTimeout);
                     window.strandsResizeTimeout = setTimeout(updateCanvasSize, 100);
                 });
                 const resizeObserver = new ResizeObserver(() => {
                     clearTimeout(window.strandsResizeObserverTimeout);
                     window.strandsResizeObserverTimeout = setTimeout(updateCanvasSize, 100);
                 });
                 resizeObserver.observe(gameBoardContainer);
            }, 100);
        }
    };

    // --- Keyboard Shortcut ---
    document.addEventListener('keydown', (e) => {
        if (e.key === 't' && e.ctrlKey === false && e.altKey === false && e.shiftKey === false) {
             if (document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
                 e.preventDefault();
                 log("T key pressed, toggling overlay.");
                 toggleOverlay();
             }
        }
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
