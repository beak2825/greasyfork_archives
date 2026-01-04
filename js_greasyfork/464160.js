// ==UserScript==
// @name         MooMoo.io Itemcounter Display
// @author       unknown
// @description  Shows Item Counter On Actionbar
// @version      1.2
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1049693
// @downloadURL https://update.greasyfork.org/scripts/464160/MooMooio%20Itemcounter%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/464160/MooMooio%20Itemcounter%20Display.meta.js
// ==/UserScript==

function getEl(id) {
    return document.getElementById(id);
}

try {

    let msgPack = window.msgpack;
    let WS;

    WebSocket.prototype.oldSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (message) {
        if (!WS) {
            WS = this;
            WS.addEventListener("message", function (messages) {
                getMessage(messages);
            });
        }
        WS.oldSend(message);
    }

    let foodValue = localStorage.getItem("moofoll") ? 100 : 0;
    function getMessage(message) {
        let data = new Uint8Array(message.data);
        let decode = msgPack.decode(data);
        let packetList = {
            "2": "addPlayer",
            "9": "updatePlayerValue",
            "14": "updateItemCounts"
        };
        let packet = {
            name: packetList[decode[0]],
            arg: function (data) {
                return decode[1][data]
            }
        };
        let checkName = function (name) {
            return packet.name === name;
        }
        if (checkName("addPlayer")) {
            let isYou = packet.arg(1);
            if (isYou) {
                updateItemCountHTML();
            }
        }
        if (checkName("updatePlayerValue")) {
            let index = packet.arg(0);
            let value = packet.arg(1);
            if (index === "food") {
                foodValue = value;
                for (let i = 0; i < 3; i++) {
                    let tmpI = (16 + i);
                    let req = i == 0 ? 10 : i == 1 ? 15 : i == 2 ? 25 : 10;
                    getEl("itemCount" + tmpI).innerHTML = Math.floor(foodValue / req);
                }
            }
        }
        if (checkName("updateItemCounts")) {
            let index = packet.arg(0);
            let value = packet.arg(1);
            itemCounts[index] = value;
            updateItemCountHTML(index);
        }
    }

    let itemCounts = [];
    let isItemSetted = [];
    let itemIds = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 4, 11, 5, 6, 7, 8, 9, 10, 12, 13];
    function updateItemCountHTML(index = undefined) {
        for (let i = 0; i < itemIds.length; ++i) {
            let id = itemIds[i];
            let tmpI = (16 + i);
            if (!isItemSetted[tmpI]) {
                isItemSetted[tmpI] = document.createElement("div");
                isItemSetted[tmpI].id = "itemCount" + tmpI;
                isItemSetted[tmpI].style.display = "block";
                isItemSetted[tmpI].style.position = "absolute";
                isItemSetted[tmpI].style.paddingLeft = "5px";
                isItemSetted[tmpI].style.fontSize = "22px";
                isItemSetted[tmpI].style.color = "#fff";
                if (i < 3) {
                    let req = i == 0 ? 10 : i == 1 ? 15 : i == 2 ? 25 : 10;
                    isItemSetted[tmpI].innerHTML = Math.floor(foodValue / req);
                } else {
                    isItemSetted[tmpI].innerHTML = (itemCounts[id] || 0);
                }
                getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
            } else {
                if (index == id) {
                    isItemSetted[tmpI].innerHTML = (itemCounts[index] || 0);
                }
            }
        }
    }
} catch (e) {
    throw new Error(e);
}