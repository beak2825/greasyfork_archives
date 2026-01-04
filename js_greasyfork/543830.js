// ==UserScript==
// @name         Drawaria Avatar Size+Hider+Multiplier Customizer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Extend or diminish the size of selfavatarimage and avatar builder canvas, affecting uploaded canvas resolution, and add dynamic avatar tiling.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/avatar/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543830/Drawaria%20Avatar%20Size%2BHider%2BMultiplier%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/543830/Drawaria%20Avatar%20Size%2BHider%2BMultiplier%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Store original sizes from the very first detection on page load (for "Original Size" button)
    let initialSelfAvatarImageWidth, initialSelfAvatarImageHeight;
    let initialAvatarBuilderCanvasWidth, initialAvatarBuilderCanvasHeight;

    // Global/scoped variables for the Avatar Builder Canvas tiling state
    let tiledBaseAvatarImage = null; // Stores the cropped Image object of the single avatar to be tiled
    let isTiledMode = false;         // Flag to indicate if tiling is currently active

    // Helper to get element's current effective dimensions
    function getElementCurrentDimensions(element, isCanvasAttributeBased) {
        if (isCanvasAttributeBased) {
            // For canvases, read the actual width/height attributes for intrinsic size
            return {
                width: element.width,
                height: element.height
            };
        } else {
            // For images/other elements, read computed CSS style dimensions
            const computedStyle = getComputedStyle(element);
            return {
                width: parseFloat(computedStyle.width),
                height: parseFloat(computedStyle.height)
            };
        }
    }

    // Function to apply dimensions to an element (CSS for images, Attributes + CSS for canvas)
    function applyElementDimensions(element, width, height, isCanvasAttributeBased) {
        if (isCanvasAttributeBased) {
            // For canvases, update the actual width/height attributes (clears content)
            element.width = width;
            element.height = height;
            // Also update CSS style for visual consistency and scaling
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        } else {
            // For images and other elements, only update CSS style
            element.style.width = `${width}px`;
            element.style.height = `${height}px`;
        }
    }

    // Function to create and append the draggable menu
    function createDraggableMenu() {
        const menu = document.createElement('div');
        menu.id = 'tampermonkey-menu';
        menu.style.cssText = `
            position: fixed;
            top: 50px;
            right: 50px;
            width: 280px;
            background: #282c34; /* Dark background */
            border: 1px solid #61dafb; /* Light blue border */
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
            z-index: 99999;
            font-family: Arial, sans-serif;
            color: #fff;
            padding: 15px;
            resize: both; /* Allow resizing the menu itself */
            overflow: auto; /* Show scrollbars if content overflows */
            min-width: 200px;
            min-height: 100px;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            cursor: grab;
            font-weight: bold;
            padding-bottom: 10px;
            border-bottom: 1px solid #61dafb;
            margin-bottom: 15px;
            color: #61dafb;
            user-select: none;
        `;
        header.textContent = 'Drawaria Size Customizer';
        menu.appendChild(header);

        // Make the menu draggable
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - menu.getBoundingClientRect().left;
            offsetY = e.clientY - menu.getBoundingClientRect().top;
            menu.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            newX = Math.max(0, Math.min(newX, window.innerWidth - menu.offsetWidth));
            newY = Math.max(0, Math.min(newY, window.innerHeight - menu.offsetHeight));

            menu.style.left = newX + 'px';
            menu.style.top = newY + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            menu.style.cursor = 'grab';
        });

        document.body.appendChild(menu);
        return menu;
    }

    // Function to create a slider control
    const createSlider = (label, value, min, max, step, onChange) => {
        const container = document.createElement('div');
        container.style.marginBottom = '10px';

        const labelElem = document.createElement('label');
        labelElem.textContent = label + ': ';
        labelElem.style.display = 'block';
        labelElem.style.marginBottom = '5px';
        labelElem.style.color = '#ccc';
        container.appendChild(labelElem);

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.value = value;
        slider.style.width = 'calc(100% - 60px)';
        slider.style.verticalAlign = 'middle';
        slider.style.background = '#444';
        slider.style.appearance = 'none';
        slider.style.height = '8px';
        slider.style.borderRadius = '5px';
        slider.style.outline = 'none';
        slider.style.webkitAppearance = 'none';
        slider.style.cursor = 'pointer';

        if (!document.getElementById('tampermonkey-slider-style')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'tampermonkey-slider-style';
            styleSheet.textContent = `
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #61dafb;
                    cursor: pointer;
                    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                }
                input[type=range]::-moz-range-thumb {
                    width: 18px;
                    height: 18px;
                    border-radius: 50%;
                    background: #61dafb;
                    cursor: pointer;
                    box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
                }
            `;
            document.head.appendChild(styleSheet);
        }

        container.appendChild(slider);

        const valueSpan = document.createElement('span');
        valueSpan.textContent = ` ${value}px`;
        valueSpan.style.marginLeft = '5px';
        valueSpan.style.verticalAlign = 'middle';
        valueSpan.style.color = '#fff';
        container.appendChild(valueSpan);

        slider.oninput = (e) => {
            valueSpan.textContent = ` ${e.target.value}px`;
            onChange(parseInt(e.target.value));
        };

        slider.update = (newValue) => {
            slider.value = newValue;
            valueSpan.textContent = ` ${newValue}px`;
        };
        return container;
    };

    // Helper function to find the bounding box of non-transparent pixels
    function getBoundingBox(imageData) {
        const data = imageData.data;
        const width = imageData.width;
        const height = imageData.height;

        let minX = width;
        let minY = height;
        let maxX = -1;
        let maxY = -1;

        let foundPixel = false;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const i = (y * width + x) * 4;
                const alpha = data[i + 3];
                if (alpha > 0) { // If not fully transparent
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                    foundPixel = true;
                }
            }
        }

        if (!foundPixel) {
            return null; // Canvas is empty or fully transparent
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX + 1,
            height: maxY - minY + 1
        };
    }

    // Function to render the tiled avatar
    function renderTiledAvatar(canvas, ctx, avatarImage) {
        if (!avatarImage) {
            console.warn("No avatar image to tile.");
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the main canvas before tiling

        const tileSourceWidth = avatarImage.width;
        const tileSourceHeight = avatarImage.height;

        if (tileSourceWidth === 0 || tileSourceHeight === 0) {
            console.warn("Captured avatar has zero dimensions. Cannot tile.");
            return;
        }

        // Calculate the number of columns and rows needed to perfectly fill the canvas
        // and the size of each tile to stretch to fit
        const numCols = Math.ceil(canvas.width / tileSourceWidth);
        const numRows = Math.ceil(canvas.height / tileSourceHeight);

        // Adjust the drawing dimensions of each tile to perfectly fill the current canvas size
        const drawWidth = canvas.width / numCols;
        const drawHeight = canvas.height / numRows;

        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                ctx.drawImage(avatarImage, c * drawWidth, r * drawHeight, drawWidth, drawHeight);
            }
        }
    }


    // Function to add a section for an element's controls
    function addControlSection(menu, title, targetSelector, isCanvasAttributeBased = false, localStorageKey) {
        const section = document.createElement('div');
        section.style.marginBottom = '20px';
        section.style.borderTop = '1px dashed #444';
        section.style.paddingTop = '15px';

        const sectionTitle = document.createElement('h3');
        sectionTitle.style.cssText = `
            font-size: 1.1em;
            margin-bottom: 10px;
            color: #61dafb;
        `;
        sectionTitle.textContent = title;
        section.appendChild(sectionTitle);

        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) {
            section.textContent = `Element "${targetSelector}" not found.`;
            section.style.color = 'red';
            menu.appendChild(section);
            return;
        }

        // Capture initial dimensions on page load for "Original Size" button
        const initialDimensions = getElementCurrentDimensions(targetElement, isCanvasAttributeBased);
        if (targetSelector === '#selfavatarimage') {
            initialSelfAvatarImageWidth = initialDimensions.width;
            initialSelfAvatarImageHeight = initialDimensions.height;
        } else if (targetSelector === 'canvas.main') {
            initialAvatarBuilderCanvasWidth = initialDimensions.width;
            initialAvatarBuilderCanvasHeight = initialDimensions.height;
        }

        let currentWidth = initialDimensions.width;
        let currentHeight = initialDimensions.height;
        let originalAspectRatio = (initialDimensions.width / initialDimensions.height);
        if (isNaN(originalAspectRatio) || !isFinite(originalAspectRatio) || originalAspectRatio === 0) {
            originalAspectRatio = 1; // Fallback to 1:1 if original dimensions are invalid or zero
        }

        // --- Sliders ---
        const widthSliderContainer = createSlider(
            'Width',
            currentWidth,
            0,
            1000,
            1,
            (val) => {
                const newWidth = val;
                const newHeight = Math.round(newWidth / originalAspectRatio);
                applyElementDimensions(targetElement, newWidth, newHeight, isCanvasAttributeBased);
                widthSliderContainer.querySelector('input').update(newWidth);
                heightSliderContainer.querySelector('input').update(newHeight);

                // Re-tile if in tiled mode
                if (isTiledMode && targetSelector === 'canvas.main') {
                    renderTiledAvatar(targetElement, targetElement.getContext('2d'), tiledBaseAvatarImage);
                }
            }
        );
        section.appendChild(widthSliderContainer);

        const heightSliderContainer = createSlider(
            'Height',
            currentHeight,
            0,
            1000,
            1,
            (val) => {
                const newHeight = val;
                const newWidth = Math.round(newHeight * originalAspectRatio);
                applyElementDimensions(targetElement, newWidth, newHeight, isCanvasAttributeBased);
                heightSliderContainer.querySelector('input').update(newHeight);
                widthSliderContainer.querySelector('input').update(newWidth);

                // Re-tile if in tiled mode
                if (isTiledMode && targetSelector === 'canvas.main') {
                    renderTiledAvatar(targetElement, targetElement.getContext('2d'), tiledBaseAvatarImage);
                }
            }
        );
        section.appendChild(heightSliderContainer);

        // --- Custom Size Buttons ---
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.marginTop = '10px';
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.flexWrap = 'wrap';
        buttonsContainer.style.gap = '8px';
        section.appendChild(buttonsContainer);

        const createButton = (text, onClick) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = `
                background: #61dafb;
                color: #282c34;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
                flex: 1;
                min-width: 60px;
                white-space: nowrap;
                transition: background 0.2s ease;
            `;
            button.onmouseover = () => button.style.background = '#21a1f1';
            button.onmouseout = () => button.style.background = '#61dafb';
            button.onclick = onClick;
            buttonsContainer.appendChild(button);
        };

        createButton('Hide (0px)', () => {
            // Exit tiled mode
            isTiledMode = false;
            tiledBaseAvatarImage = null;

            applyElementDimensions(targetElement, 0, 0, isCanvasAttributeBased);
            widthSliderContainer.querySelector('input').update(0);
            heightSliderContainer.querySelector('input').update(0);
        });

        createButton('Set W=200px', () => {
            // Exit tiled mode
            isTiledMode = false;
            tiledBaseAvatarImage = null;

            const newWidth = 200;
            const newHeight = Math.round(newWidth / originalAspectRatio);
            applyElementDimensions(targetElement, newWidth, newHeight, isCanvasAttributeBased);
            widthSliderContainer.querySelector('input').update(newWidth);
            heightSliderContainer.querySelector('input').update(newHeight);
        });

        createButton('Original Size', () => {
            // Exit tiled mode
            isTiledMode = false;
            tiledBaseAvatarImage = null;

            const initialW = (targetSelector === '#selfavatarimage') ? initialSelfAvatarImageWidth : initialAvatarBuilderCanvasWidth;
            const initialH = (targetSelector === '#selfavatarimage') ? initialSelfAvatarImageHeight : initialAvatarBuilderCanvasHeight;

            if (isNaN(initialW) || isNaN(initialH) || initialW === 0 || initialH === 0) {
                console.warn("Original size not captured or is zero for", targetSelector, ". Cannot restore accurately.");
                alert("Original size not captured or is zero. Cannot restore accurately. Please refresh the page.");
                return;
            }
            applyElementDimensions(targetElement, initialW, initialH, isCanvasAttributeBased);
            widthSliderContainer.querySelector('input').update(initialW);
            heightSliderContainer.querySelector('input').update(initialH);
        });

        // --- Tile Avatar Button (only for Avatar Builder Canvas) ---
        if (isCanvasAttributeBased && targetSelector === 'canvas.main') {
            const tileButton = document.createElement('button');
            tileButton.textContent = 'Tile Avatar';
            tileButton.style.cssText = `
                background: #ffc107; /* Amber/Yellow */
                color: #282c34;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.9em;
                margin-top: 10px;
                width: 100%;
                transition: background 0.2s ease;
            `;
            tileButton.onmouseover = () => tileButton.style.background = '#e0a800';
            tileButton.onmouseout = () => tileButton.style.background = '#ffc107';
            tileButton.onclick = () => {
                const canvas = targetElement;
                const ctx = canvas.getContext('2d');

                // 1. Capture the actual drawn avatar by finding its bounding box
                const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const boundingBox = getBoundingBox(currentImageData);

                if (!boundingBox) {
                    alert("Canvas is empty or only transparent pixels. Draw your avatar first!");
                    return;
                }

                // Create a temporary canvas to hold the cropped avatar
                const croppedCanvas = document.createElement('canvas');
                croppedCanvas.width = boundingBox.width;
                croppedCanvas.height = boundingBox.height;
                const croppedCtx = croppedCanvas.getContext('2d');
                // Put only the content within the bounding box onto the cropped canvas
                croppedCtx.putImageData(ctx.getImageData(boundingBox.x, boundingBox.y, boundingBox.width, boundingBox.height), 0, 0);

                const avatarImage = new Image();
                avatarImage.src = croppedCanvas.toDataURL(); // This is our clean single tile source

                avatarImage.onload = () => {
                    tiledBaseAvatarImage = avatarImage; // Store the image for later re-tiling
                    isTiledMode = true; // Activate tiled mode

                    renderTiledAvatar(canvas, ctx, tiledBaseAvatarImage);
                    alert("Avatar tiled across the canvas!");
                };
                 avatarImage.onerror = () => {
                    alert("Failed to load avatar image for tiling. Is the canvas content corrupted or empty?");
                };
            };
            section.appendChild(tileButton);
        }


        // --- Default Load Values Section ---
        const defaultLoadSection = document.createElement('div');
        defaultLoadSection.style.marginTop = '20px';
        defaultLoadSection.style.borderTop = '1px solid #444';
        defaultLoadSection.style.paddingTop = '15px';
        defaultLoadSection.style.color = '#ccc';

        const defaultTitle = document.createElement('h4');
        defaultTitle.style.cssText = `
            font-size: 1em;
            margin-bottom: 10px;
            color: #ddd;
        `;
        defaultTitle.textContent = 'Default Load Size:';
        defaultLoadSection.appendChild(defaultTitle);

        const defaultWidthInput = document.createElement('input');
        defaultWidthInput.type = 'number';
        defaultWidthInput.placeholder = 'Enter default width (px)';
        defaultWidthInput.style.cssText = `
            width: calc(100% - 10px);
            padding: 8px;
            margin-bottom: 10px;
            background: #333;
            border: 1px solid #555;
            border-radius: 4px;
            color: #fff;
        `;
        defaultLoadSection.appendChild(defaultWidthInput);

        const defaultButtonsContainer = document.createElement('div');
        defaultButtonsContainer.style.display = 'flex';
        defaultButtonsContainer.style.gap = '8px';
        defaultLoadSection.appendChild(defaultButtonsContainer);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save as Default';
        saveButton.style.cssText = `
            background: #28a745; /* Green */
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            flex: 1;
            transition: background 0.2s ease;
        `;
        saveButton.onmouseover = () => saveButton.style.background = '#218838';
        saveButton.onmouseout = () => saveButton.style.background = '#28a745';
        saveButton.onclick = () => {
            const val = parseInt(defaultWidthInput.value);
            if (!isNaN(val) && val >= 0) {
                const defaultHeight = Math.round(val / originalAspectRatio);
                localStorage.setItem(localStorageKey, JSON.stringify({ width: val, height: defaultHeight }));
                alert(`Default size saved for ${title}: ${val}x${defaultHeight}px`);
            } else {
                alert('Please enter a valid positive number for default width.');
            }
        };
        defaultButtonsContainer.appendChild(saveButton);

        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Default';
        resetButton.style.cssText = `
            background: #dc3545; /* Red */
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
            flex: 1;
            transition: background 0.2s ease;
        `;
        resetButton.onmouseover = () => resetButton.style.background = '#c82333';
        resetButton.onmouseout = () => resetButton.style.background = '#dc3545';
        resetButton.onclick = () => {
            localStorage.removeItem(localStorageKey);
            alert(`Default size reset for ${title}. Refresh page to apply original application size.`);

            // Exit tiled mode when default is reset for canvas
            if (targetSelector === 'canvas.main') {
                isTiledMode = false;
                tiledBaseAvatarImage = null;
            }

            const initialW = (targetSelector === '#selfavatarimage') ? initialSelfAvatarImageWidth : initialAvatarBuilderCanvasWidth;
            const initialH = (targetSelector === '#selfavatarimage') ? initialSelfAvatarImageHeight : initialAvatarBuilderCanvasHeight;
            applyElementDimensions(targetElement, initialW, initialH, isCanvasAttributeBased);
            widthSliderContainer.querySelector('input').update(initialW);
            heightSliderContainer.querySelector('input').update(initialH);
            defaultWidthInput.value = '';
        };
        defaultButtonsContainer.appendChild(resetButton);

        section.appendChild(defaultLoadSection);
        menu.appendChild(section);

        const savedDefaults = localStorage.getItem(localStorageKey);
        if (savedDefaults) {
            try {
                const { width, height } = JSON.parse(savedDefaults);
                if (!isNaN(width) && !isNaN(height) && width >= 0 && height >= 0) {
                    applyElementDimensions(targetElement, width, height, isCanvasAttributeBased);
                    widthSliderContainer.querySelector('input').update(width);
                    heightSliderContainer.querySelector('input').update(height);
                    defaultWidthInput.value = width;
                    console.log(`Applied saved default for ${title}: ${width}x${height}px`);
                }
            } catch (e) {
                console.error("Error parsing saved defaults for", title, e);
                localStorage.removeItem(localStorageKey);
            }
        }
    }

    // Initialize the script
    const menu = createDraggableMenu();

    const currentUrl = window.location.href;

    if (currentUrl.includes('drawaria.online') && !currentUrl.includes('drawaria.online/avatar/builder/')) {
        const checkSelfAvatarImage = setInterval(() => {
            const selfAvatarImage = document.getElementById('selfavatarimage');
            if (selfAvatarImage) {
                clearInterval(checkSelfAvatarImage);
                addControlSection(menu, 'Self Avatar Image', '#selfavatarimage', false, 'drawariaCustomizer.selfAvatarImageDefaults');
            }
        }, 500);
    }

    if (currentUrl.includes('drawaria.online/avatar/builder/')) {
        const checkAvatarBuilderCanvas = setInterval(() => {
            const avatarBuilderCanvas = document.querySelector('canvas.main');
            if (avatarBuilderCanvas) {
                clearInterval(checkAvatarBuilderCanvas);
                addControlSection(menu, 'Avatar Builder Canvas', 'canvas.main', true, 'drawariaCustomizer.avatarBuilderCanvasDefaults');
            }
        }, 500);
    }

})();