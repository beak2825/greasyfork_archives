// ==UserScript==
// @name         DOTV Bulk Join Raids
// @version      1.5
// @license      MIT
// @namespace    https://greasyfork.org/users/1159361
// @description  UI for selecting and joining raids by difficulty with a draggable button
// @author       Zaregoto_Gaming
// @match        https://play.dragonsofthevoid.com/*
// @exclude      https://play.dragonsofthevoid.com/#/login
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537587/DOTV%20Bulk%20Join%20Raids.user.js
// @updateURL https://update.greasyfork.org/scripts/537587/DOTV%20Bulk%20Join%20Raids.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const raidMap = {
        "r.lesser-ent": "Lesser Tree Ent",
        "r.superior-watcher": "Superior Watcher",
        "r.elven-rangers": "Elven Rangers",
        "r.greater-ent": "Greater Ent",
        "r.sand-wyrm": "Sand Wyrm",
        "r.corrupted-golem": "Corrupted Golem",
        "r.naga-risaldar": "Naga Risaldar",
        "r.galeohog": "Galeohog",
        "r.naga-karamati": "Naga Karamati",
        "r.jagar-the-red": "Jagar the Red",
        "r.rotting-fen-lure": "Rotting Fen Lure",
        "r.sentry-ghoul": "Sentry Ghoul",
        "r.fallen-naga-subedar": "Fallen Naga Subedar",
        "r.bone-dragon": "Bone Dragon",
        "r.giant-bombeetle": "Giant Bombeetle",
        "r.grootslang": "Grootslang",
        "r.demon-chaosoldier": "Demon Chaosoldier",
        "r.xaphegorgh": "Xaphegorgh",
        "r.xarbruutu": "Xarbruutu"
    };

    const difficulties = ["easy", "hard", "legendary"];
    const JOIN_LIMIT_STORAGE_KEY = 'autojoinRaidMaxJoinLimit';
    let publicRaidCounts = {};

    function loadSettings() {
        return JSON.parse(localStorage.getItem('autojoinRaidSettings')) || {};
    }

    function saveSettings(settings) {
        localStorage.setItem('autojoinRaidSettings', JSON.stringify(settings));
    }

    function loadButtonPosition() {
        return JSON.parse(localStorage.getItem('autojoinButtonPosition')) || { top: '40px', left: '10px' };
    }

    function saveButtonPosition(position) {
        localStorage.setItem('autojoinButtonPosition', JSON.stringify(position));
    }

    function saveMaxJoinLimit(limit) {
        localStorage.setItem(JOIN_LIMIT_STORAGE_KEY, limit);
    }

    function loadMaxJoinLimit() {
        return parseInt(localStorage.getItem(JOIN_LIMIT_STORAGE_KEY), 10) || 20;
    }

    function makeDraggable(element) {
        let offsetX, offsetY, isDragging = false;
        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            element.style.top = `${Math.max(0, newY)}px`;
            element.style.left = `${Math.max(0, newX)}px`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = 'grab';
            saveButtonPosition({ top: element.style.top, left: element.style.left });
        });
    }

    async function fetchPublicRaidCounts() {
        const token = localStorage.token;
        publicRaidCounts = {};

        const [publicRes, activeRes] = await Promise.all([
            fetch("https://api.dragonsofthevoid.com/api/raid/public", { headers: { authorization: token } }),
            fetch("https://api.dragonsofthevoid.com/api/raid/active", { headers: { authorization: token } })
        ]);

        const publicRaids = await publicRes.json();
        const activeRaids = await activeRes.json();
        const activeIds = new Set(activeRaids.map(r => r.id));

        for (const raid of publicRaids) {
            if (activeIds.has(raid.id)) continue;
            const xml = raid.raidXmlId;
            const diff = raid.difficulty;
            if (!publicRaidCounts[xml]) publicRaidCounts[xml] = {};
            if (!publicRaidCounts[xml][diff]) publicRaidCounts[xml][diff] = 0;
            publicRaidCounts[xml][diff]++;
        }
    }

    async function createUI(button) {
        await fetchPublicRaidCounts();
        const settings = loadSettings();
        const ui = document.createElement("div");
        ui.id = "autojoin-ui";
        ui.style.position = "fixed";
        ui.style.background = "#fff";
        ui.style.padding = "10px";
        ui.style.border = "1px solid black";
        ui.style.borderRadius = "8px";
        ui.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
        ui.style.zIndex = "1000";
        ui.style.maxHeight = "400px";
        ui.style.overflowY = "auto";

        const buttonRect = button.getBoundingClientRect();
        ui.style.top = `${Math.min(window.innerHeight - 410, buttonRect.bottom + window.scrollY)}px`;
        ui.style.left = `${Math.min(window.innerWidth - 300, buttonRect.left + window.scrollX)}px`;

        const title = document.createElement("div");
        title.innerHTML = `<strong>Bulk Join Settings</strong>`;
        ui.appendChild(title);

        // Run button + join limit input
        const runRow = document.createElement("div");
        runRow.style.display = "flex";
        runRow.style.alignItems = "center";
        runRow.style.margin = "8px 0 12px 0";

        const runButton = document.createElement("button");
        runButton.textContent = "Join Selected Raids";
        runButton.style.marginRight = "10px";

        const input = document.createElement("input");
        input.type = "number";
        input.min = "1";
        input.value = loadMaxJoinLimit();
        input.style.width = "60px";

        input.addEventListener('change', () => {
            let val = parseInt(input.value, 10);
            if (isNaN(val) || val < 1) val = 1;
            input.value = val;
            saveMaxJoinLimit(val);
        });

        runButton.onclick = () => {
            joinSelectedRaids(parseInt(input.value, 10) || 20);
        };

        runRow.appendChild(runButton);
        runRow.appendChild(document.createTextNode("Max: "));
        runRow.appendChild(input);
        ui.appendChild(runRow);

        Object.entries(raidMap).forEach(([id, name]) => {
            const nameLabel = document.createElement("div");
            nameLabel.textContent = name;
            nameLabel.style.fontWeight = "bold";
            ui.appendChild(nameLabel);

            difficulties.forEach(diff => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = settings[id]?.includes(diff) || false;
                checkbox.onchange = () => {
                    if (!settings[id]) settings[id] = [];
                    if (checkbox.checked) {
                        if (!settings[id].includes(diff)) settings[id].push(diff);
                    } else {
                        settings[id] = settings[id].filter(d => d !== diff);
                    }
                    saveSettings(settings);
                };

                const count = publicRaidCounts[id]?.[diff] || 0;
                ui.appendChild(checkbox);
                ui.appendChild(document.createTextNode(` ${diff.charAt(0).toUpperCase() + diff.slice(1)} (${count})`));
                ui.appendChild(document.createElement("br"));
            });

            ui.appendChild(document.createElement("hr"));
        });

        // Paste input
        const label = document.createElement("div");
        label.innerHTML = `<strong>Join by Paste:</strong>`;
        ui.appendChild(label);

        const textArea = document.createElement("textarea");
        textArea.rows = 10;
        textArea.cols = 40;
        textArea.style.width = "100%";
        textArea.placeholder = "Paste lines like:\njoinraid,6aca59f3..., Corrupted Golem hard \njoinraid,6aca59f3..., Corrupted Golem hard";
        ui.appendChild(textArea);

        const pasteButton = document.createElement("button");
        pasteButton.textContent = "Join from Paste";
        pasteButton.onclick = async () => {
            const token = localStorage.token;
            const lines = textArea.value.trim().split("\n");
            const joinKeys = [];

            for (let line of lines) {
                const match = line.match(/^joinraid,([a-f0-9\-]+)/i);
                if (match) joinKeys.push(match[1]);
            }

            let success = 0;
            for (let key of joinKeys) {
                try {
                    await joinraid(key, token);
                    success++;
                } catch (e) {
                    console.error("Failed to join:", key, e);
                }
            }

            alert(`Attempted to join ${joinKeys.length} raids. Successful: ${success}`);
        };
        ui.appendChild(pasteButton);

        document.body.appendChild(ui);
    }

    function addToggleButton() {
        const button = document.createElement("button");
        button.textContent = "⚔️ Bulk Join";
        button.style.position = "fixed";
        button.style.zIndex = "1001";
        button.style.cursor = "grab";

        const pos = loadButtonPosition();
        button.style.top = pos.top;
        button.style.left = pos.left;

        button.onclick = () => {
            const existing = document.getElementById("autojoin-ui");
            if (existing) existing.remove();
            else createUI(button);
        };

        document.body.appendChild(button);
        makeDraggable(button);
    }

    async function joinSelectedRaids(limit = 20) {
        const token = localStorage.token;
        const settings = loadSettings();

        const [publicRaids, activeRaids] = await Promise.all([
            getpublicraids(token),
            getactiveraids(token)
        ]);
        const activeIds = new Set(activeRaids.map(r => r.id));

        const toJoin = publicRaids.filter(raid => {
            if (raid.health < 10000) return false;
            if (activeIds.has(raid.id)) return false;
            return settings[raid.raidXmlId]?.includes(raid.difficulty);
        }).reverse();

        let count = 0;
        for (const raid of toJoin) {
            if (count >= limit) break;
            await joinraid(raid.joinkey, token);
            count++;
        }

        alert(`Joined ${count} raids`);
    }

    async function getpublicraids(token) {
        const res = await fetch("https://api.dragonsofthevoid.com/api/raid/public", {
            headers: { authorization: token }
        });
        return res.json();
    }

    async function getactiveraids(token) {
        const res = await fetch("https://api.dragonsofthevoid.com/api/raid/active", {
            headers: { authorization: token }
        });
        return res.json();
    }

    async function joinraid(joinkey, token) {
        const res = await fetch("https://api.dragonsofthevoid.com/api/raid/join/" + joinkey, {
            headers: { authorization: token }
        });
        return res.json();
    }

   function start() {
        // Make sure the body exists before we try to append
        if (document.body) {
            addToggleButton();
        } else {
            // Retry until the DOM is built
            const obs = new MutationObserver(() => {
                if (document.body) {
                    obs.disconnect();
                    addToggleButton();
                }
            });
            obs.observe(document.documentElement, { childList: true, subtree: true });
        }
    }

    // Run when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start);
    } else {
        start();
    }
})();
