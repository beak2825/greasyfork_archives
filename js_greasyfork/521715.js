// ==UserScript==
// @name         Kirka gun fire rate increase toggleable, Speed hack, Fast Reload, AutoDodge, AutoJump, & AutoSwitch.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click X/x to toggle fire rate, B/b to toggle AutoDodge, K/k to toggle AutoWalk, G/g to toggle AutoJump, N/n to toggle KillAura/AutoShoot, L/l to toggle AutoCrouch, M/m to toggle AutoSwitch
// @author       Cqmbo__
// @match        https://kour.io/
// @match        https://kour.io/games
// @icon         https://yt3.ggpht.com/ofXbHpiwGc4bYnwwljjZJo53E7JRODr-SG32NPV1W6QiUnGUtVAYDwTP2NMz2pUPGnt99Juh5w=s88-c-k-c0x00ffffff-no-rj
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521715/Kirka%20gun%20fire%20rate%20increase%20toggleable%2C%20Speed%20hack%2C%20Fast%20Reload%2C%20AutoDodge%2C%20AutoJump%2C%20%20AutoSwitch.user.js
// @updateURL https://update.greasyfork.org/scripts/521715/Kirka%20gun%20fire%20rate%20increase%20toggleable%2C%20Speed%20hack%2C%20Fast%20Reload%2C%20AutoDodge%2C%20AutoJump%2C%20%20AutoSwitch.meta.js
// ==/UserScript==

let fireRateEnabled = false;
let autoDodgeEnabled = false;
let autoDodgeInterval;
let isAutoWalking = false;
let isAutoDashing = false;
let isKillauaActive = false;
let autoJumpEnabled = false;
let autoJumpInterval;
let isAutoCrouching = false;
let autoCrouchInterval;
let autoSwitchEnabled = false;
let autoSwitchInterval;
let fireRateValue = 2123;
let autoJumpIntervalValue = 100;
let autoDashInterval;
let autoSwitchIntervalValue = 50;

// Store original Date.now and performance.now functions
const originalDateNow = Date.now;
const originalPerformanceNow = performance.now;

// Automatically enable the speed hack
performance.now = () => originalPerformanceNow.call(performance) * 1.25;
console.log("Speed increase enabled");

function toggleFireRate() {
    fireRateEnabled = !fireRateEnabled;
    if (fireRateEnabled) {
        // Increase the Date.now function rate
        Date.now = () => originalDateNow() * (fireRateValue);
        console.log("Gun fire rate increase enabled");
    } else {
        // Restore original Date.now function
        Date.now = originalDateNow;
        console.log("Gun fire rate increase disabled");
    }
    updateInfoDisplay();
}

function toggleAutoDodge() {
    autoDodgeEnabled = !autoDodgeEnabled;
    if (autoDodgeEnabled) {
        autoDodgeInterval = setInterval(() => {
            simulateKeydown('a');
            setTimeout(() => {
                simulateKeyup('a');
                simulateKeydown('d');
                setTimeout(() => {
                    simulateKeyup('d');
                }, 10);
            }, 10);
        }, 50);
        console.log("AutoDodge enabled");
    } else {
        clearInterval(autoDodgeInterval);
        console.log("AutoDodge disabled");
    }
    updateInfoDisplay();
}

function toggleAutoJump() {
    autoJumpEnabled = !autoJumpEnabled;
    if (autoJumpEnabled) {
        autoJumpInterval = setInterval(() => {
            simulateKeydown(' ');
            setTimeout(() => {
                simulateKeyup(' ');
            }, 10);
        }, autoJumpIntervalValue);
        console.log("AutoJump enabled");
    } else {
        clearInterval(autoJumpInterval);
        console.log("AutoJump disabled");
    }
    updateInfoDisplay();
}

