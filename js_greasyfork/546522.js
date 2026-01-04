// ==UserScript==
// @name         Bounty Counter
// @namespace    heartflower.torn
// @version      1.0.2
// @description  Adds an icon in your icons list that shows whether or not you still have bounty slots left
// @author       Heartflower [2626587]
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/546522/Bounty%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/546522/Bounty%20Counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API SETTINGS //

    let apiKey;
    let storedAPIKey = localStorage.getItem('hf-full-access-apiKey');

    if (storedAPIKey) {
        apiKey = storedAPIKey;
        if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', removeAPIKey);
    } else {
        setAPIkey();
    }

    function setAPIkey() {
        let enterAPIKey = prompt('Enter a full access API key here:');

        if (enterAPIKey !== null && enterAPIKey.trim() !== '') {
            localStorage.setItem('hf-full-access-apiKey', enterAPIKey);
            alert('API key set succesfully');

            apiKey = enterAPIKey;

            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Remove API key', removeAPIKey);
        } else {
            alert('No valid API key entered!');

            if (typeof GM_registerMenuCommand === 'function') GM_registerMenuCommand('Set API key', setAPIkey);
        }
    }

    function removeAPIKey() {
        let wantToDelete = confirm('Are you sure you want to remove your API key?');

        if (wantToDelete) {
            localStorage.removeItem('hf-full-access-apiKey');
            alert('API key successfully removed.');
        } else {
            alert('API key not removed.');
        }
    }


    // ACTUAL CODE //

    function fetchLogData() {
        let currentEpoch = Math.floor(Date.now() / 1000);
        let fromTimestamp = currentEpoch - (7 * 24 * 60 * 60); // One week ago, since bounties expire

        let apiUrl = `https://api.torn.com/v2/user/log?cat=157&limit=1000&from=${fromTimestamp}&key=${apiKey}`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
            // console.log('Log data fetched', data);
            parseLogData(data);
        })
            .catch(error => console.error('Error fetching data: ' + error));
    }

    function parseLogData(data) {
        let amount = 0;
        let placements = {}; // placements[target] = [timestamps of placed bounties]

        for (let log of [...data.log].reverse()) {
            let title = log.details.title;
            let timestamp = log.timestamp;
            let target = log.data.target;

            if (!placements[target]) placements[target] = [];

            if (title === 'Bounty place') {
                // Add as many placement timestamps as quantity
                for (let i = 0; i < log.data.quantity; i++) {
                    placements[target].push(timestamp);
                }

                amount += log.data.quantity;
                // console.log('PLACEMENTS HERE', placements);
            } else if (title === 'Bounty expire receive' || title === 'Bounty claim lister') {
                // Only consume a placement if one exists before this timestamp
                let validIndex = placements[target].findIndex(t => t < timestamp);
                if (validIndex !== -1) {
                    // Remove that placement
                    placements[target].splice(validIndex, 1);
                    amount -= 1;

                }

                // console.log('PLACEMENTS THERE', placements, timestamp);
            }
        }

        let remaining = 10 - amount;
        if (remaining < 1) return;

        // console.log('Unexpired bounties', remaining);

        addIcon(remaining);
    }

    function addIcon(number, retries = 30) {
        let statusIcons = document.body.querySelector('.status-icons___gPkXF');
        if (!statusIcons) {
            if (retries > 0) {
                setTimeout(() => addIcon(number, retries - 1), 100);
            } else {
                console.warn('[HF] Gave up looking for icon container after 30 retries.');
            }
            return;
        }

        let mobile = statusIcons.classList.contains('mobile___MWm2o');

        let li = document.createElement('li');
        li.style.background = 'none';
        li.style.cursor = 'pointer';

        let svg = createIcon(number, mobile);

        li.appendChild(svg);
        statusIcons.prepend(li);
    }

    function createIcon(number, mobile) {
        const xmlns = "http://www.w3.org/2000/svg";

        // --- create SVG root ---
        const svg = document.createElementNS(xmlns, "svg");
        svg.setAttribute("width", "17");
        svg.setAttribute("height", "17");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "var(--default-base-royal-color)");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        // --- circle ---
        const circle = document.createElementNS(xmlns, "circle");
        circle.setAttribute("cx", "12");
        circle.setAttribute("cy", "12");
        circle.setAttribute("r", "10");
        svg.appendChild(circle);

        // --- lines ---
        const lines = [
            { x1: 22, y1: 12, x2: 18, y2: 12 },
            { x1: 6, y1: 12, x2: 2, y2: 12 },
            { x1: 12, y1: 6, x2: 12, y2: 2 },
            { x1: 12, y1: 22, x2: 12, y2: 18 }
        ];
        lines.forEach(l => {
            const line = document.createElementNS(xmlns, "line");
            line.setAttribute("x1", l.x1);
            line.setAttribute("y1", l.y1);
            line.setAttribute("x2", l.x2);
            line.setAttribute("y2", l.y2);
            svg.appendChild(line);
        });

        // --- number text ---
        const text = document.createElementNS(xmlns, "text");
        text.setAttribute("x", "12");
        text.setAttribute("y", "13");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("dominant-baseline", "middle");
        text.setAttribute("fill", "var(--default-color)");
        text.setAttribute("stroke", "none");
        text.setAttribute("font-size", "10");
        text.textContent = number;
        svg.appendChild(text);

        // --- create tooltip ---
        const tooltip = document.createElement("div");
        tooltip.style.position = "absolute";
        tooltip.style.background = "var(--tooltip-bg-color)";
        tooltip.style.boxShadow = "var(--tooltip-shadow)";
        tooltip.style.padding = "8px";
        tooltip.style.borderRadius = "4px";
        tooltip.style.pointerEvents = "none";
        tooltip.style.whiteSpace = "nowrap";
        tooltip.style.zIndex = "9999";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 200ms ease";

        // --- text container inside tooltip ---
        const tooltipTextDiv = document.createElement("div");
        tooltipTextDiv.style.color = "var(--default-color)"; // or whatever text color
        tooltip.appendChild(tooltipTextDiv);

        // --- arrow ---
        const arrow = document.createElement("div");
        arrow.classList.add("arrow___yUDKb");
        arrow.style.left = "104.5px";
        arrow.style.position = "absolute";
        arrow.style.left = "50%";
        arrow.style.transform = "translateX(-50%)";

        let arrowArrow = document.createElement("div");
        arrowArrow.classList.add("arrowIcon___KHyjw");

        arrow.appendChild(arrowArrow);
        tooltip.appendChild(arrow);

        document.body.appendChild(tooltip);

        // --- events ---
        svg.addEventListener('click', function() {
            window.location.href = "https://www.torn.com/bounties.php#/p=add";
        });

        svg.addEventListener("mouseenter", () => {
            tooltipTextDiv.textContent = `${number}/10 bounties remaining`;
            tooltip.style.opacity = "1";

            const rect = svg.getBoundingClientRect();
            const tooltipWidth = tooltip.offsetWidth;
            const tooltipHeight = tooltip.offsetHeight;
            const screenPadding = 8;

            let left = rect.left + rect.width / 2 - tooltipWidth / 2;
            if (left + tooltipWidth > window.innerWidth - screenPadding) {
                left = window.innerWidth - tooltipWidth - screenPadding;
            }
            if (left < screenPadding) left = screenPadding;

            let top;
            if (mobile) {
                top = rect.bottom + 14;
                arrow.classList.add("bottom___mz2Ax");
                arrow.style.borderTop = "none";
                arrow.style.borderBottom = "5px solid var(--tooltip-bg-color)";
            } else {
                top = rect.top - tooltipHeight - 14;
                arrow.classList.add("top___klE_Y");
                arrow.style.borderBottom = "none";
                arrow.style.borderTop = "5px solid var(--tooltip-bg-color)";
            }

            tooltip.style.left = left + "px";
            tooltip.style.top = top + "px";

            // position arrow centered to icon
            let arrowLeft = rect.left + rect.width / 2 - left;
            if (arrowLeft < 5) arrowLeft = 5;
            if (arrowLeft > tooltipWidth - 5) arrowLeft = tooltipWidth - 5;
            arrow.style.left = arrowLeft + "px";
            arrow.style.transform = "translateX(-50%)";
        });

        svg.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
        });


        return svg;
    }

    fetchLogData();

})();