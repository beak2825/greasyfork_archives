// ==UserScript==
// @name         Remove Limits - ALL KILL
// @name:zh-CN   移除限制 - 通杀
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  ALL-KILL solution for removing limits on the website
// @description:zh-CN 用于移除网站限制的通杀解决方案
// @match        none
// @author       PRO
// @run-at       document-start
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/492852/Remove%20Limits%20-%20ALL%20KILL.user.js
// @updateURL https://update.greasyfork.org/scripts/492852/Remove%20Limits%20-%20ALL%20KILL.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const debug = false;
    const log = debug ? console.log.bind(console, "[Remove Limits]") : () => { };
    // === JavaScript Part ===
    // Stop listeners that might hinder right-click menu, selection, etc.
    const events = ["contextmenu", "select", "selectstart", "copy", "cut", "dragstart"];
    events.forEach((event) => {
        document.addEventListener(event, (e) => {
            e.stopImmediatePropagation();
        }, { capture: true });
    });
    // === CSS Part ===
    const userSelectAliases = ["-webkit-touch-callout", "-webkit-user-select", "-moz-user-select", "-ms-user-select", "user-select"];
    // Remove CSS rules that might hinder user selection
    function removeUserSelect(styleSheet) {
        for (const rule of styleSheet.cssRules) { // Might encounter a SecurityError
            if (!rule instanceof CSSStyleRule || !rule.style) continue; // Not what we're looking for
            // Iterate over its styles
            for (const property of rule.style) {
                if (userSelectAliases.includes(property) && rule.style.getPropertyValue(property) === "none") {
                    rule.style.removeProperty(property); // Remove the property
                    log(`Removed "${property}" from rule:`, rule);
                }
            }
        }
    }
    document.addEventListener("DOMContentLoaded", () => {
        // Remove all `user-select: none` declarations
        for (const styleSheet of document.styleSheets) {
            try {
                removeUserSelect(styleSheet);
            } catch (e) {
                if (e instanceof DOMException && e.name === "SecurityError") {
                    log("Caught a SecurityError while trying to read a CSS rule. This is expected if the CSS rule is from a different origin.");
                } else {
                    log("An unexpected error occurred while trying to read a CSS rule:", e);
                }
            }
        }
    });
    // Allow selection using CSS (not needed anymore in most cases)
    const style = document.createElement("style");
    style.textContent = `* {
        ${userSelectAliases.map((alias) => `${alias}: unset !important;`).join("\n")}
    }`;
    document.head.appendChild(style);
})();