function toggleAutoSwitch() {
    autoSwitchEnabled = !autoSwitchEnabled;
    if (autoSwitchEnabled) {
        autoSwitchInterval = setInterval(() => {
            simulateKeydown('1');
            setTimeout(() => {
                simulateKeyup('1');
                setTimeout(() => {
                    simulateKeydown('2');
                    setTimeout(() => {
                        simulateKeyup('2');
                        setTimeout(() => {
                            simulateKeydown('3');
                            setTimeout(() => {
                                simulateKeyup('3');
                            }, 10);
                        }, autoSwitchIntervalValue);
                    }, 10);
                }, autoSwitchIntervalValue);
            }, 10);
        }, 170);
        console.log("AutoSwitch enabled");
    } else {
        clearInterval(autoSwitchInterval);
        console.log("AutoSwitch disabled");
    }
    updateInfoDisplay();
}

function simulateKeydown(key) {
    const keyMap = {
        'a': { key: 'a', code: 'KeyA', keyCode: 65, which: 65 },
        'd': { key: 'd', code: 'KeyD', keyCode: 68, which: 68 },
        'w': { key: 'w', code: 'KeyW', keyCode: 87, which: 87 },
        ' ': { key: ' ', code: 'Space', keyCode: 32, which: 32 },
        'e': { key: 'e', code: 'KeyE', keyCode: 69, which: 69 },
        'Shift': { key: 'Shift', code: 'ShiftLeft', keyCode: 16, which: 16 },
        '1': { key: '1', code: 'Digit1', keyCode: 49, which: 49 },
        '2': { key: '2', code: 'Digit2', keyCode: 50, which: 50 },
        '3': { key: '3', code: 'Digit3', keyCode: 51, which: 51 }
    };

    const keydownEvent = new KeyboardEvent('keydown', {
        key: keyMap[key].key,
        code: keyMap[key].code,
        keyCode: keyMap[key].keyCode,
        which: keyMap[key].which,
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        repeat: true,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(keydownEvent);
}

function simulateKeyup(key) {
    const keyMap = {
        'a': { key: 'a', code: 'KeyA', keyCode: 65, which: 65 },
        'd': { key: 'd', code: 'KeyD', keyCode: 68, which: 68 },
        'w': { key: 'w', code: 'KeyW', keyCode: 87, which: 87 },
        ' ': { key: ' ', code: 'Space', keyCode: 32, which: 32 },
        'e': { key: 'e', code: 'KeyE', keyCode: 69, which: 69 },
        'Shift': { key: 'Shift', code: 'ShiftLeft', keyCode: 16, which: 16 },
        '1': { key: '1', code: 'Digit1', keyCode: 49, which: 49 },
        '2': { key: '2', code: 'Digit2', keyCode: 50, which: 50 },
        '3': { key: '3', code: 'Digit3', keyCode: 51, which: 51 }
    };

    const keyupEvent = new KeyboardEvent('keyup', {
        key: keyMap[key].key,
        code: keyMap[key].code,
        keyCode: keyMap[key].keyCode,
        which: keyMap[key].which,
        shiftKey: false,
        ctrlKey: false,
        altKey: false,
        metaKey: false,
        repeat: false,
        bubbles: true,
        cancelable: true
    });
    document.dispatchEvent(keyupEvent);
}

function updateInfoDisplay() {
    const infoDisplay = document.getElementById("infoDisplay");
    infoDisplay.innerHTML = `
        Blatant: Fire Rate: ${fireRateEnabled ? 'Enabled (x)' : 'Disabled (x)'} | KillAura/AutoShoot: ${isKillauaActive ? 'Enabled (n)' : 'Disabled (n)'}
        <small>${isKillauaActive ? '(Right-click when KillAura is enabled to shoot)' : ''}</small><br>
        Movement: AutoDodge: ${autoDodgeEnabled ? 'Enabled (b)' : 'Disabled (b)'} | AutoWalk: ${isAutoWalking ? 'Enabled (k)' : 'Disabled (k)'} | AutoJump: ${autoJumpEnabled ? 'Enabled (g)' : 'Disabled (g)'} | AutoDash: ${isAutoDashing ? 'Enabled (h)' : 'Disabled (h)'} | AutoCrouch: ${isAutoCrouching ? 'Enabled (l)' : 'Disabled (l)'}<br>
        Fun: AutoSwitch: ${autoSwitchEnabled ? 'Enabled (m)' : 'Disabled (m)'}
    `;
}

// Create toggle button for info display
const toggleButton = document.createElement("button");
toggleButton.innerText = "Toggle InfoDisplay (y)";
toggleButton.style.position = "fixed";
toggleButton.style.top = "10px";
toggleButton.style.right = "10px";
toggleButton.style.zIndex = "10000";
document.body.appendChild(toggleButton);

const toggleButtonText = document.createElement("small");
toggleButtonText.innerText = "Use button or click 'y' to toggle menu/InfoDisplay";
toggleButtonText.style.position = "fixed";
toggleButtonText.style.top = "35px";
toggleButtonText.style.right = "10px";
toggleButtonText.style.zIndex = "10000";
toggleButtonText.style.color = "lime";
document.body.appendChild(toggleButtonText);

toggleButton.addEventListener("click", function() {
    const infoDisplay = document.getElementById("infoDisplay");
    infoDisplay.style.display = infoDisplay.style.display === "none" ? "block" : "none";
});

document.addEventListener("keydown", function(event) {
    if (event.key.toLowerCase() === "y") {
        const infoDisplay = document.getElementById("infoDisplay");
        infoDisplay.style.display = infoDisplay.style.display === "none" ? "block" : "none";
    }
});


// Toggle functions when pressing keys
document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === 'x') {
        toggleFireRate();
    } else if (event.key.toLowerCase() === 'b') {
        toggleAutoDodge();
    } else if (event.key.toLowerCase() === 'k') {
        toggleAutoWalk();
    } else if (event.key.toLowerCase() === 'g') {
        toggleAutoJump();
    } else if (event.key.toLowerCase() === 'h') {
        toggleAutoDash();
    } else if (event.key.toLowerCase() === 'n') {
        toggleKillaura();
    } else if (event.key.toLowerCase() === 'l') {
        toggleAutoCrouch();
    } else if (event.key.toLowerCase() === 'm') {
        toggleAutoSwitch();
    }
    updateInfoDisplay();
});

