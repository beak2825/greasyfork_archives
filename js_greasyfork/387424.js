// ==UserScript==
// @name         Auto Builder
// @version      0.5.4
// @description  Adds buildings to queue automatically
// @author       FunnyPocketBook
// @match        https://*/game.php?village=*&screen=main*
// @grant        none
// @namespace https://greasyfork.org/users/151096
// @downloadURL https://update.greasyfork.org/scripts/387424/Auto%20Builder.user.js
// @updateURL https://update.greasyfork.org/scripts/387424/Auto%20Builder.meta.js
// ==/UserScript==

/**
 * TODO
 * - buildingQueue.splice(0, 1); might cause issues because of async
 */

"use strict";
let buildingObject;
let selection;
let scriptStatus = false; // false == script not running, true == script running
let isBuilding = false; // Prevents sending multiple orders of the same building. false == building can be built

class BQueue {
    constructor(bQueue, bQueueLength) {
        this.buildingQueue = bQueue;
        this.buildingQueueLength = bQueueLength;
    }
    add(building, display) {
        this.buildingQueue.push(building);
        if (display) {
            let ele = document.createElement("tr");
            ele.innerHTML = `<td>${building}</td>
                <td class="delete-icon-large hint-toggle float_left"></td>`;
            ele.addEventListener("click", () => {
                this.removeBuilding(ele);
            });
            document.getElementById("autoBuilderTable").appendChild(ele);
        }
    }
    /**
     * Appends buildings to a table
     * @param {DOM element} parent The element (table) where the buildings should be appended to.
     */
    display(parent) {
        this.buildingQueue.forEach((building) => {
            let ele = document.createElement("tr");
            ele.innerHTML = `<td>${building}</td>
                <td class="delete-icon-large hint-toggle float_left"></td>`;
            ele.addEventListener("click", () => {
                this.removeBuilding(ele);
            });
            parent.appendChild(ele);
        });
    }
    removeBuilding(ele) {
        this.buildingQueue.splice(ele.rowIndex - 3, 1);
        ele.remove();
        localStorage.buildingObject = JSON.stringify(buildingObject);
    }
}

init();

function init() {
    const putEleBefore = document.getElementById("content_value");
    let newDiv = document.createElement("div");
    const selectBuildingHtml = "<td><select id=\"selectBuildingHtml\"> " +
        "<option value=\"main\">Headquarters</option> " +
        "<option value=\"barracks\">Barracks</option> " +
        "<option value=\"stable\">Stable</option> " +
        "<option value=\"garage\">Workshop</option> " +
        "<option value=\"watchtower\">Watchtower</option> " +
        "<option value=\"smith\">Smithy</option> " +
        "<option value=\"market\">Market</option> " +
        "<option value=\"wood\">Timber Camp</option> " +
        "<option value=\"stone\">Clay Pit</option> " +
        "<option value=\"iron\">Iron Mine</option> " +
        "<option value=\"farm\">Farm</option> " +
        "<option value=\"storage\">Warehouse</option> " +
        "<option value=\"hide\">Hiding Place</option> " +
        "<option value=\"wall\">Wall</option> " +
        "</select></td>";
    let newTable = `<table id="autoBuilderTable">
        <tr>
            <td><button id="startBuildingScript" class="btn">Start</button></td>
        </tr>
        <tr>
            <td>Queue length:</td>
            <td><input id='queueLengthInput' style='width:30px'></td>
            <td><button id='queueLengthBtn' class='btn'>OK</button></td>
            <td><span id='queueText'></span></td>
        </tr>
        <tr>
            <td>Building</td>
            ${selectBuildingHtml}
            <td><button id='addBuilding' class='btn'>Add</button></td>
        </tr>
        </table>`;

    newDiv.innerHTML = newTable;
    putEleBefore.parentElement.parentElement.insertBefore(newDiv, putEleBefore.parentElement);

    selection = document.getElementById("selectBuildingHtml");
    let premiumBQueueLength = game_data.features.Premium.active ? 5 : 2;

    // Checks if localStorage exists
    if (localStorage.buildingObject) {
        // Checks if village exists in localStorage
        if (JSON.parse(localStorage.buildingObject)[game_data.village.id]) {
            let newBqueue = JSON.parse(localStorage.buildingObject)[game_data.village.id];
            buildingObject = new BQueue(newBqueue.buildingQueue, newBqueue.buildingQueueLength); // Save stored BQueue in new BQueue
            document.getElementById("queueLengthInput").value = buildingObject.buildingQueueLength;
            // Add each building in the BQueue to the actual queue
            buildingObject.buildingQueue.forEach((b) => {
                addBuilding(b);
            });
        }
        // Else create empty village and add into localStorage
        else {
            buildingObject = new BQueue([], premiumBQueueLength);
            document.getElementById("queueLengthInput").value = premiumBQueueLength;
            let setLocalStorage = JSON.parse(localStorage.buildingObject);
            setLocalStorage[game_data.village.id] = buildingObject;
            localStorage.buildingObject = JSON.stringify(setLocalStorage);
        }
    }
    // Else create new object
    else {
        buildingObject = new BQueue([], premiumBQueueLength);
        let newLocalStorage = { [game_data.village.id]: buildingObject };
        localStorage.buildingObject = JSON.stringify(newLocalStorage);
    }

    eventListeners();

    if (localStorage.scriptStatus) {
        scriptStatus = JSON.parse(localStorage.scriptStatus);
        if (scriptStatus) {
            document.getElementById("startBuildingScript").innerText = "Stop";
            startScript();
        }
    }
}


