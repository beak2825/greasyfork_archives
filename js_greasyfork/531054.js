// ==UserScript==
// @name         Hover Tooltip for Full Video Title
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Shows a floating tooltip with the full video title when hovering over truncated titles.
// @match        *://sextb.net/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531054/Hover%20Tooltip%20for%20Full%20Video%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/531054/Hover%20Tooltip%20for%20Full%20Video%20Title.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let tooltip = null;

    // Helper to create a styled tooltip element
    function createTooltip(text) {
        const tip = document.createElement("div");
        tip.textContent = text;
        tip.style.position = "fixed";
        tip.style.background = "rgba(0, 0, 0, 0.8)";
        tip.style.color = "#fff";
        tip.style.padding = "5px 10px";
        tip.style.borderRadius = "4px";
        tip.style.zIndex = "999999";
        tip.style.whiteSpace = "normal";
        tip.style.maxWidth = "300px";
        tip.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        tip.style.pointerEvents = "none"; // So the tooltip doesn't block hover
        return tip;
    }

    // When mouse goes over any element, check if it's a .tray-item-title
    document.addEventListener("mouseover", function(e) {
        const titleEl = e.target.closest(".tray-item-title");
        // If not over a title, remove any existing tooltip
        if (!titleEl) {
            removeTooltip();
            return;
        }
        // If hovering over a .tray-item-title but no tooltip yet, create it
        if (!tooltip) {
            tooltip = createTooltip(titleEl.textContent.trim());
            document.body.appendChild(tooltip);
        }
    });

    // Update tooltip position on mouse move
    document.addEventListener("mousemove", function(e) {
        if (tooltip) {
            // Offset the tooltip slightly so it doesn't cover the cursor
            const offset = 10;
            tooltip.style.left = (e.clientX + offset) + "px";
            tooltip.style.top = (e.clientY + offset) + "px";
        }
    });

    // If mouse leaves the element, remove the tooltip
    document.addEventListener("mouseout", function(e) {
        const titleEl = e.target.closest(".tray-item-title");
        // Only remove tooltip if we actually left the .tray-item-title area
        if (titleEl) {
            removeTooltip();
        }
    });

    // Removes the tooltip if present
    function removeTooltip() {
        if (tooltip) {
            tooltip.remove();
            tooltip = null;
        }
    }
})();
