// ==UserScript==
// @name RetroGameBuddy
// @match https://retro-game.org/flights/send?body=*
// @version          0.2.1
// @description Adds links on the "Send Fleet" screen to fill in the required number of ships of each type to carry all resources.
// @license      AGPL-3.0
// @namespace https://greasyfork.org/users/965083
// @downloadURL https://update.greasyfork.org/scripts/452296/RetroGameBuddy.user.js
// @updateURL https://update.greasyfork.org/scripts/452296/RetroGameBuddy.meta.js
// ==/UserScript==
var loopC = 0;

/* Add up all resources to get a single number value */
let getTotalResources = () => {
    const METAL_ELEM = document.querySelector("#top-bar-resources :nth-child(1) p:nth-of-type(2)");
    const METAL_STR = METAL_ELEM.innerHTML.replace(/,/g, '');
    const METAL_NUM = parseInt(METAL_STR, 10);

    const CRYSTAL_ELEM = document.querySelector("#top-bar-resources :nth-child(2) p:nth-of-type(2)");
    const CRYSTAL_STR = CRYSTAL_ELEM.innerHTML.replace(/,/g, '');
    const CRYSTAL_NUM = parseInt(CRYSTAL_STR, 10);

    const DEUT_ELEM = document.querySelector("#top-bar-resources :nth-child(3) p:nth-of-type(2)");
    const DEUT_STR = DEUT_ELEM.innerHTML.replace(/,/g, '');
    const DEUT_NUM = parseInt(DEUT_STR, 10);

    return METAL_NUM + CRYSTAL_NUM + DEUT_NUM;
}

/* Parse planet or moon name to extract coordinates
    The regexes used here might not be appropriate for your planets and moons!
*/
function getGalaxy(coordStr) {
    return coordStr.match(/([0-9])\-[0-9]{1,3}-[0-9]{1,2}/)[1];
}

function getSystem(coordStr) {
    return coordStr.match(/[0-9]\-([0-9]{1,3})-[0-9]{1,2}/)[1];
}

function getPosition(coordStr) {
    return coordStr.match(/[0-9]\-[0-9]{1,3}-([0-9]{1,2})/)[1];
}

/* Uses modified code from RetroGame source code (linked below)
 * https://github.com/retro-game/retro-game/blob/9ef5b2037a610dda3dac4cf615a18fbe1ba32c24/src/main/java/com/github/retro_game/retro_game/service/impl/FlightServiceImpl.java#L607
 * Is it better to use the 'distance' provided on the send-fleet screen than calculate it myself?
 */
function calculateDistance(a, b) {
    let ga = a[0];
    let gb = b[0];
    if (ga != gb) {
        let diff = Math.abs(ga - gb);
        return 20000 * Math.min(diff, 5 - diff);
    }

    let sa = a[1];
    let sb = b[1];
    if (sa != sb) {
        let diff = Math.abs(sa - sb);
        return 95 * Math.min(diff, 500 - diff) + 2700;
    }

    let pa = a[2];
    let pb = b[2];
    if (pa != pb) {
        let diff = Math.abs(pa - pb);
        return 5 * diff + 1000;
    }

    return 5;
}

/* - Doesn't actually take into account maxSpeed (slowest unit)
 * - Doesn't account for impulse drive level
 */
let calcConsumption = (speedFactor, maxSpeed, unitSpeed, capacity, baseConsumption, baseReqAmt, currentCoord, targetCoord) => {
    const DISTANCE = calculateDistance(currentCoord, targetCoord) / 35000.0;
    const X = speedFactor * Math.sqrt(maxSpeed / unitSpeed) + 1.0;

    let consumption = baseReqAmt * (baseConsumption * DISTANCE) * X * X;

    const NEW_AMT = baseReqAmt + Math.ceil(consumption / capacity);

    consumption = NEW_AMT * (baseConsumption * DISTANCE) * X * X;

    return Math.ceil(consumption);
}

/* Selects the appropriate unit row from the send-fleet table */
let getUnitElem = (index) => {
    return document.querySelector(`#send-fleet table tbody :nth-child(${index}) td`);
}

/* Adds a link next to the available units which, when clicked, inserts the
 * number of required units into input field
 */
