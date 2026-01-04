// ==UserScript==
// @name        Moomoo.io - 1.8.0 Item Counter
// @author      Seryo
// @description Displays an Actionbar Item Counter, excluding food items. It remains hidden when no items are placed.
// @version     Beta
// @match       *://*.moomoo.io/*
// @namespace   https://greasyfork.org/users/1190411
// @icon        https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @require     https://greasyfork.org/scripts/423602-msgpack/code/msgpack.js?version=1005014
// @license     MIT
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/476900/Moomooio%20-%20180%20Item%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/476900/Moomooio%20-%20180%20Item%20Counter.meta.js
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
            "D": "addPlayer",
            "N": "updatePlayerValue",
            "S": "updateItemCounts"
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
            let tmpI = 16 + i;
            let req = i === 0 ? 10 : i === 1 ? 15 : i === 2 ? 25 : 10;

            if (i !== 0) {
                getEl("itemCount" + tmpI).innerHTML = Math.floor(foodValue / req);
            } else {

                getEl("itemCount" + tmpI).innerHTML = "";
            }
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
            isItemSetted[tmpI].style.textAlign = "center";


            if (i !== 1) {
                isItemSetted[tmpI].innerHTML = itemCounts[id] > 0 ? itemCounts[id] : '';
            }

            getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
        } else {
            if (index == id) {
                if (i === 1) {
                    getEl("itemCount" + tmpI).style.display = "none";
                } else {
                    isItemSetted[tmpI].innerHTML = itemCounts[index] > 0 ? itemCounts[index] : '';
                }
            }
        }
    }
}

let itemCount17 = document.getElementById("itemCount17");
if (itemCount17) {
    itemCount17.style.display = "none";
}

updateItemCountHTML();
} catch (e) {
    throw new Error(e);
}