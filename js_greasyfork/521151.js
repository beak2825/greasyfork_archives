// ==UserScript==
// @name         TypeLapse
// @namespace    https://solanaceae.xyz/
// @version      1.3
// @description  Simulates slow, natural typing to automatically generate content in Google Docs over time
// @author       Solanaceae
// @match        https://docs.google.com/*
// @license      GPLv3
// @icon         https://raw.githubusercontent.com/0xSolanaceae/TypeLapse/refs/heads/main/assets/favicon/favicon.svg
// @downloadURL https://update.greasyfork.org/scripts/521151/TypeLapse.user.js
// @updateURL https://update.greasyfork.org/scripts/521151/TypeLapse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (
        window.location.href.includes("docs.google.com/document/d") ||
        window.location.href.includes("docs.google.com/presentation/d")
    ) {
        console.log("TypeLapse loaded!");

        const TypeLapseButton = createButton("TypeLapse", "type-lapse-button");
        const stopButton = createButton("Stop", "stop-button", "red");
        const pauseButton = createButton("Pause", "pause-button", "orange");
        const resumeButton = createButton("Resume", "resume-button", "green");
        stopButton.style.display = "none";
        pauseButton.style.display = "none";
        resumeButton.style.display = "none";
        stopButton.style.verticalAlign = "middle";
        stopButton.style.lineHeight = "normal";
        pauseButton.style.verticalAlign = "middle";
        pauseButton.style.lineHeight = "normal";
        resumeButton.style.verticalAlign = "middle";
        resumeButton.style.lineHeight = "normal";

        const helpMenu = document.getElementById("docs-help-menu");
        if (helpMenu) {
            helpMenu.parentNode.appendChild(TypeLapseButton);
            TypeLapseButton.parentNode.appendChild(stopButton);
            TypeLapseButton.parentNode.appendChild(pauseButton);
            TypeLapseButton.parentNode.appendChild(resumeButton);
        } else {
            console.error("Help menu not found");
            return;
        }

        let cancelTyping = false;
        let typingInProgress = false;
        let typingPaused = false;
        let lowerBoundValue = 60;
        let upperBoundValue = 120;
        let breakFrequency = 100;
        let breakDuration = 5000;
        let enableBreaks = false;
        let simulateErrors = false;

        TypeLapseButton.addEventListener("click", async () => {
            if (typingInProgress) {
                console.log("Typing in progress, please wait...");
                return;
            }

            cancelTyping = false;
            typingPaused = false;
            stopButton.style.display = "none";
            pauseButton.style.display = "none";
            resumeButton.style.display = "none";

            const { userInput } = await showOverlay();

            if (userInput !== "") {
                const input = document.querySelector(".docs-texteventtarget-iframe")
                    .contentDocument.activeElement;
                if (input) {
                    typeStringWithRandomDelay(input, userInput);
                } else {
                    console.error("Input element not found");
                }
            }
        });

        stopButton.addEventListener("click", () => {
            cancelTyping = true;
            stopButton.style.display = "none";
            pauseButton.style.display = "none";
            resumeButton.style.display = "none";
            console.log("Typing cancelled");
        });

        pauseButton.addEventListener("click", () => {
            typingPaused = true;
            pauseButton.style.display = "none";
            resumeButton.style.display = "inline";
            console.log("Typing paused");
        });

        resumeButton.addEventListener("click", () => {
            typingPaused = false;
            resumeButton.style.display = "none";
            pauseButton.style.display = "inline";
            console.log("Typing resumed");
        });

        window.addEventListener("beforeunload", () => {
            cancelTyping = true;
            typingInProgress = false;
        });

        window.addEventListener("load", () => {
            cancelTyping = false;
            typingInProgress = false;
            typingPaused = false;
            enableBreaks = false;
            simulateErrors = false;
            const enableBreaksCheckbox = document.querySelector("#type-lapse-overlay input[type='checkbox']");
            if (enableBreaksCheckbox) {
                enableBreaksCheckbox.checked = false;
            }
        });

        function createButton(text, id, color = "black") {
            const button = document.createElement("div");
            button.textContent = text;
            button.classList.add("menu-button", "goog-control", "goog-inline-block");
            button.style.userSelect = "none";
            button.style.color = color;
            button.style.cursor = "pointer";
            button.style.transition = "color 0.3s";
            button.id = id;
            return button;
        }

        async function showOverlay() {
            const existingOverlay = document.getElementById("type-lapse-overlay");
            if (existingOverlay) {
                document.body.removeChild(existingOverlay);
                return;
            }
        
            const overlay = document.createElement("div");
            overlay.id = "type-lapse-overlay";
            overlay.style = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 400px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            `;
        
            let isDragging = false;
            let offsetX, offsetY;
        
            overlay.addEventListener("mousedown", (e) => {
                if (e.target === overlay) {
                    isDragging = true;
                    offsetX = e.clientX - overlay.getBoundingClientRect().left;
                    offsetY = e.clientY - overlay.getBoundingClientRect().top;
                }
            });
        
            document.addEventListener("mousemove", (e) => {
                if (isDragging) {
                    overlay.style.left = `${e.clientX - offsetX}px`;
                    overlay.style.top = `${e.clientY - offsetY}px`;
                    overlay.style.transform = "none";
                }
            });
        
            document.addEventListener("mouseup", () => {
                isDragging = false;
            });
        
            const closeButton = document.createElement("button");
            closeButton.textContent = "✖";
            closeButton.style = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #333;
            `;
            closeButton.addEventListener("click", () => {
                document.body.removeChild(overlay);
            });
        
            const heading = document.createElement("h2");
            heading.textContent = "TypeLapse";
            heading.style = `
                margin-bottom: 15px;
                font-size: 24px;
                color: #333;
            `;
        
            const textField = document.createElement("textarea");
            textField.rows = "5";
            textField.cols = "40";
            textField.placeholder = "Enter your text...";
            textField.style = `
                margin-bottom: 10px;
                width: 100%;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 8px;
                resize: vertical;
                font-size: 14px;
            `;
        
            const description = document.createElement("p");
            description.textContent =
                "Keep this tab open; otherwise, the script will pause and resume when you return. Each character has a random typing delay between the lower (min) and upper (max) bounds in milliseconds. Lower values are faster.";
            description.style = `
                font-size: 14px;
                margin-bottom: 15px;
                text-align: center;
            `;
        
            const randomDelayLabel = document.createElement("div");
            randomDelayLabel.style.marginBottom = "5px";
        
            const lowerBoundLabel = createLabel("Lower Bound (ms): ", lowerBoundValue);
            const upperBoundLabel = createLabel("Upper Bound (ms): ", upperBoundValue);
            const simulateErrorsLabel = createCheckboxLabel("Simulate Errors: ", simulateErrors);
            const enableBreaksLabel = createCheckboxLabel("Enable Breaks: ", enableBreaks);
        
            const breakOptionsContainer = document.createElement("div");
            breakOptionsContainer.style.display = "none";
        
            const breakDescription = document.createElement("p");
            breakDescription.textContent =
                "Breaks will pause typing for a specified duration after a certain number of characters.";
            breakDescription.style = `
                font-size: 14px;
                margin-bottom: 10px;
                text-align: center;
            `;
        
            const breakFrequencyLabel = createLabel("Break Frequency (chars): ", breakFrequency);
            const breakDurationLabel = createLabel("Break Duration (ms): ", breakDuration);
        
            breakOptionsContainer.append(
                breakDescription,
                breakFrequencyLabel,
                breakDurationLabel,
            );
        
            enableBreaksLabel.querySelector("input").addEventListener("change", () => {
                breakOptionsContainer.style.display = enableBreaksLabel.querySelector("input").checked ? "block" : "none";
            });
        
            const confirmButton = document.createElement("button");
            confirmButton.textContent = "Cancel";
            confirmButton.style = `
                padding: 10px 20px;
                background-color: #4d82f4;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                transition: background-color 0.3s;
                font-size: 16px;
                margin-top: 10px;
            `;
            confirmButton.addEventListener("mouseover", () => {
                confirmButton.style.backgroundColor = "#3b6bd6";
            });
            confirmButton.addEventListener("mouseout", () => {
                confirmButton.style.backgroundColor = "#4d82f4";
            });
        
            overlay.append(
                closeButton,
                heading,
                description,
                textField,
                randomDelayLabel,
                lowerBoundLabel,
                upperBoundLabel,
                simulateErrorsLabel,
                enableBreaksLabel,
                breakOptionsContainer,
                confirmButton,
            );
            document.body.appendChild(overlay);
        
            return new Promise((resolve) => {
                const updateRandomDelayLabel = () => {
                    const charCount = textField.value.length;
                    const etaLowerBound = Math.ceil(
                        (charCount * parseInt(lowerBoundLabel.querySelector("input").value)) /
                        60000,
                    );
                    const etaUpperBound = Math.ceil(
                        (charCount * parseInt(upperBoundLabel.querySelector("input").value)) /
                        60000,
                    );
                    randomDelayLabel.textContent = `ETA: ${etaLowerBound} - ${etaUpperBound} minutes`;
                };
        
                confirmButton.addEventListener("click", () => {
                    const userInput = textField.value.trim();
                    lowerBoundValue = parseInt(
                        lowerBoundLabel.querySelector("input").value,
                    );
                    upperBoundValue = parseInt(
                        upperBoundLabel.querySelector("input").value,
                    );
                    breakFrequency = parseInt(
                        breakFrequencyLabel.querySelector("input").value,
                    );
                    breakDuration = parseInt(
                        breakDurationLabel.querySelector("input").value,
                    );
                    enableBreaks = enableBreaksLabel.querySelector("input").checked;
                    simulateErrors = simulateErrorsLabel.querySelector("input").checked;
        
                    if (userInput === "") {
                        document.body.removeChild(overlay);
                        return;
                    }
        
                    if (isNaN(lowerBoundValue) ||
                        isNaN(upperBoundValue) ||
                        lowerBoundValue < 0 ||
                        upperBoundValue < lowerBoundValue ||
                        isNaN(breakFrequency) ||
                        breakFrequency <= 0 ||
                        isNaN(breakDuration) ||
                        breakDuration < 0) {
                        return;
                    }
        
                    typingInProgress = true;
                    stopButton.style.display = "inline";
                    pauseButton.style.display = "inline";
                    document.body.removeChild(overlay);
                    resolve({
                        userInput,
                    });
                });
        
                textField.addEventListener("input", () => {
                    confirmButton.textContent =
                        textField.value.trim() === "" ? "Cancel" : "Confirm";
                    updateRandomDelayLabel();
                });
        
                lowerBoundLabel
                    .querySelector("input")
                    .addEventListener("input", updateRandomDelayLabel);
                upperBoundLabel
                    .querySelector("input")
                    .addEventListener("input", updateRandomDelayLabel);
            });
        }
        
        function createLabel(text, value) {
            return createInputLabel(text, "number", value);
        }
        
        function createCheckboxLabel(text, checked) {
            return createInputLabel(text, "checkbox", checked);
        }
        
        function createInputLabel(text, type, value) {
            const label = document.createElement("label");
            label.textContent = text;
            label.style = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                margin-bottom: 10px;
            `;
            const input = document.createElement("input");
            input.type = type;
            if (type === "number") {
                input.min = "0";
                input.value = value;
                input.style = `
                    margin-left: 10px;
                    padding: 6px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    width: 100px;
                `;
            } else if (type === "checkbox") {
                input.checked = value;
                input.style = `
                    margin-left: 10px;
                    transform: scale(1.5);
                `;
            }
            label.appendChild(input);
            return label;
        }

        async function typeStringWithRandomDelay(inputElement, string) {
            const keyboardLayout = {
                a: ['q', 's', 'w', 'z'], b: ['v', 'n', 'g', 'h'], c: ['x', 'v', 'd', 'f'],
                d: ['s', 'f', 'e', 'r'], e: ['w', 'r', 'd', 'f'], f: ['d', 'g', 'r', 't'],
                g: ['f', 'h', 't', 'y'], h: ['g', 'j', 'y', 'u'], i: ['u', 'o', 'j', 'k'],
                j: ['h', 'k', 'u', 'i'], k: ['j', 'l', 'i', 'o'], l: ['k', 'o', 'p'],
                m: ['n', 'j', 'k'], n: ['b', 'm', 'h', 'j'], o: ['i', 'p', 'k', 'l'],
                p: ['o', 'l'], q: ['a', 'w', 's'], r: ['e', 't', 'd', 'f'],
                s: ['a', 'd', 'q', 'w'], t: ['r', 'y', 'f', 'g'], u: ['y', 'i', 'h', 'j'],
                v: ['c', 'b', 'f', 'g'], w: ['q', 'e', 'a', 's'], x: ['z', 'c', 's', 'd'],
                y: ['t', 'u', 'g', 'h'], z: ['a', 's', 'x'],
            };
        
            for (let i = 0; i < string.length; i++) {
                if (cancelTyping) {
                    stopButton.style.display = "none";
                    pauseButton.style.display = "none";
                    resumeButton.style.display = "none";
                    console.log("Typing cancelled");
                    break;
                }
        
                if (typingPaused) {
                    await new Promise(resolve => {
                        const interval = setInterval(() => {
                            if (!typingPaused) {
                                clearInterval(interval);
                                resolve();
                            }
                        }, 100);
                    });
                }
        
                const char = string[i];
                const randomDelay =
                    Math.floor(Math.random() * (upperBoundValue - lowerBoundValue + 1)) +
                    lowerBoundValue;
        
                if (simulateErrors && Math.random() < 0.1) {
                    const errorType = Math.random();
                    if (errorType < 0.33 && keyboardLayout[char]) {
                        const neighbors = keyboardLayout[char];
                        const errorChar = neighbors[Math.floor(Math.random() * neighbors.length)];
                        await simulateTyping(inputElement, errorChar, randomDelay);
                        await simulateTyping(inputElement, "\b", randomDelay);
                    } else if (errorType < 0.66) {
                        await simulateTyping(inputElement, char, randomDelay);
                        await simulateTyping(inputElement, char, randomDelay);
                        await simulateTyping(inputElement, "\b", randomDelay);
                    } else {
                        continue;
                    }
                }
        
                await simulateTyping(inputElement, char, randomDelay);
        
                if (enableBreaks && (i + 1) % breakFrequency === 0) {
                    console.log(`Taking a break for ${breakDuration}ms`);
                    await new Promise(resolve => setTimeout(resolve, breakDuration));
                }
            }
        
            typingInProgress = false;
            stopButton.style.display = "none";
            pauseButton.style.display = "none";
            resumeButton.style.display = "none";
        }

        function simulateTyping(inputElement, char, delay) {
            return new Promise((resolve) => {
                if (cancelTyping) {
                    stopButton.style.display = "none";
                    pauseButton.style.display = "none";
                    resumeButton.style.display = "none";
                    console.log("Typing cancelled");
                    resolve();
                    return;
                }

                setTimeout(() => {
                    let eventObj;
                    if (char === "\n") {
                        eventObj = new KeyboardEvent("keydown", {
                            bubbles: true,
                            key: "Enter",
                            code: "Enter",
                            keyCode: 13,
                            which: 13,
                            charCode: 13,
                        });
                    } else if (char === "\b") {
                        eventObj = new KeyboardEvent("keydown", {
                            bubbles: true,
                            key: "Backspace",
                            code: "Backspace",
                            keyCode: 8,
                            which: 8,
                            charCode: 8,
                        });
                    } else {
                        eventObj = new KeyboardEvent("keypress", {
                            bubbles: true,
                            key: char,
                            charCode: char.charCodeAt(0),
                            keyCode: char.charCodeAt(0),
                            which: char.charCodeAt(0),
                        });
                    }

                    inputElement.dispatchEvent(eventObj);
                    console.log(`Typed: ${char}, Delay: ${delay}ms`);
                    resolve();
                }, delay);
            });
        }
    } else {
        console.log("TypeLapse cannot find document");
    }
})();