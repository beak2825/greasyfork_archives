// ==UserScript==
// @name         Drawaria Lazer Gradient
// @version      6.1
// @description  Cyclic gradient with a 'laser' transition effect between colors
// @author       лазер дмитрий прайм, YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @license      MIT
// @namespace https://greasyfork.org/users/1088100
// @downloadURL https://update.greasyfork.org/scripts/544861/Drawaria%20Lazer%20Gradient.user.js
// @updateURL https://update.greasyfork.org/scripts/544861/Drawaria%20Lazer%20Gradient.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Original ASCII art and comments preserved from v5.1

    // ████████████████████████████████████████████████████████████████████████████████████████████████████████████████████
    // █▄─█▀▀▀█─▄█─▄▄─█▄─▀█▀─▄█▄─▄▄▀█▄─▄█─▄▄─█─▄─▄─█▄─▄▄─█─▄▄─█▄─▄▄▀█─▄▄─█─▄▄▄▄█─▄─▄─█▄─▄▄─█▄─▀█▄─▄█─▄▄▄▄█─█─█▄─▄█─▄▄─█▄─▀█▀─▄█
    // ██─█─█─█─██─██─██─█▄█─███─▄─▄██─██─██─███─████─▄█▀█─██─██─▄─▄█─██─█▄▄▄▄─███─████─▄█▀██─█▄▀─██▄▄▄▄─█─▄─██─██─██─██─█▄█─██
    // ▀▀▄▄▄▀▄▄▄▀▄▄▄▄▀▄▄▄▀▄▄▄▀▄▄▀▄▄▀▄▄▄▀▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▄▀▄▄▀▄▄▀▄▄▄▄▀▄▄▄▄▄▀▀▄▄▄▀▀▄▄▄▄▄▀▄▄▄▀▀▄▄▀▄▄▄▄▄▀▄▀▄▀▄▄▄▀▄▄▄▄▀▄▄▄▀▄▄▄▀

    // Стили панели
    const panelStyle = `
        position: fixed;
        top: 100px;
        left: 100px;
        z-index: 99999;
        background: rgba(10,10,10,0.96);
        padding: 15px;
        border-radius: 8px;
        border: 2px solid #FF00FF;
        box-shadow: 0 0 25px rgba(255,0,255,0.7),
                    inset 0 0 15px rgba(0,255,255,0.4);
        cursor: move;
        user-select: none;
        width: 240px;
        font-family: 'Courier New', monospace;
        backdrop-filter: blur(5px);
    `;

    const gradientStyle = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: -1;
        pointer-events: none;
        opacity: 0;
        transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden; /* Prevent scrollbars if background-size is large */
    `;

    // Создаем элементы
    const panel = document.createElement("div");
    panel.style.cssText = panelStyle;
    panel.setAttribute('id', 'lazer-gradient-panel');

    const gradient = document.createElement("div");
    gradient.style.cssText = gradientStyle;
    gradient.setAttribute('id', 'lazer-gradient-effect');

    // █▀▀ █▀█ █▀▀ ▄▀█ ▀█▀ █ █▀█ █▄░█ █▀▀   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀▄ ██▄ █▀█ ░█░ █ █▄█ █░▀█ ██▄   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // [КОНТРОЛЛЕРЫ]
    let speed = 5;
    let gradientType = 'linear'; // 'linear', 'radial', 'conic'
    let linearDirection = 'to right'; // 'to right', 'to bottom', '45deg' etc.
    let conicStartAngle = 0; // 0-360 degrees
    let globalOpacity = 85; // 0-100

    // HTML for new controls
    const gradientTypeControlHTML = `
    <div style="margin-bottom: 15px;">
        <div style="color: #00FFFF; font-size: 12px; margin-bottom: 5px;">GRADIENT TYPE:</div>
        <select id="lazer-gradient-type" style="width: 100%; padding: 5px; border-radius: 3px; background: rgba(0,255,255,0.1); color: white; border: 1px solid #00FFFF;">
            <option value="linear">Linear</option>
            <option value="radial">Radial</option>
            <option value="conic">Conic</option>
        </select>
    </div>`;

    const linearDirectionControlHTML = `
    <div id="lazer-linear-direction-control" style="margin-bottom: 15px;">
        <div style="color: #00FFFF; font-size: 12px; margin-bottom: 5px;">LINEAR DIRECTION:</div>
        <select id="lazer-linear-direction" style="width: 100%; padding: 5px; border-radius: 3px; background: rgba(0,255,255,0.1); color: white; border: 1px solid #00FFFF;">
            <option value="to right">Right</option>
            <option value="to left">Left</option>
            <option value="to top">Top</option>
            <option value="to bottom">Bottom</option>
            <option value="to top right">Top Right</option>
            <option value="to top left">Top Left</option>
            <option value="to bottom right">Bottom Right</option>
            <option value="to bottom left">Bottom Left</option>
            <option value="0deg">0° (To Top)</option>
            <option value="45deg">45°</option>
            <option value="90deg">90° (To Right)</option>
            <option value="135deg">135°</option>
            <option value="180deg">180° (To Bottom)</option>
            <option value="225deg">225°</option>
            <option value="270deg">270° (To Left)</option>
            <option value="315deg">315°</option>
        </select>
    </div>`;

    const conicAngleControlHTML = `
    <div id="lazer-conic-angle-control" style="margin-bottom: 15px; display: none;">
        <div style="display: flex; justify-content: space-between; color: #00FFFF; font-size: 12px; margin-bottom: 5px;">
            <span>CONIC START ANGLE:</span>
            <span id="lazer-conic-angle-value">${conicStartAngle}°</span>
        </div>
        <input type="range" min="0" max="360" value="${conicStartAngle}"
            style="width: 100%; accent-color: #FF00FF; cursor: pointer;"
            id="lazer-conic-angle-slider">
    </div>`;

    const globalOpacityControlHTML = `
    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; color: #00FFFF; font-size: 12px; margin-bottom: 5px;">
            <span>GLOBAL OPACITY:</span>
            <span id="lazer-opacity-value">${globalOpacity}%</span>
        </div>
        <input type="range" min="0" max="100" value="${globalOpacity}"
            style="width: 100%; accent-color: #FF00FF; cursor: pointer;"
            id="lazer-opacity-slider">
    </div>`;

    // [ИНТЕРФЕЙС]
    panel.innerHTML = `
    <div style="border-bottom: 1px solid #FF00FF; margin-bottom: 15px; padding-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <div style="color: #00FFFF; font-weight: bold; text-shadow: 0 0 8px #FF00FF; font-size: 16px;">
            ⚡ LAZER GRADIENT v6.0
        </div>
        <div id="lazer-close-btn" style="color: white; cursor: pointer; font-size: 20px; transition: all 0.2s;">×</div>
    </div>

    <div id="lazer-color-container" style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; max-height: 250px; overflow-y: auto; padding-right: 5px;">
        <!-- Colors will be added here -->
    </div>

    <button id="lazer-add-color" style="background: rgba(255,0,255,0.2); color: white; border: 1px dashed #FF00FF; padding: 8px; border-radius: 5px; margin-bottom: 15px; cursor: pointer; width: 100%; font-size: 12px; transition: all 0.2s;">
        + ADD LAZER COLOR (MAX 10)
    </button>

    ${gradientTypeControlHTML}
    ${linearDirectionControlHTML}
    ${conicAngleControlHTML}
    ${globalOpacityControlHTML}

    <div style="margin-bottom: 15px;">
        <div style="display: flex; justify-content: space-between; color: #00FFFF; font-size: 12px; margin-bottom: 5px;">
            <span>LAZER SPEED:</span>
            <span id="lazer-speed-value">${speed}</span>
        </div>
        <input type="range" min="1" max="10" value="${speed}"
            style="width: 100%; accent-color: #FF00FF; cursor: pointer;"
            id="lazer-speed-slider">
    </div>

    <button id="lazer-toggle-btn" style="background: linear-gradient(45deg, #FF00FF, #00FFFF); color: black; border: none; padding: 10px; border-radius: 5px; cursor: pointer; font-weight: bold; width: 100%; transition: all 0.3s; font-size: 14px; text-shadow: 0 0 3px rgba(255,255,255,0.5);">
        ACTIVATE LAZER
    </button>`;

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Initial setup
    document.body.appendChild(panel);
    document.body.appendChild(gradient);
    let isActive = false;
    let animationId = null;
    const colorInputs = [];
    let colorCount = 2; // Start with 2 colors

    // Default colors for initialization
    const defaultColors = [
        '#FF00FF', '#00FFFF', '#00FF00',
        '#FFFF00', '#FF0000', '#0000FF',
        '#FF8000', '#8000FF', '#0080FF',
        '#80FF00'
    ];

    // █▀▀ █ ▀█▀ █▀▀ █▀   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▀░ █ ░█░ ██▄ ▄█   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ █▄█ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Function to create color input elements
    function createColorElement(index) {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
            display: flex;
            flex-direction: column;
            gap: 5px;
            align-items: center;
        `;

        const label = document.createElement("div");
        label.textContent = `LAZER ${index + 1}`;
        label.style.cssText = `
            color: #00FFFF;
            font-size: 10px;
            text-align: center;
            width: 100%;
            font-weight: bold;
        `;

        const inputWrapper = document.createElement("div");
        inputWrapper.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            width: 100%;
            justify-content: center;
        `;

        const input = document.createElement("input");
        input.type = "color";
        input.value = defaultColors[index] || '#FFFFFF'; // Fallback if defaultColors runs out
        input.style.cssText = `
            width: 30px;
            height: 30px;
            cursor: pointer;
            flex-shrink: 0;
            border: 1px solid #00FFFF;
            border-radius: 50%;
        `;

        const deleteBtn = document.createElement("div");
        deleteBtn.textContent = "×";
        deleteBtn.style.cssText = `
            color: white;
            cursor: pointer;
            font-size: 14px;
            opacity: ${index > 1 ? '0.7' : '0'};
            pointer-events: ${index > 1 ? 'auto' : 'none'};
            background: #FF00FF;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
        `;

        // Add handlers
        input.addEventListener("change", updateGradient);
        deleteBtn.addEventListener("click", () => removeColor(index, wrapper));

        // Store references
        colorInputs[index] = input;

        // Assemble component
        inputWrapper.appendChild(input);
        if (index > 1) inputWrapper.appendChild(deleteBtn);
        wrapper.appendChild(label);
        wrapper.appendChild(inputWrapper);

        return wrapper;
    }

    // Function to remove a color
    function removeColor(indexToRemove, wrapperToRemove) {
        if (colorCount <= 2) return;

        colorContainer.removeChild(wrapperToRemove);
        colorInputs.splice(indexToRemove, 1);
        colorCount--;

        // Re-index remaining colors and update delete button opacity/pointer-events
        colorInputs.forEach((input, i) => {
            const parentWrapper = input.closest('div[style*="flex-direction: column"]');
            if (parentWrapper) {
                const label = parentWrapper.querySelector('div[style*="font-size: 10px"]');
                if (label) label.textContent = `LAZER ${i + 1}`;

                const deleteBtn = parentWrapper.querySelector('div[style*="background: rgb(255, 0, 255)"]');
                if (deleteBtn) {
                    deleteBtn.style.opacity = i > 1 ? '0.7' : '0';
                    deleteBtn.style.pointerEvents = i > 1 ? 'auto' : 'none';
                }
            }
        });

        if (isActive) updateGradient();
    }

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Main gradient update function
    function updateGradient() {
        if (colorInputs.length < 2) {
            gradient.style.background = 'none';
            cancelAnimationFrame(animationId);
            return;
        }

        const colors = colorInputs.map(input => input.value);

        // Add the first color to the end to ensure a seamless loop for repeating gradients
        const seamlessColors = [...colors, colors[0]];
        const stopInterval = 100 / colors.length; // Each color occupies an equal percentage segment

        // Generate color stops string for CSS gradients
        const gradientStops = seamlessColors.map((color, i) => `${color} ${i * stopInterval}%`).join(', ');

        cancelAnimationFrame(animationId);

        let animationFrameCount = 0;
        const animate = () => {
            animationFrameCount++;
            const animationSpeedFactor = speed * 0.1; // Adjust multiplier for animation speed
            const currentAnimationOffset = animationFrameCount * animationSpeedFactor;

            let backgroundCSS = '';
            gradient.style.background = ''; // Clear previous background
            gradient.style.transform = ''; // Clear previous transform (for conic)
            gradient.style.backgroundSize = ''; // Clear previous background-size (for linear/radial)
            gradient.style.backgroundPosition = ''; // Clear previous background-position (for linear/radial)

            if (gradientType === 'linear') {
                backgroundCSS = `linear-gradient(${linearDirection}, ${gradientStops})`;

                // Calculate background size and position for animated scrolling effect
                const stretchFactor = 100 * colors.length; // e.g., 200% for 2 colors, 300% for 3 colors

                let bgSizeX = '100vw'; // Default to viewport width
                let bgSizeY = '100vh'; // Default to viewport height
                let bgPosX = '0px';
                let bgPosY = '0px';

                // Determine the background-size and position for seamless scrolling based on direction
                if (linearDirection.includes('right') || linearDirection.includes('left') || linearDirection === '90deg' || linearDirection === '270deg') {
                    bgSizeX = `${stretchFactor}%`;
                    bgPosX = `${-(currentAnimationOffset % stretchFactor)}%`;
                }
                if (linearDirection.includes('top') || linearDirection.includes('bottom') || linearDirection === '0deg' || linearDirection === '180deg') {
                    bgSizeY = `${stretchFactor}%`;
                    bgPosY = `${-(currentAnimationOffset % stretchFactor)}%`;
                }
                // For diagonal gradients, both dimensions are stretched and moved
                if ((linearDirection.includes('top') || linearDirection.includes('bottom')) && (linearDirection.includes('left') || linearDirection.includes('right'))) {
                    bgSizeX = `${stretchFactor}%`;
                    bgSizeY = `${stretchFactor}%`;
                    bgPosX = `${-(currentAnimationOffset % stretchFactor)}%`;
                    bgPosY = `${-(currentAnimationOffset % stretchFactor)}%`;
                }

                gradient.style.background = backgroundCSS;
                gradient.style.backgroundSize = `${bgSizeX} ${bgSizeY}`;
                gradient.style.backgroundPosition = `${bgPosX} ${bgPosY}`;

            } else if (gradientType === 'radial') {
                // For radial, animate the center position for a "scanning" effect
                const offsetAngle = (currentAnimationOffset * 0.5) * (Math.PI / 180); // Slower oscillation
                const centerX = 50 + Math.sin(offsetAngle) * 40; // Oscillate center X by 40%
                const centerY = 50 + Math.cos(offsetAngle) * 40; // Oscillate center Y by 40%

                backgroundCSS = `radial-gradient(circle at ${centerX}% ${centerY}%, ${gradientStops})`;
                gradient.style.background = backgroundCSS;

            } else if (gradientType === 'conic') {
                // For conic, animate the `from` angle for rotation
                const animatedAngle = (conicStartAngle + currentAnimationOffset * 3.6) % 360; // Rotate by 3.6 degrees per unit of offset
                backgroundCSS = `conic-gradient(from ${animatedAngle}deg at center, ${colors.join(', ')})`;
                gradient.style.background = backgroundCSS;
            }

            animationId = requestAnimationFrame(animate);
        };

        if (isActive) { // Only start animation if the gradient is active
            animate();
        }
    }

    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Initialize interface elements
    const colorContainer = panel.querySelector("#lazer-color-container");
    const addColorBtn = panel.querySelector("#lazer-add-color");
    const toggleBtn = panel.querySelector("#lazer-toggle-btn");
    const closeBtn = panel.querySelector("#lazer-close-btn");
    const speedSlider = panel.querySelector("#lazer-speed-slider");
    const speedValue = panel.querySelector("#lazer-speed-value");

    // New controls
    const gradientTypeSelect = panel.querySelector("#lazer-gradient-type");
    const linearDirectionControl = panel.querySelector("#lazer-linear-direction-control");
    const linearDirectionSelect = panel.querySelector("#lazer-linear-direction");
    const conicAngleControl = panel.querySelector("#lazer-conic-angle-control");
    const conicAngleSlider = panel.querySelector("#lazer-conic-angle-slider");
    const conicAngleValue = panel.querySelector("#lazer-conic-angle-value");
    const globalOpacitySlider = panel.querySelector("#lazer-opacity-slider");
    const globalOpacityValue = panel.querySelector("#lazer-opacity-value");


    // Add initial colors
    for (let i = 0; i < 2; i++) {
        colorContainer.appendChild(createColorElement(i));
    }

    // Function to update visibility of gradient-specific controls
    function updateControlVisibility() {
        linearDirectionControl.style.display = (gradientType === 'linear') ? 'block' : 'none';
        conicAngleControl.style.display = (gradientType === 'conic') ? 'block' : 'none';
    }
    // Set initial visibility
    updateControlVisibility();


    // █▀▀ █░█ █▀▀ █▀█ █▀▀ █▀▄   █▀▀ █▀█ █▄░█ █▀▀ █░█ █▀ █▀▀ █▀▄   █▀▀ █▀▀ █▄░█ █▀▀ █▀█ ▄▀█ █▀▀ █▀▀ ▀█▀ █▀█ █▀█
    // █▄▄ █▀█ ██▄ █▀▄ ██▄ █▄▀   █▄▄ █▄█ █░▀█ █▄▄ █▄█ ▄█ ██▄ █▄▀   █▄█ ██▄ █░▀█ ██▄ █▀▄ █▀█ █▄▄ ██▄ ░█░ █▄█ █▀▄

    // Event Handlers
    addColorBtn.addEventListener("click", () => {
        if (colorCount >= 10) {
            alert("Maximum 10 LAZER colors!");
            return;
        }
        colorContainer.appendChild(createColorElement(colorCount));
        colorCount++;
        if (isActive) updateGradient(); // Update gradient immediately after adding a color
    });

    toggleBtn.addEventListener("click", () => {
        if (colorInputs.length < 2) {
            alert("Need at least 2 LAZER colors!");
            return;
        }

        isActive = !isActive;

        if (isActive) {
            gradient.style.opacity = globalOpacity / 100; // Use the configured opacity
            toggleBtn.textContent = "DEACTIVATE LAZER";
            toggleBtn.style.background = "linear-gradient(45deg, #FF0000, #990000)";
            updateGradient(); // Start animation
        } else {
            gradient.style.opacity = 0;
            toggleBtn.textContent = "ACTIVATE LAZER";
            toggleBtn.style.background = "linear-gradient(45deg, #FF00FF, #00FFFF)";
            cancelAnimationFrame(animationId); // Stop animation
        }
    });

    speedSlider.addEventListener("input", () => {
        speed = parseInt(speedSlider.value);
        speedValue.textContent = speed;
        if (isActive) {
            updateGradient(); // Re-start animation with new speed
        }
    });

    // New Event Listeners for gradient type, direction, angle, opacity
    gradientTypeSelect.addEventListener("change", (e) => {
        gradientType = e.target.value;
        updateControlVisibility(); // Show/hide relevant controls
        if (isActive) updateGradient();
    });

    linearDirectionSelect.addEventListener("change", (e) => {
        linearDirection = e.target.value;
        if (isActive) updateGradient();
    });

    conicAngleSlider.addEventListener("input", () => {
        conicStartAngle = parseInt(conicAngleSlider.value);
        conicAngleValue.textContent = `${conicStartAngle}°`;
        if (isActive) updateGradient();
    });

    globalOpacitySlider.addEventListener("input", () => {
        globalOpacity = parseInt(globalOpacitySlider.value);
        globalOpacityValue.textContent = `${globalOpacity}%`;
        if (isActive) { // Only change opacity if already active, otherwise it will be set on activation
             gradient.style.opacity = globalOpacity / 100;
        }
    });


    closeBtn.addEventListener("click", () => {
        panel.remove();
        gradient.remove();
        cancelAnimationFrame(animationId);
    });

    // Panel dragging logic (unchanged)
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    panel.addEventListener("mousedown", (e) => {
        // Exclude input fields, selects and buttons from dragging
        if (e.target.tagName !== "INPUT" && e.target.tagName !== "SELECT" && e.target.tagName !== "BUTTON" && e.target !== closeBtn) {
            isDragging = true;
            dragOffset = {
                x: e.clientX - panel.getBoundingClientRect().left,
                y: e.clientY - panel.getBoundingClientRect().top
            };
            panel.style.cursor = "grabbing";
            panel.style.boxShadow = "0 0 30px rgba(255,0,255,1)";
        }
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;

        panel.style.left = `${e.clientX - dragOffset.x}px`;
        panel.style.top = `${e.clientY - dragOffset.y}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        panel.style.cursor = "move";
        panel.style.boxShadow = "0 0 25px rgba(255,0,255,0.8)";
    });

    // Scrollbar styles (unchanged)
    const scrollStyle = document.createElement("style");
    scrollStyle.textContent = `
        #lazer-color-container::-webkit-scrollbar {
            width: 4px;
            height: 4px;
        }
        #lazer-color-container::-webkit-scrollbar-thumb {
            background: #FF00FF;
            border-radius: 2px;
        }
        #lazer-color-container::-webkit-scrollbar-track {
            background: rgba(255,0,255,0.1);
        }
    `;
    document.head.appendChild(scrollStyle);

    console.log("⚡ LAZER GRADIENT v6.0 activated!");
})();