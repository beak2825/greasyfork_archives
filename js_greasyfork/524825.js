// ==UserScript==
// @name         Ress Relay for Minting
// @version      1
// @description  Automatically mint resources at the academy at random intervals (10-15 minutes) with countdown, reset, and customizable settings
// @include      https://*/game.php*screen=storage*
// @namespace https://greasyfork.org/users/1388863
// @downloadURL https://update.greasyfork.org/scripts/524825/Ress%20Relay%20for%20Minting.user.js
// @updateURL https://update.greasyfork.org/scripts/524825/Ress%20Relay%20for%20Minting.meta.js
// ==/UserScript==

let countdownTimer = null; // Global timer reference

// Function to generate random interval in milliseconds
function getRandomInterval(min, max) {
    return Math.random() * (max - min) + min;
}

// Function to get a value from localStorage or return a default value if not found
function getFromStorage(key, defaultValue) {
    return localStorage.getItem(key) || defaultValue;
}

// Main execution steps
function executeSteps() {
    console.log("Starting main execution steps...");

    setTimeout(() => {
        const inputTimeElement = document.getElementById("nr_time_interval");
        const targetElement = document.getElementById("coord_mint_village");
        const targetValue = getFromStorage("targetcoord", "");

        const groupElement = document.getElementById("nr_group_id");
        const groupValue = getFromStorage("groupID", "");

        if (inputTimeElement) {
            inputTimeElement.value = 15;
            console.log("Set time interval to 15.");
        } else {
            console.error("Element with ID 'nr_time_interval' not found.");
        }

        if (targetElement) {
            targetElement.value = targetValue;
            console.log("Set target coordinates:", targetValue);
        } else {
            console.error("Element with ID 'coord_mint_village' not found.");
        }

        if (groupElement) {
            groupElement.value = groupValue;
            console.log("Set Group:", groupValue);
        } else {
            console.error("Element with ID 'nr_group_id' not found.");
        }

        setTimeout(() => {
            const button = document.querySelector(".btn.evt-confirm-btn.btn-confirm-yes[type='button'][value='start']");
            if (button) {
                button.click();
                console.log("Start button clicked.");
            } else {
                console.error("Start button not found.");
            }

            setTimeout(() => {
                function pressEnterContinuously() {
                    console.log("Pressing Enter...");
                    const event = new KeyboardEvent("keydown", {
                        key: "Enter",
                        code: "Enter",
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                    });
                    document.dispatchEvent(event);
                    setTimeout(pressEnterContinuously, getRandomInterval(250, 500));
                }

                pressEnterContinuously();
            }, getRandomInterval(2000, 3000));
        }, getRandomInterval(2000, 3000));
    }, getRandomInterval(2000, 3000));
}

// Main function to load external scripts and execute steps
function main() {
    console.log("Waiting to load external script...");
    setTimeout(() => {
        console.log("Loading external script...");
        $.getScript("https://dl.dropboxusercontent.com/scl/fi/aqzxdsms61n5ybj5zond1/optiMint2.js?rlkey=ymx95vzao1npn5yp43w5if5xu&dl=0")
            .done(() => {
                console.log("External script loaded successfully.");
                setTimeout(() => {
                    console.log("Proceeding to main steps...");
                    executeSteps();
                }, getRandomInterval(1000, 2000));
            })
            .fail(() => {
                console.error("Failed to load external script.");
            });
    }, getRandomInterval(1000, 2000));
}

// Countdown logic
function startCountdown(minutes) {
    const countdownElement = document.getElementById("countdown-timer");
    const endTime = Date.now() + minutes * 60000;
    localStorage.setItem("countdownEndTime", endTime);

    if (countdownTimer) {
        clearTimeout(countdownTimer);
    }

    function updateCountdown() {
        const remainingTime = Math.max(0, endTime - Date.now());
        const mins = Math.floor(remainingTime / 60000);
        const secs = Math.floor((remainingTime % 60000) / 1000);

        countdownElement.textContent = `Next execution in: ${mins}m ${secs}s`;

        if (remainingTime > 0) {
            countdownTimer = setTimeout(updateCountdown, 1000);
        } else {
            countdownElement.textContent = "Executing...";
            main();
            startCountdown(Math.random() * 5 + 10); // Start new countdown (20-30 minutes)
        }
    }

    updateCountdown();
}

// UI Initialization
function initializeUI() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.bottom = "20px";
    container.style.left = "20px";
    container.style.backgroundColor = "#333";
    container.style.color = "#fff";
    container.style.padding = "10px";
    container.style.borderRadius = "5px";
    container.style.zIndex = 10000;

    const countdownElement = document.createElement("div");
    countdownElement.id = "countdown-timer";
    countdownElement.style.marginBottom = "10px";
    container.appendChild(countdownElement);

    const resetButton = document.createElement("button");
    resetButton.textContent = "Forced Start";
    resetButton.style.padding = "5px 10px";
    resetButton.style.marginRight = "5px";
    resetButton.style.border = "none";
    resetButton.style.borderRadius = "3px";
    resetButton.style.cursor = "pointer";
    resetButton.style.backgroundColor = "#007bff";
    resetButton.style.color = "#fff";

    resetButton.addEventListener("click", () => {
        console.log("Reset button clicked.");
        startCountdown(0.02); // Quick start for testing
        location.reload();
    });

    const settingsButton = document.createElement("button");
    settingsButton.textContent = "Settings";
    settingsButton.style.padding = "5px 10px";
    settingsButton.style.border = "none";
    settingsButton.style.borderRadius = "3px";
    settingsButton.style.cursor = "pointer";
    settingsButton.style.backgroundColor = "#28a745";
    settingsButton.style.color = "#fff";

    settingsButton.addEventListener("click", () => {
        const newTarget = prompt("Enter Target Coordinates:", getFromStorage("targetcoord", ""));
        if (newTarget !== null) {
            localStorage.setItem("targetcoord", newTarget);
            console.log("New target saved:", newTarget);
        }

        const newGroup = prompt("Enter Group:", getFromStorage("groupID", ""));
        if (newGroup !== null) {
            localStorage.setItem("groupID", newGroup);
            console.log("New Group saved:", newGroup);
        }
    });

    container.appendChild(resetButton);
    container.appendChild(settingsButton);
    document.body.appendChild(container);
}

// Initialize script
(function () {
    initializeUI();

    const savedEndTime = localStorage.getItem("countdownEndTime");
    const remainingTime = savedEndTime ? Math.max(0, savedEndTime - Date.now()) : 0;

    if (remainingTime > 0) {
        console.log("Resuming previous countdown.");
        startCountdown(remainingTime / 60000);
    } else {
        console.log("Starting a new countdown.");
        startCountdown(Math.random() * 5 + 10); // Random interval (20-30 minutes)
    }
})();
