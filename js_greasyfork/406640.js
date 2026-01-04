// ==UserScript==
// @name         Zombs.io chat filter + blocking names
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  zombsio chat filter
// @author       Apex
// @match        *://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406640/Zombsio%20chat%20filter%20%2B%20blocking%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/406640/Zombsio%20chat%20filter%20%2B%20blocking%20names.meta.js
// ==/UserScript==
const getId = ID => {
    return document.getElementById(ID);
}

const getElement = ELEMENT => {
    return document.getElementsByClassName(ELEMENT);
}
if (localStorage.getItem("blockedNames") == null) {
    localStorage.setItem("blockedNames", "[]");
}

getElement("hud-settings-grid")[0].innerHTML += `<center><h3>Chat filter</h3>\n<button class="btn btn-green" style="width: 99%;" id="chatFilter" filter="all">All</button>\n<input type="text" class="btn" id="nameToBlock" style="width: 99%; margin-top: 1%;" maxlength=35 placeholder="Name of person you want to block/unblock..."></input>\n<button class="btn btn-red" id="blockName" style="width: 45%; margin-top: 1%;">Block</button><button class="btn btn-green" id="unblockName" style="margin-top: 1%; margin-left: 1%; width: 45%;">Unblock</button>\n<button class="btn btn-green" id="showBlocked" style="width:99%; margin-top: 1%;">Show Blocked Names</button></center>\n<div style="margin-top: 1%;" id="blockNamesList"></div>`;
let filterButton = getId("chatFilter");
filterButton.onclick = () => {
    let f = filterButton.getAttribute("filter");
    let newF = "all";
    if (f == "all") {
        newF = "party";
    } else if (f == "party") {
        newF = "none";
    } else if (f == "none") {
        newF = "all";
    }
    filterButton.setAttribute("filter", newF);
    switch (newF) {
        case "all":
            filterButton.setAttribute("class", "btn btn-green");
            filterButton.textContent = "All";
            break;
        case "party":
            filterButton.setAttribute("class", "btn btn-gold");
            filterButton.textContent = "Party";
            break;
        case "none":
            filterButton.setAttribute("class", "btn btn-red");
            filterButton.textContent = "None";
            break;
    }
}

let blockButton = getId("blockName");
blockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToBlock = getId("nameToBlock").value;
    if (blocked.includes(nameToBlock)) return;
    blocked.push(nameToBlock);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let unblockButton = getId("unblockName");
unblockButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let nameToUnblock = getId("nameToBlock").value;
    if (blocked.indexOf(nameToUnblock) == -1) return;
    blocked.splice(blocked.indexOf(nameToUnblock), 1);
    localStorage.setItem("blockedNames", JSON.stringify(blocked));
}

let showBlockedButton = getId("showBlocked");
showBlockedButton.onclick = () => {
    let blocked = JSON.parse(localStorage.getItem("blockedNames"));
    let str = "<h3>";
    str += blocked.join(", ");
    str += "</h3>";
    getId("blockNamesList").innerHTML = str;
}

Game.currentGame.network.emitter.removeListener("PACKET_RPC", Game.currentGame.network.emitter._events.PACKET_RPC[1]);
let onMessageReceived = (msg => {
    let filter = filterButton.getAttribute("filter");
    switch (filter) {
        case "party": {
            let party = Game.currentGame.ui.playerPartyMembers;
            let uids = [];
            for (let member of party) {
                uids.push(member.playerUid);
            }
            if (!uids.includes(msg.uid)) return;
        }
        break;
        case "none":
            return;
            break;
    }
    let blockedNames = JSON.parse(localStorage.getItem("blockedNames"));
    let a = Game.currentGame.ui.getComponent("Chat"),
        b = window.filterXSS(msg.displayName),
        c = window.filterXSS(msg.message),
        d = a.ui.createElement(`<div class="hud-chat-message"><strong>${b}</strong>: ${c}</div>`);
    if (blockedNames.includes(b)) return;
    a.messagesElem.appendChild(d);
    a.messagesElem.scrollTop = a.messagesElem.scrollHeight;
})
Game.currentGame.network.addRpcHandler("ReceiveChatMessage", onMessageReceived);