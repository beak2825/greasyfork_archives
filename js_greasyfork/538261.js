// ==UserScript==
// @name         DOTV Item Description (Beauty)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @license MIT
// @description  Enhance all tooltips: format effects, expand height, improve readability
// @namespace    https://greasyfork.org/users/1159361
// @author       Zaregoto_Gaming
// @match        https://play.dragonsofthevoid.com/*
// @exclude      https://play.dragonsofthevoid.com/#/login
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538261/DOTV%20Item%20Description%20%28Beauty%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538261/DOTV%20Item%20Description%20%28Beauty%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Persistent Width Control ---
    let tooltipWidth = parseInt(localStorage.getItem("tooltipWidth")) || 500;

    function applyTooltipWidth(width) {
        const contentWidth = width;
        const outerWidth = width + 20;

        GM_addStyle(`
            .item-popover-content {
                width: ${contentWidth}px !important;
            }
            .item-popover {
                width: ${outerWidth}px !important;
            }
        `);

        localStorage.setItem("tooltipWidth", width);
    }

    // Initial style
    const baseStyle = `
        .item-popover {
            max-width: 90vw !important;
            height: auto !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
        }
        .item-popover-content {
            max-width: 90vw !important;
            height: auto !important;
            max-height: 85vh !important;
            overflow-y: auto !important;
        }
    `;
    GM_addStyle(baseStyle);
    applyTooltipWidth(tooltipWidth);

    // Function to reposition tooltips if they appear off-screen at the top
   function repositionTooltip() {
    requestAnimationFrame(() => {
        document.querySelectorAll('.tooltip-content-container.ready').forEach(el => {

            const rect = el.getBoundingClientRect();
            const viewportWidth = window.innerWidth;

            if (rect.top < 10) {
                el.style.top = `${window.scrollY + 100}px`;
                el.style.transform = 'none';
            }

            if (rect.left < 10) {
                el.style.left = '10px';
                el.style.transform = 'none';
            }

            if (rect.right > viewportWidth - 10) {
                const newLeft = Math.max(10, viewportWidth - rect.width - 10);
                el.style.left = `${newLeft}px`;
                el.style.transform = 'none';
            }
        });
    });
}

    function formatEffectText(text) {
        const [effectBlock, ...setBonusParts] = text.split(/Set Bonus/i);
        const rawLines = effectBlock.split(/[\r\n;]+/).map(line => line.trim()).filter(Boolean);

        let htmlLines = [];
        let inEffectBlock = false;

        for (let line of rawLines) {
            const isArmorType = line.toLowerCase().includes("light armor:") || line.toLowerCase().includes("heavy armor:");
            const isGreenHeader = line.includes(':') || /chance to proc/i.test(line);
            const isIndentedDamage = (
                line.startsWith('+') &&
                (/damage/i.test(line) || /per/i.test(line)) &&
                !/crit damage/i.test(line)
            );

            if (isArmorType) {
                htmlLines.push(`<div style="color:#4ab0f0; margin-bottom: 4px;">${line}</div>`);
            } else if (isGreenHeader) {
                htmlLines.push(`<div style="color:#42bd3a; font-weight:bold; margin-top: 8px;">${line}</div>`);
                inEffectBlock = true;
            } else if (isIndentedDamage && inEffectBlock) {
                htmlLines.push(`<div style="margin-left: 1.5em; color:#ffce73; margin-bottom: 2px;">• ${line}</div>`);
            } else {
                htmlLines.push(`<div style="color:#42bd3a; font-weight:bold; margin-bottom: 4px;">${line}</div>`);
                inEffectBlock = false;
            }
        }

        // --- Parse Set Bonus ---
        let setBonusHtml = '';
        if (setBonusParts.length) {
            const remainder = setBonusParts.join('Set Bonus').trim();
            const setBonusLines = remainder.split(/[\r\n;]+/).map(line => line.trim()).filter(Boolean);

            setBonusHtml += `<br><div style="color:#d35400; font-weight:bold; margin-bottom: 6px; margin-top: 0;">Set Bonus</div>`;

            for (const line of setBonusLines) {
                const isArmorType = line.toLowerCase().includes("light armor:") || line.toLowerCase().includes("heavy armor:");

                if (isArmorType) {
                    setBonusHtml += `<div style="color:#4ab0f0; margin-bottom: 4px;">${line}</div>`;
                } else if (/^\d+\+?:/.test(line)) {
                    setBonusHtml += `<div style="margin-left: 1.5em; color:#ffce73; margin-bottom: 3px;">• ${line}</div>`;
                } else {
                    setBonusHtml += `<div style="color:#42bd3a; font-weight:bold; margin-bottom: 6px;">${line}</div>`;
                }
            }
        }

        return htmlLines.join('') + setBonusHtml;
    }

    function enhanceEffectsDiv(div) {
        if (div.dataset.enhanced) return;
        const text = div.innerText.trim();
        if (!text) return;
        div.innerHTML = formatEffectText(text);
        div.style.whiteSpace = 'pre-wrap';
        div.dataset.enhanced = "true";
    }

    const observer = new MutationObserver(() => {
        document.querySelectorAll('.effects').forEach(enhanceEffectsDiv);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const tooltipObserver = new MutationObserver(() => {
        repositionTooltip();
        applyTooltipWidth(tooltipWidth);
    });
    tooltipObserver.observe(document.body, { childList: true, subtree: true });

    // --- Add width setting to game settings panel ---
    // Add SVG + - button framework
    // --- Add width setting to game settings panel ---
    function cloneGameButton(type, onClick) {
        // Look for the first usable settings button by class
        const button = document.querySelector(".settings-button.button");
        if (!button) {
            console.error("Could not find a settings button to clone.");
            return document.createElement("div");
        }

        // Go up to the outer frame container to clone the entire button
        const wrapper = button.closest(".frame-container.image-frame-border")?.cloneNode(true);
        if (!wrapper) {
            console.error("Could not find frame container to clone.");
            return document.createElement("div");
        }

        wrapper.style.width = "36px";
        wrapper.style.height = "36px";
        wrapper.style.minWidth = "36px";
        wrapper.style.minHeight = "36px";
        wrapper.style.marginRight = type === "minus" ? "15px" : "0";
        wrapper.style.marginLeft = type === "plus" ? "15px" : "0";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";

        const innerButton = wrapper.querySelector(".settings-button.button");
        if (innerButton) {
            innerButton.style.width = "100%";
            innerButton.style.height = "100%";
            innerButton.style.display = "flex";
            innerButton.style.alignItems = "center";
            innerButton.style.justifyContent = "center";
        }

        const svg = wrapper.querySelector("svg");
        const path = svg?.querySelector("path");

        const iconData = {
            plus: {
                icon: "plus",
                d: "M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
            },
            minus: {
                icon: "minus",
                d: "M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
            }
        };

        if (svg && path) {
            svg.setAttribute("data-icon", iconData[type].icon);
            path.setAttribute("d", iconData[type].d);

            // Fix the viewBox so the icon centers correctly
            svg.setAttribute("viewBox", "0 0 448 512");

            svg.style.width = "100%";
            svg.style.height = "100%";
            svg.style.margin = "auto";
        }

        wrapper.addEventListener("click", onClick);
        return wrapper;
    }



    function addTooltipWidthControls(container) {

        const widthDisplay = document.createElement("span");
        widthDisplay.innerText = ` ${tooltipWidth}px`;
        widthDisplay.style.fontSize = "30px";
        widthDisplay.style.margin = "0 10px";

        const increaseBtn = cloneGameButton("plus", () => {
            tooltipWidth += 20;
            applyTooltipWidth(tooltipWidth);
            widthDisplay.innerText = ` ${tooltipWidth}px`;
        });

        const decreaseBtn = cloneGameButton("minus", () => {
            tooltipWidth = Math.max(200, tooltipWidth - 20);
            applyTooltipWidth(tooltipWidth);
            widthDisplay.innerText = ` ${tooltipWidth}px`;
        });

        const controlsRow = document.createElement("div");
        controlsRow.style.display = "flex";
        controlsRow.style.alignItems = "center";
        controlsRow.style.justifyContent = "center";
        //controlsRow.style.marginTop = "15px";

        controlsRow.appendChild(decreaseBtn);
        controlsRow.appendChild(widthDisplay);
        controlsRow.appendChild(increaseBtn);

        container.appendChild(controlsRow);
    }

    // Add Observer for settings icon in game
    const settingsObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node instanceof Element && node.classList.contains("modal-shell")) {
                    const settingsView = document.getElementById("settings");
                    if (!settingsView) return;

                    const fieldset = document.createElement("fieldset");
                    fieldset.style.borderRadius = "5px";
                    fieldset.style.backgroundColor = "#252525";
                    fieldset.style.padding = "20px";
                    fieldset.style.marginTop = "15px";
                    fieldset.style.borderColor = "#a0725f";

                    const legend = document.createElement("legend");
                    legend.innerText = "Hover Width";
                    legend.style.fontSize = "36px";
                    legend.style.fontWeight = "bold";

                    const container = document.createElement("div");
                    fieldset.appendChild(legend);
                    fieldset.appendChild(container);
                    settingsView.appendChild(fieldset);

                    addTooltipWidthControls(container);
                }
            });
        });
    });

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            const checkInterval = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(checkInterval);
                    callback(el);
                }
            }, 100);
        }
    }

    waitForElement("#game-view", (gameView) => {
        settingsObserver.observe(gameView, {
            childList: true,
            subtree: true,
        });
    });
})();