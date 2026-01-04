// ==UserScript==
// @name         Krunker Precision Enhancer
// @namespace    https://github.com/SolitarianScripts
// @version      1.4.3
// @description  Advanced player visualization and targeting system for Krunker with predictive algorithms
// @author       Solitarian
// @license      All Rights Reserved
// @match        *://krunker.io/*
// @match        *://browserfps.com/*
// @exclude      *://krunker.io/social*
// @exclude      *://krunker.io/editor*
// @icon         https://img.icons8.com/color/96/000000/target.png
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/three@0.150.1/build/three.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531093/Krunker%20Precision%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/531093/Krunker%20Precision%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const visualizationPalette = [
        { name: "Crimson", value: "0.86, 0.08, 0.24", style: "color: #dc143c" },
        { name: "Amber", value: "1.0, 0.75, 0.0", style: "color: #ffbf00" },
        { name: "Emerald", value: "0.0, 0.79, 0.34", style: "color: #00c957" },
        { name: "Azure", value: "0.0, 0.5, 1.0", style: "color: #007fff" },
        { name: "Violet", value: "0.54, 0.17, 0.89", style: "color: #8a2be2" },
        { name: "Onyx", value: "0.0, 0.0, 0.0", style: "color: #000000" },
        { name: "Pearl", value: "0.94, 0.94, 0.94", style: "color: #f0f0f0" },
        { name: "Jade", value: "0.0, 0.66, 0.42", style: "color: #00a86b" }
    ];

    const defaultConfig = {
        targetingEnabled: true,
        visualizationEnabled: true,
        trajectoryLines: true,
        visualizationColor: "0.86, 0.08, 0.24",
        visualizationColorIndex: 0,
        verticalAdjustment: 7.5,
        targetingMode: 'crosshairProximity',
        predictionIntensity: 0.85,
        targetingPrecision: 95,
        smoothTargeting: false,
        smoothingFactor: 25,
        uiCollapsed: false,
        lastActivePanel: null
    };

    const config = GM_getValue('krunkerEnhancerConfig', defaultConfig);

    const keyBindings = {
        KeyB: 'targetingEnabled',
        KeyN: 'visualizationEnabled',
        KeyM: 'trajectoryLines',
        KeyC: 'cycleVisualizationColor',
        BracketLeft: 'decreaseVerticalAdjustment',
        BracketRight: 'increaseVerticalAdjustment',
        Digit2: 'toggleTargetingMode',
        Digit3: 'smoothTargeting',
        Backslash: 'toggleUI'
    };

    const featureDescriptions = {
        targetingEnabled: "Targeting System [B]",
        visualizationEnabled: "Visualization [N]",
        trajectoryLines: "Trajectory Lines [M]",
        targetingMode: "Targeting Mode [2]",
        predictionIntensity: "Prediction Strength",
        targetingPrecision: "Targeting Precision",
        smoothTargeting: "Smooth Targeting [3]",
        smoothingFactor: "Smoothing Factor",
        visualizationColor: "Color Scheme [C]",
        verticalAdjustment: "Vertical Adjustment"
    };

    let sceneContext;
    let initializationTimer = null;
    let rightMouseActive = false;
    let targetLockActive = false;
    let lockedTarget = null;
    let targetPositionHistory = {};
    let lastTargetingTime = 0;

    const ThreeDEngine = window.THREE;
    delete window.THREE;

    const systemUtils = {
        window: window,
        document: document,
        querySelector: document.querySelector,
        log: console.log,
        arrayProto: Array.prototype,
        arrayPush: Array.prototype.push,
        requestFrame: window.requestAnimationFrame,
        setTimeout: window.setTimeout
    };

    systemUtils.log('Initializing precision enhancement system...');

    const sceneDetector = function(object) {
        try {
            if (typeof object === 'object' &&
                typeof object.parent === 'object' &&
                object.parent.type === 'Scene' &&
                object.parent.name === 'Main') {
                systemUtils.log('Scene context acquired');
                sceneContext = object.parent;
                systemUtils.arrayProto.push = systemUtils.arrayPush;
            }
        } catch (error) {}
        return systemUtils.arrayPush.apply(this, arguments);
    };

    const vectorCache1 = new ThreeDEngine.Vector3();
    const vectorCache2 = new ThreeDEngine.Vector3();
    const tempTransform = new ThreeDEngine.Object3D();
    tempTransform.rotation.order = 'YXZ';

    const playerGeometry = new ThreeDEngine.EdgesGeometry(
        new ThreeDEngine.BoxGeometry(4.8, 14.8, 4.8).translate(0, 7.4, 0)
    );

    let visualizationMaterial = new ThreeDEngine.RawShaderMaterial({
        vertexShader: `
            attribute vec3 position;
            uniform mat4 projectionMatrix;
            uniform mat4 modelViewMatrix;
            void main() {
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                gl_Position.z = 1.0;
            }`,
        fragmentShader: `
            void main() {
                gl_FragColor = vec4(${config.visualizationColor}, 1.0);
            }`
    });

    const trajectoryVisual = new ThreeDEngine.LineSegments(
        new ThreeDEngine.BufferGeometry(),
        visualizationMaterial
    );
    trajectoryVisual.frustumCulled = false;
    const trajectoryPositions = new ThreeDEngine.BufferAttribute(
        new Float32Array(100 * 2 * 3),
        3
    );
    trajectoryVisual.geometry.setAttribute('position', trajectoryPositions);

    function updateVisualizationColor() {
        config.visualizationColorIndex =
            (config.visualizationColorIndex + 1) % visualizationPalette.length;
        const newColor = visualizationPalette[config.visualizationColorIndex];
        config.visualizationColor = newColor.value;

        visualizationMaterial = new ThreeDEngine.RawShaderMaterial({
            vertexShader: `
                attribute vec3 position;
                uniform mat4 projectionMatrix;
                uniform mat4 modelViewMatrix;
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    gl_Position.z = 1.0;
                }`,
            fragmentShader: `
                void main() {
                    gl_FragColor = vec4(${config.visualizationColor}, 1.0);
                }`
        });

        trajectoryVisual.material = visualizationMaterial;

        if (sceneContext && sceneContext.children) {
            for (let i = 0; i < sceneContext.children.length; i++) {
                const entity = sceneContext.children[i];
                if (entity.visualizationBox) {
                    entity.visualizationBox.material = visualizationMaterial;
                }
            }
        }

        const colorDisplay = document.querySelector(
            '[data-config-key="visualizationColor"] .value-display'
        );
        if (colorDisplay) {
            colorDisplay.textContent = newColor.name;
            colorDisplay.style = newColor.style;
        }

        saveConfiguration();
    }

    function restoreDefaultConfiguration() {
        Object.assign(config, defaultConfig);
        saveConfiguration();
        updateInterfaceConfiguration();
    }

    function handlePointerDown(e) {
        if (e.button === 2) {
            rightMouseActive = true;
            targetLockActive = false;
            lockedTarget = null;
        }
    }

    function handlePointerUp(e) {
        if (e.button === 2) {
            rightMouseActive = false;
            targetLockActive = false;
            lockedTarget = null;
        }
    }

    function saveConfiguration() {
        GM_setValue('krunkerEnhancerConfig', config);
    }

    function toggleConfiguration(key) {
        config[key] = !config[key];
        const itemElement = document.querySelector(`[data-config-key="${key}"]`);
        if (itemElement) {
            const valueElement = itemElement.querySelector('.value-display');
            valueElement.textContent = config[key] ? 'ON' : 'OFF';
            valueElement.style.color = config[key] ? '#4CAF50' : '#F44336';
        }
        saveConfiguration();
    }

    function switchTargetingMode() {
        config.targetingMode = config.targetingMode === 'crosshairProximity'
            ? 'distanceProximity'
            : 'crosshairProximity';
        const modeElement = document.querySelector('[data-config-key="targetingMode"]');
        if (modeElement) {
            const valueElement = modeElement.querySelector('.value-display');
            valueElement.textContent = config.targetingMode === 'crosshairProximity'
                ? 'Crosshair'
                : 'Distance';
            valueElement.style.color = '#4CAF50';
        }
        saveConfiguration();
    }

    function toggleInterface() {
        config.uiCollapsed = !config.uiCollapsed;
        updateInterfaceVisibility();
        saveConfiguration();
    }

    function updateVerticalAdjustmentDisplay() {
        const adjustmentInput = document.querySelector('#verticalAdjustmentInput');
        const adjustmentSlider = document.querySelector('#verticalAdjustmentSlider');
        if (adjustmentInput && adjustmentSlider) {
            adjustmentInput.value = config.verticalAdjustment;
            adjustmentSlider.value = config.verticalAdjustment;
        }
    }

    function updateInterfaceConfiguration() {
        Object.keys(config).forEach(key => {
            const itemElement = document.querySelector(`[data-config-key="${key}"]`);
            if (itemElement) {
                const valueElement = itemElement.querySelector('.value-display');
                if (valueElement) {
                    if (key === 'targetingMode') {
                        valueElement.textContent = config[key] === 'crosshairProximity'
                            ? 'Crosshair'
                            : 'Distance';
                        valueElement.style.color = '#4CAF50';
                    } else if (key === 'visualizationColor') {
                        valueElement.textContent = visualizationPalette[config.visualizationColorIndex].name;
                        valueElement.style = visualizationPalette[config.visualizationColorIndex].style;
                    } else if (typeof config[key] === 'boolean') {
                        valueElement.textContent = config[key] ? 'ON' : 'OFF';
                        valueElement.style.color = config[key] ? '#4CAF50' : '#F44336';
                    }
                }
            }
        });

        const verticalAdjustmentInput = document.querySelector('#verticalAdjustmentInput');
        const verticalAdjustmentSlider = document.querySelector('#verticalAdjustmentSlider');
        if (verticalAdjustmentInput && verticalAdjustmentSlider) {
            verticalAdjustmentInput.value = config.verticalAdjustment;
            verticalAdjustmentSlider.value = config.verticalAdjustment;
        }

        const predictionInput = document.querySelector('#predictionInput');
        const predictionSlider = document.querySelector('#predictionSlider');
        if (predictionInput && predictionSlider) {
            predictionInput.value = Math.round(config.predictionIntensity * 100);
            predictionSlider.value = config.predictionIntensity;
        }

        const precisionInput = document.querySelector('#precisionInput');
        const precisionSlider = document.querySelector('#precisionSlider');
        if (precisionInput && precisionSlider) {
            precisionInput.value = config.targetingPrecision;
            precisionSlider.value = config.targetingPrecision;
        }

        const smoothingInput = document.querySelector('#smoothingInput');
        const smoothingSlider = document.querySelector('#smoothingSlider');
        if (smoothingInput && smoothingSlider) {
            smoothingInput.value = config.smoothingFactor;
            smoothingSlider.value = config.smoothingFactor;
        }

        const interfaceElement = document.querySelector('.enhancer-interface');
        if (interfaceElement) {
            if (config.uiCollapsed) {
                interfaceElement.classList.remove('expanded');
            } else {
                interfaceElement.classList.add('expanded');
            }
        }

        if (config.lastActivePanel) {
            const panelElement = document.querySelector(
                `.panel-header:contains("${config.lastActivePanel}")`
            );
            if (panelElement) {
                panelElement.parentElement.classList.add('active');
            }
        }
    }

    function updateInterfaceVisibility() {
        const interfaceElement = document.querySelector('.enhancer-interface');
        if (interfaceElement) {
            if (config.uiCollapsed) {
                interfaceElement.classList.remove('expanded');
                interfaceElement.querySelector('.interface-status').textContent = '';
            } else {
                interfaceElement.classList.add('expanded');
                interfaceElement.querySelector('.interface-status').textContent = '';
            }
        }
    }

    function initializeInterface() {
        const interfaceContainer = document.createElement('div');
        interfaceContainer.innerHTML = `
            <style>
                .enhancer-interface {
                    position: fixed;
                    right: 10px;
                    top: 100px;
                    z-index: 999;
                    display: flex;
                    flex-direction: column;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    color: #e0e0e0;
                    width: 260px;
                    user-select: none;
                    border: 1px solid #333;
                    background: rgba(20, 20, 20, 0.9);
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
                }

                .interface-header {
                    padding: 6px 10px;
                    background: #111;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #333;
                }

                .interface-title {
                    font-size: 14px;
                    font-weight: bold;
                    color: #4CAF50;
                }

                .interface-status {
                    font-size: 12px;
                    color: #888;
                }

                .interface-content {
                    display: none;
                    flex-direction: column;
                }

                .enhancer-interface.expanded .interface-content {
                    display: flex;
                }

                .panel {
                    margin: 5px;
                    border: 1px solid #333;
                    background: rgba(30, 30, 30, 0.7);
                }

                .panel-header {
                    padding: 6px 10px;
                    background: #222;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .panel-header:hover {
                    background: #2a2a2a;
                }

                .panel-title {
                    font-weight: bold;
                    color: #4CAF50;
                }

                .panel-arrow {
                    transition: transform 0.2s;
                    color: #888;
                }

                .panel.active .panel-arrow {
                    transform: rotate(90deg);
                }

                .panel-content {
                    display: none;
                    flex-direction: column;
                }

                .panel.active .panel-content {
                    display: flex;
                }

                .control-item {
                    padding: 6px 10px;
                    display: flex;
                    flex-direction: column;
                    background: rgba(40, 40, 40, 0.7);
                    border-bottom: 1px solid #2a2a2a;
                }

                .control-item:last-child {
                    border-bottom: none;
                }

                .control-label {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 5px;
                }

                .control-name {
                    font-weight: bold;
                }

                .value-display {
                    font-size: 12px;
                    font-weight: bold;
                }

                .control-inputs {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .slider-container {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .slider-container input[type="range"] {
                    flex-grow: 1;
                    -webkit-appearance: none;
                    height: 4px;
                    background: #444;
                    outline: none;
                }

                .slider-container input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: #4CAF50;
                    cursor: pointer;
                    border-radius: 50%;
                }

                .slider-container input[type="number"] {
                    width: 50px;
                    text-align: center;
                    background: #333;
                    border: 1px solid #444;
                    color: #fff;
                    padding: 2px;
                    font-size: 12px;
                }

                .action-button {
                    padding: 6px 10px;
                    background: #333;
                    text-align: center;
                    cursor: pointer;
                    border: 1px solid #444;
                    margin: 5px;
                    color: #008000;
                }

                .action-button:hover {
                    background: #3a3a3a;
                }
            </style>
            <div class="enhancer-interface ${config.uiCollapsed ? '' : 'expanded'}">
                <div class="interface-header">
                    <span class="interface-title">Precision Enhancer</span>
                    <span class="interface-status">[${config.uiCollapsed ? '+' : '-'}]</span>
                </div>
                <div class="interface-content">
                    <div class="panel ${config.lastActivePanel === 'Targeting System' ? 'active' : ''}">
                        <div class="panel-header">
                            <span class="panel-title">Targeting System</span>
                            <span class="panel-arrow">▶</span>
                        </div>
                        <div class="panel-content">
                            <div class="control-item" data-config-key="targetingEnabled">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.targetingEnabled}</span>
                                    <span class="value-display" style="color: ${config.targetingEnabled ? '#4CAF50' : '#F44336'}">${config.targetingEnabled ? 'ON' : 'OFF'}</span>
                                </div>
                            </div>

                            <div class="control-item" data-config-key="targetingMode">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.targetingMode}</span>
                                    <span class="value-display" style="color: #4CAF50">${config.targetingMode === 'crosshairProximity' ? 'Crosshair' : 'Distance'}</span>
                                </div>
                            </div>

                            <div class="control-item" data-config-key="smoothTargeting">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.smoothTargeting}</span>
                                    <span class="value-display" style="color: ${config.smoothTargeting ? '#4CAF50' : '#F44336'}">${config.smoothTargeting ? 'ON' : 'OFF'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel ${config.lastActivePanel === 'Visualization' ? 'active' : ''}">
                        <div class="panel-header">
                            <span class="panel-title">Visualization</span>
                            <span class="panel-arrow">▶</span>
                        </div>
                        <div class="panel-content">
                            <div class="control-item" data-config-key="visualizationEnabled">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.visualizationEnabled}</span>
                                    <span class="value-display" style="color: ${config.visualizationEnabled ? '#4CAF50' : '#F44336'}">${config.visualizationEnabled ? 'ON' : 'OFF'}</span>
                                </div>
                            </div>

                            <div class="control-item" data-config-key="trajectoryLines">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.trajectoryLines}</span>
                                    <span class="value-display" style="color: ${config.trajectoryLines ? '#4CAF50' : '#F44336'}">${config.trajectoryLines ? 'ON' : 'OFF'}</span>
                                </div>
                            </div>

                            <div class="control-item" data-config-key="visualizationColor">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.visualizationColor}</span>
                                    <span class="value-display" style="${visualizationPalette[config.visualizationColorIndex].style}">${visualizationPalette[config.visualizationColorIndex].name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel ${config.lastActivePanel === 'Configuration' ? 'active' : ''}">
                        <div class="panel-header">
                            <span class="panel-title">Configuration</span>
                            <span class="panel-arrow">▶</span>
                        </div>
                        <div class="panel-content">
                            <div class="control-item">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.predictionIntensity}</span>
                                </div>
                                <div class="control-inputs">
                                    <div class="slider-container">
                                        <input type="range" id="predictionSlider" min="0" max="1" step="0.01" value="${config.predictionIntensity}">
                                        <input type="number" id="predictionInput" value="${Math.round(config.predictionIntensity * 100)}" min="0" max="100" step="1">
                                    </div>
                                </div>
                            </div>

                            <div class="control-item">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.targetingPrecision}</span>
                                </div>
                                <div class="control-inputs">
                                    <div class="slider-container">
                                        <input type="range" id="precisionSlider" min="1" max="100" step="1" value="${config.targetingPrecision}">
                                        <input type="number" id="precisionInput" value="${config.targetingPrecision}" min="1" max="100" step="1">
                                    </div>
                                </div>
                            </div>

                            <div class="control-item">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.smoothingFactor}</span>
                                </div>
                                <div class="control-inputs">
                                    <div class="slider-container">
                                        <input type="range" id="smoothingSlider" min="1" max="100" step="1" value="${config.smoothingFactor}">
                                        <input type="number" id="smoothingInput" value="${config.smoothingFactor}" min="1" max="100" step="1">
                                    </div>
                                </div>
                            </div>

                            <div class="control-item">
                                <div class="control-label">
                                    <span class="control-name">${featureDescriptions.verticalAdjustment}</span>
                                </div>
                                <div class="control-inputs">
                                    <div class="slider-container">
                                        <input type="range" id="verticalAdjustmentSlider" min="-50" max="50" step="0.25" value="${config.verticalAdjustment}">
                                        <input type="number" id="verticalAdjustmentInput" value="${config.verticalAdjustment}" min="-50" max="50" step="0.25">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panel-header">
                            <span class="panel-title">System</span>
                            <span class="panel-arrow">▶</span>
                        </div>
                        <div class="panel-content">
                            <div class="action-button" id="resetSettings">
                                Reset All Settings
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const panelHeaders = interfaceContainer.querySelectorAll('.panel-header');
        panelHeaders.forEach(header => {
            header.addEventListener('click', function() {
                const panel = this.parentElement;
                const wasActive = panel.classList.contains('active');

                document.querySelectorAll('.panel').forEach(p => {
                    p.classList.remove('active');
                });

                if (!wasActive) {
                    panel.classList.add('active');
                    config.lastActivePanel = this.querySelector('.panel-title').textContent;
                    saveConfiguration();
                } else {
                    config.lastActivePanel = null;
                    saveConfiguration();
                }
            });
        });

        const predictionSlider = interfaceContainer.querySelector('#predictionSlider');
        const predictionInput = interfaceContainer.querySelector('#predictionInput');
        if (predictionSlider && predictionInput) {
            predictionSlider.addEventListener('input', function() {
                config.predictionIntensity = parseFloat(this.value);
                predictionInput.value = Math.round(config.predictionIntensity * 100);
                saveConfiguration();
            });

            predictionInput.addEventListener('change', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value)) {
                    const clampedValue = Math.max(0, Math.min(100, value));
                    config.predictionIntensity = clampedValue / 100;
                    predictionSlider.value = config.predictionIntensity;
                    this.value = clampedValue;
                    saveConfiguration();
                } else {
                    this.value = Math.round(config.predictionIntensity * 100);
                }
            });
        }

        const precisionSlider = interfaceContainer.querySelector('#precisionSlider');
        const precisionInput = interfaceContainer.querySelector('#precisionInput');
        if (precisionSlider && precisionInput) {
            precisionSlider.addEventListener('input', function() {
                config.targetingPrecision = parseInt(this.value);
                precisionInput.value = config.targetingPrecision;
                saveConfiguration();
            });

            precisionInput.addEventListener('change', function() {
                const value = parseInt(this.value);
                if (!isNaN(value)) {
                    const clampedValue = Math.max(1, Math.min(100, value));
                    config.targetingPrecision = clampedValue;
                    precisionSlider.value = clampedValue;
                    this.value = clampedValue;
                    saveConfiguration();
                } else {
                    this.value = config.targetingPrecision;
                }
            });
        }

        const smoothingSlider = interfaceContainer.querySelector('#smoothingSlider');
        const smoothingInput = interfaceContainer.querySelector('#smoothingInput');
        if (smoothingSlider && smoothingInput) {
            smoothingSlider.addEventListener('input', function() {
                config.smoothingFactor = parseInt(this.value);
                smoothingInput.value = config.smoothingFactor;
                saveConfiguration();
            });

            smoothingInput.addEventListener('change', function() {
                const value = parseInt(this.value);
                if (!isNaN(value)) {
                    const clampedValue = Math.max(1, Math.min(100, value));
                    config.smoothingFactor = clampedValue;
                    smoothingSlider.value = clampedValue;
                    this.value = clampedValue;
                    saveConfiguration();
                } else {
                    this.value = config.smoothingFactor;
                }
            });
        }

        const verticalAdjustmentSlider = interfaceContainer.querySelector('#verticalAdjustmentSlider');
        const verticalAdjustmentInput = interfaceContainer.querySelector('#verticalAdjustmentInput');
        if (verticalAdjustmentSlider && verticalAdjustmentInput) {
            verticalAdjustmentSlider.addEventListener('input', function() {
                config.verticalAdjustment = parseFloat(this.value);
                verticalAdjustmentInput.value = config.verticalAdjustment;
                saveConfiguration();
            });

            verticalAdjustmentInput.addEventListener('change', function() {
                const value = parseFloat(this.value);
                if (!isNaN(value)) {
                    const clampedValue = Math.max(-50, Math.min(50, value));
                    config.verticalAdjustment = clampedValue;
                    verticalAdjustmentSlider.value = clampedValue;
                    this.value = clampedValue;
                    saveConfiguration();
                } else {
                    this.value = config.verticalAdjustment;
                }
            });
        }

        const resetButton = interfaceContainer.querySelector('#resetSettings');
        if (resetButton) {
            resetButton.addEventListener('click', restoreDefaultConfiguration);
        }

        const interfaceHeader = interfaceContainer.querySelector('.interface-header');
        let isDragging = false;
        let startX, startY, initialX, initialY;

        interfaceHeader.addEventListener('mousedown', function(e) {
            if (e.button === 0) {
                isDragging = true;
                startX = e.clientX;
                startY = e.clientY;
                const rect = interfaceContainer.querySelector('.enhancer-interface').getBoundingClientRect();
                initialX = rect.left;
                initialY = rect.top;
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        });

        function onMouseMove(e) {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newX = initialX + dx;
            let newY = initialY + dy;

            const maxX = window.innerWidth - interfaceContainer.querySelector('.enhancer-interface').offsetWidth;
            const maxY = window.innerHeight - interfaceContainer.querySelector('.enhancer-interface').offsetHeight;
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));

            interfaceContainer.querySelector('.enhancer-interface').style.left = `${newX}px`;
            interfaceContainer.querySelector('.enhancer-interface').style.top = `${newY}px`;
        }

        function onMouseUp() {
            if (isDragging) {
                isDragging = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
        }

        document.body.appendChild(interfaceContainer);
        updateInterfaceVisibility();
    }

    function systemLoop() {
        systemUtils.requestFrame.call(systemUtils.window, systemLoop);

        if (!sceneContext && !initializationTimer) {
            const loadingElement = systemUtils.querySelector.call(
                systemUtils.document, '#loadingBg'
            );
            if (loadingElement && loadingElement.style.display === 'none') {
                systemUtils.log('Starting initialization sequence');
                initializationTimer = systemUtils.setTimeout.call(systemUtils.window, () => {
                    systemUtils.log('System injection complete');
                    systemUtils.arrayProto.push = sceneDetector;
                }, 2000);
            }
        }

        if (sceneContext === undefined || !sceneContext.children) return;

        const playerEntities = [];
        let localPlayer;

        for (let i = 0; i < sceneContext.children.length; i++) {
            const entity = sceneContext.children[i];
            if (entity.type === 'Object3D') {
                try {
                    if (entity.children[0].children[0].type === 'PerspectiveCamera') {
                        localPlayer = entity;
                    } else {
                        playerEntities.push(entity);
                    }
                } catch (err) {}
            } else if (entity.material) {
                entity.material.wireframe = false;
            }
        }

        if (!localPlayer) {
            systemUtils.log('Local player not detected, reinitializing...');
            systemUtils.arrayProto.push = sceneDetector;
            return;
        }

        let positionCounter = 0;
        let currentTarget;
        let minimumDistance = Infinity;

        tempTransform.matrix.copy(localPlayer.matrix).invert();

        const currentPositions = {};
        for (let i = 0; i < playerEntities.length; i++) {
            const entity = playerEntities[i];
            currentPositions[entity.id] = entity.position.clone();
        }

        for (let i = 0; i < playerEntities.length; i++) {
            const entity = playerEntities[i];

            if (!entity.visualizationBox) {
                const visualizationBox = new ThreeDEngine.LineSegments(
                    playerGeometry,
                    visualizationMaterial
                );
                visualizationBox.frustumCulled = false;
                entity.add(visualizationBox);
                entity.visualizationBox = visualizationBox;
            }

            if (entity.position.x === localPlayer.position.x &&
                entity.position.z === localPlayer.position.z) {
                entity.visualizationBox.visible = false;
                if (trajectoryVisual.parent !== entity) {
                    entity.add(trajectoryVisual);
                }
                continue;
            }

            trajectoryPositions.setXYZ(positionCounter++, 0, 10, -5);
            vectorCache1.copy(entity.position);
            vectorCache1.y += 9;
            vectorCache1.applyMatrix4(tempTransform.matrix);
            trajectoryPositions.setXYZ(
                positionCounter++,
                vectorCache1.x,
                vectorCache1.y,
                vectorCache1.z
            );

            entity.visible = config.visualizationEnabled || entity.visible;
            entity.visualizationBox.visible = config.visualizationEnabled;

            let predictedPosition = entity.position.clone();
            if (targetPositionHistory[entity.id]) {
                const velocity = new ThreeDEngine.Vector3().subVectors(
                    currentPositions[entity.id],
                    targetPositionHistory[entity.id]
                );
                predictedPosition.add(velocity.multiplyScalar(config.predictionIntensity));
            }

            if (config.targetingMode === 'distanceProximity') {
                const dx = predictedPosition.x - localPlayer.position.x;
                const dy = predictedPosition.y - localPlayer.position.y;
                const dz = predictedPosition.z - localPlayer.position.z;
                const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

                if (distance < minimumDistance && !targetLockActive) {
                    currentTarget = entity;
                    minimumDistance = distance;
                }
            } else if (config.targetingMode === 'crosshairProximity') {
                vectorCache1.copy(predictedPosition);
                vectorCache1.y += config.verticalAdjustment;

                const viewCamera = localPlayer.children[0].children[0];
                vectorCache1.project(viewCamera);

                const dx = vectorCache1.x;
                const dy = vectorCache1.y;
                const screenDistance = Math.sqrt(dx * dx + dy * dy);

                const playerForward = new ThreeDEngine.Vector3(0, 0, -1)
                    .applyQuaternion(localPlayer.quaternion);
                const toTarget = new ThreeDEngine.Vector3()
                    .subVectors(predictedPosition, localPlayer.position)
                    .normalize();
                const angle = Math.acos(playerForward.dot(toTarget)) * (180 / Math.PI);

                if (screenDistance < minimumDistance &&
                    !targetLockActive &&
                    angle < 90) {
                    currentTarget = entity;
                    minimumDistance = screenDistance;
                }
            }
        }

        targetPositionHistory = currentPositions;

        trajectoryPositions.needsUpdate = true;
        trajectoryVisual.geometry.setDrawRange(0, positionCounter);
        trajectoryVisual.visible = config.trajectoryLines;

        if (!rightMouseActive || !config.targetingEnabled) return;

        if (!targetLockActive) {
            lockedTarget = currentTarget;
            targetLockActive = true;
        }

        if (lockedTarget && !sceneContext.children.includes(lockedTarget)) {
            targetLockActive = false;
            lockedTarget = null;
            return;
        }

        if (lockedTarget === undefined) return;

        const currentTime = performance.now();
        const timeDelta = Math.min(50, currentTime - lastTargetingTime) / 1000;
        lastTargetingTime = currentTime;

        if (lockedTarget.children[0] &&
            lockedTarget.children[0].children[0] &&
            lockedTarget.children[0].children[0].type === 'PerspectiveCamera') {
            const headPosition = new ThreeDEngine.Vector3();
            lockedTarget.children[0].children[0].getWorldPosition(headPosition);

            if (targetPositionHistory[lockedTarget.id]) {
                const velocity = new ThreeDEngine.Vector3().subVectors(
                    currentPositions[lockedTarget.id],
                    targetPositionHistory[lockedTarget.id]
                );
                headPosition.add(velocity.multiplyScalar(config.predictionIntensity));
            }

            const direction = new ThreeDEngine.Vector3()
                .subVectors(headPosition, localPlayer.position)
                .normalize();

            if (config.targetingPrecision < 100) {
                const accuracyFactor = (100 - config.targetingPrecision) / 1000;
                direction.x += (Math.random() * 2 - 1) * accuracyFactor;
                direction.y += (Math.random() * 2 - 1) * accuracyFactor;
                direction.z += (Math.random() * 2 - 1) * accuracyFactor;
                direction.normalize();
            }

            const targetRotation = new ThreeDEngine.Quaternion();
            targetRotation.setFromUnitVectors(new ThreeDEngine.Vector3(0, 0, -1), direction);

            if (config.smoothTargeting) {
                const currentRotation = localPlayer.quaternion.clone();
                const t = Math.min(1, timeDelta * (config.smoothingFactor / 5));

                if (currentRotation.dot(targetRotation) < 0) {
                    targetRotation.negate();
                }

                localPlayer.quaternion.slerp(targetRotation, t);
            } else {
                localPlayer.quaternion.copy(targetRotation);
            }
        } else {
            let predictedPosition = lockedTarget.position.clone();
            if (targetPositionHistory[lockedTarget.id]) {
                const velocity = new ThreeDEngine.Vector3().subVectors(
                    currentPositions[lockedTarget.id],
                    targetPositionHistory[lockedTarget.id]
                );
                predictedPosition.add(velocity.multiplyScalar(config.predictionIntensity));
            }

            vectorCache1.copy(predictedPosition);
            vectorCache1.y += config.verticalAdjustment;
            tempTransform.position.copy(localPlayer.position);
            tempTransform.lookAt(vectorCache1);

            if (config.targetingPrecision < 100) {
                const accuracyFactor = (100 - config.targetingPrecision) / 1000;
                tempTransform.rotation.x += (Math.random() * 2 - 1) * accuracyFactor;
                tempTransform.rotation.y += (Math.random() * 2 - 1) * accuracyFactor;
            }

            if (config.smoothTargeting) {
                const t = Math.min(1, timeDelta * (config.smoothingFactor / 5));

                const currentXRot = localPlayer.children[0].rotation.x;
                const targetXRot = -tempTransform.rotation.x;
                localPlayer.children[0].rotation.x = currentXRot + (targetXRot - currentXRot) * t;

                const currentYRot = localPlayer.rotation.y;
                const targetYRot = tempTransform.rotation.y + Math.PI;

                let diff = targetYRot - currentYRot;
                if (diff > Math.PI) diff -= 2 * Math.PI;
                if (diff < -Math.PI) diff += 2 * Math.PI;

                localPlayer.rotation.y = currentYRot + diff * t;
            } else {
                localPlayer.children[0].rotation.x = -tempTransform.rotation.x;
                localPlayer.rotation.y = tempTransform.rotation.y + Math.PI;
            }
        }
    }

    // Initialize event listeners
    window.addEventListener('DOMContentLoaded', function() {
        initializeInterface();
    });

    // Start the system
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    window.addEventListener('mouseup', handlePointerUp);
    window.addEventListener('blur', function() {
        rightMouseActive = false;
        targetLockActive = false;
        lockedTarget = null;
    });
    window.addEventListener('contextmenu', function(e) {
        if (e.button === 2) e.preventDefault();
    });

    window.addEventListener('keydown', function(event) {
        if (systemUtils.document.activeElement &&
            systemUtils.document.activeElement.value !== undefined) return;

        if (event.code === 'BracketLeft') {
            config.verticalAdjustment = Math.max(-50, config.verticalAdjustment - 0.25);
            updateVerticalAdjustmentDisplay();
            saveConfiguration();
        } else if (event.code === 'BracketRight') {
            config.verticalAdjustment = Math.min(50, config.verticalAdjustment + 0.25);
            updateVerticalAdjustmentDisplay();
            saveConfiguration();
        }
    });

    window.addEventListener('keyup', function(event) {
        if (systemUtils.document.activeElement &&
            systemUtils.document.activeElement.value !== undefined) return;

        if (keyBindings[event.code]) {
            if (event.code === 'Digit2') {
                switchTargetingMode();
            } else if (event.code === 'Backslash') {
                toggleInterface();
            } else if (event.code === 'KeyC') {
                updateVisualizationColor();
            } else if (event.code === 'Digit3') {
                toggleConfiguration('smoothTargeting');
            } else {
                toggleConfiguration(keyBindings[event.code]);
            }
        }
    });

    // Start the main loop
    systemLoop();
})();