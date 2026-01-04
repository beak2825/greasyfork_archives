// ==UserScript==
// @name         Gyropad
// @namespace    https://github.com/aortizu/gyropad
// @version      1.0.4
// @description  Simulate a gamepad with the device's gyroscope
// @license      MIT
// @author       Reklaw
// @match        https://play.geforcenow.com/*
// @match        https://www.xbox.com/*/play*
// @match        https://cloud.boosteroid.com/*
// @icon         https://icons.iconarchive.com/icons/paomedia/small-n-flat/72/gamepad-icon.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526617/Gyropad.user.js
// @updateURL https://update.greasyfork.org/scripts/526617/Gyropad.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const MAX_ANGLE = 45;
    const MOVEMENT_THRESHOLD = 0.03;
    const DEFAULT_OPACITY = 0.3;
    const STICK_RADIUS = 45;
    const realGamepads = navigator.getGamepads.bind(navigator);
    const clamp = (num, min, max) => Math.max(min, Math.min(num, max));
    let enabled = true;
    let horizontal = false;
    let vertical = false;
    let controllerEnable = false;
    let showConfigController = false;
    let deadzone = 0.1;
    let alpha = 0.1;
    let smoothedX = 0;
    let smoothedY = 0;
    let isRight = true;
    let leftStickMoved = false;
    let rightStickMoved = false;
    let trigger = -1;
    let posX = 0;
    let posY = 0;
    let scale = 1;
    let elementSelected = null;
    let toggleButton = null;
    let opacity = DEFAULT_OPACITY;
    let simulatedStick = { x1: 0.0, y1: 0.0, x2: 0.0, y2: 0.0 };
    let simulatedGamepad = {
        id: "Xbox One Game Controller (STANDARD GAMEPAD)",
        index: 0,
        connected: true,
        mapping: "standard",
        buttons: Array(17).fill({ pressed: false, touched: false, value: 0 }),
        axes: [0,0,0,0,0,0],
        timestamp: 0.0,
        vibrationActuator: null
    };

    const createButton = (text, styles, eventListeners) => {
        const button = document.createElement('button');
        button.textContent = text;
        Object.assign(button.style, styles);
        for (const event in eventListeners) {
            button.addEventListener(event, eventListeners[event]);
        }
        return button;
    };

    function setTrigger(triggerValue) {
        trigger = triggerValue;
        enabled = trigger < 0;
    }

    navigator.getGamepads = function () {
        const gamepads = realGamepads();
        let gamepadList = [...gamepads];
        if (gamepads[0] && !controllerEnable) {
            const gamepad = gamepads[0];
            toggleButton.style.background = enabled ? "#00A86B" : "#FF4D4D";
            simulatedGamepad.buttons = gamepad.buttons.map(btn => ({ pressed: btn.pressed, value: btn.value }));
            simulatedGamepad.axes = [...gamepad.axes];
            simulatedGamepad.timestamp = performance.now();
            const isUsingRightStick = isRight;
            const stickX = gamepad.axes[isUsingRightStick ? 2 : 0];
            const stickY = gamepad.axes[isUsingRightStick ? 3 : 1];
            const stickMoved = Math.abs(stickX) > MOVEMENT_THRESHOLD || Math.abs(stickY) > MOVEMENT_THRESHOLD;
            if (!stickMoved && (enabled || trigger === -1)) {
                simulatedGamepad.axes[isUsingRightStick ? 2 : 0] = simulatedStick[isUsingRightStick ? 'x2' : 'x1'];
                simulatedGamepad.axes[isUsingRightStick ? 3 : 1] = simulatedStick[isUsingRightStick ? 'y2' : 'y1'];
                simulatedGamepad.timestamp = performance.now();
            }
        } else if (controllerEnable) {
            toggleButton.style.background = enabled ? "#00A86B" : "#FF4D4D";
            simulatedGamepad.axes = [simulatedStick.x1, simulatedStick.y1, simulatedStick.x2, simulatedStick.y2,0,0];
            simulatedGamepad.timestamp = performance.now();
            //gamepadList[0] = simulatedGamepad;
        }
        return [simulatedGamepad];
    };

    function gameLoop() {
        const gamepads = navigator.getGamepads();
        if (gamepads[0] && trigger !== -1 && gamepads[0].buttons[trigger]) {
            const currentPressed = gamepads[0].buttons[trigger].pressed;
            if(currentPressed){
                enabled = true;
            }else{
                enabled = false;
            }
        }
        requestAnimationFrame(gameLoop);
    }

    function handleDeviceMotion(event) {
        if (!enabled) return;
        const smoothFactor = 1.1 - alpha;
        let rawX = event.rotationRate.alpha || 0;
        let rawY = event.rotationRate.beta || 0;
        rawX = Math.abs(rawX) < deadzone ? 0 : rawX;
        rawY = Math.abs(rawY) < deadzone ? 0 : rawY;
        smoothedX = smoothFactor * rawX + (1 - smoothFactor) * smoothedX;
        smoothedY = smoothFactor * rawY + (1 - smoothFactor) * smoothedY;
        let normX = clamp(smoothedX / MAX_ANGLE, -1, 1);
        let normY = clamp(smoothedY / MAX_ANGLE, -1, 1);
        normX = horizontal ? -normX : normX;
        normY = vertical ? -normY : normY;
        if (isRight) {
            simulatedStick.x2 = normX;
            simulatedStick.y2 = normY;
        } else {
            simulatedStick.x1 = normX;
            simulatedStick.y1 = normY;
        }
    }

    if (DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === "function") {
        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {
            if (permissionState === "granted") {
                window.addEventListener("devicemotion", handleDeviceMotion);
            } else {
                console.error("Permission denied to access the gyroscope");
            }
        })
            .catch(console.error);
    } else {
        window.addEventListener("devicemotion", handleDeviceMotion);
    }

    gameLoop();

    function createUI() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const containerStyles = {
            position: "fixed",
            top: "10px",
            right: "10px",
            width: "40%",
            padding: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            borderRadius: "10px",
            fontFamily: "Arial, sans-serif",
            fontSize: "3vh",
            zIndex: "9999",
            textAlign: "center",
            boxShadow: "0px 0px 10px rgba(255,255,255,0.2)",
            display: "none"
        };
        const elementsStyles = {
            position: "relative",
            background: "rgba(0,0,0,0)",
            color: "white",
            fontFamily: "Arial, sans-serif",
            fontSize: "3vh",
            zIndex: "9999",
            textAlign: "center",
            maxHeight: "70vh",
            overflowY: "auto"
        };
        const buttonStyles = {
            marginTop: "10px",
            width: "100%",
            background: "#009CDA",
            color: "white",
            border: "none",
            padding: "5px",
            cursor: "pointer"
        };
        const inputStyles = {
            width: "100%"
        };
        const selectStyles = {
            width: "100%",
            marginTop: "5px",
            backgroundColor: "#444",
            color: "white"
        };

        let uiContainer = document.createElement("div");
        uiContainer.id = "gamepad-ui";
        Object.assign(uiContainer.style, containerStyles);

        let uiElements = document.createElement("div");
        uiElements.id = "elements-ui";
        Object.assign(uiElements.style, elementsStyles);

        let closeButton = createButton("❌", {
            fontSize: "4vh",
            textAlign: "left",
            paddingLeft: "10px",
            width: "100%",
            background: "#00000000",
            color: "white",
            border: "none",
            cursor: "pointer"
        }, {
            click: () => {
                uiContainer.style.display = "none";
            }
        });

        let sensitivityLabel = document.createElement("label");
        sensitivityLabel.textContent = "Smoth Factor: " + Math.round((alpha * 10));
        sensitivityLabel.style.marginTop = "10px";
        let sensitivityInput = document.createElement("input");
        sensitivityInput.type = "range";
        sensitivityInput.min = "0.1";
        sensitivityInput.max = "1";
        sensitivityInput.step = "0.1";
        sensitivityInput.value = alpha;
        Object.assign(sensitivityInput.style, inputStyles);
        sensitivityInput.oninput = function () {
            alpha = parseFloat(this.value);
            sensitivityLabel.textContent = "Smoth Factor: " + Math.round(alpha * 10);
        };

        let deadzoneLabel = document.createElement("label");
        deadzoneLabel.textContent = "Dead Zone: " + deadzone * 10;
        let deadzoneInput = document.createElement("input");
        deadzoneInput.type = "range";
        deadzoneInput.min = "0.1";
        deadzoneInput.max = "1";
        deadzoneInput.step = "0.1";
        deadzoneInput.value = deadzone;
        Object.assign(deadzoneInput.style, inputStyles);
        deadzoneInput.oninput = function () {
            deadzone = parseFloat(this.value);
            deadzoneLabel.textContent = "Dead Zone: " + deadzone * 10;
        };

        let stickButton = createButton(isRight ? "Use Right Stick 🕹️➡️" : "Use Left Stick 🕹️⬅️", buttonStyles, {
            click: () => {
                isRight = !isRight;
                stickButton.textContent = isRight ? "Use Right Stick 🕹️➡️" : "Use Left Stick 🕹️⬅️";
            }
        });

        let horizontalButton = createButton(
            `Reverse Horizontal: ${horizontal ? "ON 🔃↕️✅" : "OFF 🔃↕️🚫"}`,
            { ...buttonStyles, background: horizontal ? "#00A86B" : "#FF4D4D" },
            {
                click: () => {
                    horizontal = !horizontal;
                    horizontalButton.textContent = `Reverse Horizontal: ${horizontal ? "ON 🔃↕️✅" : "OFF 🔃↕️🚫"}`;
                    horizontalButton.style.background = horizontal ? "#00A86B" : "#FF4D4D";
                }
            }
        );

        let verticalButton = createButton(
            `Reverse Vertical: ${vertical ? "ON 🔃↔️✅" : "OFF 🔃↔️🚫"}`,
            { ...buttonStyles, background: vertical ? "#00A86B" : "#FF4D4D", marginBottom: "10px" },
            {
                click: () => {
                    vertical = !vertical;
                    verticalButton.textContent = `Reverse Vertical: ${vertical ? "ON 🔃↔️✅" : "OFF 🔃↔️🚫"}`;
                    verticalButton.style.background = vertical ? "#00A86B" : "#FF4D4D";
                }
            }
        );

        let buttonLabel = document.createElement("label");
        buttonLabel.textContent = "Trigger Button:";
        let triggerSelect = document.createElement("select");
        Object.assign(triggerSelect.style, selectStyles);
        let buttonNames = [
            "🚫-DISABLED-🚫", "A", "B", "X", "Y", "LB", "RB", "LT", "RT", "SELECT", "START", "LS", "RS",
            "DPAD UP", "DPAD DOWN", "DPAD LEFT", "DPAD RIGHT",
        ];

        buttonNames.forEach((btnName, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = btnName;
            triggerSelect.appendChild(option);
        });

        triggerSelect.onchange = function () {
            let value = parseInt(this.value);
            setTrigger(value - 1);
            enabled = trigger === -1 ? true : false;
            toggleButton.style.background = enabled ? "#00A86B" : "#FF4D4D";
        };

        let toggleEnabledButton = createButton(
            enabled ? "Disable Gyroscope 🚫" : "Activate Gyroscope 🔄",
            { ...buttonStyles, background: enabled ? "#FF4D4D" : "#00A86B", marginBottom: "10px" },
            {
                click: () => {
                    enabled = !enabled;
                    toggleEnabledButton.textContent = enabled ? "Disable Gyroscope 🚫" : "Activate Gyroscope 🔄";
                    toggleEnabledButton.style.background = enabled ? "#FF4D4D" : "#00A86B";
                    sensitivityLabel.style.display = enabled ? "block" : "none";
                    sensitivityInput.style.display = enabled ? "block" : "none";
                    deadzoneLabel.style.display = enabled ? "block" : "none";
                    deadzoneInput.style.display = enabled ? "block" : "none";
                    stickButton.style.display = enabled ? "block" : "none";
                    horizontalButton.style.display = enabled ? "block" : "none";
                    verticalButton.style.display = enabled ? "block" : "none";
                    buttonLabel.style.display = enabled ? "block" : "none";
                    triggerSelect.style.display = enabled ? "block" : "none";
                }
            }
        );

        let enableController = createButton(
            controllerEnable ? "Disable Virtual Controller 🎮" : "Activate Virtual Controller 🎮",
            { ...buttonStyles, background: controllerEnable ? "#00A86B" : "#FF4D4D" },
            {
                click: () => {
                    if (screen.orientation.type.includes('landscape')) {
                        let gamepads = realGamepads();
                        if (gamepads[0]) {
                            showToast("There Is A Real Gamepad Connected 🎮 So Virtual Gamepad is Not Available 🚫");
                        } else {
                            controllerEnable = !controllerEnable;
                            if (controllerEnable) {
                                if (window.location.hostname === "cloud.boosteroid.com") {
                                    const event = new Event("gamepadconnected");
                                    Object.defineProperty(event, "gamepad", { value: simulatedGamepad, configurable: true });
                                    window.dispatchEvent(event);
                                }
                                showControls();
                            } else {
                                if (window.location.hostname === "cloud.boosteroid.com") {
                                    const event = new Event("gamepaddisconnected");
                                    Object.defineProperty(event, "gamepad", { value: simulatedGamepad, configurable: true });
                                    window.dispatchEvent(event);
                                }
                                hideControls();
                            }
                        }
                    } else {
                        showToast("Only In Landscape Orientation");
                    }
                }
            }
        );

        // configController Button to toggle "enabled"
        let configController = createButton(
            showConfigController ? "Close Controller Config ⚙️" : "Open Controller Config ⚙️",
            { ...buttonStyles, background: "#009CDA", display: "none" },
            {
                click: () => {
                    showConfigController = !showConfigController;
                    configController.textContent = showConfigController ? "Close Controller Config ⚙️" : "Open Controller Config ⚙️";
                    uiControllerContainer.style.display = showConfigController ? "block" : "none";
                }
            }
        );

        const createVirtualButton = (text, color, bottom, right, eventListeners) => {
            const button = createButton(text, {
                background: "#444",
                opacity: DEFAULT_OPACITY,
                position: "fixed",
                width: "10vh",
                height: "10vh",
                borderRadius: "50%",
                border: "none",
                color: color,
                fontSize: "3vh",
                fontFamily: "Arial, sans-serif",
                userSelect: "none",
                display: "none",
                bottom: bottom,
                right: right,
                textAlign: "center",
                zIndex: "9000",
            }, eventListeners);

            const touchStartHandler = (e) => {
                e.preventDefault();
                button.style.filter = "brightness(150%)";
                button.style.transform = "scale(0.95)";
                button.style.transition = "all 0.1s";
                const buttonIndex = getButtonIndex(text);
                simulatedGamepad.buttons[buttonIndex] = { pressed: true, touched: true, value: 1 };
                simulatedGamepad.timestamp = performance.now();
                if (trigger === buttonIndex) {
                    enabled = true;
                }
            };

            const touchEndHandler = (e) => {
                e.preventDefault();
                button.style.filter = "brightness(100%)";
                button.style.transform = "scale(1)";
                const buttonIndex = getButtonIndex(text);
                simulatedGamepad.buttons[buttonIndex] = { pressed: false, touched: false, value: 0 };
                simulatedGamepad.timestamp = performance.now();
                if (trigger === buttonIndex) {
                    enabled = false;
                }
            };

            button.addEventListener('touchstart', touchStartHandler);
            button.addEventListener('touchend', touchEndHandler);

            return button;
        };

        const getButtonIndex = (buttonText) => {
            switch (buttonText) {
                case "A": return 0;
                case "B": return 1;
                case "X": return 2;
                case "Y": return 3;
                case "LB": return 4;
                case "RB": return 5;
                case "LT": return 6;
                case "RT": return 7;
                case "SELECT": return 8;
                case "START": return 9;
                case "L3": return 10;
                case "R3": return 11;
                case "↑": return 12;
                case "↓": return 13;
                case "←": return 14;
                case "→": return 15;
                default: return -1;
            }
        };

        let buttonA = createVirtualButton("A", "#0F0", "25vh", "20vh");
        let buttonB = createVirtualButton("B", "#F00", "35vh", "10vh");
        let buttonX = createVirtualButton("X", "#00F", "35vh", "30vh");
        let buttonY = createVirtualButton("Y", "#FF0", "45vh", "20vh");
        let down = createVirtualButton("↓", "#FFF", "25vh", null, null);
        down.style.left = "20vh";
        down.style.borderRadius = "10%";
        let right = createVirtualButton("→", "#FFF", "35vh", null, null);
        right.style.left = "30vh";
        right.style.borderRadius = "10%";
        let left = createVirtualButton("←", "#FFF", "35vh", null, null);
        left.style.left = "10vh";
        left.style.borderRadius = "10%";
        let up = createVirtualButton("↑", "#FFF", "45vh", null, null);
        up.style.left = "20vh";
        up.style.borderRadius = "10%";
        let lt = createVirtualButton("LT", "#FFF", "89vh", null, null);
        lt.style.width = "15vw";
        lt.style.left = "3vw";
        lt.style.borderRadius = "10%";
        let rt = createVirtualButton("RT", "#FFF", "89vh", null, null);
        rt.style.width = "15vw";
        rt.style.right = "3vw";
        rt.style.borderRadius = "10%";
        let lb = createVirtualButton("LB", "#FFF", "75vh", null, null);
        lb.style.width = "15vw";
        lb.style.left = "3vw";
        lb.style.borderRadius = "10%";
        let rb = createVirtualButton("RB", "#FFF", "75vh", null, null);
        rb.style.width = "15vw";
        rb.style.right = "3vw";
        rb.style.borderRadius = "10%";
        let start = createVirtualButton("START", "#FFF", "8vh", null, null);
        start.style.width = "8vw";
        start.style.right = "40vw";
        start.style.height = "4vh";
        start.style.borderRadius = "10%";
        let select = createVirtualButton("SELECT", "#FFF", "8vh", null, null);
        select.style.width = "8vw";
        select.style.left = "40vw";
        select.style.height = "4vh";
        select.style.borderRadius = "10%";
        let l3 = createVirtualButton("L3", "#FFF", "8vh", null, null);
        l3.style.left = "10vh";
        l3.style.borderRadius = "10%";
        let r3 = createVirtualButton("R3", "#FFF", "8vh", null, null);
        r3.style.right = "10vh";
        r3.style.borderRadius = "10%";

        const createStickContainer = (isLeft) => {
            const container = document.createElement('div');
            container.style.position = "fixed";
            container.style.width = "12vw";
            container.style.height = "12vw";
            container.style.background = "#444";
            container.style.opacity = DEFAULT_OPACITY;
            container.style.borderRadius = "50%";
            container.style.bottom = "8vh";
            container.style[isLeft ? 'left' : 'right'] = "20vw";
            container.style.display = "none";
            container.style.zIndex = "9000";
            const stick = document.createElement('div');
            stick.style.position = "absolute";
            stick.style.width = "50%";
            stick.style.height = "50%";
            stick.style.background = "#fff";
            stick.style.opacity = DEFAULT_OPACITY;
            stick.style.borderRadius = "50%";
            stick.style.display = "flex";
            stick.style.justifyContent = "center";
            stick.style.alignItems = "center";
            stick.style.left = "25%";
            stick.style.top = "25%";
            stick.style.transition = "transform 0.1s";
            stick.style.touchAction = "none";
            let activeTouch = null;
            let stickMoved = false;
            container.addEventListener('touchstart', (e) => {
                e.preventDefault();
                for (let touch of e.touches) {
                    if (container.contains(touch.target)) {
                        activeTouch = touch;
                        break;
                    }
                }
                stickMoved = true;
                container.style.filter = "brightness(150%)";
                container.style.transform = "scale(0.95)";
                container.style.transition = "all 0.1s";
            });
            container.addEventListener('touchmove', (e) => {
                if (!activeTouch) return;
                stick.style.transition = "none";
                const containerRect = container.getBoundingClientRect();
                const centerX = containerRect.width / 2;
                const centerY = containerRect.height / 2;
                const touch = Array.from(e.touches).find(t => t.identifier === activeTouch.identifier);

                if (touch) {
                    const dx = touch.clientX - containerRect.left - centerX;
                    const dy = touch.clientY - containerRect.top - centerY;

                    let normX = dx / STICK_RADIUS;
                    let normY = dy / STICK_RADIUS;

                    const magnitude = Math.hypot(normX, normY);
                    if (magnitude > 1) {
                        normX /= magnitude;
                        normY /= magnitude;
                    }

                    const realDistance = Math.hypot(dx, dy);
                    const clampedDistance = Math.min(realDistance, STICK_RADIUS);
                    const angle = Math.atan2(dy, dx);
                    const dispX = Math.cos(angle) * clampedDistance;
                    const dispY = Math.sin(angle) * clampedDistance;

                    stick.style.transform = `translate(${dispX}px, ${dispY}px)`;
                    simulatedStick[isLeft ? 'x1' : 'x2'] = normX;
                    simulatedStick[isLeft ? 'y1' : 'y2'] = normY;
                    simulatedGamepad.timestamp = performance.now();
                }
            });
            container.addEventListener('touchend', (e) => {
                activeTouch = null;
                stick.style.transition = "all 0.1s";
                stick.style.transform = 'translate(0, 0)';
                container.style.filter = "brightness(100%)";
                container.style.transform = "scale(1)";
                simulatedStick[isLeft ? 'x1' : 'x2'] = 0;
                simulatedStick[isLeft ? 'y1' : 'y2'] = 0;
                simulatedGamepad.timestamp = performance.now();
                stickMoved = false;
            });
            container.appendChild(stick);
            return container;
        };

        let stickRightContainer = createStickContainer(false);
        let stickLeftContainer = createStickContainer(true);

        let uiControllerContainer = document.createElement("div");
        uiControllerContainer.id = "controls-ui";
        Object.assign(uiControllerContainer.style, {
            position: "fixed",
            top: "10px",
            left: "10px",
            width: "30%",
            padding: "10px",
            background: "rgba(0,0,0,0.8)",
            color: "white",
            borderRadius: "10px",
            fontFamily: "Arial, sans-serif",
            fontSize: "3vh",
            zIndex: "9999",
            textAlign: "center",
            boxShadow: "0px 0px 10px rgba(255,255,255,0.2)",
            display: "none",
            maxHeight: "80vh",
            overflowY: "auto"
        });

        let closeControllerButton = createButton("❌", {
            fontSize: "4vh",
            textAlign: "right",
            paddingRight: "10px",
            width: "100%",
            background: "#0000",
            color: "white",
            border: "none",
            cursor: "pointer"
        }, {
            click: () => {
                showConfigController = !showConfigController;
                positionXLabel.style.display = "none";
                positionYLabel.style.display = "none";
                positionXInput.style.display = "none";
                positionYInput.style.display = "none";
                sizeLabel.style.display = "none";
                sizeInput.style.display = "none";
                if (elementSelected) {
                    elementSelected.style.border = "none";
                    elementSelected.style.opacity = opacity;
                    elementSelected = null;
                }
                uiControllerContainer.style.display = "none";
            }
        });

        let opacityLabel = document.createElement("label");
        opacityLabel.textContent = "Opacity: " + Math.round((opacity * 100));
        let opacityInput = document.createElement("input");
        opacityInput.type = "range";
        opacityInput.min = "0";
        opacityInput.max = "1";
        opacityInput.step = "0.01";
        opacityInput.value = opacity;
        Object.assign(opacityInput.style, inputStyles);
        opacityInput.oninput = function () {
            opacity = parseFloat(this.value);
            updateOpacity();
            opacityLabel.textContent = "Opacity: " + Math.round(opacity * 100);
        };

        let elementLabel = document.createElement("label");
        elementLabel.textContent = "Select Element To Modify:";
        let elementSelect = document.createElement("select");
        Object.assign(elementSelect.style, selectStyles);
        let elementsNames = [
            "🚫-NONE-🚫", "A", "B", "X", "Y", "LB", "RB", "LT", "RT", "SELECT", "START", "LS", "RS",
            "DPAD UP", "DPAD DOWN", "DPAD LEFT", "DPAD RIGHT", "RIGHT STICK", "LEFT STICK"
        ];
        elementsNames.forEach((btnName, index) => {
            let option = document.createElement("option");
            option.value = index;
            option.textContent = btnName;
            elementSelect.appendChild(option);
        });
        elementSelect.onchange = function () {
            let value = parseInt(this.value);
            let index = value - 1;
            if (index == -1) {
                positionXLabel.style.display = "none";
                positionYLabel.style.display = "none";
                positionXInput.style.display = "none";
                positionYInput.style.display = "none";
                sizeLabel.style.display = "none";
                sizeInput.style.display = "none";
                if (elementSelected) {
                    elementSelected.style.border = "none";
                    elementSelected.style.opacity = opacity;
                    elementSelected = null;
                }
            } else {
                uiContainer.style.display = "none";
                elementSelected = selectElement(index);
                elementSelected.style.border = "3px solid red";
                elementSelected.style.opacity = 1;
                posX = Math.round(elementSelected.getBoundingClientRect().x);
                posY = Math.round(elementSelected.getBoundingClientRect().y);
                positionXInput.value = posX;
                positionYInput.value = posY;
                positionXLabel.textContent = "Position In X: " + posX;
                positionYLabel.textContent = "Position In Y: " + posY;
                positionXLabel.style.display = "block";
                positionYLabel.style.display = "block";
                positionXInput.style.display = "block";
                positionYInput.style.display = "block";
                sizeLabel.style.display = "block";
                sizeInput.style.display = "block";
            }
        };

        let positionXLabel = document.createElement("label");
        positionXLabel.textContent = "Position In X: " + posX;
        positionXLabel.style.marginTop = "10px";
        positionXLabel.style.display = "none";
        let positionXInput = document.createElement("input");
        positionXInput.type = "range";
        positionXInput.min = "0";
        positionXInput.max = screenWidth;
        positionXInput.step = "1";
        positionXInput.value = posX;
        positionXInput.style.display = "none";
        positionXInput.style.width = "100%";
        positionXInput.oninput = function () {
            posX = parseFloat(this.value);
            elementSelected.style.removeProperty("left");
            elementSelected.style.removeProperty("right");
            elementSelected.style.left = `${posX}px`;
            positionXLabel.textContent = "Position In X: " + posX;
        };

        let positionYLabel = document.createElement("label");
        positionYLabel.textContent = "Position In Y: " + posY;
        positionYLabel.style.marginTop = "10px";
        positionYLabel.style.display = "none";
        let positionYInput = document.createElement("input");
        positionYInput.type = "range";
        positionYInput.min = "0";
        positionYInput.max = screenHeight;
        positionYInput.step = "1";
        positionYInput.value = posY;
        positionYInput.style.display = "none";
        positionYInput.style.width = "100%";
        positionYInput.oninput = function () {
            posY = parseFloat(this.value);
            elementSelected.style.removeProperty("top");
            elementSelected.style.removeProperty("down");
            elementSelected.style.top = `${posY}px`;
            positionYLabel.textContent = "Position In Y: " + posY;
        };

        let sizeLabel = document.createElement("label");
        sizeLabel.textContent = "Scale: " + scale;
        sizeLabel.style.marginTop = "10px";
        sizeLabel.style.display = "none";
        let sizeInput = document.createElement("input");
        sizeInput.type = "range";
        sizeInput.min = "0.5";
        sizeInput.max = "3";
        sizeInput.step = "0.1";
        sizeInput.value = scale;
        sizeInput.style.display = "none";
        sizeInput.style.width = "100%";
        sizeInput.oninput = function () {
            scale = parseFloat(this.value);
            elementSelected.style.removeProperty("top");
            elementSelected.style.removeProperty("down");
            elementSelected.style.transform = `scale(${scale})`;
            sizeLabel.textContent = "Scale: " + scale;
        };

        toggleButton = document.createElement("button");
        toggleButton.textContent = "✜";
        toggleButton.style.position = "fixed";
        toggleButton.style.fontSize = "5vh";
        toggleButton.style.textAlign = "center";
        toggleButton.style.fontFamily = "Arial, sans-serif";
        toggleButton.style.top = "10%";
        toggleButton.style.right = "0vw";
        toggleButton.style.background = enabled ? "#00A86B" : "#FF4D4D";
        toggleButton.style.opacity = 0.5;
        toggleButton.style.color = "#FFF8";
        toggleButton.style.border = "none";
        toggleButton.style.borderRadius = "50%";
        toggleButton.style.width = "8vh";
        toggleButton.style.height = "8vh";
        toggleButton.style.zIndex = "10000";

        function showControls() {
            controllerEnable = true;
            enableController.textContent = controllerEnable ? "Disable Virtual Controller 🎮" : "Activate Virtual Controller 🎮";
            enableController.style.background = controllerEnable ? "#00A86B" : "#FF4D4D";
            configController.style.display = "block";
            buttonA.style.display = "block";
            buttonB.style.display = "block";
            buttonX.style.display = "block";
            buttonY.style.display = "block";
            up.style.display = "block";
            down.style.display = "block";
            left.style.display = "block";
            right.style.display = "block";
            lt.style.display = "block";
            rt.style.display = "block";
            lb.style.display = "block";
            rb.style.display = "block";
            l3.style.display = "block";
            r3.style.display = "block";
            select.style.display = "block";
            start.style.display = "block";
            stickLeftContainer.style.display = "block";
            stickRightContainer.style.display = "block";
        }

        function hideControls() {
            controllerEnable = false;
            enableController.textContent = controllerEnable ? "Disable Virtual Controller 🎮" : "Activate Virtual Controller 🎮";
            enableController.style.background = controllerEnable ? "#00A86B" : "#FF4D4D";
            configController.style.display = "none";
            uiControllerContainer.style.display = "none";
            buttonA.style.display = "none";
            buttonB.style.display = "none";
            buttonX.style.display = "none";
            buttonY.style.display = "none";
            up.style.display = "none";
            down.style.display = "none";
            left.style.display = "none";
            right.style.display = "none";
            lt.style.display = "none";
            rt.style.display = "none";
            lb.style.display = "none";
            rb.style.display = "none";
            l3.style.display = "none";
            r3.style.display = "none";
            select.style.display = "none";
            start.style.display = "none";
            stickLeftContainer.style.display = "none";
            stickRightContainer.style.display = "none";
        }

        function updateOpacity() {
            buttonA.style.opacity = opacity;
            buttonB.style.opacity = opacity;
            buttonX.style.opacity = opacity;
            buttonY.style.opacity = opacity;
            up.style.opacity = opacity;
            down.style.opacity = opacity;
            left.style.opacity = opacity;
            right.style.opacity = opacity;
            lt.style.opacity = opacity;
            rt.style.opacity = opacity;
            lb.style.opacity = opacity;
            rb.style.opacity = opacity;
            l3.style.opacity = opacity;
            r3.style.opacity = opacity;
            select.style.opacity = opacity;
            start.style.opacity = opacity;
            stickLeftContainer.style.opacity = opacity;
            stickRightContainer.style.opacity = opacity;
            toggleButton.style.opacity = opacity;
        }

        function selectElement(element) {
            switch (element) {
                case 0:
                    return buttonA;
                case 1:
                    return buttonB;
                case 2:
                    return buttonX;
                case 3:
                    return buttonY;
                case 4:
                    return lb;
                case 5:
                    return rb;
                case 6:
                    return lt;
                case 7:
                    return rt;
                case 8:
                    return select;
                case 9:
                    return start;
                case 10:
                    return l3;
                case 11:
                    return r3;
                case 12:
                    return up;
                case 13:
                    return down;
                case 14:
                    return left;
                case 15:
                    return right;
                case 16:
                    return stickRightContainer;
                case 17:
                    return stickLeftContainer;
            }
        }

        function showToast(message) {
            const toast = document.createElement("div");
            toast.textContent = message;
            toast.style.position = "fixed";
            toast.style.textAlign = "center";
            toast.style.bottom = "20px";
            toast.style.left = "50%";
            toast.style.transform = "translateX(-50%)";
            toast.style.background = "rgba(0, 0, 0, 0.8)";
            toast.style.color = "white";
            toast.style.padding = "12px 20px";
            toast.style.borderRadius = "8px";
            toast.style.fontSize = "3vh";
            toast.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.3)";
            toast.style.zIndex = "9999";
            toast.style.opacity = "0";
            toast.style.transition = "opacity 0.5s ease-in-out";
            document.body.appendChild(toast);
            setTimeout(() => {
                toast.style.opacity = "1";
            }, 100);
            setTimeout(() => {
                toast.style.opacity = "0";
                setTimeout(() => {
                    toast.remove();
                }, 500);
            }, 5000);

        }

        screen.orientation.addEventListener("change", function () {
            if (screen.orientation.type.includes('portrait')) {
                hideControls();
            }
        });

        toggleButton.ontouchstart = function (event) {
            event.preventDefault();
            let touch = event.touches[0];
            let rect = toggleButton.getBoundingClientRect();
            let shiftX = touch.clientX - rect.left;
            let shiftY = touch.clientY - rect.top;
            let startX = touch.clientX;
            let startY = touch.clientY;
            let moved = false;
            function moveAt(clientX, clientY) {
                toggleButton.style.left = clientX - shiftX + "px";
                toggleButton.style.top = clientY - shiftY + "px";
            }
            function onTouchMove(event) {
                let currentTouch = event.touches[0];
                moveAt(currentTouch.clientX, currentTouch.clientY);
                if (Math.abs(currentTouch.clientX - startX) > 30 ||
                    Math.abs(currentTouch.clientY - startY) > 30) {
                    moved = true;
                }
            }
            function onTouchEnd() {
                document.removeEventListener("touchmove", onTouchMove);
                document.removeEventListener("touchend", onTouchEnd);
                if (!moved) {
                    uiContainer.style.display = "block";
                }
            }
            document.addEventListener("touchmove", onTouchMove);
            document.addEventListener("touchend", onTouchEnd);
        };

        document.addEventListener("fullscreenchange", () => {
            let fullscreenElement = document.getElementById("fullscreen-container") ? document.getElementById("fullscreen-container") : document.getElementById("StreamHud");
            if (fullscreenElement) {
                fullscreenElement.appendChild(toggleButton);
                fullscreenElement.appendChild(uiContainer);
                fullscreenElement.appendChild(buttonA);
                fullscreenElement.appendChild(buttonB);
                fullscreenElement.appendChild(buttonX);
                fullscreenElement.appendChild(buttonY);
                fullscreenElement.appendChild(up);
                fullscreenElement.appendChild(down);
                fullscreenElement.appendChild(right);
                fullscreenElement.appendChild(left);
                fullscreenElement.appendChild(lt);
                fullscreenElement.appendChild(rt);
                fullscreenElement.appendChild(lb);
                fullscreenElement.appendChild(rb);
                fullscreenElement.appendChild(l3);
                fullscreenElement.appendChild(r3);
                fullscreenElement.appendChild(select);
                fullscreenElement.appendChild(start);
                fullscreenElement.appendChild(stickLeftContainer);
                fullscreenElement.appendChild(stickRightContainer);
                fullscreenElement.appendChild(uiControllerContainer);
            }
        });

        uiContainer.appendChild(closeButton);
        uiContainer.appendChild(uiElements);
        uiElements.appendChild(enableController);
        uiElements.appendChild(configController);
        uiElements.appendChild(toggleEnabledButton);
        uiElements.appendChild(sensitivityLabel);
        uiElements.appendChild(sensitivityInput);
        uiElements.appendChild(deadzoneLabel);
        uiElements.appendChild(deadzoneInput);
        uiElements.appendChild(stickButton);
        uiElements.appendChild(horizontalButton);
        uiElements.appendChild(verticalButton);
        uiElements.appendChild(buttonLabel);
        uiElements.appendChild(triggerSelect);
        uiControllerContainer.appendChild(closeControllerButton);
        uiControllerContainer.appendChild(opacityLabel);
        uiControllerContainer.appendChild(opacityInput);
        uiControllerContainer.appendChild(elementLabel);
        uiControllerContainer.appendChild(elementSelect);
        uiControllerContainer.appendChild(positionXLabel);
        uiControllerContainer.appendChild(positionXInput);
        uiControllerContainer.appendChild(positionYLabel);
        uiControllerContainer.appendChild(positionYInput);
        uiControllerContainer.appendChild(sizeLabel);
        uiControllerContainer.appendChild(sizeInput);
        document.body.appendChild(buttonA);
        document.body.appendChild(buttonB);
        document.body.appendChild(buttonX);
        document.body.appendChild(buttonY);
        document.body.appendChild(up);
        document.body.appendChild(down);
        document.body.appendChild(right);
        document.body.appendChild(left);
        document.body.appendChild(lt);
        document.body.appendChild(rt);
        document.body.appendChild(lb);
        document.body.appendChild(rb);
        document.body.appendChild(l3);
        document.body.appendChild(r3);
        document.body.appendChild(select);
        document.body.appendChild(start);
        document.body.appendChild(stickLeftContainer);
        document.body.appendChild(stickRightContainer);
        document.body.appendChild(toggleButton);
        document.body.appendChild(uiContainer);
        document.body.appendChild(uiControllerContainer);
    }
    createUI();
})();
