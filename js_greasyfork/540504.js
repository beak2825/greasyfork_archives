// ==UserScript==
// @name         Talkomatic Tooltips
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Advanced talkomatic thingies
// @match        https://classic.talkomatic.co/room.html?roomId=*
// @match        https://dev.talkomatic.co/room.html?roomId=*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540504/Talkomatic%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/540504/Talkomatic%20Tooltips.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function buildStatusLabel(fontSize = "16px", bottom = "10px") {
        let label = document.getElementById("socketStatusLabel");
        if (!label) {
            label = document.createElement("div");
            label.id = "socketStatusLabel";
            label.style.position = "fixed";
            label.style.left = "10px";
            label.style.zIndex = "9999";
            label.style.fontStyle = "italic";
            label.style.fontFamily = "Arial, sans-serif";
            label.style.color = "white";
            label.innerHTML = `🔌Socket status: <span id="socketStatusValue" style="color:red;">disconnected</span>`;
            document.body.appendChild(label);
        }

        label.style.fontSize = fontSize;
        label.style.bottom = bottom;
    }

    function determinePlacement() {
        const upload = document.querySelector('label[for="bg-upload-button"]');
        if (upload) {
            const spacing = upload.offsetHeight ? upload.offsetHeight + 6 : 28;
            buildStatusLabel("16px", `${spacing + 8}px`);
        } else {
            buildStatusLabel("16px", "10px");
        }
    }

    function updateStatus() {
        const el = document.getElementById("socketStatusValue");
        if (el && typeof socket === "object") {
            el.textContent = socket.connected ? "connected" : "disconnected";
            el.style.color = socket.connected ? "limegreen" : "red";
        }
    }
function monitorChatInputs() {
    const wrappers = document.querySelectorAll(".chat-input-wrapper");

    wrappers.forEach(wrapper => {
        const input = wrapper.querySelector(".chat-input");
        const row = wrapper.closest(".chat-row");
        const userId = row?.dataset.userId || "unknown";

        let infoBar = wrapper.querySelector(".info-bar");
        if (!infoBar) {
            infoBar = document.createElement("div");
            infoBar.className = "info-bar";
            wrapper.appendChild(infoBar);
        }

        Object.assign(infoBar.style, {
            position: "absolute",
            bottom: "4px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
            fontFamily: "monospace",
            color: "white",
            background: "rgba(0, 0, 0, 0.6)",
            padding: "4px 8px",
            borderRadius: "6px",
            zIndex: "5",
            textShadow: "black 0 0 3px, black 0 0 6px"
        });

        let counterGroup = infoBar.querySelector(".char-counter-label");
        if (!counterGroup) {
            counterGroup = document.createElement("span");
            counterGroup.className = "char-counter-label";

            const lengthSpan = document.createElement("span");
            lengthSpan.className = "length-span";
            counterGroup.appendChild(lengthSpan);

            counterGroup.append(" |");
            infoBar.appendChild(counterGroup);
        }

        const lengthSpan = counterGroup.querySelector(".length-span");

        let baseLength = input?.textContent?.length || 0;
        input?.querySelectorAll("img[alt]")?.forEach(img => baseLength += img.alt.length);

        lengthSpan.textContent = `${baseLength} / ${MAX_MESSAGE_LENGTH}`;
        lengthSpan.style.color = baseLength > MAX_MESSAGE_LENGTH - 1 ? "#ffabab" : "#ffffff";

        let idGroup = infoBar.querySelector(".user-id-box");
        if (!idGroup) {
            idGroup = document.createElement("span");
            idGroup.className = "user-id-box";
            idGroup.style.display = "flex";
            idGroup.style.alignItems = "center";
            idGroup.style.gap = "4px";

            const idLabel = document.createElement("span");
            idLabel.className = "user-id-label";
            idLabel.textContent = `ID: ${userId}`;

            const copyBtn = document.createElement("button");
            copyBtn.textContent = "📋Copy";
            copyBtn.title = "Copy User ID";
            Object.assign(copyBtn.style, {
                fontSize: "12px",
                padding: "2px 6px",
                background: "rgb(34,34,34)",
                color: "white",
                border: "1px solid orange",
                borderRadius: "4px",
                cursor: "pointer"
            });

            copyBtn.onclick = () => {
                navigator.clipboard.writeText(userId).then(() => {
                    copyBtn.textContent = "✅Copied";
                    setTimeout(() => copyBtn.textContent = "📋Copy", 1000);
                });
            };

            idGroup.appendChild(idLabel);
            idGroup.appendChild(copyBtn);
            infoBar.appendChild(idGroup);
        }
    });
}
    window.addEventListener("load", () => {
        determinePlacement();
        updateStatus();
        setInterval(updateStatus, 100);
        setInterval(determinePlacement, 5000);
        setInterval(monitorChatInputs, 50);
    });
})();

function startAntiAfkLoop() {
    console.log('Initalize Anti AFK loop...')
    if (typeof socket === "undefined") {
       console.warn('Failure to start Anti AFK script, Uh oh')
        return;
    }
    console.log('Run the AFK script...')
    setInterval(() => {
        socket.emit("anti-afk", {
            author: "ZackiBoiz"
        });
    }, 3000);
}


(function () {
    'use strict';

    const originalSetInterval = window.setInterval;
    const blocked = [];

    window.setInterval = function (fn, delay, ...args) {
        const fnText = fn.toString();
        if (fnText.includes("toLocaleTimeString") || fnText.includes("updateDateTime")) {
            console.log("🛑 Blocked original updateDateTime interval");
            return -1;
        }
        const id = originalSetInterval(fn, delay, ...args);
        blocked.push({ id, fnText });
        return id;
    };

    function getOrdinalSuffix(n) {
        if (n >= 11 && n <= 13) return 'th';
        return ['st', 'nd', 'rd'][n % 10 - 1] || 'th';
    }

    function formatFancyDateOnly() {
        const now = new Date();
        const day = now.getDate();
        const suffix = getOrdinalSuffix(day);
        const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
        const month = now.toLocaleDateString(undefined, { month: 'long' });
        const year = now.getFullYear();
        return `📅${weekday} ${day}${suffix} ${month} ${year}📅`;
    }

    function formatDualClock() {
        const now = new Date();
        const pad = x => String(x).padStart(2, '0');
        const h = pad(now.getHours());
        const m = pad(now.getMinutes());
        const s = pad(now.getSeconds());
        const twelve = now.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }).toLowerCase();
        return `⌚${h}:${m}:${s} / ${twelve}⌚`;
    }
    function updateClock() {
        const box = document.querySelector('#dateTime');
        if (!box) return;
        const dateEl = box.querySelector('.date');
        const timeEl = box.querySelector('.time');

        if (dateEl) dateEl.textContent = formatFancyDateOnly();
        if (timeEl) timeEl.textContent = formatDualClock();
    }

    window.addEventListener("DOMContentLoaded", () => {
        updateClock();
        startAntiAfkLoop()
        setInterval(updateClock, 1000);
    });
})();

addEventListener("click",()=>{console.log('Auto inactivity loaded');const ctx=new AudioContext(),o=ctx.createOscillator();o.connect(ctx.destination);o.start();o.frequency.value=0.0001;},{once:true});