function startScript() {
    let currentBuildLength = 0;
    if (document.getElementById("buildqueue")) {
        currentBuildLength = document.getElementById("buildqueue").rows.length - 2;
    }
    setInterval(function () {
        let btn = document.querySelector(".btn-instant-free");
        if (btn && btn.style.display != "none") {
            btn.click();
        }
        if (buildingObject.buildingQueue.length !== 0) {
            let building = buildingObject.buildingQueue[0];
            let wood = parseInt(document.getElementById("wood").textContent);
            let stone = parseInt(document.getElementById("stone").textContent);
            let iron = parseInt(document.getElementById("iron").textContent);
            let woodCost = 9999999;
            let stoneCost = 9999999;
            let ironCost = 9999999;

            try {
                woodCost = parseInt(document.querySelector("#main_buildrow_" + building + " > .cost_wood").getAttribute("data-cost"));
                stoneCost = parseInt(document.querySelector("#main_buildrow_" + building + " > .cost_stone").getAttribute("data-cost"));
                ironCost = parseInt(document.querySelector("#main_buildrow_" + building + " > .cost_iron").getAttribute("data-cost"));
            } catch (e) { console.log("Error getting building cost"); }

            if (document.getElementById("buildqueue")) {
                currentBuildLength = document.getElementById("buildqueue").rows.length - 2;
            }
            if (currentBuildLength < buildingObject.buildingQueueLength && !isBuilding && scriptStatus && wood >= woodCost && stone >= stoneCost && iron >= ironCost) {
                isBuilding = true;
                console.log("Sending build order for " + building);
                setTimeout(function () {
                    buildBuilding(building);
                }, Math.floor(Math.random() * 500 + 1000));
            }
        }
    }, 1000);
}

function addBuilding(building) {
    let ele = document.createElement("tr");
    ele.innerHTML = `<td>${building}</td>
    <td class="delete-icon-large hint-toggle float_left" style="cursor:pointer"></td>`;
    ele.childNodes[2].addEventListener("click", function () {
        removeBuilding(ele);
    });
    document.getElementById("autoBuilderTable").appendChild(ele);
}

/**
 * Removes the row of the building that should be removed. -3 because there are three other rows in the table
 * @param {DOM} ele table row of building queue to be removed
 */
function removeBuilding(ele) {
    buildingObject.buildingQueue.splice(ele.rowIndex - 3, 1);
    let setLocalStorage = JSON.parse(localStorage.buildingObject);
    setLocalStorage[game_data.village.id] = buildingObject;
    localStorage.buildingObject = JSON.stringify(setLocalStorage);
    ele.remove();
}

