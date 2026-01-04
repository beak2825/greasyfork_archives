// ==UserScript==
// @name         CarManiac's Improved Color Picker
// @namespace    http://tampermonkey.net/
// @version      v1.40
// @description  Extends player appearance editor functionality
// @author       CarManiac
// @run-at       document-idle
// @license      MIT
// @match        https://heav.io/game.html
// @match        https://hitbox.io/game.html
// @match        https://heav.io/game2.html
// @match        https://hitbox.io/game2.html
// @match        https://hitbox.io/game-beta.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=heav.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509308/CarManiac%27s%20Improved%20Color%20Picker.user.js
// @updateURL https://update.greasyfork.org/scripts/509308/CarManiac%27s%20Improved%20Color%20Picker.meta.js
// ==/UserScript==

const style = document.createElement("style");
style.textContent = `
    button:hover,
    .crossButton:hover {
        background-color: #5c85b4 !important;
    }
`;
document.head.appendChild(style);

const targetImage = 'graphics/ui/hitbox.svg';
const newImageSrc = 'https://i.ibb.co/F5RLpmx/hitbox-1.png';

const images = document.querySelectorAll(`img[src="${targetImage}"]`);

images.forEach(img => {
    const overlayImage = document.createElement('img');
    overlayImage.src = newImageSrc;
    overlayImage.style.position = 'absolute';
    overlayImage.style.left = img.offsetLeft + 'px';
    overlayImage.style.top = img.offsetTop + 'px';
    overlayImage.style.width = img.width + 'px';
    overlayImage.style.height = img.height + 'px';
    overlayImage.style.pointerEvents = 'none';
    img.parentNode.appendChild(overlayImage);
});

const originalSend = window.WebSocket.prototype.send;
let WSS = 0;

window.WebSocket.prototype.send = async function(args) {
    if (this.url && this.url.includes("peer")) {
        return;
    }

    if (this.url.includes("/socket.io/?EIO=3&transport=websocket&sid=")) {
        if (typeof args === "string") {
            if (!WSS) {
                WSS = this;
            }
        }
    }

    return originalSend.call(this, args);
};

const iroScript = document.createElement("script");
iroScript.src = "https://unpkg.com/@jaames/iro/dist/iro.min.js";
document.head.appendChild(iroScript);

const savedColors = JSON.parse(localStorage.getItem('savedColors')) || [];
let colorPickerContainer;
let deletionMode = false;

function hexToDecimal(hex) {
    if (hex.startsWith("#")) hex = hex.slice(1);
    return parseInt(hex, 16);
}

