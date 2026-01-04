// ==UserScript==
// @name         War Updater
// @namespace    http://tampermonkey.net/
// @version      2024-03-20
// @description  Ultimata War Updater for updating wars on the site instantly.
// @author       olesien
// @match        *://*.torn.com/factions.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM.xmlHttpRequest
// @connect      *
// @license      CC BY-NC-ND 4.0
// @downloadURL https://update.greasyfork.org/scripts/490938/War%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/490938/War%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let apiKey = String(localStorage.getItem("ultimata-key"));
    if (apiKey.length < 10) {
        let key = prompt("Please enter key (public is ok)", "");
        console.log(key);
        if (key.length > 10) {
            console.log("setting....");
            localStorage.setItem("ultimata-key", key);
            apiKey = key;
        } else {
            alert("That is not a key");
        }
    }

    function watchSocket() {
        const originalSend = WebSocket.prototype.send;
        console.log("Starting to watch for socket changes");
        WebSocket.prototype.send = function(...args) {
            if (this.url === "wss://ws-centrifugo.torn.com/connection/websocket" && args[0].includes("faction-users-")) {
                console.log("Subscribed to: " + args[0]);
                console.log(this);
                this.addEventListener("message", (event) => {
                    console.log("New data");
                    const data = JSON.parse(event.data);
                    console.log(data);
                    if ("result" in data) {
                        //Step 1
                        if ("data" in data.result) {
                            if ("data" in data.result.data) {
                                const action = data.result.data.data.message.namespaces.users.actions;
                                if ("updateIcons" in action) {
                                    const userId = action.updateIcons.userId;
                                    const icons = action.updateIcons.icons;
                                    //console.log(userId, icons);
                                } else if ("updateStatus" in action) {
                                    const userId = action.updateStatus.userId;
                                    //{status: {area: 1, okay: false, text: "Jail", updateAt: 1710899620}
                                    //{ text: "Hospital", okay: false, updateAt: 1710900228, area: 1 } <- updateAt is for when they get out
                                    //{ text: "Traveling", okay: false, updateAt: 1710895639, area: 2 } <- Flying
                                    const status = action.updateStatus.status;
                                    let faction_id = Number(args[0].split("faction-users-")[1].split('"')[0]);

                                    const url = `https://ultimata.net/api/v1/updatewar?key=${apiKey}`;
                                    var formdata = new FormData();
                                    GM.xmlHttpRequest({
                                        method: 'POST',
                                        url: url,
                                        onload: function (response) {
                                            console.log(response);
                                        },
                                        onerror: function (error) {
                                            //alert('Something went wrong, please let olesien know')
                                        },
                                        data: JSON.stringify({player_id: userId, faction_id, ...status})
                                    });

                                } else {
                                    console.log("New STATUS ................................. XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX");
                                    console.log(action);
                                }
                            }
                        }
                    }
                });
            }
            return originalSend.call(this, ...args);
        };
    }
    watchSocket();
})();