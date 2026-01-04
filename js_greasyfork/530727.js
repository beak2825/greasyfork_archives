// ==UserScript==
// @name         RYM Combine Genres and Scenes
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Combines primary genres with scenes and movements on RateYourMusic album pages
// @author       FrnkPsycho
// @match        *://rateyourmusic.com/release/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530727/RYM%20Combine%20Genres%20and%20Scenes.user.js
// @updateURL https://update.greasyfork.org/scripts/530727/RYM%20Combine%20Genres%20and%20Scenes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = false; // Set to true to enable logging
    const OPACITY = 0.75; // Set opacity of appending text, including slash separators
    const INLINE = true; // Set false to display scenes and movements in a new line

    function log(...args) {
        if (DEBUG) console.log("[RYM Script]", ...args);
    }

    function appendScenesAndMovements() {
        const genreRows = document.querySelectorAll("tr.release_genres");
        let genreRow, scenesRow, movementsRow;

        genreRows.forEach(row => {
            const header = row.querySelector("th.info_hdr");
            if (!header) return;
            const text = header.textContent.trim();
            if (text === "Genres") genreRow = row;
            else if (text === "Scenes") scenesRow = row;
            else if (text === "Movements") movementsRow = row;
        });

        if (!genreRow) {
            log("Genre row not found");
            return;
        }

        const priGenres = genreRow.querySelector(".release_pri_genres");
        if (!priGenres) {
            log("Primary genres not found");
            return;
        }

        let additionalText = "";
        let slash = `<span style='opacity: ${OPACITY};'> / </span>`;

        [scenesRow, movementsRow].forEach(row => {
            if (row) {
                const categorySpan = row.querySelector(".release_pri_genres");
                if (categorySpan) {
                    additionalText += (additionalText ? `${slash}` : "") + `<span style='color: var(--link-text-default); opacity: ${OPACITY};'>${categorySpan.innerHTML}</span>`;
                }
                row.remove();
            }
        });

        if (additionalText) {
            if (INLINE) {
                priGenres.innerHTML += `${slash}${additionalText}`;
            } else {
                priGenres.innerHTML += `<br>${additionalText}`;
            }
            log("Updated genres with scenes/movements:", priGenres.innerHTML);
        } else {
            log("No scenes or movements found");
        }
    }

    function waitForElement(selector, callback, interval = 500, timeout = 5000) {
        const startTime = Date.now();
        const check = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(check);
                callback(element);
            } else if (Date.now() - startTime > timeout) {
                clearInterval(check);
                log(`Timeout waiting for ${selector}`);
            }
        }, interval);
    }

    waitForElement("tr.release_genres", appendScenesAndMovements);
})();
