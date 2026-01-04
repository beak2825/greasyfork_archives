// ==UserScript==
// @name         Raid Card Filter UI
// @namespace    https://greasyfork.org/users/1159361
// @version      1.3
// @license MIT
// @description  Adds a UI to hide specific raid cards by name and difficulty with a movable button and UI.
// @author       Zaregoto_Gaming
// @match        https://play.dragonsofthevoid.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528815/Raid%20Card%20Filter%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/528815/Raid%20Card%20Filter%20UI.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const raidNames = [
        "Lesser Tree Ent", "Superior Watcher", "Elven Rangers", "Greater Ent", "Sand Wyrm",
        "Corrupted Golem", "Naga Risaldar", "Galeohog", "Naga Karamati", "Jagar the Red",
        "Rotting Fen Lure", "Sentry Ghoul", "Fallen Naga Subedar", "Bone Dragon"
    ];
    const difficulties = ["easy", "hard", "legendary"];

    function loadSettings() {
        return JSON.parse(localStorage.getItem('raidFilterSettings')) || { enabled: true };
    }

    function saveSettings(settings) {
        localStorage.setItem('raidFilterSettings', JSON.stringify(settings));
    }

    function removeRaidCards() {
        const settings = loadSettings();
        if (!settings.enabled) return;
        document.querySelectorAll(".raid-card-container").forEach(card => {
            const header = card.querySelector(".raid-card-header");
            if (!header) return;
            const name = header.textContent.trim();
            const difficulty = header.className.match(/font-(\w+)/)?.[1];
            if (settings[name] && settings[name].length > 0 && settings[name].includes(difficulty)) {
                card.remove();
            }
        });
    }

    function createUI(button) {
        const settings = loadSettings();
        const ui = document.createElement("div");
        ui.style.position = "fixed";
        ui.style.background = "white";
        ui.style.padding = "10px";
        ui.style.border = "1px solid black";
        ui.style.zIndex = "1000";
        ui.style.maxHeight = "400px";
        ui.style.overflowY = "auto";

        // Position UI below the button
        const buttonRect = button.getBoundingClientRect();
        ui.style.top = `${Math.min(window.innerHeight - 410, buttonRect.bottom + window.scrollY)}px`;
        ui.style.left = `${Math.min(window.innerWidth - 200, buttonRect.left + window.scrollX)}px`;

        ui.innerHTML = `<strong>Raid Filter</strong><br>`;

        const masterCheckbox = document.createElement("input");
        masterCheckbox.type = "checkbox";
        masterCheckbox.checked = settings.enabled !== false;
        masterCheckbox.onchange = () => {
            settings.enabled = masterCheckbox.checked;
            saveSettings(settings);
            removeRaidCards();
        };
        ui.appendChild(masterCheckbox);
        ui.appendChild(document.createTextNode(" Enable Filtering"));
        ui.appendChild(document.createElement("hr"));

        raidNames.forEach(name => {
            const nameLabel = document.createElement("div");
            nameLabel.textContent = name;
            nameLabel.style.fontWeight = "bold";
            ui.appendChild(nameLabel);

            difficulties.forEach(diff => {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = settings[name]?.includes(diff) || false;
                checkbox.onchange = () => {
                    if (!settings[name]) settings[name] = [];
                    if (checkbox.checked) {
                        settings[name].push(diff);
                    } else {
                        settings[name] = settings[name].filter(d => d !== diff);
                    }
                    saveSettings(settings);
                    removeRaidCards();
                };
                ui.appendChild(checkbox);
                ui.appendChild(document.createTextNode(diff.charAt(0).toUpperCase() + diff.slice(1)));
                ui.appendChild(document.createElement("br"));
            });
            ui.appendChild(document.createElement("hr"));
        });

        document.body.appendChild(ui);
    }

    function loadButtonPosition() {
        return JSON.parse(localStorage.getItem('raidFilterButtonPosition')) || { top: '10px', left: '120px' };
    }

    function saveButtonPosition(position) {
        localStorage.setItem('raidFilterButtonPosition', JSON.stringify(position));
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
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;

            // Constrain within window bounds
            newX = Math.max(0, Math.min(window.innerWidth - element.offsetWidth, newX));
            newY = Math.max(0, Math.min(window.innerHeight - element.offsetHeight, newY));

            element.style.top = `${newY}px`;
            element.style.left = `${newX}px`;
            element.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            element.style.cursor = 'grab';
            saveButtonPosition({ top: element.style.top, left: element.style.left });
        });
    }

    function addToggleButton() {
        const button = document.createElement("button");
        button.textContent = "⚙️ Raid Filter";
        button.style.position = "fixed";
        button.style.zIndex = "1001";
        button.style.cursor = "grab";

        const position = loadButtonPosition();
        button.style.top = position.top;
        button.style.left = position.left;

        button.onclick = () => {
            const ui = document.querySelector("div[style*='fixed'][style*='white']");
            if (ui) {
                ui.remove();
            } else {
                createUI(button);
            }
        };

        document.body.appendChild(button);
        makeDraggable(button);
    }

    addToggleButton();
    removeRaidCards();

    const observer = new MutationObserver(removeRaidCards);
    observer.observe(document.body, { childList: true, subtree: true });
})();