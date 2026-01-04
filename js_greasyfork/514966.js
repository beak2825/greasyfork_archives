// ==UserScript==
// @name Auto Send Attack (Pc & mobile)
// @version 1.1
// @description Set the desired arrival time and the script will automatically send the attack
// @include https://*/game.php?*&screen=place&try=confirm
// @namespace https://greasyfork.org/users/1388899
// @downloadURL https://update.greasyfork.org/scripts/514966/Auto%20Send%20Attack%20%28Pc%20%20mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514966/Auto%20Send%20Attack%20%28Pc%20%20mobile%29.meta.js
// ==/UserScript==

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

function setArrivalTime() {
    clearInterval(arrInterval);
    let arrivalTime, currentTime;
    arrInterval = setInterval(() => {
        arrivalTime = document.getElementsByClassName("relative_time")[0].textContent;
        currentTime = performance.now();
        logTime("Arrival Time", arrivalTime);
        if (arrivalTime.slice(-8) >= input || (currentTime - performance.now() >= delay)) {
            setTimeout(() => {
                logTime("Send Click Triggered", performance.now());
                document.getElementById("troop_confirm_submit").click();
            }, delay - 5);
            clearInterval(arrInterval);
        }
    }, 5);
}

function setSendTime() {
    clearInterval(attInterval);
    let serverTime;
    attInterval = setInterval(() => {
        serverTime = document.getElementById("serverTime").textContent;
        logTime("Server Time", serverTime);
        if (serverTime >= input) {
            setTimeout(() => {
                logTime("Send Click Triggered", performance.now());
                document.getElementById("troop_confirm_submit").click();
            }, delay - 5);
            clearInterval(attInterval);
        }
    }, 10);
}

document.getElementById("arrTime").onclick = function () {
    clearInterval(attInterval);
    let time = document.getElementsByClassName("relative_time")[0].textContent.slice(-8);
    input = prompt("Please enter desired arrival time", time);
    inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
    delay = parseInt(delayTime) + parseInt(inputMs);
    document.getElementById("showArrTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");
    document.getElementById("showSendTime").innerHTML = "";
    setArrivalTime();
};

document.getElementById("sendTime").onclick = function () {
    clearInterval(arrInterval);
    let time = document.getElementById("serverTime").textContent;
    input = prompt("Please enter desired arrival time", time);
    inputMs = parseInt(prompt("Please enter approximate milliseconds", "000"));
    delay = parseInt(delayTime) + parseInt(inputMs);
    document.getElementById("showSendTime").innerHTML = input + ":" + inputMs.toString().padStart(3, "0");
    document.getElementById("showArrTime").innerHTML = "";
    setSendTime();
};

document.getElementById("delayButton").onclick = function () {
    delayTime = parseInt($("#delayInput").val());
    localStorage.delayTime = JSON.stringify(delayTime);
    delay = parseInt(delayTime) + parseInt(inputMs);
    if (delay < 0) {
        delay = 0;
    }
};