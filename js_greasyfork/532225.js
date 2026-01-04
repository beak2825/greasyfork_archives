// ==UserScript==
// @name         Discord Platform Spoof + Toolbox
// @namespace    http://tampermonkey.net/
// @version      1.5.4
// @author       CheetoPuffsz23
// @description  Switch platforms, highlight red users, and trigger full wipe with a slick UI.
// @match        https://discord.com/channels/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532225/Discord%20Platform%20Spoof%20%2B%20Toolbox.user.js
// @updateURL https://update.greasyfork.org/scripts/532225/Discord%20Platform%20Spoof%20%2B%20Toolbox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const platforms = {
        "Web": { "$os": "Windows", "$browser": "Chrome", "$device": "" },
        "Mobile": { "$os": "Android", "$browser": "Discord Android", "$device": "Discord Android" }
    };

    let selected = GM_getValue("discordSpoofPlatform", "Web");
    let uiContainer = null;
    let isVisible = false;

    const spoofedProps = () => platforms[selected];

    const originalSend = WebSocket.prototype.send;
    WebSocket.prototype.send = function (data) {
        try {
            if (typeof data === "string" && data.includes('"op":2')) {
                const parsed = JSON.parse(data);
                if (parsed?.op === 2 && parsed?.d?.properties) {
                    parsed.d.properties = spoofedProps();
                    console.log(`[Spoof] Applied "${selected}" spoof:`, parsed.d.properties);
                    data = JSON.stringify(parsed);
                }
            }
        } catch (err) {
            console.error("[Spoof] Failed to spoof IDENTIFY:", err);
        }
        return originalSend.call(this, data);
    };

    function highlightRedUsernames() {
        const observer = new MutationObserver(() => {
            Array.from(document.querySelectorAll('[class*="username"]')).forEach(el => {
                const name = el.textContent.toLowerCase();
                if (name.includes("admin") || name.includes("mod")) {
                    el.style.color = "#ff4d4d";
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function toggleUsernameHighlight() {
        const style = document.getElementById("toolbox-username-style");
        if (style) style.remove();
        else {
            const css = document.createElement("style");
            css.id = "toolbox-username-style";
            css.textContent = `
                [class*='username'] { color: #ff5555 !important; }
            `;
            document.head.appendChild(css);
        }
    }

    function createDivider() {
        const div = document.createElement("div");
        div.style.cssText = "margin: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1);";
        return div;
    }

    function createSubtleLabel(text) {
        const label = document.createElement("div");
        label.textContent = text;
        label.style.cssText = "margin-top: 4px; margin-bottom: 0.3px; font-size: 10px; color: #888; font-weight: 400; text-align: right;";
        return label;
    }
        function createLabel(text) {
        const label = document.createElement("div");
        label.textContent = text;
        label.style.cssText = "margin-top: 4px; font-size: 15px; color: #fff; font-weight: 600; text-align: center;";
        return label;
    }

    function createUI() {
        uiContainer = document.createElement("div");
        uiContainer.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            width: 260px;
            background: rgba(30, 30, 40, 0.65);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            box-shadow: 0 0 15px rgba(0,0,0,0.5);
            color: #fff;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            z-index: 999999;
            user-select: none;
        `;

        const header = document.createElement("div");
        header.textContent = "🛠️ Discord Toolbox";
        header.style.cssText = `
            padding: 10px 12px;
            font-weight: bold;
            background: rgba(0,0,0,0.2);
            border-bottom: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px 12px 0 0;
            cursor: move;
        `;
        uiContainer.appendChild(header);

        const body = document.createElement("div");
        body.style.padding = "12px";

       const inputStyle = `
           width: 100%;
           padding: 8px;
           border-radius: 6px;
           background: rgba(50,50,60,0.9);
           color: #fff;
           border: 1px solid rgba(0,0,0,0.3);
           margin: 8px 0 2px 0;
           box-sizing: border-box;
         `;
        const buttonStyle = `
            margin-top: 8px;
            width: 100%;
            padding: 8px;
            border-radius: 6px;
            background: rgba(60, 60, 70, 0.9);
            color: #fff;
            border: 1px solid rgba(0,0,0,0.3);
            cursor: pointer;
        `;

        const select = document.createElement("select");
        select.style.cssText = inputStyle;

        Object.keys(platforms).forEach(key => {
            const option = document.createElement("option");
            option.value = key;
            option.textContent = key;
            if (key === selected) option.selected = true;
            select.append(option);
        });

        select.onchange = () => {
            selected = select.value;
            GM_setValue("discordSpoofPlatform", selected);
            alert(`✅ Spoofed as "${selected}". Click Reconnect to apply.`);
        };

        const webhookInput = document.createElement("input");
        webhookInput.placeholder = "https://discord.com/api/webhooks/...";
        webhookInput.style.cssText = inputStyle;

        const reconnectBtn = document.createElement("button");
        reconnectBtn.textContent = "🔄 Reconnect";
        reconnectBtn.style.cssText = buttonStyle;
        reconnectBtn.onclick = () => {
            alert("📡 Reloading to reconnect...");
            window.location.reload();
        };

        const usernameColorToggle = document.createElement("button");
        usernameColorToggle.textContent = "🎨 Toggle Red Usernames";
        usernameColorToggle.style.cssText = buttonStyle;
        usernameColorToggle.onclick = toggleUsernameHighlight;

        const deleteWebhookBtn = document.createElement("button");
        deleteWebhookBtn.textContent = "🚫 Delete Webhook";
        deleteWebhookBtn.style.cssText = buttonStyle;
        deleteWebhookBtn.onclick = async () => {
            const url = webhookInput.value.trim();
            if (!url.startsWith("https://discord.com/api/webhooks/")) return alert("❌ Invalid webhook URL.");
            try {
                const res = await fetch(url, { method: "DELETE" });
                if (res.ok) alert("✅ Webhook deleted successfully.");
                else alert(`❌ Failed to delete webhook: ${res.status}`);
            } catch (err) {
                console.error("Webhook delete error:", err);
                alert("❌ Error deleting webhook.");
            }
        };

        const panicBtn = document.createElement("button");
        panicBtn.textContent = "💣 Panic Wipe";
        panicBtn.style.cssText = buttonStyle + "background: #9b1c1c; border-color: #5c0d0d;";
        panicBtn.onclick = () => {
            alert("☠️ Nuking everything...");
            if (uiContainer) uiContainer.remove();
            WebSocket.prototype.send = originalSend;
            GM_deleteValue("discordSpoofPlatform");
            for (const key in window) {
                if (typeof window[key] === "function" && /spoof|ui|tool/i.test(key)) {
                    window[key] = () => {};
                }
            }
        };

        body.append(
            createLabel("📱 Platform Spoof"), select,
            reconnectBtn, createSubtleLabel("Reload to apply"),
            usernameColorToggle, createSubtleLabel("Changes username color for easier readability"),
            createDivider(),
            webhookInput, createSubtleLabel("Paste full webhook URL"), deleteWebhookBtn,
            createDivider(),
            panicBtn, createSubtleLabel("Press Shift + P to hide the menu temporarily!")
        );

        uiContainer.appendChild(body);
        document.body.appendChild(uiContainer);

        let isDragging = false, offsetX = 0, offsetY = 0;
        header.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - uiContainer.offsetLeft;
            offsetY = e.clientY - uiContainer.offsetTop;
            document.body.style.userSelect = "none";
        });
        document.addEventListener("mouseup", () => {
            isDragging = false;
            document.body.style.userSelect = "";
        });
        document.addEventListener("mousemove", (e) => {
            if (isDragging) {
                uiContainer.style.left = `${e.clientX - offsetX}px`;
                uiContainer.style.top = `${e.clientY - offsetY}px`;
            }
        });
    }

    function toggleUI() {
        if (!uiContainer) return;
        isVisible = !isVisible;
        uiContainer.style.display = isVisible ? "block" : "none";
    }

    document.addEventListener("keydown", (e) => {
        const t = e.target;
        if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
        if (e.shiftKey && e.key.toLowerCase() === "p") toggleUI();
    });

    window.addEventListener("load", () => {
        createUI();
        uiContainer.style.display = "block";
        isVisible = true;
        highlightRedUsernames();
        console.log("[Spoof] Toolbox loaded. Shift+P to toggle.");
    });
})();
