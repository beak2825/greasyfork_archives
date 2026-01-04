// ==UserScript==
// @name         osu! Beatmap Ranked Status Checker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Check ranked status of beatmaps on osu! using a local file
// @author       You
// @license      MIT
// @match        https://osu.ppy.sh/beatmapsets/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535168/osu%21%20Beatmap%20Ranked%20Status%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/535168/osu%21%20Beatmap%20Ranked%20Status%20Checker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Create the popup UI ---
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.top = "100px";
    panel.style.left = "10px";
    panel.style.backgroundColor = "#1b1b1b";
    panel.style.color = "#fff";
    panel.style.padding = "10px";
    panel.style.border = "2px solid #ff66aa";
    panel.style.zIndex = "99999";
    panel.style.fontFamily = "Arial";
    panel.innerHTML = `
        <strong>osu! Ranked Status Checker</strong><br><br>
        <input type="file" id="beatmapFile"><br><br>
        <label>Optional Beatmap ID:</label><br>
        <input type="number" id="manualId" style="width: 100px;"><br><br>
        <button id="checkStatus">Check Status</button>
        <p id="statusResult" style="margin-top: 10px;"></p>
    `;
    document.body.appendChild(panel);

    let beatmapData = {};

    // --- Parse the file and extract Beatmap ID -> Ranked Status ---
    function parseFile(text) {
        const lines = text.split("\n");
        for (const line of lines) {
            const match = line.match(/Beatmap ID:\s*(\d+),\s*Ranked:\s*(\d+)/);
            if (match) {
                const id = match[1];
                const status = match[2];
                beatmapData[id] = status;
            }
        }
    }

    // --- Read uploaded file ---
    document.getElementById("beatmapFile").addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            parseFile(event.target.result);
            alert("Beatmap list loaded!");
        };
        reader.readAsText(file);
    });

    // --- When clicking "Check Status" ---
    document.getElementById("checkStatus").addEventListener("click", () => {
        const manualId = document.getElementById("manualId").value.trim();
        let beatmapId = manualId;

        if (!beatmapId) {
            // Try to extract it from URL
            const match = window.location.href.match(/#\w+\/(\d+)/);
            if (match) {
                beatmapId = match[1];
            } else {
                document.getElementById("statusResult").textContent = "❌ Could not detect beatmap ID from URL.";
                return;
            }
        }

        const status = beatmapData[beatmapId];
        const resultBox = document.getElementById("statusResult");

        if (status !== undefined) {
            resultBox.textContent = `✅ Beatmap ID ${beatmapId} has Ranked status: ${status}`;
        } else {
            resultBox.textContent = `❌ Beatmap ID ${beatmapId} not found in file.`;
        }
    });
})();