function rgbToDecimal(rgb) {
    const rgbValues = rgb.match(/\d+/g);
    return rgbValues.reduce((acc, val) => (acc << 8) + parseInt(val), 0);
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

    const colorWheelContainer = document.createElement("div");
    colorWheelContainer.style.textAlign = "center";

    const colorInput = document.createElement("input");
    colorInput.type = "text";
    colorInput.style.cssText = `
        background-color: rgb(100, 100, 100);
        color: white;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-top: 5px;
        font-family: 'Bai Jamjuree', sans-serif;
    `;
    colorInput.placeholder = "Hex (#RRGGBB) or rgb(R, G, B)";

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

    colorPickerContainer.append(crossButton, label, colorWheelContainer, colorInput, buttonContainer, saveButton, feedbackMessage, savedColorsContainer);
    buttonContainer.append(applyButton, randomButton);
    savedColorsContainer.append(savedColorsTitle, savedColorsList, deleteButton);

    document.body.appendChild(colorPickerContainer);
    displaySavedColors();

    const colorWheel = new iro.ColorPicker(colorWheelContainer, {
        width: 225,
        color: "#ff0000"
    });

    function getLuminance(hex) {
        let r = parseInt(hex.slice(1, 3), 16);
        let g = parseInt(hex.slice(3, 5), 16);
        let b = parseInt(hex.slice(5, 7), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    }

    colorWheel.on('color:change', function(color) {
        const hexColor = color.hexString;
        colorInput.value = hexColor;
        colorInput.style.backgroundColor = hexColor;
        const luminance = getLuminance(hexColor);
        colorInput.style.color = luminance > 0.5 ? 'black' : 'white';
    });

    saveButton.addEventListener("click", () => saveColor(colorInput.value.trim(), feedbackMessage, savedColorsList));
    applyButton.addEventListener("click", () => applyColor(colorInput.value.trim(), feedbackMessage));
    randomButton.addEventListener("click", () => generateRandomColor(colorInput, feedbackMessage));
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
                    colorInput.value = color;
                    colorInput.style.backgroundColor = color;
                    const luminance = getLuminance(color);
                    colorInput.style.color = luminance > 0.5 ? 'black' : 'white';
                    feedbackMessage.textContent = `Color selected: ${color}`;
                    feedbackMessage.style.color = "green";
                }
            });
            savedColorsList.appendChild(colorBox);
        });
    }

    function saveColor(colorValue, feedback, list) {
        if (colorValue && !savedColors.includes(colorValue)) {
            savedColors.push(colorValue);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            displaySavedColors();
            feedback.textContent = `Color ${colorValue} saved!`;
            feedback.style.color = "green";
        } else {
            feedback.textContent = "Color is either empty or already saved!";
            feedback.style.color = "red";
        }
    }

    function applyColor(colorValue, feedback) {
        let decimalValue;
        if (colorValue.startsWith("#")) {
            decimalValue = hexToDecimal(colorValue);
        } else if (colorValue.startsWith("rgb")) {
            decimalValue = rgbToDecimal(colorValue);
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
        input.style.backgroundColor = randomColor;
        const luminance = getLuminance(randomColor);
        input.style.color = luminance > 0.5 ? 'black' : 'white';
        feedback.textContent = `Random color generated: ${randomColor}`;
        feedback.style.color = "green";
    }

    function toggleDeletionMode() {
        if (deletionMode) {
            deletionMode = false;
            deleteButton.style.backgroundColor = "rgb(74, 122, 177)";
            deleteButton.textContent = "DELETE COLORS";
            deleteButton.classList.remove("cancel-delete-hover");
        } else {
            if (localStorage.getItem("noAskAgain") !== "true") {
                createConfirmationPopup(() => {
                    deletionMode = true;
                    deleteButton.style.backgroundColor = "rgb(255, 0, 0)";
                    deleteButton.textContent = "CANCEL DELETE";
                    deleteButton.classList.add("cancel-delete-hover");
                });
            } else {
                deletionMode = true;
                deleteButton.style.backgroundColor = "rgb(255, 0, 0)";
                deleteButton.textContent = "CANCEL DELETE";
                deleteButton.classList.add("cancel-delete-hover");
            }
        }
    }

    const style = document.createElement('style');
    style.textContent = `
        .cancel-delete-hover:hover {
            background-color: #ff171b !important;
        }
    `;
    document.head.appendChild(style);

    function confirmDeletion(color) {
        const index = savedColors.indexOf(color);
        if (index > -1) {
            savedColors.splice(index, 1);
            localStorage.setItem('savedColors', JSON.stringify(savedColors));
            displaySavedColors();
        }
    }

    function createConfirmationPopup(callback) {
        const popupContainer = document.createElement("div");
        popupContainer.style.cssText = "position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.8); color: white; padding: 20px; border-radius: 10px; z-index: 1000;";

        const message = document.createElement("p");
        message.textContent = "Are you sure you want to enable deletion mode?";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = "noAskAgain";
        const checkboxLabel = document.createElement("label");
        checkboxLabel.setAttribute("for", "noAskAgain");
        checkboxLabel.textContent = "Don't ask again";

        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.justifyContent = "space-between";

        const cancelButton = createButton("CANCEL", "margin-right: 5px; background-color: red;");
        const confirmButton = createButton("CONFIRM");

        buttonContainer.append(cancelButton, confirmButton);
        popupContainer.append(message, checkboxLabel, checkbox, buttonContainer);
        document.body.appendChild(popupContainer);

        cancelButton.addEventListener("click", () => {
            popupContainer.remove();
        });

        confirmButton.addEventListener("click", () => {
            if (checkbox.checked) {
                localStorage.setItem("noAskAgain", "true");
            }
            callback();
            popupContainer.remove();
        });
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