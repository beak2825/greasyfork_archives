// ==UserScript==
// @name bruh
// @namespace Simple Mod
// @match *://*/*
// @grant none
// @version 1.0
// @author keypressed & z-r
// @description practice with websocket
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536645/bruh.user.js
// @updateURL https://update.greasyfork.org/scripts/536645/bruh.meta.js
// ==/UserScript==


var killCount = 0;
var lastSpawnTime = Date.now();
var spawnChat = false;
var killChat = false;
var autoRespawn = false;
var spawnContent = "spawn↠[player]";
var killChatTextValue = "kill↠[playerkilled] ([kills])";
var showID = false;
var nick = document.getElementById("nickname");
const play = document.getElementById("play");
var autoSelect = false;
var buildingInfo = false;
var logItem = false;
var logData = false;
var autoheal = false;
var millWarning = false;
var maxMills = false;
let millMessage = "replace your mill(s)!";
//automatically set nickname
nick.value = "sploop.io";

const menu = document.createElement("div");
document.body.appendChild(menu);
menu.style.position = "absolute";
menu.style.top = "10px";
menu.style.left = "10px";
menu.style.width = "400px";
menu.style.height = "auto";
menu.style.border = "2px solid black";
menu.style.borderRadius = "10px";
menu.style.backgroundColor = "lightpink";
menu.style.opacity = "0.9";
menu.style.padding = "8px";

function toggleMenu() {
    if (menu.style.display === 'none') {
        menu.style.display = 'block';
    } else {
        menu.style.display = 'none';
    }
}

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        toggleMenu();
    }
});
const header = document.createElement("h1");
header.textContent = "Simple Mod v1.0.1";
menu.appendChild(header);
header.style.margin = "5px";

const division = document.createElement("hr");
menu.appendChild(division);

const label = document.createElement("label");
label.textContent = "Send chat on players spawning";
menu.appendChild(label);
label.style.margin = "5px";

const checkbox = document.createElement("input");
checkbox.type = "checkbox";
menu.appendChild(checkbox);
checkbox.checked = false;

const lineBreak = document.createElement("br");
menu.appendChild(lineBreak);


const spawnChatInputLabel = document.createElement("label");
spawnChatInputLabel.textContent = "What text to say when player spawns: ";
menu.appendChild(spawnChatInputLabel);
spawnChatInputLabel.style.margin = "5px";


const lineBreak2 = document.createElement("br");
menu.appendChild(lineBreak2);

const spawnChatInputText = document.createElement("input");
spawnChatInputText.value = spawnContent;
menu.appendChild(spawnChatInputText);
spawnChatInputText.style.margin = "5px";
spawnChatInputText.style.width = "350px";

const lineBreak3 = document.createElement("br");
menu.appendChild(lineBreak3);

const showIDSLabel = document.createElement("label");
showIDSLabel.textContent = "Show IDS in the spawn text";
showIDSLabel.style.margin = "5px";
menu.appendChild(showIDSLabel);

const IDCheckbox = document.createElement("input");
IDCheckbox.type = "checkbox";
IDCheckbox.checked = false;
menu.appendChild(IDCheckbox);

const firstHR = document.createElement("hr");
menu.appendChild(firstHR);

const killChatToggleLabel = document.createElement("label");
killChatToggleLabel.textContent = "Send killchat";
killChatToggleLabel.style.margin = "5px";
menu.appendChild(killChatToggleLabel);

const killChatToggle = document.createElement("input");
killChatToggle.type = "checkbox";
killChatToggle.checked = false;
menu.appendChild(killChatToggle);

const lineBreak4 = document.createElement("br");
menu.appendChild(lineBreak4);

const killChatLabel = document.createElement("label");
killChatLabel.textContent = "Text sent on a kill";
menu.appendChild(killChatLabel);
killChatLabel.style.margin = "5px";

const killChatText = document.createElement("input");
killChatText.type = "text";
killChatText.value = killChatTextValue;
menu.appendChild(killChatText);

const secondHR = document.createElement("hr");
menu.appendChild(secondHR);

const autoRespawnLabel = document.createElement("label");
autoRespawnLabel.textContent = "Auto-respawn";
menu.appendChild(autoRespawnLabel);
autoRespawnLabel.style.margin = "5px";

const autoRespawnToggle = document.createElement("input");
autoRespawnToggle.type = "checkbox";
autoRespawnToggle.checked = false;
menu.appendChild(autoRespawnToggle);

