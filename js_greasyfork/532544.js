// ==UserScript==
// @name         Spoof Discord Platform
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Spoof Discord Web client with draggable, toggleable UI and platform icons
// @author       you
// @match        https://discord.com/*
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532544/Spoof%20Discord%20Platform.user.js
// @updateURL https://update.greasyfork.org/scripts/532544/Spoof%20Discord%20Platform.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const platforms = {
        "Desktop": { "$os": "Windows", "$browser": "Discord Client", "$device": "Discord Client" },
        "Android": { "$os": "Android", "$browser": "Discord Android", "$device": "Discord Android" },
        "iOS": { "$os": "iOS", "$browser": "Discord iOS", "$device": "Discord iOS" },
        "Xbox": { "$os": "Xbox", "$browser": "Xbox", "$device": "Xbox" },
        "Web": { "$os": "Mac OS X", "$browser": "Chrome", "$device": "" }
    };

    const platformIcons = {
        "Desktop": "💻",
        "Android": "🤖",
        "iOS": "📱",
        "Xbox": "🎮",
        "Web": "🌐"
    };

    const defaultPlatform = "Web";
    let selectedPlatform = localStorage.getItem("discordPlatformSpoof") || defaultPlatform;

    Object.keys(platforms).forEach(platform => {
        GM_registerMenuCommand(`Set platform: ${platform}`, () => {
            localStorage.setItem("discordPlatformSpoof", platform);
            alert(`Discord platform set to ${platform}. Reload Discord to apply changes.`);
        });
    });

    const spoofProps = platforms[selectedPlatform];

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        try {
            const json = JSON.parse(data);
            if (json.op === 2 && json.d?.properties) {
                json.d.properties = spoofProps;
                console.log(`[SPOOF] Spoofed as ${selectedPlatform} client.`);
                data = JSON.stringify(json);
            }
        } catch (e) { }
        return originalSend.call(this, data);
    };

    function createMenu() {
        const wrapper = document.createElement("div");
        wrapper.id = "spoof-ui-wrapper";
        wrapper.style.cssText = `
            position: fixed;
            top: 120px;
            right: 20px;
            z-index: 9999;
            background-color: #2f3136;
            color: #fff;
            border-radius: 8px;
            font-family: "gg sans", "Segoe UI", sans-serif;
            box-shadow: 0 0 15px rgba(0,0,0,0.4);
            padding: 10px;
            max-width: 220px;
            display: none;
        `;

        const title = document.createElement("div");
        title.textContent = "Platform Menu";
        title.style.fontWeight = "bold";
        title.style.marginBottom = "10px";
        title.style.cursor = "move";
        wrapper.appendChild(title);

        Object.keys(platforms).forEach(platform => {
            const btn = document.createElement("button");
            btn.textContent = `${platformIcons[platform]} ${platform}`;
            btn.style.cssText = `
                display: block;
                width: 100%;
                margin: 5px 0;
                padding: 6px;
                background-color: ${platform === selectedPlatform ? "#5865F2" : "#7289da"};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                text-align: left;
                padding-left: 12px;
            `;
            btn.onclick = () => {
                localStorage.setItem("discordPlatformSpoof", platform);
                alert(`Platform set to ${platform}. Reload Discord to apply.`);
                location.reload();
            };
            wrapper.appendChild(btn);
        });

        let isDragging = false, offsetX, offsetY;
        title.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - wrapper.getBoundingClientRect().left;
            offsetY = e.clientY - wrapper.getBoundingClientRect().top;
            e.preventDefault();
        });
        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                wrapper.style.top = `${e.clientY - offsetY}px`;
                wrapper.style.left = `${e.clientX - offsetX}px`;
                wrapper.style.right = "auto";
            }
        });
        document.addEventListener("mouseup", () => { isDragging = false; });

        document.body.appendChild(wrapper);

        const toggle = document.createElement("div");
        toggle.textContent = "⚙️";
        toggle.title = "Toggle Menu";
        toggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #5865F2;
            color: white;
            font-size: 18px;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
        `;
        toggle.onclick = () => {
            wrapper.style.display = wrapper.style.display === "none" ? "block" : "none";
        };

        document.body.appendChild(toggle);
    }

    window.addEventListener('load', createMenu);
})();