// Create info display
const infoDisplay = document.createElement("div");
infoDisplay.id = "infoDisplay";
infoDisplay.style.position = "fixed";
infoDisplay.style.top = "10px";
infoDisplay.style.left = "10px";
infoDisplay.style.color = "#ffffff";
infoDisplay.style.zIndex = "9999";
infoDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
infoDisplay.style.padding = "5px";
infoDisplay.style.borderRadius = "5px";
document.body.appendChild(infoDisplay);

updateInfoDisplay();

// Create sliders container
const slidersContainer = document.createElement('div');
slidersContainer.id = 'kirka-sliders';
slidersContainer.style.position = 'fixed';
slidersContainer.style.top = '350px'; // Adjust the position as needed
slidersContainer.style.right = '10px';
slidersContainer.style.zIndex = '10000';
slidersContainer.style.color = 'white';
slidersContainer.innerHTML =
    `
    <h2>Kirka Settings</h2>
    <div>
        <label for="fireRateSlider">Fire Rate (2-3000 ms):</label>
        <input type="range" id="fireRateSlider" min="2" max="3000" value="${fireRateValue}">
        <output id="fireRateValue">${fireRateValue}</output>
    </div>
    <div>
        <label for="autoJumpSlider">AutoJump Interval (10-1500 ms):</label>
        <input type="range" id="autoJumpSlider" min="10" max="1500" value="${autoJumpIntervalValue}">
        <output id="autoJumpValue">${autoJumpIntervalValue}</output>
    </div>
        <div>
        <label for="autoSwitchSlider">AutoSwitch Interval (50-1000 ms):</label>
        <input type="range" id="autoSwitchSlider" min="50" max="1000" value="${autoSwitchIntervalValue}">
        <output id="autoSwitchValue">${autoSwitchIntervalValue}</output>
    </div>
    `
