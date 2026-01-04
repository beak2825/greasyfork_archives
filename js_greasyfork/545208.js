// ==UserScript==
// @name         Krunker Fun Pack v1.2 (Visual Only)
// @namespace    https://yournamehere.dev/
// @version      1.2
// @description  Fun visual effects for Krunker.io - safe, no gameplay changes
// @author       You
// @match        *://krunker.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545208/Krunker%20Fun%20Pack%20v12%20%28Visual%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545208/Krunker%20Fun%20Pack%20v12%20%28Visual%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = "krunkerFunPackSettings";
    let settings = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {
        crosshair: "dot",
        crosshairColor: "#ff0000",
        neon: false,
        invert: false,
        killFlash: false,
        theme: "default",
        playerName: ""
    };
    const saveSettings = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    const style = document.createElement("style");
    style.innerHTML = `
        #funPanel {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.7);
            padding: 8px;
            border-radius: 6px;
            font-family: sans-serif;
            color: white;
            font-size: 12px;
            z-index: 99999;
            cursor: move;
            width: 150px;
        }
        #funPanel h4 {
            margin: 2px 0 6px 0;
            font-size: 13px;
            text-align: center;
        }
        #funPanel label {
            display: flex;
            align-items: center;
            margin-bottom: 4px;
        }
        #funPanel input[type=checkbox] {
            margin-right: 5px;
        }
        .neon-vision {
            filter: contrast(2) saturate(2) brightness(1.2);
        }
        .invert-colors {
            filter: invert(1);
        }
        #killFlashOverlay {
            position: fixed;
            top:0;
            left:0;
            width:100%;
            height:100%;
            opacity:0;
            pointer-events:none;
            z-index:99998;
            transition: opacity 0.1s ease;
        }
    `;
    document.head.appendChild(style);

    const killFlashOverlay = document.createElement("div");
    killFlashOverlay.id = "killFlashOverlay";
    document.body.appendChild(killFlashOverlay);

    const panel = document.createElement("div");
    panel.id = "funPanel";
    panel.innerHTML = `
        <h4>Fun Pack</h4>
        <label><input type="checkbox" id="neonToggle"> Neon Vision</label>
        <label><input type="checkbox" id="invertToggle"> Invert Colors</label>
        <label><input type="checkbox" id="killFlashToggle"> Kill Flash</label>
        <label>Your Name:
            <input type="text" id="playerName" placeholder="Exact in-game name">
        </label>
        <label>Crosshair:
            <select id="crosshairSelect">
                <option value="dot">Dot</option>
                <option value="circle">Circle</option>
                <option value="star">Star</option>
            </select>
        </label>
        <label>Color:
            <input type="color" id="crosshairColor">
        </label>
        <label>Theme:
            <select id="themeSelect">
                <option value="default">Default</option>
                <option value="dark">Dark</option>
                <option value="retro">Retro</option>
            </select>
        </label>
    `;
    document.body.appendChild(panel);

    // Load settings into UI
    document.getElementById("neonToggle").checked = settings.neon;
    document.getElementById("invertToggle").checked = settings.invert;
    document.getElementById("killFlashToggle").checked = settings.killFlash;
    document.getElementById("crosshairSelect").value = settings.crosshair;
    document.getElementById("crosshairColor").value = settings.crosshairColor;
    document.getElementById("themeSelect").value = settings.theme;
    document.getElementById("playerName").value = settings.playerName;

    const applyEffects = () => {
        document.body.classList.toggle("neon-vision", settings.neon);
        document.body.classList.toggle("invert-colors", settings.invert);
    };
    applyEffects();

    // Listeners
    document.getElementById("neonToggle").addEventListener("change", e => {
        settings.neon = e.target.checked; saveSettings(); applyEffects();
    });
    document.getElementById("invertToggle").addEventListener("change", e => {
        settings.invert = e.target.checked; saveSettings(); applyEffects();
    });
    document.getElementById("killFlashToggle").addEventListener("change", e => {
        settings.killFlash = e.target.checked; saveSettings();
    });
    document.getElementById("playerName").addEventListener("input", e => {
        settings.playerName = e.target.value.trim(); saveSettings();
    });
    document.getElementById("crosshairSelect").addEventListener("change", e => {
        settings.crosshair = e.target.value; saveSettings(); updateCrosshair();
    });
    document.getElementById("crosshairColor").addEventListener("input", e => {
        settings.crosshairColor = e.target.value; saveSettings(); updateCrosshair();
    });
    document.getElementById("themeSelect").addEventListener("change", e => {
        settings.theme = e.target.value; saveSettings(); applyTheme();
    });

    // Crosshair canvas
    const crosshair = document.createElement("canvas");
    crosshair.width = crosshair.height = 64;
    crosshair.style.position = "fixed";
    crosshair.style.top = "50%";
    crosshair.style.left = "50%";
    crosshair.style.transform = "translate(-50%, -50%)";
    crosshair.style.pointerEvents = "none";
    crosshair.style.zIndex = 99997;
    document.body.appendChild(crosshair);
    const ctx = crosshair.getContext("2d");

    function updateCrosshair() {
        ctx.clearRect(0, 0, 64, 64);
        ctx.strokeStyle = settings.crosshairColor;
        ctx.fillStyle = settings.crosshairColor;
        ctx.lineWidth = 2;
        if (settings.crosshair === "dot") {
            ctx.beginPath(); ctx.arc(32, 32, 3, 0, Math.PI*2); ctx.fill();
        } else if (settings.crosshair === "circle") {
            ctx.beginPath(); ctx.arc(32, 32, 10, 0, Math.PI*2); ctx.stroke();
        } else if (settings.crosshair === "star") {
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.moveTo(32, 32);
                const angle = (i * 72) * Math.PI/180;
                ctx.lineTo(32 + 12 * Math.cos(angle), 32 + 12 * Math.sin(angle));
                ctx.stroke();
            }
        }
    }
    updateCrosshair();

    function applyTheme() {
        if (settings.theme === "dark") {
            document.body.style.backgroundColor = "#111";
        } else if (settings.theme === "retro") {
            document.body.style.filter = "sepia(0.8) saturate(1.2)";
        } else {
            document.body.style.backgroundColor = "";
            document.body.style.filter = "";
        }
    }
    applyTheme();

    function triggerKillFlash(color = "white") {
        if (!settings.killFlash) return;
        killFlashOverlay.style.background = color;
        killFlashOverlay.style.opacity = "1";
        setTimeout(() => killFlashOverlay.style.opacity = "0", 100);
    }

    // --- Detect kills and headshots from killfeed ---
    const killFeedObserver = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && settings.playerName) {
                    const txt = node.innerText || "";
                    const html = node.innerHTML || "";
                    if (txt.includes(settings.playerName)) {
                        if (txt.includes("HS") || html.toLowerCase().includes("headshot")) {
                            triggerKillFlash("gold"); // headshot = gold flash
                        } else {
                            triggerKillFlash("white"); // normal kill
                        }
                    }
                }
            });
        });
    });

    const waitForKillFeed = setInterval(() => {
        const feed = document.querySelector("#killFeed");
        if (feed) {
            killFeedObserver.observe(feed, { childList: true, subtree: true });
            clearInterval(waitForKillFeed);
        }
    }, 1000);

    // Drag panel
    panel.onmousedown = function(event) {
        let shiftX = event.clientX - panel.getBoundingClientRect().left;
        let shiftY = event.clientY - panel.getBoundingClientRect().top;
        function moveAt(pageX, pageY) {
            panel.style.left = pageX - shiftX + 'px';
            panel.style.top = pageY - shiftY + 'px';
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }
        function onMouseMove(e) { moveAt(e.pageX, e.pageY); }
        document.addEventListener('mousemove', onMouseMove);
        document.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            document.onmouseup = null;
        };
    };
    panel.ondragstart = () => false;
})();