const lineBreak5 = document.createElement("br");
menu.appendChild(lineBreak5);

const autoRespawnNameLabel = document.createElement("label");
autoRespawnNameLabel.textContent = "Auto-respawn name: ";
menu.appendChild(autoRespawnNameLabel);
autoRespawnNameLabel.style.margin = "5px";

const autoRespawnName = document.createElement("input");
autoRespawnName.type = "text";
autoRespawnName.value = nick.value;
menu.appendChild(autoRespawnName);

const thirdHR = document.createElement("hr");
menu.appendChild(thirdHR);

const autoSelectLabel = document.createElement("label");
autoSelectLabel.textContent = "Auto Select KTH";
menu.appendChild(autoSelectLabel);
autoSelectLabel.style.margin = "5px";

const sendWeapons = document.createElement("input");
sendWeapons.type = "checkbox";
sendWeapons.checked = false;
menu.appendChild(sendWeapons);

const fourthHR = document.createElement("hr");
menu.appendChild(fourthHR);

const buildingInfoLabel = document.createElement("label");
buildingInfoLabel.textContent = "Show number of buildings";
menu.appendChild(buildingInfoLabel);
buildingInfoLabel.style.margin = "5px";

const buildingInfoToggle = document.createElement("input");
buildingInfoToggle.type = "checkbox";
buildingInfoToggle.checked = false;
menu.appendChild(buildingInfoToggle);



const buildInfoContainer = document.createElement("div");
buildInfoContainer.style.width = "auto";
buildInfoContainer.style.height = "auto";
buildInfoContainer.style.border = "2px solid black";
buildInfoContainer.style.borderRadius = "10px";
buildInfoContainer.style.backgroundColor = "salmon";
buildInfoContainer.style.opacity = "0.8";
buildInfoContainer.style.padding = "8px";
buildInfoContainer.style.display = "none";
menu.appendChild(buildInfoContainer);

const walls = document.createElement("label");
walls.textContent = "Walls: 0/100";
const line = document.createElement("br");
const mills = document.createElement("label");
mills.textContent = "Mills: 0/8";
const line2 = document.createElement("br");
const spikes = document.createElement("label");
spikes.textContent = "Spikes: 0/30";
const line3 = document.createElement("br");
const platforms = document.createElement("label");
platforms.textContent = "Platforms: 0/32";
const line4 = document.createElement("br");
const cosy = document.createElement("label");
cosy.textContent = "Cosy bed: 0/1";
const line5 = document.createElement("br");
const trap = document.createElement("label");
trap.textContent = "Trap/boosts: 0/12";
buildInfoContainer.append(walls, line, mills, line2, spikes, line3, platforms, line4, cosy, line5, trap);

const lineBreak6 = document.createElement("br");
menu.appendChild(lineBreak6);

const warnLabel = document.createElement("label");
warnLabel.textContent = "Send warning on mills being broken";
menu.appendChild(warnLabel);
warnLabel.style.margin = "5px";

const warnToggle = document.createElement("input");
warnToggle.type = "checkbox";
warnToggle.checked = false;
menu.appendChild(warnToggle);

const fifthHR = document.createElement("hr");
menu.appendChild(fifthHR);
const lineBreak7 = document.createElement("br");
menu.appendChild(lineBreak7);

const autohealLabel = document.createElement("label");
autohealLabel.textContent = "Autoheal";
menu.appendChild(autohealLabel);
autohealLabel.style.margin = "5px";

const autohealToggle = document.createElement("input");
autohealToggle.type = "checkbox";
autohealToggle.checked = false;
menu.appendChild(autohealToggle);

const lineBreak8 = document.createElement("br");
menu.appendChild(lineBreak8);

const healthLabel = document.createElement("label");
healthLabel.textContent = "Health: none";
menu.appendChild(healthLabel);
healthLabel.style.margin = "5px";

const ninthHR = document.createElement("hr");
menu.appendChild(ninthHR);

const mainDebugToggle = document.createElement("label");
mainDebugToggle.textContent = "Show debug options";
menu.appendChild(mainDebugToggle);
mainDebugToggle.style.margin = "5px";

const mainDebugCB = document.createElement("input");
mainDebugCB.type = "checkbox";
mainDebugCB.checked = false;
menu.appendChild(mainDebugCB);

const debugDiv = document.createElement("div");
menu.appendChild(debugDiv);
debugDiv.style.margin = "5px";
debugDiv.style.display = "none";

