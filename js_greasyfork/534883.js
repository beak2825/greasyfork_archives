// ==UserScript==
// @name         Copy Report URLs
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Right-click after selecting table rows to copy column 1 links. Button styles on hover/click and shows checkmark after copying.
// @match        https://www.gaiaonline.com/moddog/report/area/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/534883/Copy%20Report%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/534883/Copy%20Report%20URLs.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const BUTTON_ID = 'tm-copy-url-button';

    function createCopyButton(x, y) {
        let button = document.getElementById(BUTTON_ID);
        if (!button) {
            button = document.createElement("button");
            button.id = BUTTON_ID;
            button.textContent = "Copy Report URLs";
            Object.assign(button.style, {
                position: "absolute",
                top: `${y - 40}px`,
                left: `${x - 10}px`,
                zIndex: 99999,
                padding: "6px 10px",
                backgroundColor: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                fontSize: "13px",
                userSelect: "none",
                transition: "background-color 0.2s, color 0.2s",
            });

            button.addEventListener("mouseenter", () => {
                button.style.backgroundColor = "#444";
            });
            button.addEventListener("mouseleave", () => {
                button.style.backgroundColor = "#333";
            });

            button.addEventListener("mouseup", () => {
                const selection = window.getSelection();
                const selectedLinks = extractLinksFromSelection(selection);
                if (selectedLinks.length) {
                    GM_setClipboard(selectedLinks.join("\n"));
                    button.textContent = "✅ Copied!";
                } else {
                    button.textContent = "⚠️ No URLs";
                }

                setTimeout(() => {
                    button.remove();
                    window.getSelection().removeAllRanges();
                }, 1500);
            });

            document.body.appendChild(button);
        } else {
            button.style.top = `${y - 40}px`;
            button.style.left = `${x - 10}px`;
        }
    }

    function extractLinksFromSelection(selection) {
        const links = [];
        const allRows = document.querySelectorAll("table tr");

        allRows.forEach(row => {
            try {
                if (selection.containsNode(row, true)) {
                    const firstCellLink = row.querySelector("td:first-child a[href]");
                    if (firstCellLink) {
                        links.push(firstCellLink.href);
                    }
                }
            } catch (err) {
                console.warn("Selection check error:", err);
            }
        });

        return links;
    }

    function removeCopyButton() {
        const button = document.getElementById(BUTTON_ID);
        if (button) button.remove();
    }

    document.addEventListener("contextmenu", (e) => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            createCopyButton(e.pageX, e.pageY);
        } else {
            removeCopyButton();
        }
    });

    document.addEventListener("mousedown", (e) => {
        const button = document.getElementById(BUTTON_ID);
        if (button && !button.contains(e.target)) {
            button.remove();
        }
    });
})();
