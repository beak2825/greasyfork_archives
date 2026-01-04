// ==UserScript==
// @name Auto Send Att V2 (Pc & mobile)
// @version 2.1
// @description Set the desired arrival time and the script will automatically send the attack
// @include https://*/game.php?*&screen=place&try=confirm
// @namespace https://greasyfork.org/users/1388899
// @downloadURL https://update.greasyfork.org/scripts/515363/Auto%20Send%20Att%20V2%20%28Pc%20%20mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/515363/Auto%20Send%20Att%20V2%20%28Pc%20%20mobile%29.meta.js
// ==/UserScript==

function getPageIdentifier() {
  const urlParams = new URLSearchParams(window.location.search);
  const villageId = urlParams.get('village'); // Get the village ID from the URL
  return villageId ? `village_${villageId}` : 'unknown'; // Use 'village_' prefix to differentiate
}

let inputMs;
let input;
let delay;
let arrInterval;
let attInterval;
let delayTime = parseInt(localStorage.delayTime);
if (isNaN(delayTime)) {
    delayTime = 0;
    localStorage.delayTime = JSON.stringify(delayTime);
}

// Fungsi log waktu
function logTime(label, time) {
    console.log(`${label}: ${time}`);
}

let offsetHtml = `<tr>
    <td>
        Offset:
    </td>
    <td>
        <input id="delayInput" value="${delayTime}" style="width:50px">
        <a id="delayButton" class="btn">OK</a>
    </td>
</tr>`;

let setArrivalHtml = `<tr><td>Set arrival:</td><td id="showArrTime"></td></tr>`;
let sendAttackHtml = `<tr><td>Send at:</td><td id="showSendTime"></td></tr>`;
let buttons = `<a id="arrTime" class="btn" style="cursor:pointer;">Set arrival time</a>
               <a id="sendTime" class="btn" style="cursor:pointer;">Set send time</a>`;

document.getElementById("troop_confirm_submit").insertAdjacentHTML("afterend", buttons);
let parentTable = document.getElementById("date_arrival").parentNode.parentNode;
parentTable.insertAdjacentHTML("beforeend", offsetHtml + setArrivalHtml + sendAttackHtml);

function addSecondsToTime(timeString, secondsToAdd) {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);

    let newSeconds = seconds + secondsToAdd;
    let newMinutes = minutes;
    let newHours = hours;

    if (newSeconds >= 60) {
        newSeconds -= 60;
        newMinutes += 1;
    }
    if (newMinutes >= 60) {
        newMinutes -= 60;
        newHours += 1;
    }

    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;
}

function waitForElement(selector, callback) {
    const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
            clearInterval(interval);
            callback(element);
        }
    }, 100);
}

function setArrivalTime() {
    clearInterval(arrInterval);
    arrInterval = setInterval(() => {
        const arrivalTime = document.getElementsByClassName("relative_time")[0]?.textContent;
        if (!arrivalTime) return;

        const currentTime = performance.now();
        const modifiedArrivalTime = addSecondsToTime(arrivalTime.slice(-8), 15);

        logTime("Arrival Time", arrivalTime);
        if (modifiedArrivalTime === input && !localStorage.getItem("hasReloaded")) {
            localStorage.setItem("hasReloaded", "true");
            localStorage.setItem("inputTime", input);
            localStorage.setItem("inputMs", inputMs.toString());
            location.reload();
        } else if (arrivalTime.slice(-8) >= input) {
            if (currentTime - performance.now() >= delay) {
                setTimeout(() => {
                    logTime("Send Click Triggered", performance.now());
                    waitForElement("#troop_confirm_submit", (btn) => btn.click());
                }, delay - 5);
                clearInterval(arrInterval);
            }
        }
    }, 5);
}

