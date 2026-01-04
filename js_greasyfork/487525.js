// ==UserScript==
// @name         Auto Expeditions by Yuu
// @namespace    http://tampermonkey.net/
// @version      2024-02-17
// @description  confidental
// @author       @yuu
// @match        https://ogame.fun/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ogame.fun
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487525/Auto%20Expeditions%20by%20Yuu.user.js
// @updateURL https://update.greasyfork.org/scripts/487525/Auto%20Expeditions%20by%20Yuu.meta.js
// ==/UserScript==

let microWait = 85;
const spyProbeID = 210;
const expeditionShipNumber = 10;
let expeditionsToSend = 4;
const defaultRefreshTime = 20000;
let page = extractGet('page'), currentLocation = page;
let missionId = extractGet('target_mission');

createMenuElement('Auto Expeditions', 'expeditions');

function submit(time){
    if(document.getElementsByClassName('button green medium')){
        setTimeout(function() {
            document.getElementsByClassName('button green medium')[0].click();
        }, time);
    }
}

function createMenuElement(elementName, page, icon = ''){
    var menuTable = document.getElementById('menuTable');
    var newElement = document.createElement('li');
    newElement.innerHTML = `<span class="${icon}"></span>` +
        `<a class="menubutton" href="game.php?page=${page}" target="_self">` +
        `<span class="textlabel">${elementName}</span></a>`;
    if(menuTable){
        menuTable.appendChild(newElement);
    }
}

function getSelectedGalaxyAndSystem() {
    const selectedOptionText = document.querySelector('#planetSelector option:checked').textContent;
    const regex = /\[(\d+):(\d+):(\d+)\]/;
    const match = regex.exec(selectedOptionText);

    if (match) {
        return { galaxy: parseInt(match[1]), system: parseInt(match[2]), planet: parseInt(match[3]) };
    } else {
        return null;
    }
}

function shipOperation(action, shipID, number = null) {
    // Construct the input element's name based on shipID
    const inputName = `ship${shipID}`;
    // Find the input element
    const inputElement = document.querySelector(`input[name="${inputName}"]`);

    if (!inputElement) {
        console.warn(`Input for shipID ${shipID} not found.`);
        return;
    }

    switch (action) {
        case 'getShipNumber':
            // Return the data-max attribute as BigInt
            return BigInt(inputElement.getAttribute('data-max'));

        case 'setShipNumber':
            if (number !== null) {
                // Set the input's value to the specified number
                inputElement.value = number.toString();
            } else {
                console.warn('setShipNumber requires a number argument.');
            }
            break;

        case 'setMaxShipNumber':
            // Set the input's value to its data-max attribute value
            inputElement.value = inputElement.getAttribute('data-max');
            break;

        default:
            console.warn('Invalid action specified.');
    }
}

function refresh(time = defaultRefreshTime){
    var msToSec = time/1000;
    setTimeout(function(){ window. location. reload(); }, time);
    console.log(`Refresh queued for ${msToSec} seconds from now`);
}

function extractGet(get) {
    let url = new URL(window.location.href);
    if(url.searchParams.get(get)){
        return url.searchParams.get(get);
    } else {
        return false;
    }
}

if(currentLocation == "fleetTable" && missionId == '15'){
    setTimeout(shipOperation('setShipNumber', spyProbeID, expeditionShipNumber), microWait);
    submit(3500);
}

if(currentLocation == "fleetStep1"){
    submit(10000);
}

if(currentLocation == "fleetStep2"){
    submit(10000);
}

if(currentLocation == "fleetStep3"){
    window.close();
}

if(currentLocation == "expeditions"){

    const headerRS = document.querySelector('.headerRS');
    const mainRS = document.querySelector('.mainRS');
    // Clear existing content
    if (headerRS) {
        headerRS.innerHTML = ''; // Remove existing content

        // Create new elements
        const planetDiv = document.createElement('div');
        planetDiv.id = 'planet';
        planetDiv.style = 'background:url(https://i.imgur.com/t1s79xv.jpeg) no-repeat; height:250px; width:654px;';
        planetDiv.innerHTML = '<h2>Expeditions</h2>';

        const technologyDetailsWrapper = document.createElement('div');
        technologyDetailsWrapper.id = 'technologydetails_wrapper';
        technologyDetailsWrapper.style = 'height:250px';
        technologyDetailsWrapper.innerHTML = '<div id="technologydetails_content" class="small"></div>';

        const csLeftDiv = document.createElement('div');
        csLeftDiv.className = 'cs-left';
        csLeftDiv.style = 'top:214px';

        const csRightDiv = document.createElement('div');
        csRightDiv.className = 'cs-right';
        csRightDiv.style = 'top:214px';

        // Append new elements to the headerRS
        headerRS.appendChild(planetDiv);
        headerRS.appendChild(technologyDetailsWrapper);

    }

    function countExpeditionFleets() {
        const allFleets = document.querySelectorAll('span.return.owntransport');
        let expeditionFleetsCount = 0;

        allFleets.forEach(fleet => {
            if (fleet.textContent.includes('Expedition')) {
                expeditionFleetsCount++;
            }
        });

        return expeditionFleetsCount;
    }
    // Function to open new page if conditions are met
    function openNewPageIfNeeded() {
        const fleetCount = countExpeditionFleets();
        if (fleetCount < expeditionsToSend) {
            const lastOpenedTimestamp = localStorage.getItem('lastOpenedTimestamp');
            const currentTime = new Date().getTime();
            if (!lastOpenedTimestamp || currentTime - lastOpenedTimestamp >= 30000) {
                const coords = getSelectedGalaxyAndSystem();
                if (coords) {
                    const url = `game.php?page=fleetTable&galaxy=${coords.galaxy}&system=${coords.system}&planet=16&planettype=1&target_mission=15`;
                    window.open(url, '_blank');
                    localStorage.setItem('lastOpenedTimestamp', currentTime.toString());
                }
            }
        }
    }

    // Check conditions and possibly open new page
    openNewPageIfNeeded();

    if (mainRS){
        mainRS.style = 'display: block; margin-top: 220px';
        mainRS.innerHTML = '</br></br>';
    }

    // Step 1: Find all fleet events
    const fleetEvents = document.querySelectorAll('.OvfleetEvents_');

    // Step 2: Filter for Expedition missions
    const expeditionFleets = Array.from(fleetEvents).filter(event => {
        // Check if the mission description includes "Mission: Expedition"
        return event.innerHTML.includes('Mission: Expedition');
    });

    // Step 3: Append filtered events to the mainRS element
    expeditionFleets.forEach(fleet => {
        // Clone the node if you want to keep the original in place or just append it directly if you want to move it
        const clone = fleet.cloneNode(true);
        clone.style = "background-color: none; padding-top: 10px; padding-left: 20px; padding-right: 20px;";
        mainRS.appendChild(clone);
    });

    refresh(60000);
}