function buildBuilding(building) {
    let data = {
        "id": building,
        "force": 1,
        "destroy": 0,
        "source": game_data.village.id,
        "h": game_data.csrf
    };
    let url = "/game.php?village=" + game_data.village.id + "&screen=main&ajaxaction=upgrade_building&type=main&";
    $.ajax({
        url: url,
        type: "post",
        data: data,
        headers: {
            "Accept": "application/json, text/javascript, */*; q=0.01",
            "TribalWars-Ajax": 1
        }
    }).done(function (r) {
        let response = JSON.parse(r);
        if (response.error) {
            UI.ErrorMessage(response.error[0]);
            console.error(response.error[0]);
        } else if (response.response.success) {
            UI.SuccessMessage(response.response.success);
            console.log(response.response.success);
            // TODO: might cause issues because of async
            buildingObject.buildingQueue.splice(0, 1);
            let setLocalStorage = JSON.parse(localStorage.buildingObject);
            setLocalStorage[game_data.village.id] = buildingObject;
            localStorage.buildingObject = JSON.stringify(setLocalStorage);
            document.querySelector("#autoBuilderTable > tr").remove();
            setTimeout(() => { window.location.reload(); }, Math.floor(Math.random() * 50 + 500));
        }
    }).fail(function () {
        UI.ErrorMessage("Something bad happened. Please contact FunnyPocketBook#9373");
        console.log("Something bad happened. Please contact FunnyPocketBook#9373");
    }).always(function () {
        isBuilding = false;
    });
}


function eventListeners() {
    // #region Query
    // Enter triggers OK for "Queue length"
    document.getElementById("queueLengthInput").addEventListener("keydown", clickOnKeyPress.bind(this, 13, "#queueLengthBtn"));

    // Saves query length
    document.getElementById("queueLengthBtn").addEventListener("click", function () {
        let qLength = parseInt(document.getElementById("queueLengthInput").value);
        if (Number.isNaN(qLength)) {
            qLength = 2;
        }
        if (!game_data.features.Premium.active && qLength > 2) {
            buildingObject.buildingQueueLength = 2;
        } else {
            buildingObject.buildingQueueLength = qLength;
        }
        let setLocalStorage = JSON.parse(localStorage.buildingObject);
        setLocalStorage[game_data.village.id] = buildingObject;
        localStorage.buildingObject = JSON.stringify(setLocalStorage);
        if (!game_data.features.Premium.active && qLength > 2) {
            document.getElementById("queueText").innerHTML = " Premium account not active, queue length set to 2.";
        } else if (parseInt(buildingObject.buildingQueueLength) > 5) {
            document.getElementById("queueText").innerHTML = " Queue length set to " + buildingObject.buildingQueueLength + ". There will be additional costs for more than 5 constructions in the queue";
        } else {
            document.getElementById("queueText").innerHTML = " Queue length set to " + buildingObject.buildingQueueLength;
        }
        document.getElementById("queueLengthInput").value = buildingObject.buildingQueueLength;
    });
    // #endregion Query

    // #region Building
    document.getElementById("addBuilding").addEventListener("click", function () {
        let b = selection.options[selection.selectedIndex].value;
        buildingObject.buildingQueue.push(selection.options[selection.selectedIndex].value);
        let setLocalStorage = JSON.parse(localStorage.buildingObject);
        setLocalStorage[game_data.village.id] = buildingObject;
        localStorage.buildingObject = JSON.stringify(setLocalStorage);
        addBuilding(b);
    });
    document.getElementById("startBuildingScript").addEventListener("click", function () {
        if (document.getElementById("startBuildingScript").innerText === "Start") {
            document.getElementById("startBuildingScript").innerText = "Stop";
            scriptStatus = true;
            localStorage.scriptStatus = JSON.stringify(scriptStatus);
            startScript();
        } else {
            document.getElementById("startBuildingScript").innerText = "Start";
            scriptStatus = false;
            localStorage.scriptStatus = JSON.stringify(scriptStatus);
        }
    });
    // #endregion Building
}

/**
 * Triggers a click on a keypress
 * @param {int} key key that has been pressed
 * @param {string} selector CSS selector of the element that is to be triggered
 */
function clickOnKeyPress(key, selector) {
    "use strict";
    if (event.defaultPrevented) {
        return; // Should do nothing if the default action has been cancelled
    }
    let handled = false;
    if (event.key === key) {
        document.querySelector(selector).click();
        handled = true;
    } else if (event.keyIdentifier === key) {
        document.querySelector(selector).click();
        handled = true;
    } else if (event.keyCode === key) {
        document.querySelector(selector).click();
        handled = true;
    }
    if (handled) {
        event.preventDefault();
    }
}