function setSendTime() {
    clearInterval(attInterval);
    attInterval = setInterval(() => {
        const serverTime = document.getElementById("serverTime")?.textContent;
        if (!serverTime) return;

        logTime("Server Time", serverTime);
        const modifiedServerTime = addSecondsToTime(serverTime, 15);

        if (modifiedServerTime === input && !localStorage.getItem("hasReloaded")) {
            localStorage.setItem("hasReloaded", "true");
            localStorage.setItem("inputTime", input);
            localStorage.setItem("inputMs", inputMs.toString());
            location.reload();
        } else if (serverTime >= input) {
            setTimeout(() => {
                logTime("Send Click Triggered", performance.now());
                waitForElement("#troop_confirm_submit", (btn) => btn.click());
            }, delay - 5);
            clearInterval(attInterval);
        }
    }, 10);
}

document.getElementById("arrTime").onclick = function () {
    clearInterval(attInterval);
    const time = document.getElementsByClassName("relative_time")[0]?.textContent.slice(-8);
    input = prompt("Please enter desired arrival time", time);
    inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
    delay = parseInt(delayTime) + inputMs;

    localStorage.setItem("arrivalTime", input);
    localStorage.setItem("arrivalMs", inputMs.toString());

    document.getElementById("showArrTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");
    document.getElementById("showSendTime").innerHTML = "";
    setArrivalTime();
};


document.getElementById("sendTime").onclick = function () {
    clearInterval(arrInterval);
    const time = document.getElementById("serverTime").textContent;
    input = prompt("Please enter desired arrival time", time);
    inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
    delay = parseInt(delayTime) + parseInt(inputMs);
    document.getElementById("showSendTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");
    document.getElementById("showArrTime").innerHTML = "";
    setSendTime();
};

window.onload = function () {
    // Check if the page has been reloaded before
    if (localStorage.getItem("hasReloaded") === "true") {
        localStorage.removeItem("hasReloaded"); // Remove the reload flag

        // Retrieve and parse the time and delay
        input = localStorage.getItem("inputTime");
        inputMs = parseInt(localStorage.getItem("inputMs"));
        delay = parseInt(localStorage.delayTime) + inputMs;
        const applySettingsButton = document.getElementById('applySettings');
        // If the applySettingsButton exists, click it after loading units
        if (applySettingsButton) {
            const pageIdentifier = getPageIdentifier();
            const savedUnits = JSON.parse(localStorage.getItem(`units_${pageIdentifier}`)) || {};

            // Load units data into corresponding input fields
            document.getElementById('spear').value = savedUnits.spear || 0;
            document.getElementById('sword').value = savedUnits.sword || 0;
            document.getElementById('axe').value = savedUnits.axe || 0;
            document.getElementById('spy').value = savedUnits.spy || 0;
            document.getElementById('light').value = savedUnits.light || 0;
            document.getElementById('heavy').value = savedUnits.heavy || 0;
            document.getElementById('ram').value = savedUnits.ram || 0;
            document.getElementById('catapult').value = savedUnits.catapult || 0;
            document.getElementById('knight').value = savedUnits.knight || 0;
            document.getElementById('snob').value = savedUnits.snob || 0;
            document.getElementById('numAttack').value = savedUnits.numAttack || 0;

            // Click the apply settings button to apply the loaded units
            applySettingsButton.click();
        }

        // Display the input time with milliseconds
        document.getElementById("showArrTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");

        // Set up the interval for checking the arrival time
        const interval = setInterval(() => {
            const arrivalTimeElement = document.getElementsByClassName("relative_time")[0];
            if (!arrivalTimeElement) return; // If the element is not found, wait

            const arrivalTime = arrivalTimeElement.textContent.slice(-8);
            logTime("Checking Arrival Time", arrivalTime);

            // If the arrival time matches, trigger the submission
            if (arrivalTime == input) {
                clearInterval(interval); // Stop the interval
                setTimeout(() => {
                    waitForElement("#troop_confirm_submit", (btn) => btn.click());
                }, delay - 5);
            }
        }, 6); // Check every 6ms
    }
};


document.getElementById("delayButton").onclick = function () {
    delayTime = parseInt(document.getElementById("delayInput").value);
    localStorage.delayTime = JSON.stringify(delayTime);
    delay = parseInt(delayTime) + parseInt(inputMs || 0);
};
