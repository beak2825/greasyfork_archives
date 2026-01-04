// ==UserScript==
// @name         SG Train Navigation Assistant
// @namespace    http://tampermonkey.net/
// @version      2025-09-27
// @description  Adds some QoL shortcuts for train navigation on SG!
// @author       Alpha2749 | SG /user/Alpha2749
// @match        https://www.steamgifts.com/giveaway/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamgifts.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533401/SG%20Train%20Navigation%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/533401/SG%20Train%20Navigation%20Assistant.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* Fallback default config (DO NOT TOUCH)
       -  If you want to modify your configuration
          please click on your userscript manager
          and click 'Configure Script'
    */
    const defaultConfig = {
        allowOpenScreenshots: true,
        keyBindings: {
            next: "ArrowRight",
            previous: "ArrowLeft",
            screenshots: "ArrowUp",
            trailerToggle: "Control",
        }
    };
    let config = loadConfig();
    GM_registerMenuCommand("Configure Script", () => {
        openConfigUI();
    });


    const nextKeywords = ['next', 'forward', 'on', '>', 'cho', '→', 'N E X T', 'ahead', 'future', 'climbing', '↬', 'avanti', 'prossimo', '▶', 'nekst', 'yes', 'go', '➡️', '⏩', '⏭️', '🌜', '👉', 'Forth'];
    const lastKeywords = ['prev', 'back', 'last', '<', 'och', '←', 'B A C K', 'retreat', 'past', 'falling', '↫', 'indietro', 'precedente', '◀', 'previous', 'perv', 'prior', 'no', 'og', '⬅️', '⏪', '⏮️', '🌛', '👈'];

    document.addEventListener("keydown", function (event) {
        const isInputField = ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName);
        const configOpen = document.querySelector("#tm-config-ui");
        if (isInputField || configOpen) return;

        const screenshotsOpen = !document.querySelector(".lightbox.hide");
        if (screenshotsOpen) {
            handleScreenshots(event);
            return;
        }

        if (event.key === config.keyBindings.next) handleNavigation("next");
        if (event.key === config.keyBindings.previous) handleNavigation("previous");
        if (config.allowOpenScreenshots && event.key === config.keyBindings.screenshots) {
            openScreenshots();
        }
    });

    async function handleNavigation(direction) {
        const link = extractLinks(direction) || findLabelledLink(direction) || findLink(direction);
        if (link) {
            showPopup(`Moving ${direction === 'next' ? 'Onward' : 'Backward'}!`);
            window.location.href = link;
        } else {
            showPopup(`Unable to find ${direction} cart. Are you sure you're in a train?`);
        }
    }

    function findLink(direction) {
        var regex = new RegExp((direction === 'next' ? nextKeywords : lastKeywords).join('|'), 'i');
        return Array.from(document.querySelector('.page__description')?.querySelectorAll('a') || []).find(link => {
            const text = link.textContent.trim();
            const url = link.href;
            const isValidURL = url.includes('/giveaway/') && !url.includes('/discussion/') && !url.includes('/user/');
            return isValidURL && regex.test(text);
        })?.href;
    }

    function findLabelledLink(direction) {
        var regex = new RegExp(`^\\s*(?:${(direction === 'next' ? nextKeywords : lastKeywords).join('|')})(?=\\s*:?)`, 'i');
        const container = document.querySelector('.page__description');
        if (!container) return null;

        const lines = container.innerText.split('\n');
        for (const line of lines) {
            if (regex.test(line)) {
                const match = line.match(/(https?:\/\/[^ \n]+)/);
                if (match) {
                    const url = match[1];
                    const isValidURL = url.includes('/giveaway/') && !url.includes('/discussion/') && !url.includes('/user/');
                    if (isValidURL) return url;
                }
            }
        }
        return null;
    }

    function extractLinks(direction) {
        const paragraphs = document.querySelector('.page__description')?.querySelectorAll('p, h1, h2') || [];
        const numbers = Array.from(paragraphs)
        .flatMap(paragraph => [...paragraph.innerText.matchAll(/\d+/g)].map(match => parseInt(match)))
        .filter(Boolean);

        const uniqueNumbers = Array.from(new Set(numbers)).sort((a, b) => a - b);
        if (uniqueNumbers.length === 0) return null;

        let run = null;
        for (let i = 0; i < uniqueNumbers.length; i++) {
            if (i + 1 < uniqueNumbers.length &&
                uniqueNumbers[i + 1] - uniqueNumbers[i] === 2) {
                run = [uniqueNumbers[i], uniqueNumbers[i + 1]];
                break;
            }

            if (i + 2 < uniqueNumbers.length &&
                uniqueNumbers[i + 1] - uniqueNumbers[i] === 1 &&
                uniqueNumbers[i + 2] - uniqueNumbers[i + 1] === 1) {
                run = [uniqueNumbers[i], uniqueNumbers[i + 1], uniqueNumbers[i + 2]];
                break;
            }
        }
        if (!run) return null;

        const targetNum = direction === 'previous' ? run[0] : run[run.length - 1];
        const link = Array.from(document.querySelectorAll('a')).find(
            a => a.textContent.trim() === targetNum.toString()
        );
        return link ? link.href : null;
    }

    function handleScreenshots(event) {
        if (event.key === config.keyBindings.screenshots) {
            const closeBtn = document.querySelector('.lightbox-header-icon--close');
            closeBtn?.click();
            return;
        }

        if (event.key === config.keyBindings.trailerToggle) {
            const imageBtn = document.querySelector('.lightbox-header-icon.fa-camera');
            const videoBtn = document.querySelector('.lightbox-header-icon.fa-video-camera');
            if (!imageBtn || !videoBtn) return;

            const isImageSelected = imageBtn.classList.contains('lightbox-header-icon--selected');
            if (isImageSelected) {
                videoBtn.click();
            } else {
                imageBtn.click();
            }
        }
    }

    function openScreenshots() {
        const screenshotBtn = Array.from(document.querySelectorAll('a[data-ui-tooltip]')).find(el => {
            const tooltipData = el.getAttribute('data-ui-tooltip');
            return tooltipData && JSON.parse(tooltipData).rows.some(row =>
                row.columns.some(column => column.name === 'Screenshots / Videos')
            );
        });
        screenshotBtn?.click();
    }

    function showPopup(message) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 5px;
            z-index: 999999;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.2s, transform 0.3s;
        `;
        popup.textContent = message;
        document.body.appendChild(popup);

        requestAnimationFrame(() => {
            popup.style.opacity = '1';
            popup.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            popup.style.opacity = '0';
            popup.style.transform = 'translateY(20px)';
            setTimeout(() => {
                document.body.removeChild(popup);
            }, 300);
        }, 2000);
    }


    // Config stuff
    function loadConfig() {
        const saved = GM_getValue("config", {});
        return {
            ...defaultConfig,
            ...saved,
            keyBindings: {
                ...defaultConfig.keyBindings,
                ...(saved.keyBindings || {})
            }
        };
    }

    function saveConfig(cfg) {
        GM_setValue("config", cfg);
    }

    let currentClosePopupHandler = null;
    function openConfigUI() {
        const existing = document.querySelector("#tm-config-ui");
        if (existing) {
            existing.remove();
            return;
        }

        const panel = document.createElement("div");
        panel.id = "tm-config-ui";
        panel.style.position = "fixed";
        panel.style.top = "40px";
        panel.style.right = "40px";
        panel.style.zIndex = "999999";
        panel.style.background = "#fff";
        panel.style.color = "#333";
        panel.style.padding = "20px";
        panel.style.border = "1px solid #ccc";
        panel.style.borderRadius = "8px";
        panel.style.fontFamily = "Segoe UI, sans-serif";
        panel.style.minWidth = "280px";
        panel.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";

        panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
            <h3 style="margin:0;font-size:16px;color:#444;">TrainNavAssist Config</h3>
            <span id="cfg-close" style="cursor:pointer;font-size:16px;color:#999;">✕</span>
        </div>

        <label style="display:block;margin-bottom:10px;">
            <strong>Next Key:</strong><br>
            <input type="text" id="cfg-next" value="${config.keyBindings.next}" readonly
                style="width:100%;padding:6px 8px;margin-top:4px;border:1px solid #ccc;border-radius:4px;">
        </label>

        <label style="display:block;margin-bottom:10px;">
            <strong>Previous Key:</strong><br>
            <input type="text" id="cfg-prev" value="${config.keyBindings.previous}" readonly
                style="width:100%;padding:6px 8px;margin-top:4px;border:1px solid #ccc;border-radius:4px;">
        </label>

        <label style="display: block; margin-bottom: 16px;">
            <strong>Media Keys:</strong><br>
            Open/ Close Screenshots:<br>
            <label style="display: flex; width: 100%;">
                <input type="text" id="cfg-scr" value="${config.keyBindings.screenshots}" readonly
                    style="padding: 6px 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px; margin-right: 8px;">
                <input type="checkbox" id="cfg-screenshots" style="width: 48px;" ${config.allowOpenScreenshots ? "checked" : ""}>
            </label>
            Toggle Images/Videos:<br>
            <input type="text" id="cfg-tra" value="${config.keyBindings.trailerToggle}" readonly
                    style="padding: 6px 8px; margin-top: 4px; border: 1px solid #ccc; border-radius: 4px; margin-right: 8px;">
        </label>

        <div style="display:flex;gap:8px;justify-content:flex-end;">
            <button id="cfg-reset" style="
                background:#eee;border:1px solid #ccc;border-radius:4px;
                padding:6px 12px;cursor:pointer;font-size:13px;
            ">Reset to Default</button>
        </div>
    `;

        document.body.appendChild(panel);

        panel.querySelector("#cfg-screenshots").addEventListener("change", (e) => {
            config.allowOpenScreenshots = e.target.checked;
            showPopup("Screenshot Hotkey " + (config.allowOpenScreenshots ? 'ON' : 'OFF'));
            saveConfig(config);
        });

        function bindKeyCapture(input, action) {
            input.addEventListener("focus", () => {
                input.value = "Press a key...";
            });
            input.addEventListener("keydown", (e) => {
                e.preventDefault();
                if (e.key === "Escape") {
                    input.value = config.keyBindings[action];
                    input.blur();
                    return;
                }
                input.value = e.key;
                config.keyBindings[action] = e.key;
                saveConfig(config);
                showPopup("Config Saved");
                input.blur();
            });
        }

        bindKeyCapture(panel.querySelector("#cfg-next"), "next");
        bindKeyCapture(panel.querySelector("#cfg-prev"), "previous");
        bindKeyCapture(panel.querySelector("#cfg-scr"), "screenshots");
        bindKeyCapture(panel.querySelector("#cfg-tra"), "trailerToggle");

        panel.querySelector("#cfg-close").onclick = closePopup;
        panel.querySelector("#cfg-reset").onclick = () => {
            config = { ...defaultConfig };
            saveConfig(config);
            showPopup("Config reset to defaults");
            closePopup();
        };

        setTimeout(() => {
            document.addEventListener("click", closePopupHandler);
        }, 0);

        function closePopupHandler(event) {
            if (!panel.contains(event.target)) {
                closePopup();
            }
        }

        function closePopup() {
            document.removeEventListener("click", closePopupHandler);
            panel.remove();
            return;
        }
    }
})();
