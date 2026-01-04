// ==UserScript==
// @name         Fifteensquared Spoiler
// @namespace    https://github.com/stuson/fifteensquared-spoiler
// @homepageURL  https://github.com/stuson/fifteensquared-spoiler
// @version      0.1
// @description  Hides all answers and explanations for cryptic crosswords on Fifteensquared behind toggleable spoilers.
// @author       Sam Tuson
// @match        https://www.fifteensquared.net/*/*/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/456684/Fifteensquared%20Spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/456684/Fifteensquared%20Spoiler.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const addStyle = (cssObj) => {
        const mapProperties = (props) => {
            return Object.entries(props)
                .map(([prop, value]) => {
                    prop = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
                    return `${prop}: ${value}`;
                })
                .join("; ");
        };

        const id = "fifteensquared-spoiler-style";
        let styleEl = document.getElementById(id);
        if (!styleEl) {
            styleEl = document.createElement("style");
            styleEl.id = id;
            document.head.appendChild(styleEl);
        }

        Object.entries(cssObj).forEach(([selector, style]) => {
            styleEl.sheet.insertRule(`${selector} { ${mapProperties(style)} }`);
        });
    };

    const toggleAnswer = (ans) => {
        if (ans.classList.contains("revealed")) {
            hideAnswer(ans);
        } else {
            revealAnswer(ans);
        }
    };

    const revealAnswer = (ans) => {
        const ansId = ans.dataset.ansId;
        ans.classList.add("revealed");
        localStorage.setItem(ansId, 1);
    };

    const hideAnswer = (ans) => {
        const ansId = ans.dataset.ansId;
        ans.classList.remove("revealed");
        localStorage.removeItem(ansId);
    };

    const addSpoilers = () => {
        const testRow = (row) => {
            const el = row.firstElementChild;
            if (el.textContent.match(/^\s*\d/)) return true;

            if (row.childElementCount > 1 && !el.textContent && el.colSpan > 1) return true;

            return false;
        };

        const path = window.location.pathname;
        const rows = document.querySelectorAll(".entry-content tr");
        const updatedRows = Array.from(rows).map((row, rowIdx) => {
            if (testRow(row)) {
                row.querySelectorAll("td:nth-of-type(n+2)").forEach((ans, ansIdx) => {
                    const ansId = `${path}~~${rowIdx}~~${ansIdx}`;
                    if (localStorage.getItem(ansId)) ans.classList.add("revealed");
                    ans.classList.add("spoiler");
                    ans.dataset.ansId = ansId;
                    ans.addEventListener("click", () => toggleAnswer(ans));
                });

                return row;
            }
        });

        if (updatedRows.length < 1) {
            showWarning();
        } else {
            addSpoilerControls();
        }
    };

    const showWarning = () => {
        const content = document.querySelector(".entry-content");
        content.classList.add("spoiler-warning");
        content.addEventListener("click", (e) => e.target.classList.remove("spoiler-warning"));
    };

    const addSpoilerControls = () => {
        const setAllAnswers = (revealed) => {
            if (revealed) {
                document.querySelectorAll(".spoiler").forEach((ans) => revealAnswer(ans));
            } else {
                document.querySelectorAll(".spoiler").forEach((ans) => hideAnswer(ans));
            }
        };

        const controls = document.createElement("div");
        controls.className = "spoiler-controls";

        const revealAllBtn = document.createElement("button");
        revealAllBtn.type = "button";
        revealAllBtn.textContent = "Reveal all";
        revealAllBtn.addEventListener("click", () => setAllAnswers(true));
        controls.appendChild(revealAllBtn);

        const hideAllBtn = document.createElement("button");
        hideAllBtn.className = "secondary-button";
        hideAllBtn.type = "button";
        hideAllBtn.textContent = "Hide all";
        hideAllBtn.addEventListener("click", () => setAllAnswers(false));
        controls.appendChild(hideAllBtn);

        document.querySelector(".entry-content").prepend(controls);
    };

    const css = {
        ".spoiler, .spoiler-warning": {
            position: "relative",
        },
        ".spoiler": {
            padding: "2px 5px",
        },
        ".spoiler:hover, .spoiler-warning:hover": {
            opacity: "0.8",
        },
        ".spoiler::after, .spoiler-warning::after": {
            display: "block",
            position: "absolute",
            inset: "0",
            padding: "10px",
            backgroundColor: "rgba(12, 12, 12, 1.0)",
            color: "#fff",
            cursor: "pointer",
        },
        ".spoiler::after": {
            content: "''",
            margin: "2px",
            transition: "background-color 0.1s ease-in-out",
        },
        ".spoiler.revealed::after": {
            backgroundColor: "rgba(12, 12, 12, 0.08)",
        },
        ".spoiler-warning::after": {
            content:
                "'WARNING: Fifteensquared Spoiler could not find any answers to block. Click this message to reveal the whole page at once.'",
        },
        ".spoiler-controls > button": {
            marginRight: "10px",
        },
        ".secondary-button": {
            backgroundColor: "#595959",
        },
    };

    addStyle(css);
    addSpoilers();
})();