;
document.body.appendChild(slidersContainer);

// Function to update the slider output value
function updateSliderOutput(sliderId, outputId) {
    const slider = document.getElementById(sliderId);
    const output = document.getElementById(outputId);
    slider.addEventListener('input', () => {
        output.value = slider.value;
    });
}

// Update the slider output values on input
updateSliderOutput('fireRateSlider', 'fireRateValue');
updateSliderOutput('autoJumpSlider', 'autoJumpValue');
updateSliderOutput('autoSwitchSlider', 'autoSwitchValue');

// Add event listeners to update the values
document.getElementById('fireRateSlider').addEventListener('input', function() {
    fireRateValue = parseInt(this.value);
});
document.getElementById('autoJumpSlider').addEventListener('input', function() {
    autoJumpIntervalValue = parseInt(this.value);
});
document.getElementById('autoSwitchSlider').addEventListener('input', function() {
    autoSwitchIntervalValue = parseInt(this.value);
});

function toggleAutoWalk() {
    isAutoWalking = !isAutoWalking;
    if (isAutoWalking) {
        simulateKeydown('w');
        console.log("AutoWalk enabled");
    } else {
        simulateKeyup('w');
        console.log("AutoWalk disabled");
    }
    updateInfoDisplay();
}

function toggleKillaura() {
    isKillauaActive = !isKillauaActive;
    if (isKillauaActive) {
        document.addEventListener('mousedown', onMouseDownHandler);
        document.addEventListener('mouseup', onMouseUpHandler);
        console.log("KillAura/AutoShoot enabled");
    } else {
        document.removeEventListener('mousedown', onMouseDownHandler);
        document.removeEventListener('mouseup', onMouseUpHandler);
        console.log("KillAura/AutoShoot disabled");
    }
    updateInfoDisplay();
}

function onMouseDownHandler(event) {
    if (event.target.tagName === 'CANVAS') {
        simulateMouseDown();
    }
}

function onMouseUpHandler(event) {
    if (event.target.tagName === 'CANVAS') {
        simulateMouseUp();
    }
}

function simulateMouseDown() {
    const canvas = document.querySelector('canvas');
    const mouseDownEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        clientX: canvas.width / 2,
        clientY: canvas.height / 2
    });
    canvas.dispatchEvent(mouseDownEvent);
}

function simulateMouseUp() {
    const canvas = document.querySelector('canvas');
    const mouseUpEvent = new MouseEvent('mouseup', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 0,
        clientX: canvas.width / 2,
        clientY: canvas.height / 2
    });
    canvas.dispatchEvent(mouseUpEvent);
}

function toggleAutoDash() {
    isAutoDashing = !isAutoDashing;
    if (isAutoDashing) {
        autoDashInterval = setInterval(() => {
            simulateKeydown('e');
            setTimeout(() => {
                simulateKeyup('e');
            }, 10);
        }, 1500);
        console.log("AutoDash enabled");
    } else {
        clearInterval(autoDashInterval);
        console.log("AutoDash disabled");
    }
    updateInfoDisplay();
}

function toggleAutoCrouch() {
    isAutoCrouching = !isAutoCrouching;
    if (isAutoCrouching) {
        autoCrouchInterval = setInterval(() => {
            simulateKeydown('Shift');
            setTimeout(() => {
                simulateKeyup('Shift');
            }, 10);
        }, 500);
        console.log("AutoCrouch enabled");
    } else {
        clearInterval(autoCrouchInterval);
        console.log("AutoCrouch disabled");
    }
    updateInfoDisplay();
}

// Prevent the 'left mouse button' from stopping KillAura when clicked
document.addEventListener('mousedown', function(event) {
    if (event.button === 0 && isKillauaActive) {
        event.preventDefault(); // Prevent default behavior of the left mouse button
    }
});