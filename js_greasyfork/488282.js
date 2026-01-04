// ==UserScript==
// @name         Troopcounter
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  try to take over the world!
// @author       Vonk
// @match        https://nl114.grepolis.com/game/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488282/Troopcounter.user.js
// @updateURL https://update.greasyfork.org/scripts/488282/Troopcounter.meta.js
// ==/UserScript==

(function () {
'use strict';

$(document).ready(function () {
if (Game.world_id == "nl114") {
addTroopCounterButton();
setTimeout(function() {
fetchData();
setInterval(fetchData, 600000);
}, 10000);


function addTroopCounterButton() {
if (document.getElementById('troopCounterButton') == null) {
var a = document.createElement('div');
a.id = "troopCounterButton";
a.className = 'btn_settings circle_button_small';
a.style.top = '90px';
a.style.right = '57px';
a.style.zIndex = '10000';
a.innerHTML = "T";
document.getElementById('ui_box').appendChild(a);
$("#troopCounterButton").click(function () {
createTroopcounterWindow();
});
}
}

var troops = [
{ "id": 1, "name": "sword" },
{ "id": 2, "name": "archer" },
{ "id": 3, "name": "hoplite" },
{ "id": 4, "name": "slinger" },
{ "id": 5, "name": "rider" },
{ "id": 6, "name": "chariot" },
{ "id": 7, "name": "catapult" },
{ "id": 8, "name": "godsent" },
{ "id": 9, "name": "manticore" },
{ "id": 10, "name": "harpy" },
{ "id": 11, "name": "pegasus" },
{ "id": 12, "name": "griffin" },
{ "id": 13, "name": "cerberus" },
{ "id": 14, "name": "minotaur" },
{ "id": 15, "name": "medusa" },
{ "id": 16, "name": "zyklop" },
{ "id": 17, "name": "centaur" },
{ "id": 18, "name": "sea_monster" },
{ "id": 19, "name": "ladon" },
{ "id": 20, "name": "spartoi" },
{ "id": 21, "name": "small_transporter" },
{ "id": 22, "name": "big_transporter" },
{ "id": 23, "name": "bireme" },
{ "id": 24, "name": "attack_ship" },
{ "id": 25, "name": "trireme" },
{ "id": 26, "name": "colonize_ship" },
{ "id": 27, "name": "siren" },
{ "id": 28, "name": "fury" },
{ "id": 29, "name": "demolition_ship" },
{ "id": 30, "name": "satyr" },
{ "id": 31, "name": "calydonian_boar" }
];

function createTroopcounterWindow() {
var windowExists = false;
var windowItem = null;
for (var item of document.getElementsByClassName('ui-dialog-title')) {
if (item.innerHTML == "TroopCounter") {
windowExists = true;
windowItem = item;
}
}
if (!windowExists) {
var wnd = Layout.wnd.Create(Layout.wnd.TYPE_DIALOG, "TroopCounter");
wnd.setContent('');
}
for (var item of document.getElementsByClassName('ui-dialog-title')) {
if (item.innerHTML == "TroopCounter") {
windowItem = item;
}
}
wnd.setHeight('500');
wnd.setWidth('750');
wnd.setTitle("TroopCounter");
var title = windowItem;
var frame = title.parentElement.parentElement.children[1].children[4];
frame.innerHTML = '';



var html = document.createElement('html');
var body = document.createElement('div');
var head = document.createElement('head');
var element = document.createElement('h3');
element.innerHTML = "TroopCounter";
element.style.margin = '0 auto';
body.appendChild(element);

var tableContainer = document.createElement('div');
tableContainer.style.height = '300px';
tableContainer.style.overflowY = 'auto';

var table = document.createElement('table');
table.id = "troopcounterTable";
table.style.overflowX = 'scroll';

tableContainer.appendChild(table);
var headerRow = document.createElement('tr');
var playernameHeader = document.createElement('th');
playernameHeader.textContent = 'Playername';
headerRow.appendChild(playernameHeader);

troops.forEach(function (troop) {
var th = document.createElement('th');
var spanElement = document.createElement('span');
spanElement.setAttribute('class', 'unit index_unit unit_icon40x40 ' + troop.name);
th.appendChild(spanElement);
headerRow.appendChild(th);
});

table.appendChild(headerRow);


body.appendChild(tableContainer);
frame.appendChild(body);

// Add login inputs
var loginDiv = document.createElement('div');
loginDiv.style.marginTop = "10px";
if (localStorage.getItem('username') !== null && localStorage.getItem('password') !== null) {
loginDiv.innerHTML = `
<button id="loadButton">Laad/Update troepen</button>
<button id="fetchData">Update eigen data</button>
`;
frame.appendChild(loginDiv);
} else {
loginDiv.innerHTML = `
Username: <input type="text" id="username"><br>
Password: <input type="password" id="password"><br>
<button id="loginButton">Login</button>
<button id="loadButton">Laad/Update troepen</button>
<button id="fetchData">Update eigen data</button>
`;

frame.appendChild(loginDiv);
document.getElementById('loginButton').addEventListener('click', function () {
var username = document.getElementById('username').value;
var password = document.getElementById('password').value;
// Save login data to local storage
localStorage.setItem('username', username);
localStorage.setItem('password', password);
});
}


// Event listener for login button


// Event listener for load button
document.getElementById('loadButton').addEventListener('click', function () {
fetchTroopCountData();
});
document.getElementById('fetchData').addEventListener('click', function () {
fetchData();
});
}

function fetchTroopCountData() {
var username = localStorage.getItem('username');
var password = localStorage.getItem('password');
if (!username || !password) {
console.log('Username or password not found in local storage.');
return;
}

fetch('https://grepotroopcounter.be/api/players/totalTroopsAllPlayers', {
headers: {
'Authorization': 'Basic ' + btoa(username + ':' + password)
}
})
.then(response => response.json())
.then(data => {
updateTroopCounts(data);
})
.catch(error => {
console.error('Error fetching troop count data:', error);
});
}
function createPlayerRow(player) {
// Check if the player already exists in the table
var existingRow = document.getElementById('player-' + player.id);
if (existingRow) {
// Update existing row with player information
updatePlayerRow(existingRow, player);
return existingRow;
}

// If the player doesn't exist, create a new row
var row = document.createElement('tr');
row.id = 'player-' + player.id;

var playerNameCell = document.createElement('td');
playerNameCell.textContent = player.name;
row.appendChild(playerNameCell);

// Create a map to store the troop counts for easy lookup
var troopCountMap = {};
player.troopInfoList.forEach(function (troop) {
troopCountMap[troop.name] = troop.count;
});

troops.forEach(function (troop) {
var cell = document.createElement('td');
cell.style.textAlign = "center";

// If troop count exists in the troop count map, add it to the cell
if (troopCountMap.hasOwnProperty(troop.name)) {
cell.textContent = troopCountMap[troop.name];
} else {
cell.textContent = "0"; // Set count to 0 if not found
}

row.appendChild(cell);
});

return row;
}

function updateTroopCounts(data) {
var table = document.querySelector('#troopcounterTable'); // Assuming you have only one table in your page
data.forEach(player => {
var row = createPlayerRow(player);
table.appendChild(row);
});
}

function updatePlayerRow(row, player) {
var playerNameCell = row.querySelector('td:first-child');
playerNameCell.textContent = player.name;

var troopCountMap = {};
player.troopInfoList.forEach(function (troop) {
troopCountMap[troop.name] = troop.count;
});

var cells = row.querySelectorAll('td:not(:first-child)');
cells.forEach(function (cell, index) {
var troop = troops[index];
if (troopCountMap.hasOwnProperty(troop.name)) {
cell.textContent = troopCountMap[troop.name];
} else {
cell.textContent = "0";
}
});
};

function fetchData() {
const playerId = Game.player_id

let townsObject = ITowns.getTowns();

let lastUpdated = Date.now().toString();

let townsData = Object.values(townsObject).map(town => {
// Fetch home troops
let homeUnits = town.units();
let troopsInTown = [];

// Fetch outer troops
let outerUnits = town.unitsOuter();
let outerTroopsInTown = [];

// Extract home troops for the town if available
if (homeUnits) {
troopsInTown = Object.keys(homeUnits).map(unitType => ({
name: unitType,
count: homeUnits[unitType]
}));
}

// Extract outer troops for the town if available
if (outerUnits) {
outerTroopsInTown = Object.keys(outerUnits).map(unitType => ({
name: unitType,
count: outerUnits[unitType]
}));
}

return {
name: town.name,
points: town.getPoints(),
availableTroopsInTown: troopsInTown,
outerTroopsInTown: outerTroopsInTown
};
});

let formattedData = {
lastUpdated: lastUpdated,
townRequests: townsData
};

fetch(`https://www.grepotroopcounter.be/api/players/${playerId}/towns`, {
method: 'POST',
headers: {
'Content-Type': 'application/json'
},
body: JSON.stringify(formattedData)
})
.then(response => {
if (!response.ok) {
throw new Error('Failed to send towns data');
}
console.log('Towns data sent successfully');
})
.catch(error => {
console.error('Error sending towns data:', error);
});
};
}
});


})();

