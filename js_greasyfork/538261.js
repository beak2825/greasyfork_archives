// ==UserScript==
// @name         DOTV Item Description (Beauty)
// @namespace    http://tampermonkey.net/
// @version      2.5
// @license MIT
// @description  Enhance all tooltips: format effects, expand height, improve readability
// @author       Zaregoto_Gaming
// @match        https://play.dragonsofthevoid.com/*
// @exclude      https://play.dragonsofthevoid.com/#/login
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538261/DOTV%20Item%20Description%20%28Beauty%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538261/DOTV%20Item%20Description%20%28Beauty%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Persistent Width Control ---
    let tooltipWidth = parseInt(localStorage.getItem("tooltipWidth")) || 500;

    // --- ONE persistent style element for width ---
    const tooltipWidthStyle = document.createElement("style");
    tooltipWidthStyle.id = "dotv-tooltip-width-style";
    document.head.appendChild(tooltipWidthStyle);

    function applyTooltipWidth(width) {
        const contentWidth = width;
        const outerWidth = width + 20;

        tooltipWidthStyle.textContent = `
            .item-popover-content {
                width: ${contentWidth}px !important;
            }
            .item-popover {
                width: ${outerWidth}px !important;
            }
        `;

        localStorage.setItem("tooltipWidth", width);
    }

    // --- Static base styles (added ONCE) ---
    GM_addStyle(`
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
    `);

    applyTooltipWidth(tooltipWidth);

    // ---------------- Tooltip reposition logic ----------------

    function forceRepositionLoop(el) {
        let ticks = 0;
        const maxTicks = 20;

        const interval = setInterval(() => {
            ticks++;

            if (!document.body.contains(el)) {
                clearInterval(interval);
                return;
            }

            el.style.transform = "none";

            const rect = el.getBoundingClientRect();
            const vw = window.innerWidth;
            const vh = window.innerHeight;

            let left = rect.left;
            let top = rect.top;

            if (rect.left < 10) left = 10;
            if (rect.right > vw - 10) left = vw - rect.width - 10;
            if (rect.top < 10) top = 10;
            if (rect.bottom > vh - 10) top = vh - rect.height - 10;

            el.style.left = `${left}px`;
            el.style.top = `${top}px`;

            if (ticks >= maxTicks) clearInterval(interval);
        }, 10);
    }

    function repositionTooltip() {
        document.querySelectorAll('.tooltip-content-container.ready')
            .forEach(forceRepositionLoop);
    }

    // ---------------- Effect text formatting ----------------

    function formatEffectText(text) {
        const [effectBlock, ...setBonusParts] = text.split(/Set Bonus/i);
        const rawLines = effectBlock
            .split(/[\r\n;]+/)
            .map(l => l.trim())
            .filter(Boolean);

        let htmlLines = [];
        let inEffectBlock = false;

        for (let line of rawLines) {
            const isArmorType = /light armor:|heavy armor:/i.test(line);
            const isGreenHeader = line.includes(':') || /chance to proc/i.test(line);
            const isIndentedDamage =
                line.startsWith('+') &&
                (/damage/i.test(line) || /per/i.test(line)) &&
                !/crit damage/i.test(line);

            if (isArmorType) {
                htmlLines.push(`<div style="color:#4ab0f0; margin-bottom:4px;">${line}</div>`);
            } else if (isGreenHeader) {
                htmlLines.push(`<div style="color:#42bd3a;font-weight:bold;margin-top:8px;">${line}</div>`);
                inEffectBlock = true;
            } else if (isIndentedDamage && inEffectBlock) {
                htmlLines.push(`<div style="margin-left:1.5em;color:#ffce73;">• ${line}</div>`);
            } else {
                htmlLines.push(`<div style="color:#42bd3a;font-weight:bold;">${line}</div>`);
                inEffectBlock = false;
            }
        }

        let setBonusHtml = '';
        if (setBonusParts.length) {
            const setBonusLines = setBonusParts
                .join('Set Bonus')
                .trim()
                .split(/[\r\n;]+/)
                .map(l => l.trim())
                .filter(Boolean);

            setBonusHtml += `<br><div style="color:#d35400;font-weight:bold;">Set Bonus</div>`;

            for (const line of setBonusLines) {
                if (/light armor:|heavy armor:/i.test(line)) {
                    setBonusHtml += `<div style="color:#4ab0f0;">${line}</div>`;
                } else if (/^\d+\+?:/.test(line)) {
                    setBonusHtml += `<div style="margin-left:1.5em;color:#ffce73;">• ${line}</div>`;
                } else {
                    setBonusHtml += `<div style="color:#42bd3a;font-weight:bold;">${line}</div>`;
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

    const effectsObserver = new MutationObserver(() => {
        document.querySelectorAll('.effects').forEach(enhanceEffectsDiv);
    });
    effectsObserver.observe(document.body, { childList: true, subtree: true });

    // --- Tooltip reposition observer (NO style injection here anymore) ---
    const tooltipObserver = new MutationObserver(repositionTooltip);
    tooltipObserver.observe(document.body, { childList: true, subtree: true });

    // ---------------- Settings UI (unchanged) ----------------

    function cloneGameButton(type, onClick) {
        const button = document.querySelector(".settings-button.button");
        if (!button) return document.createElement("div");

        const wrapper = button.closest(".frame-container.image-frame-border")?.cloneNode(true);
        if (!wrapper) return document.createElement("div");

        wrapper.style.width = wrapper.style.height = "36px";
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.justifyContent = "center";

        const svg = wrapper.querySelector("svg");
        const path = svg?.querySelector("path");

        const iconData = {
            plus: "M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z",
            minus: "M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"
        };

        if (svg && path) {
            path.setAttribute("d", iconData[type]);
            svg.setAttribute("viewBox", "0 0 448 512");
        }

        wrapper.addEventListener("click", onClick);
        return wrapper;
    }

    function addTooltipWidthControls(container) {
        const widthDisplay = document.createElement("span");
        widthDisplay.innerText = ` ${tooltipWidth}px`;
        widthDisplay.style.fontSize = "30px";

        container.append(
            cloneGameButton("minus", () => {
                tooltipWidth = Math.max(200, tooltipWidth - 20);
                applyTooltipWidth(tooltipWidth);
                widthDisplay.innerText = ` ${tooltipWidth}px`;
            }),
            widthDisplay,
            cloneGameButton("plus", () => {
                tooltipWidth += 20;
                applyTooltipWidth(tooltipWidth);
                widthDisplay.innerText = ` ${tooltipWidth}px`;
            })
        );
    }

})();
