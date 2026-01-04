// ==UserScript==
// @name         racenao
// @namespace    racenao.zero.nao
// @version      0.6
// @description  race helper for torn
// @author       nao [2669774]
// @match        https://www.torn.com/page.php?sid=racing
// @match        https://www.torn.com/loader.php?sid=racing
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522050/racenao.user.js
// @updateURL https://update.greasyfork.org/scripts/522050/racenao.meta.js
// ==/UserScript==

GM_addStyle(`
.race-button {
  color: white;
  margin: 5px;
  height: 40px;
padding: 5px !important;
border-radius: 5px;
background: #069494 !important;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

.blinking {
  animation: blink 1s infinite;
}

.save-button {
width: 50px;
}
`);

if (!localStorage.getItem("racesNao")) {
    localStorage.setItem("racesNao", JSON.stringify({}));
}

if (!localStorage.getItem("chosenCarsNao")) {
    localStorage.setItem("chosenCarsNao", JSON.stringify({}));
}

let races = JSON.parse(localStorage.getItem("racesNao"));
let chosenCars = JSON.parse(localStorage.getItem("chosenCarsNao"));
let lastRaceInfo;

let rfc = getRFC();

function getRFC() {
    var rfc = $.cookie("rfc_v");
    if (!rfc) {
        var cookies = document.cookie.split("; ");
        for (var i in cookies) {
            var cookie = cookies[i].split("=");
            if (cookie[0] == "rfc_v") {
                return cookie[1];
            }
        }
    }
    return rfc;
}

function saveRace() {
    const raceTitle = prompt(`
Race Name: ${lastRaceInfo.title}
Track: ${lastRaceInfo.trackID}
Min Drivers: ${lastRaceInfo.minDrivers}
Max Drivers: ${lastRaceInfo.maxDrivers}
Laps: ${lastRaceInfo.laps}
Min Class: ${lastRaceInfo.minClass}
Cars Type Allowed: ${lastRaceInfo.carsTypeAllowed}
Cars Allowed: ${lastRaceInfo.carsAllowed}
Bet Amount: ${lastRaceInfo.betAmount}
Wait Time: ${lastRaceInfo.waitTime}

Enter the race title:`);
    if (raceTitle) {
        races[raceTitle] = lastRaceInfo;
        localStorage.setItem("racesNao", JSON.stringify(races));
        updateRace();

        const saveButton = document.querySelector(".save-button");
        saveButton.classList.remove("blinking");
    }
}

function insert() {
    if (document.querySelector("#race-containr")) return;

    const container = document.querySelector("div[class^='titleContainer_']");

    if (!container) {
        setTimeout(insert, 1000);
        return;
    }


    const containerNao = document.createElement("div");
    containerNao.style.display = "flex";
    containerNao.id = "race-containr";
    containerNao.style.flexDirection = "column";
    container.parentNode.parentNode.appendChild(containerNao);

    const saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.className = "race-button save-button";
    saveButton.addEventListener("click", function () {
        saveRace();
    });
    containerNao.appendChild(saveButton);

    const racesContainer = document.createElement("div");
    racesContainer.className = "races-container";
    containerNao.appendChild(racesContainer);


    for (let raceId in races) {
        const raceName = raceId;
        const raceButton = document.createElement("button");
        raceButton.innerText = raceName;
        raceButton.className = "race-button";
        raceButton.addEventListener("click", function () {
            startRace(raceId);
        });
        raceButton.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            removeRace(raceId);
        });

        racesContainer.appendChild(raceButton);
    }
}

function updateRace() {
    const racesContainer = document.querySelector(".races-container");
    racesContainer.innerHTML = "";
    for (let raceId in races) {
        const raceName = raceId;
        const raceButton = document.createElement("button");
        raceButton.innerText = raceName;
        raceButton.className = "race-button";
        raceButton.addEventListener("click", function () {
            startRace(raceId);
        });
        raceButton.addEventListener("contextmenu", function (e) {
            e.preventDefault();
            removeRace(raceId);
        });

        racesContainer.appendChild(raceButton);
    }
}

function removeRace(raceId) {
    delete races[raceId];
    localStorage.setItem("racesNao", JSON.stringify(races));
    updateRace();
}

function startRace(raceId) {
    const raceName = races[raceId].title;
    const minDrivers = races[raceId].minDrivers;
    const maxDrivers = races[raceId].maxDrivers;
    const trackId = races[raceId].trackID;
    const laps = races[raceId].laps;
    const minClass = races[raceId].minClass;
    const carsTypeAllowed = races[raceId].carsTypeAllowed;
    const carsAllowed = races[raceId].carsAllowed;
    const betAmount = races[raceId].betAmount;
    const waitTime = races[raceId].waitTime;
    const carId = races[raceId].carID;

    let raceLink = `https://www.torn.com/page.php?sid=racing&tab=customrace&section=getInRace&step=getInRace&id=&carID=${carId}&createRace=true&title=${raceName}&minDrivers=${minDrivers}&maxDrivers=${maxDrivers}&trackID=${trackId}&laps=${laps}&minClass=${minClass}&carsTypeAllowed=${carsTypeAllowed}&carsAllowed=${carsAllowed}&betAmount=${betAmount}&waitTime=0&rfcv=${getRFC()}`;
    $.post(raceLink, function (response) {
        console.log("Race started");
        const saveButton = document.querySelector(".save-button");
        saveButton.classList.remove("blinking");
    });
}

insert();
setInterval(insert, 300);

const originalAjax = $.ajax;
$.ajax = function (options) {
    console.log("[RACENAO] :", options);
    if (options?.url?.includes("sid=racing") && options?.url?.includes("getInRace")) {
        const requestUrl = options.url.split("step=getInRace&")[1];
        const urlPieces = requestUrl.split("&");

        lastRaceInfo = {};
        for (let piece of urlPieces) {
            const [key, value] = piece.split("=");
            lastRaceInfo[key] = value;
        }

        const saveButton = document.querySelector(".save-button");
        if (lastRaceInfo && lastRaceInfo.title) {
            saveButton.classList.add("blinking");
        } else {
            saveButton.classList.remove("blinking");
        }
    }

    return originalAjax(options);
};

function checkForRace() {
    const raceTitle =
          $("div.enlisted-btn-wrap:nth-child(1)")?.text() || undefined;
    if (raceTitle) {
        showPreference(raceTitle);
    }
}

function showPreference(raceTitle) {
    if (chosenCars[raceTitle]) {
        const link = chosenCars[raceTitle];
        const carLink = document.createElement("a");
        carLink.href = link;
        $("div.enlisted-btn-wrap:nth-child(1)").append(carLink);
    }
}