const lineBreak10 = document.createElement("br");
debugDiv.appendChild(lineBreak10);

const debugInfo = document.createElement("label");
debugInfo.textContent = "Log item to custom console";
debugDiv.appendChild(debugInfo);
debugInfo.style.margin = "5px";

const debugItem = document.createElement("input");
debugItem.type = "checkbox";
debugItem.checked = false;
debugDiv.appendChild(debugItem);


const lineBreak12 = document.createElement("br");
debugDiv.appendChild(lineBreak12);

const debugData = document.createElement("label");
debugData.textContent = "Log data to custom console";
debugDiv.appendChild(debugData);
debugData.style.margin = "5px";

const debug2Toggle = document.createElement("input");
debug2Toggle.type = "checkbox";
debug2Toggle.checked = false;
debugDiv.appendChild(debug2Toggle);

IDCheckbox.addEventListener('change', function () {
    if (this.checked) {
        showID = true;
    } else {
        showID = false;
    }
});

checkbox.addEventListener('change', function () {
    if (this.checked) {
        spawnChat = true;
    } else {
        spawnChat = false;
    }
});

killChatToggle.addEventListener('change', function () {
    if (this.checked) {
        killChat = true;
    } else {
        killChat = false;
    }
});

autoRespawnToggle.addEventListener('change', function () {
    if (this.checked) {
        autoRespawn = true;
    } else {
        autoRespawn = false;
    }
});

sendWeapons.addEventListener('change', function () {
    if (this.checked) {
        autoSelect = true;
    } else {
        autoSelect = false;
    }
});

debugItem.addEventListener('change', function () {
    if (this.checked) {
        logItem = true;
    } else {
        logItem = false;
    }
});

debug2Toggle.addEventListener('change', function () {
    if (this.checked) {
        logData = true;
    } else {
        logData = false;
    }
});

mainDebugCB.addEventListener('change', function () {
    if (this.checked) {
        debugDiv.style.display = "block";
    } else {
        debugDiv.style.display = "none";
    }
});

autohealToggle.addEventListener('change', function () {
    if (this.checked) {
        autoheal = true;
    } else {
        autoheal = false;
    }
});

warnToggle.addEventListener('change', function () {
    if (this.checked) {
        millWarning = true;
    } else {
        millWarning = false;
    }
});

buildingInfoToggle.addEventListener('change', function () {
    if (this.checked) {
        buildingInfo = true;
        buildInfoContainer.style.display = "block";
    } else {
        buildingInfo = false;
        buildInfoContainer.style.display = "none";
    }
});
function logToCustomConsole(message) {
    var customConsole = document.getElementById('custom-console');
    var newLine = document.createElement('div');
    newLine.textContent = message;
    customConsole.appendChild(newLine);

    if (customConsole.scrollTop + customConsole.clientHeight >= customConsole.scrollHeight - 20) {
        customConsole.scrollTop = customConsole.scrollHeight;
    }
}

var millWarningDiv = document.createElement("div");
                  document.body.appendChild(millWarningDiv);
                  millWarningDiv.style.position = "absolute";
                  millWarningDiv.style.top = "10px";
                  millWarningDiv.style.left = "900px";
                  millWarningDiv.style.height = "50px";
                  millWarningDiv.style.position = "auto";
                  millWarningDiv.style.border = "2px solid black";
                  millWarningDiv.style.textAlign = "center";
                  millWarningDiv.style.borderRadius = "5px";
                  millWarningDiv.style.backgroundColor = "salmon";
                  millWarningDiv.style.opacity = "0.9";
                  millWarningDiv.textContent = "Replace your mills!";
millWarningDiv.style.display = "none";



var customConsoleElement = document.createElement('div');
customConsoleElement.id = 'custom-console';
debugDiv.appendChild(customConsoleElement);
customConsoleElement.style.width = "auto";
customConsoleElement.style.height = "150px";
customConsoleElement.style.border = "2px solid black";
/*customConsoleElement.style.position = "absolute";
customConsoleElement.style.top = "10px";
customConsoleElement.style.left = "500px";*/
customConsoleElement.style.overflow = "auto";
let lastPacket = 0;

