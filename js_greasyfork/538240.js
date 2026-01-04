// ==UserScript==
// @name         Torn Room Manager UI
// @namespace    http://tampermonkey.net/
// @version      22.0
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @connect      api.torn.com
// @description Torn War Tool UI
// @downloadURL https://update.greasyfork.org/scripts/538240/Torn%20Room%20Manager%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/538240/Torn%20Room%20Manager%20UI.meta.js
// ==/UserScript==

(async function () {
    const API_URL = "https://script.google.com/macros/s/AKfycbzpRX2Lbh599fjORYW1V2AoApCMzk3FXnNCppn6SJM6vpwI1p0xSs2PwmZyWGpKOIv2/exec"; // Replace
    const POLL_INTERVAL = 10000;

    let localApiData = {
        name: null,
        id: null
    };

    async function getUserData(apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: `https://api.torn.com/user/?selections=profile&key=${apiKey}`,
                onload: r => {
                    try {
                        const data = JSON.parse(r.responseText);
                        if (data.error) {
                            reject(data.error.error);
                        } else {
                            resolve({ name: data.name, id: data.player_id });
                        }
                    } catch (e) {
                        console.error(e);
                        reject(e);
                    }
                },
                onerror: e => reject(e)
            });
        });
    }

    async function getApiKey() {
        if (localApiData.name && localApiData.id) {
            return GM_getValue("TornAPIKey");
        }
        let key = GM_getValue("TornAPIKey");
        if (!key) {
            key = prompt("Enter your Torn API Key:");
        }
        if (key) {
            try {
                const userData = await getUserData(key);
                localApiData = userData;
                GM_setValue("TornAPIKey", key);
                return key;
            } catch (e) {
                alert(`Error with API key: ${e}. Please try again.`);
                GM_setValue("TornAPIKey", null);
                return null;
            }
        }
        return null;
    }

    function apiGet() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: API_URL,
                onload: r => {
                    try {
                        resolve(JSON.parse(r.responseText));
                    }
                    catch (e) {
                        console.error(e);
                        reject(e);
                    }
                },
                onerror: e => reject(e)
            });
        });
    }

    function apiPost(data) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: API_URL,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(data),
                onload: r => {
                    try {
                        resolve(JSON.parse(r.responseText));
                    }
                    catch {
                        resolve(r.responseText);
                    }
                },
                onerror: e => reject(e)
            });
        });
    }

    async function getMemberStatuses(members, apiKey) {
        const statuses = {};
        const requests = members.map(m => {
            if (m.userId) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: `https://api.torn.com/user/${m.userId}?selections=profile&key=${apiKey}`,
                        onload: r => {
                            try {
                                const data = JSON.parse(r.responseText);
                                if (data.status) {
                                    statuses[m.userId] = data.status.state;
                                }
                                resolve();
                            } catch (e) {
                                console.error(e);
                                resolve(); // Resolve even on error to not block other requests
                            }
                        },
                        onerror: e => {
                            console.error(e);
                            resolve(); // Resolve even on error
                        }
                    });
                });
            }
            return Promise.resolve();
        });
        await Promise.all(requests);
        return statuses;
    }

    async function refreshUI() {
        const apiKey = await getApiKey();
        if (!apiKey) return;

        const data = await apiGet();
        if (!data.rooms || data.rooms.length === 0) data.rooms = [{ id: 1, name: "Waiting Room", target: "" }];

        let container = document.getElementById("roomUI");
        if (!container) {
            container = document.createElement("div");
            container.id = "roomUI";
            container.style.position = "fixed";
            container.style.top = "80px";
            container.style.right = "10px";
            container.style.background = "#1e1e2f";
            container.style.color = "#fff";
            container.style.padding = "15px";
            container.style.zIndex = "9999";
            container.style.maxHeight = "90vh";
            container.style.overflowY = "auto";
            container.style.borderRadius = "10px";
            container.style.fontFamily = "'Segoe UI', sans-serif";
            container.style.boxShadow = "0 4px 12px rgba(0,0,0,0.4)";
            document.body.appendChild(container);
        }
        container.innerHTML = "<h2 style='text-align:center;'>Torn Room Manager</h2>";

        // Get status for all members in the current rooms
        const memberStatuses = await getMemberStatuses(data.members, apiKey);

        data.rooms.forEach(room => {
            const roomDiv = document.createElement("div");
            roomDiv.style.border = "1px solid #444";
            roomDiv.style.margin = "5px 0";
            roomDiv.style.padding = "10px";
            roomDiv.style.borderRadius = "8px";
            roomDiv.style.background = "#282c34";

            roomDiv.innerHTML = `<b>${room.name}</b> (Target: ${room.target || "None"})`;

            const membersInRoom = data.members.filter(m => m.roomId == room.id);
            membersInRoom.forEach(m => {
                const p = document.createElement("p");
                const status = memberStatuses[m.userId] || "Unknown";
                p.textContent = `${m.userName} (${m.userId}) - Status: ${status}`;
                p.style.margin = "2px 0";
                roomDiv.appendChild(p);
            });

            // Waiting Room join/leave
            if (room.name === "Waiting Room") {
                const isInRoom = membersInRoom.some(m => m.apiKey === apiKey);
                const btn = document.createElement("button");
                btn.textContent = isInRoom ? "Leave Room" : "Join Room";
                btn.style.marginTop = "5px";
                btn.style.padding = "4px 10px";
                btn.onclick = async () => {
                    if (isInRoom) {
                        await apiPost({ type: "leaveRoom", roomId: room.id, apiKey });
                    } else {
                        await apiPost({
                            type: "joinRoom",
                            roomId: room.id,
                            userName: localApiData.name,
                            userId: localApiData.id,
                            apiKey
                        });
                    }
                    refreshUI();
                };
                roomDiv.appendChild(btn);
            }

            // Admin buttons
            const admin = data.admins.find(a => a.apiKey === apiKey);
            if (admin) {
                const createBtn = document.createElement("button");
                createBtn.textContent = "Create Room";
                createBtn.style.margin = "5px 5px 0 0";
                createBtn.onclick = async () => {
                    const name = prompt("New room name:");
                    if (!name) return;
                    await apiPost({ type: "createRoom", roomName: name, apiKey });
                    refreshUI();
                };

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete Room";
                deleteBtn.style.margin = "0 5px 0 0";
                deleteBtn.onclick = async () => {
                    if (room.id === 1) return alert("Cannot delete Waiting Room");
                    if (!confirm(`Delete ${room.name}?`)) return;
                    await apiPost({ type: "deleteRoom", roomId: room.id, apiKey });
                    refreshUI();
                };

                const targetBtn = document.createElement("button");
                targetBtn.textContent = "Set Target";
                targetBtn.style.margin = "0 5px 0 0";
                targetBtn.onclick = async () => {
                    const t = prompt("Enter target for room:", room.target || "");
                    if (t !== null) {
                        await apiPost({ type: "setTarget", roomId: room.id, target: t, apiKey });
                        refreshUI();
                    }
                };
                roomDiv.appendChild(createBtn);
                roomDiv.appendChild(deleteBtn);
                roomDiv.appendChild(targetBtn);
            }

            container.appendChild(roomDiv);
        });
    }

    refreshUI();
    setInterval(refreshUI, POLL_INTERVAL);
})();