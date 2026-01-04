// ==UserScript==
// @name         MaM SendToClient
// @namespace    http://tampermonkey.net/
// @version      0.0.3
// @license      GPL3
// @description  Send torrent to local client from MyAnonamouse with UI config (qBittorrent, Deluge, Transmission supported)
// @author       BareMetal
// @match        https://www.myanonamouse.net/t/*
// @grant        GM.xmlHttpRequest
// @connect      localhost
// @downloadURL https://update.greasyfork.org/scripts/537265/MaM%20SendToClient.user.js
// @updateURL https://update.greasyfork.org/scripts/537265/MaM%20SendToClient.meta.js
// ==/UserScript==

// ========== CONFIGURATION STORAGE ==========
const defaultConfig = {
    clientType: "qbittorrent",
    clientAddress: "http://localhost:8080",
    username: "admin",
    password: "adminadmin",
    category: "books",
    savePath: "",
    startPaused: true
};

function getConfig() {
    return { ...defaultConfig, ...JSON.parse(localStorage.getItem("torClientConfig") || "{}") };
}

function saveConfig(newConfig) {
    localStorage.setItem("torClientConfig", JSON.stringify(newConfig));
}

// ========== CLIENT HANDLERS ==========

const Clients = {
    qbittorrent: async function (torrentBlob, config) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: `${config.clientAddress}/api/v2/auth/login`,
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                data: `username=${config.username}&password=${config.password}`,
                onload: function (authRes) {
                    if (authRes.responseText.trim() === "Ok.") {
                        let formData = new FormData();
                        formData.append("torrents", torrentBlob, "sendtoclient.torrent");
                        if (config.category) formData.append("category", config.category);
                        if (config.savePath) formData.append("savepath", config.savePath);
                        if (config.startPaused) formData.append("paused", "true");

                        GM.xmlHttpRequest({
                            method: "POST",
                            url: `${config.clientAddress}/api/v2/torrents/add`,
                            data: formData,
                            onload: () => resolve(),
                            onerror: err => reject(err)
                        });
                    } else {
                        reject("Authentication failed.");
                    }
                },
                onerror: err => reject(err)
            });
        });
    },

    transmission: async function (torrentBlob, config) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: `${config.clientAddress}/transmission/rpc`,
                headers: {
                    "Authorization": "Basic " + btoa(`${config.username}:${config.password}`)
                },
                onload: function (sessionRes) {
                    const sessionId = sessionRes.responseHeaders.match(/X-Transmission-Session-Id: (.+)/i)?.[1]?.trim();
                    if (!sessionId) return reject("Failed to get Transmission session ID.");

                    let reader = new FileReader();
                    reader.onload = function () {
                        const base64Data = btoa(reader.result);
                        const payload = {
                            method: "torrent-add",
                            arguments: {
                                metainfo: base64Data,
                                "download-dir": config.savePath || undefined,
                                paused: config.startPaused || false
                            }
                        };

                        GM.xmlHttpRequest({
                            method: "POST",
                            url: `${config.clientAddress}/transmission/rpc`,
                            headers: {
                                "X-Transmission-Session-Id": sessionId,
                                "Authorization": "Basic " + btoa(`${config.username}:${config.password}`),
                                "Content-Type": "application/json"
                            },
                            data: JSON.stringify(payload),
                            onload: () => resolve(),
                            onerror: err => reject(err)
                        });
                    };
                    reader.readAsBinaryString(torrentBlob);
                },
                onerror: err => reject(err)
            });
        });
    },

    deluge: async function (torrentBlob, config) {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: "POST",
                url: `${config.clientAddress}/json`,
                data: JSON.stringify({ method: "auth.login", params: [config.password], id: 1 }),
                headers: { "Content-Type": "application/json" },
                onload: function (authRes) {
                    const res = JSON.parse(authRes.responseText);
                    if (!res.result) return reject("Deluge authentication failed.");

                    let reader = new FileReader();
                    reader.onload = function () {
                        const base64Data = btoa(reader.result);
                        const addPayload = {
                            method: "web.add_torrents",
                            params: [[{
                                path: base64Data,
                                name: "sendtoclient.torrent",
                                options: {
                                    download_location: config.savePath || "",
                                    add_paused: config.startPaused || false
                                }
                            }]],
                            id: 2
                        };

                        GM.xmlHttpRequest({
                            method: "POST",
                            url: `${config.clientAddress}/json`,
                            data: JSON.stringify(addPayload),
                            headers: { "Content-Type": "application/json" },
                            onload: () => resolve(),
                            onerror: err => reject(err)
                        });
                    };
                    reader.readAsBinaryString(torrentBlob);
                },
                onerror: err => reject(err)
            });
        });
    }
};

