// ==UserScript==
// @name         CarManiac's Improved Color Picker Previous
// @namespace    http://tampermonkey.net/
// @version      v1.2.0
// @description  Extends player appearance editor functionality
// @author       CarManiac
// @run-at       document-idle
// @license      MIT
// @match        https://hitbox.io/game.html
// @match        https://hitbox.io/game2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hitbox.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509883/CarManiac%27s%20Improved%20Color%20Picker%20Previous.user.js
// @updateURL https://update.greasyfork.org/scripts/509883/CarManiac%27s%20Improved%20Color%20Picker%20Previous.meta.js
// ==/UserScript==

const originalSend = window.WebSocket.prototype.send;
let WSS = 0;

window.WebSocket.prototype.send = async function(args) {
    if (this.url && this.url.includes("peer")) return;
    if (this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")) {
        if (typeof args === "string") {
            if (!WSS) WSS = this;
        }
    }
    return originalSend.call(this, args);
};


const savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];
let colorPickerContainer;
let deletionMode = false;

function hexToDecimal(hex) {
    if (hex.startsWith("#")) hex = hex.slice(1);
    return parseInt(hex, 16);
}

function createColorInput() {
    if (colorPickerContainer) return;

    colorPickerContainer = document.createElement("div");
    colorPickerContainer.id = "colorPickerContainer";
    colorPickerContainer.style.cssText = "background-color: rgb(37, 38, 42); border-radius: 7px; color: rgb(235, 235, 235); display: flex; flex-direction: column; font-family: 'Bai Jamjuree', sans-serif; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); padding: 10px; width: 300px;";

    const crossButton = document.createElement("div");
    crossButton.className = "crossButton";
    crossButton.style.cssText = `
        background-color: rgb(74, 122, 177);
        background-image: url(https://hitbox.io/graphics/ui/close.svg);
        background-position: 50% 50%;
        background-repeat: no-repeat;
        border-radius: 20px;
        color: rgb(235, 235, 235);
        cursor: pointer;
        display: block;
        height: 25.9929px;
        position: absolute;
        right: -9px;
        top: -9px;
        width: 25.9929px;
    `;
    crossButton.addEventListener("click", closeBoth);

    const label = document.createElement("label");
    label.textContent = "Select Color";
    label.style.cssText = "color: rgb(235, 235, 235); font-weight: bold; font-size: 15px; margin-bottom: 10px;";

    const colorInput = document.createElement("input");
    colorInput.type = "color";
    colorInput.style.cssText = "margin-top: 5px; width: 100%;";

    const textBox = document.createElement("input");
    textBox.type = "text";
    textBox.style.cssText = "margin-top: 5px; width: 100%; background-color: rgb(100, 100, 100); color: white; border: 1px solid #ccc; border-radius: 5px; padding: 5px;";
    textBox.placeholder = "Hex (#RRGGBB) or rgb(R, G, B)";

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.justifyContent = "space-between";
    buttonContainer.style.marginTop = "10px";

    const applyButton = createButton("APPLY COLOR", "margin: 5px;");
    const randomButton = createButton("RANDOM COLOR", "margin: 5px;");
    const saveButton = createButton("SAVE COLOR", "margin: 5px;");

    const feedbackMessage = document.createElement("div");
    feedbackMessage.style.cssText = "margin-top: 10px; color: green; font-size: 15px;";

    const savedColorsContainer = document.createElement("div");
    savedColorsContainer.style.cssText = "margin-top: 10px; padding-top: 10px; border-top: 1px solid #ccc; color: rgb(235, 235, 235);";

    const savedColorsTitle = document.createElement("h4");
    savedColorsTitle.textContent = "Saved Colors";
    savedColorsTitle.style.cssText = "margin-bottom: 10px; font-size: 14px;";

    const savedColorsList = document.createElement("div");
    savedColorsList.style.display = "flex";
    savedColorsList.style.flexWrap = "wrap";
    savedColorsList.style.gap = "10px";

    const deleteButton = createButton("DELETE COLORS", "margin-top: 10px; width: 100px;");

    colorPickerContainer.append(crossButton, label, colorInput, textBox, buttonContainer, saveButton, feedbackMessage, savedColorsContainer);
    buttonContainer.append(applyButton, randomButton);
    savedColorsContainer.append(savedColorsTitle, savedColorsList, deleteButton);

    document.body.appendChild(colorPickerContainer);
    displaySavedColors();

    colorInput.addEventListener("input", () => {
        textBox.value = colorInput.value; // Update text box with color input value
        feedbackMessage.textContent = `Color selected: ${colorInput.value}`;
        feedbackMessage.style.color = "green";
    });

    saveButton.addEventListener("click", () => saveColor(textBox.value.trim(), feedbackMessage, savedColorsList));
    applyButton.addEventListener("click", () => applyColor(textBox.value.trim(), feedbackMessage));
    randomButton.addEventListener("click", () => generateRandomColor(textBox, feedbackMessage));
    deleteButton.addEventListener("click", () => toggleDeletionMode());

    function createButton(text, additionalStyles = "") {
        const button = document.createElement("button");
        button.textContent = text;
        button.style.cssText = `padding: 5px; border: none; font-family: 'Bai Jamjuree', sans-serif; border-radius: 2px; cursor: pointer; color: rgb(235, 235, 235); background-color: rgb(74, 122, 177); ${additionalStyles}`;
        return button;
    }

    function displaySavedColors() {
        savedColorsList.innerHTML = '';
        savedColors.forEach(color => {
            const colorBox = document.createElement("div");
            colorBox.style.cssText = `width: 30px; height: 30px; background-color: ${color}; cursor: pointer; border: 1px solid #ccc; border-radius: 3px;`;
            colorBox.addEventListener("click", () => {
                if (deletionMode) {
                    confirmDeletion(color);
                } else {
                    textBox.value = color;
                    colorInput.value = color; // Update color input with the selected color
                    feedbackMessage.textContent = `Color selected: ${color}`;
                    feedbackMessage.style.color = "green";
                }
            });
            savedColorsList.appendChild(colorBox);
        });
    }

    function saveColor(colorValue, feedback, list) {
        if (colorValue === "") {
            feedback.textContent = "Please enter a color!";
            feedback.style.color = "red";
            return;
        }

        if (!savedColors.includes(colorValue)) {
            savedColors.push(colorValue);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            displaySavedColors();
            feedback.textContent = `Color saved: ${colorValue}`;
            feedback.style.color = "green";
        } else {
            feedback.textContent = "Color already saved!";
            feedback.style.color = "orange";
        }
    }

    function applyColor(colorValue, feedback) {
        let decimalValue;

        if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(colorValue)) {
            decimalValue = hexToDecimal(colorValue);
        } else {
            feedback.textContent = "Please enter a valid color!";
            feedback.style.color = "red";
            return;
        }

        feedback.textContent = `Color applied successfully: ${colorValue}`;
        feedback.style.color = "green";
        localStorage.setItem("basic_col_1", decimalValue);
        if (WSS) {
            WSS.send(`42[1,[40,{"1": ${decimalValue}}]]`);
        }
    }

    function generateRandomColor(input, feedback) {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        input.value = randomColor;
        colorInput.value = randomColor; // Update color input
        feedback.textContent = `Random color generated: ${randomColor}`;
        feedback.style.color = "green";
    }

    function toggleDeletionMode() {
        if (deletionMode) {
            deletionMode = false;
            deleteButton.style.backgroundColor = "rgb(74, 122, 177)";
            deleteButton.textContent = "DELETE COLORS";
        } else {
            deletionMode = true;
            deleteButton.style.backgroundColor = "red";
            deleteButton.textContent = "CANCEL DELETE";
        }
    }

    function confirmDeletion(color) {
        const index = savedColors.indexOf(color);
        if (index > -1) {
            savedColors.splice(index, 1);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            displaySavedColors();
        }
    }
}

const appearancePageObserver = new MutationObserver(() => {
    const appearancePage = document.querySelector('.cosmeticWindow');
    if (appearancePage) {
        createColorInput();
    } else {
        closeBoth();
    }
});

function checkAppearancePage() {
    appearancePageObserver.observe(document.body, { childList: true, subtree: true });
}

function closeColorPicker() {
    if (colorPickerContainer) {
        colorPickerContainer.remove();
        colorPickerContainer = null;
    }
}

function closeBoth() {
    closeColorPicker();
    const cosmeticWindow = document.querySelector('.cosmeticWindow');
    if (cosmeticWindow) {
        cosmeticWindow.remove();
    }
    const blockerContainer = document.querySelector('.blockerContainer');
    if (blockerContainer) {
        blockerContainer.remove();
    }
}

checkAppearancePage();
