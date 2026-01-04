// ==UserScript==
// @name         Roblox Gamepass Auto Creator 4.3
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Create multiple gamepasses with saved settings and Discord webhook embed support.
// @author       JM01
// @license      MIT
// @match        https://create.roblox.com/dashboard/creations/experiences/*/passes*
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/547112/Roblox%20Gamepass%20Auto%20Creator%2043.user.js
// @updateURL https://update.greasyfork.org/scripts/547112/Roblox%20Gamepass%20Auto%20Creator%2043.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const sleep = (ms) => new Promise(res => setTimeout(res, ms));

    // --- Storage Helpers ---
    function getUniverseIdFromUrl() {
        const match = window.location.pathname.match(/experiences\/(\d+)/);
        return match ? match[1] : "default";
    }
    const STORAGE_KEY = (id) => `gpCreator_${id}`;
    function saveSettings(universeId, data) {
        localStorage.setItem(STORAGE_KEY(universeId), JSON.stringify(data));
    }
    function loadSettings(universeId) {
        const raw = localStorage.getItem(STORAGE_KEY(universeId));
        return raw ? JSON.parse(raw) : {};
    }

    // --- Roblox Helpers ---
    async function getCsrfToken() {
        let res = await fetch("https://auth.roblox.com/v2/logout", {
            method: "POST",
            credentials: "include"
        }).catch(() => {});
        return res?.headers.get("x-csrf-token") || "";
    }

    async function createGamePass(csrfToken, universeId, name, desc, price, imageFile) {
        const form = new FormData();
        form.append("name", name);
        form.append("description", desc);
        form.append("universeId", universeId);
        form.append("price", price);
        form.append("isForSale", "true");
        form.append("file", imageFile);

        const res = await fetch("https://apis.roblox.com/game-passes/v1/game-passes", {
            method: "POST",
            headers: { "x-csrf-token": csrfToken },
            body: form,
            credentials: "include"
        });

        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        return await res.json();
    }

    // --- Webhook with Embed ---
    function sendWebhook(url, title, description, color = 0x57F287) {
        if (!url) return;
        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: JSON.stringify({
                embeds: [{
                    title: title,
                    description: description,
                    color: color,
                    footer: { text: "JM01 Gamepass Creator" },
                    timestamp: new Date().toISOString()
                }]
            }),
            headers: { "Content-Type": "application/json" }
        });
    }

    // --- UI Injection ---
    function injectToggleButton() {
        if (document.getElementById("gpToggle")) return;

        const toggle = document.createElement("button");
        toggle.id = "gpToggle";
        toggle.textContent = "🎮 Pass Maker";
        toggle.style = `
            position:fixed;bottom:20px;right:20px;z-index:1000000;
            background:#ff4d4d;color:#fff;padding:10px 15px;
            border:none;border-radius:8px;font-weight:bold;
            font-family:Arial;cursor:pointer;box-shadow:0 0 8px rgba(0,0,0,0.4);
        `;
        toggle.onclick = () => {
            const gui = document.getElementById("gpGui");
            gui.style.display = gui.style.display === "none" ? "block" : "none";
        };
        document.body.appendChild(toggle);
    }

    function injectGUI() {
        if (document.getElementById("gpGui")) return;

        const universeId = getUniverseIdFromUrl();
        const saved = loadSettings(universeId);

        const gui = document.createElement("div");
        gui.id = "gpGui";
        gui.style = `
            position:fixed;top:20px;right:20px;z-index:999999;
            background:#1e1e1e;color:#fff;padding:15px;width:340px;
            border:2px solid #ff4d4d;border-radius:10px;
            font-family:Arial,sans-serif;box-shadow:0 0 12px rgba(0,0,0,0.6);
        `;
        gui.innerHTML = `
            <h3 style="margin:0 0 10px;">🎮 "JM01's Gamepass Creator</h3>
            <label>Universe ID:<br><input id="universeId" style="width:100%" placeholder="Paste your game UniverseId" value="${saved.universeId || universeId}"></label><br><br>
            <label>Number of Passes:<br><input id="gpCount" type="number" style="width:100%" value="${saved.gpCount || ""}"></label><br><br>
            <label>Base Name:<br><input id="gpName" style="width:100%" placeholder="Example: JM01Pass" value="${saved.gpName || ""}"></label><br><br>
            <label>Description:<br><textarea id="gpDesc" style="width:100%;height:60px;" placeholder="Enter description">${saved.gpDesc || ""}</textarea></label><br><br>
            <label>Price (R$):<br><input id="gpPrice" type="number" style="width:100%" placeholder="Example: 5" value="${saved.gpPrice || ""}"></label><br><br>
            <label>Image:<br><input id="gpImage" type="file" accept="image/*" style="width:100%"></label><br><br>
            <label>Discord Webhook (optional):<br><input id="gpWebhook" type="text" style="width:100%" placeholder="Paste Discord webhook URL" value="${saved.gpWebhook || ""}"></label><br><br>
            <button id="gpStart" style="width:100%;padding:8px;background:#ff4d4d;color:#fff;border:none;border-radius:5px;cursor:pointer;">Create Gamepasses</button>
            <p id="gpStatus" style="margin-top:10px;font-size:0.9em;"></p>
        `;
        document.body.appendChild(gui);
    }

    // --- Main Logic ---
    async function createPasses() {
        const universeId = document.getElementById("universeId").value.trim();
        const count = parseInt(document.getElementById("gpCount").value, 10);
        const baseName = document.getElementById("gpName").value.trim();
        const desc = document.getElementById("gpDesc").value.trim();
        const price = parseInt(document.getElementById("gpPrice").value, 10);
        const webhook = document.getElementById("gpWebhook").value.trim();
        const imageInput = document.getElementById("gpImage");
        const status = document.getElementById("gpStatus");

        // Save settings for this universe
        saveSettings(universeId, { universeId, gpCount: count, gpName: baseName, gpDesc: desc, gpPrice: price, gpWebhook: webhook });

        if (!universeId || !count || !baseName || !desc || isNaN(price) || imageInput.files.length === 0) {
            status.textContent = "⚠️ Fill out all fields and upload an image.";
            status.style.color = "orange";
            return;
        }

        const imageFile = imageInput.files[0];
        const csrfToken = await getCsrfToken();

        for (let i = 1; i <= count; i++) {
            const name = `${baseName} #${i}`;
            status.textContent = `⏳ Creating ${name}...`;
            status.style.color = "white";

            try {
                const result = await createGamePass(csrfToken, universeId, name, desc, price, imageFile);
                console.log("Created pass:", result);
                status.textContent = `✅ Created ${name}`;
                status.style.color = "lightgreen";

                if (webhook) {
                    sendWebhook(webhook, "✅ Gamepass Created", `**${name}**\n💰 Price: R$${price}\n🔗 [View Pass](https://www.roblox.com/game-pass/${result.id})`, 0x57F287);
                }
            } catch (err) {
                console.error(err);
                status.textContent = `❌ Failed to create ${name}`;
                status.style.color = "red";
                if (webhook) {
                    sendWebhook(webhook, "❌ Gamepass Creation Failed", `**${name}**\nUniverse: ${universeId}`, 0xED4245);
                }
                break;
            }

            await sleep(2000);
        }

        status.textContent = `🎉 Finished creating ${count} passes.`;
        status.style.color = "lightgreen";
        if (webhook) {
            sendWebhook(webhook, "🎉 Finished", `Created **${count}** passes for universe **${universeId}**`, 0x5865F2);
        }
    }

    injectToggleButton();
    injectGUI();
    document.getElementById("gpStart").addEventListener("click", createPasses);
})();
// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2025-08-24
// @description  try to take over the world!
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();