let addButton = (parentElem, req, inputId) => {
    const ID_STR = `rgmb-btn-${inputId}`;

    let existingButton = document.getElementById(ID_STR);
    if (existingButton) {
        existingButton.remove();
    }

    let buttonElem = document.createElement("span");
    buttonElem.id = ID_STR;
    buttonElem.style.marginLeft = "4px";
    buttonElem.innerHTML = `<a href="#">(${req})</a>`;
    buttonElem.addEventListener('click', () => {
        let inputElem = document.getElementById(inputId);
        inputElem.value = req;
    });
    parentElem.appendChild(buttonElem);
}

/* For convienient access in getRequiredUnits */
class Unit {
    constructor(capacity, consumption, speed) {
        this.capacity = capacity;
        this.consumption = consumption;
        this.speed = speed;
    }
}

/* Adds a button for each unit to fill in the required number */
let getRequiredUnits = (totalResources, currentCoord, targetCoord) => {
    const PARENT_ELEM = document.querySelector("#send-fleet table tbody");
    const ROWS = [...PARENT_ELEM.querySelectorAll("tr")];

    /* Get SC to DS, ignore the rest */
    const UNIT_LIST = ROWS.slice(2, 14).map(u => {
        const DETAILS_REGEX = /Capacity\: <strong>(.*?)<\/strong>.*?Consumption\: <strong>(.*?)<\/strong>.*?Speed\: <strong>(.*?)<\/strong>/;

        const TOOLTIP_ELEM = u.querySelector(`td label span`).getAttribute("data-tooltip-title");

        const U_DETAILS_MATCHES = TOOLTIP_ELEM.match(DETAILS_REGEX);
        const U_CAPACITY = parseFloat(U_DETAILS_MATCHES[1].replace(/,/g, ''));
        const U_CONSUMPTION = parseFloat(U_DETAILS_MATCHES[2].replace(/,/g, ''));
        const U_SPEED = parseFloat(U_DETAILS_MATCHES[3].replace(/,/g, ''));

        return new Unit(U_CAPACITY, U_CONSUMPTION, U_SPEED);
    });

    const SPEED_VAL = parseFloat(ROWS[20].querySelector("select").value);

    const REQ_UNITS = UNIT_LIST.map(u => {
        const BASE_REQ = Math.ceil(totalResources / u.capacity);
        return BASE_REQ + Math.ceil(calcConsumption(SPEED_VAL * 0.1, u.speed, u.speed, u.capacity, u.consumption, BASE_REQ, currentCoord, targetCoord) / u.capacity);
    });

    const UNIT_IDS = [
        "unit_SMALL_CARGO",
        "unit_LARGE_CARGO",
        "unit_LITTLE_FIGHTER",
        "unit_HEAVY_FIGHTER",
        "unit_CRUISER",
        "unit_BATTLESHIP",
        "unit_COLONY_SHIP",
        "unit_RECYCLER",
        "unit_ESPIONAGE_PROBE",
        "unit_BOMBER",
        "unit_DESTROYER",
        "unit_DEATH_STAR",
    ];

    for (let i = 0; i < 12; i++) {
        addButton(getUnitElem(3 + i), REQ_UNITS[i], UNIT_IDS[i]);
    }
}

function addReqCargo() {
    const CURRENT_BODY = document.querySelector("#top-bar-body-list select option[selected=selected]").innerHTML;
    const CURRENT_G = getGalaxy(CURRENT_BODY);
    const CURRENT_S = getSystem(CURRENT_BODY);
    const CURRENT_P = getPosition(CURRENT_BODY);
    const CURRENT_COORD = [CURRENT_G, CURRENT_S, CURRENT_P];
    const TOTAL_RESOURCES = getTotalResources();

    document.querySelector("#own-bodies").addEventListener('change', () => {
        const PARENT_ELEM = document.querySelector("#send-fleet table tbody");
        const ROWS = [...PARENT_ELEM.querySelectorAll("tr")];
        const TARGET_ROW = ROWS[18];
        const TARGET_G = TARGET_ROW.childNodes[3].childNodes[1].value;
        const TARGET_S = TARGET_ROW.childNodes[3].childNodes[3].value;
        const TARGET_P = TARGET_ROW.childNodes[3].childNodes[5].value;
        const TARGET_COORD = [TARGET_G, TARGET_S, TARGET_P];
        getRequiredUnits(TOTAL_RESOURCES, CURRENT_COORD, TARGET_COORD)
    });
}

function retroGameBuddy() {
    addReqCargo();
}

/* Set up execution */
if (document.readyState !== 'loading') {
    retroGameBuddy();
} else {
    window.addEventListener('DOMContentLoaded', () => {
        runScript();
    });
}