WebSocket.prototype.lastSend = WebSocket.prototype.send;
WebSocket.prototype.send = function (a) {
    this.lastSend(a);
    this.addEventListener("message", (msg) => {
        try {
            const data = typeof msg.data == "string" ? JSON.parse(msg.data) : new Uint8Array(msg.data);
            const item = data[0];

                let wallAmt = data[4];
                let spikeAmt = data[5];
                let millAmt = data[6];
                let trapAmt = data[8];
                let platformAmt = data[9];
                let bedAmt = data[10];
            if (item == 20 && autoheal) {
               healthLabel.textContent = "Health: " + data[13] / 255 * 100;
            }
            if (item != 20 && item != lastPacket && logItem) {
                logToCustomConsole(item);
                lastPacket = item;
            }
            if (item != 20 && item != lastPacket && logData) {
                logToCustomConsole(data);
                lastPacket = item;
            }
            if (item == 36 && (Date.now() - lastSpawnTime > 50)){
                if(millAmt === 8){
                  maxMills = true;
                  millWarningDiv.style.display = "none";
                }
                if(maxMills && millWarning && millAmt<8){
                  millWarningDiv.style.display = "block";
                  logToCustomConsole(millMessage);
                }
                lastSpawnTime = Date.now();
            }
            if (item == 36 && (Date.now() - lastSpawnTime > 50)) {
                walls.textContent = "Walls: " + wallAmt + "/100";
                spikes.textContent = "Spikes: " + spikeAmt + "/30";
                mills.textContent = "Mills: " + millAmt + "/8";
                platforms.textContent = "Platforms/roof: " + platformAmt + "/32";
                trap.textContent = "Trap/boosts: " + trapAmt + "/12";
                cosy.textContent = "Cosy bed: " + bedAmt + "/1";
                lastSpawnTime = Date.now();
                //index 0 = packet type
                //index 1 = unknown
                //index 2 = unknown
                //index 3 = unknown
                //index 4 = wall
                //index 5 = spike
                //index 6 = mill
                //index 7 = bush/sapling/stone
                //index 8 = trap/boost
                //index 9 = roof/platform
                //index 10 = cosy bed
                //index 11 = unknown
            }
            if (item == 14 && autoSelect && (Date.now() - lastSpawnTime > 50)) {
                const encodedData = new Uint8Array([14, 1]);//sword
                const encodedData2 = new Uint8Array([14, 12]);//cookie
                const encodedData3 = new Uint8Array([14, 9]);//trap
                const encodedData4 = new Uint8Array([14, 19]);//powermill
                const encodedData5 = new Uint8Array([14, 20]);//spike
                const encodedData6 = new Uint8Array([14, 15]);//hammer
                const encodedData7 = new Uint8Array([14, 8]);//platform

                const encodedData9 = new Uint8Array([14, 17]);//katana
                const encodedData10 = new Uint8Array([14, 16]);//bed
                this.send(encodedData);
                this.send(encodedData2);
                this.send(encodedData3);
                this.send(encodedData4);
                this.send(encodedData5);
                this.send(encodedData6);
                this.send(encodedData7);
                this.send(encodedData9);
                this.send(encodedData10);
                lastSpawnTime = Date.now();
            }
            if (item == 19 && autoRespawn && (Date.now() - lastSpawnTime > 50)) {
                nick.value = autoRespawnName.value;
                play.click();
                lastSpawnTime = Date.now();
            }

            if (item == 35) { killCount = 0 };
            if (item == 28 && (Date.now() - lastSpawnTime > 50)) {
                killCount++;
                if (killChat) {
                    //const playerkilled = data[1].split(' ')[1];
                    const playerkilled = data[1].substring(6);
                    logToCustomConsole(playerkilled);
                    killChatTextValue = killChatText.value;
                    this.send(new Uint8Array([7, ...new TextEncoder().encode(killChatTextValue.replace('[kills]', killCount).replace('[playerkilled]', playerkilled))]));
                }
                lastSpawnTime = Date.now();
            }

            if (item == 32 && (Date.now() - lastSpawnTime > 700)) {
                const playerName = data[2];
                const playerId = data[1];
                if (spawnChat) {
                    spawnContent = spawnChatInputText.value;
                    if (showID) {
                        this.send(new Uint8Array([7, ...new TextEncoder().encode(`${spawnContent.replace('[player]', playerName)} ID: ${playerId}`)]));
                    } else {
                        this.send(new Uint8Array([7, ...new TextEncoder().encode(spawnContent.replace('[player]', playerName))]));
                    }
                }
                lastSpawnTime = Date.now();
            }
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
};