// ========== Send Torrent ==========

async function sendTorrent(tID) {
    const config = getConfig();
    const downloadURL = `https://www.myanonamouse.net/tor/download.php?tid=${tID}`;
    const response = await fetch(downloadURL);
    const blob = await response.blob();

    if (!Clients[config.clientType]) {
        alert(`Unsupported client type: ${config.clientType}`);
        return;
    }

    try {
        await Clients[config.clientType](blob, config);
        alert("Torrent sent to client!");
    } catch (err) {
        console.error(err);
        alert("Failed to send torrent: " + err.toString());
    }
}

// ========== UI Injection ==========

function injectSendButton(torrentID) {
    let button = document.createElement('button');
    button.textContent = "Send to Client";
    button.style = "margin-top: 1em; padding: 0.5em; background-color: #4CAF50; color: white; border: none; cursor: pointer; font-weight: bold;";
    button.onclick = () => sendTorrent(torrentID);

    let target = document.querySelector('#tddl');
    if (target) {
        target.parentElement.appendChild(document.createElement('br'));
        target.parentElement.appendChild(button);
    }
}

function injectSettingsUI() {
    let settingsBtn = document.createElement("button");
    settingsBtn.textContent = "⚙️ Client Settings";
    settingsBtn.style = "position: fixed; bottom: 10px; right: 10px; z-index: 9999; padding: 0.5em;";

    let modal = document.createElement("div");
    modal.style = "position: fixed; bottom: 50px; right: 10px; background: white; border: 1px solid #ccc; padding: 1em; z-index: 9999; display: none;";
    modal.innerHTML = `
        <label>Client Type:
            <select id="clientType">
                <option value="qbittorrent">qBittorrent</option>
                <option value="deluge">Deluge</option>
                <option value="transmission">Transmission</option>
            </select>
        </label><br>
        <label>Address: <input type="text" id="clientAddress" size="30" /></label><br>
        <label>Username: <input type="text" id="user" /></label><br>
        <label>Password: <input id="pass" /></label><br>
        <label>Category: <input type="text" id="category" /></label><br>
        <label>Download Path: <input type="text" id="savePath" /></label><br>
        <label><input type="checkbox" id="startPaused" /> Add torrents in Paused state</label><br>
        <button id="saveConfigBtn">Save</button>
    `;

    settingsBtn.onclick = () => {
        modal.style.display = modal.style.display === "none" ? "block" : "none";
        let cfg = getConfig();
        document.getElementById("clientType").value = cfg.clientType;
        document.getElementById("clientAddress").value = cfg.clientAddress;
        document.getElementById("user").value = cfg.username;
        document.getElementById("pass").value = cfg.password;
        document.getElementById("category").value = cfg.category;
        document.getElementById("savePath").value = cfg.savePath;
        document.getElementById("startPaused").checked = cfg.startPaused;
    };

    modal.querySelector("#saveConfigBtn").onclick = () => {
        const newCfg = {
            clientType: document.getElementById("clientType").value,
            clientAddress: document.getElementById("clientAddress").value,
            username: document.getElementById("user").value,
            password: document.getElementById("pass").value,
            category: document.getElementById("category").value,
            savePath: document.getElementById("savePath").value,
            startPaused: document.getElementById("startPaused").checked
        };
        saveConfig(newCfg);
        modal.style.display = "none";
        alert("Settings saved.");
    };

    document.body.appendChild(settingsBtn);
    document.body.appendChild(modal);
}

// ========== Entry Point ==========
(function () {
    const match = document.URL.match(/\/t\/(\d+)/);
    injectSendButton(match[1]);
    injectSettingsUI();
})();
