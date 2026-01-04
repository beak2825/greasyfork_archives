// ==UserScript==
// @name         Copy Results from GeoGuessr Challenge
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Copy settings, names, scores, and map info from GeoGuessr to clipboard, tab-separated.
// @author       ffz
// @license MIT
// @include      *://*.geoguessr.com/results*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528930/Copy%20Results%20from%20GeoGuessr%20Challenge.user.js
// @updateURL https://update.greasyfork.org/scripts/528930/Copy%20Results%20from%20GeoGuessr%20Challenge.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const button = document.createElement("button");
    button.classList.add("button");
    button.innerHTML = "Copy Results";
    document.body.appendChild(button);

    button.addEventListener("click", function() {
        const names = [...document.querySelectorAll('.results_column__pZWgz .user-nick_nick__sRjZ2')].map(t => t.textContent.trim());
        const scores = [...document.querySelectorAll('.results_totalColumn__vlXbH .score-cell_score__oKM2x')].map(t => t.textContent.replace(/\D/g, ''));

        const map = document.querySelector('.info-card_title__QWuny')?.textContent.trim();
        let url = window.location.href.replace(/results/, 'challenge');
        const hyperlink = `=HYPERLINK("${url}", "${map}")`;

        let settings = document.querySelector('.info-card_content___gJYt p')?.textContent.trim();

        let format = "Moving";
        if (settings.includes("No move") && settings.includes("No pan") && settings.includes("No zoom")) {
            format = "NMPZ";
        } else if (settings.includes("No move")) {
            format = "NM";
        }

        let timeLimit = "No time limit";
        let seconds = 0;

        if (!settings.includes("No time limit")) {
            const timeUnits = settings.match(/\d+/g)?.map(Number) || [];
            const conversions = [1, 60, 3600, 86400];

            timeUnits.reverse();
            seconds = timeUnits.reduce((acc, num, index) => {
                const multiplier = conversions[index] || 1;
                return acc + num * multiplier;
            }, 0);

            timeLimit = `${seconds}s`;
        }

        const output = `${hyperlink}\t${format}\t${timeLimit}\t` + names.map((name, i) => `${name}\t${scores[i]}`).join('\t');

        navigator.clipboard.writeText(output).then(() => {
            const originalText = button.innerHTML;
            button.innerHTML = "Copied";
            button.style.backgroundColor = "#4CAF50";
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = "#111";
            }, 2000);
        }).catch(err => {
            const originalText = button.innerHTML;
            button.innerHTML = "Failed";
            button.style.backgroundColor = "#F44336";
            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.backgroundColor = "#111";
            }, 2000);
        });
    });

    const style = document.createElement('style');
    style.innerHTML = `
        .button {
            padding: 0.6em 2em;
            border: none;
            color: #fff;
            background: #111;
            cursor: pointer;
            position: fixed;
            left: 20px;
            bottom: 20px;
            z-index: 9999;
            border-radius: 10px;
            box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7);
            transition: all 0.3s ease;
        }
        .button:hover {
            box-shadow: 0 0 15px 5px rgba(255, 255, 255, 0.9);
        }
    `;
    document.head.appendChild(style);
})();