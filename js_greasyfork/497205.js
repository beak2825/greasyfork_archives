// ==UserScript==
// @name         Stake Lil' Live Stats
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a toggle button to minimize and restore live stats on Stake.us and Stake.com [have not tested on stake.com warning]
// @author       Telegram: @sighb3r LTC: ltc1qvpmsjyn6y7vk080uhje8v63mvty4adp7ewk20c
// @license      MIT
// @match        https://stake.us/*
// @match        https://stake.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497205/Stake%20Lil%27%20Live%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/497205/Stake%20Lil%27%20Live%20Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isInitialized = false;

    // Function to initialize the script
    function init() {
        if (isInitialized) return; // Prevent re-initialization
        isInitialized = true;

        const header = document.querySelector('.draggable .header .title');
        const content = document.querySelector('.draggable .content');
        const closeButton = document.querySelector('.draggable .header button');
        const draggable = document.querySelector('.draggable');

        if (!header || !content || !closeButton || !draggable) {
            console.error('Required elements not found');
            return;
        }

        // Create a span element to hold the net gain display
        const gainSpan = document.createElement('span');
        gainSpan.className = "weight-semibold line-height-default align-left size-default text-size-default with-icon-space svelte-17v69ua";
        header.appendChild(gainSpan);

        // Create the toggle button
        const toggleButton = document.createElement('button');
        toggleButton.textContent = '^';
        toggleButton.style.marginLeft = '10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.background = 'transparent';
        toggleButton.style.border = 'none';
        toggleButton.style.color = 'inherit';
        toggleButton.style.fontSize = 'inherit';
        toggleButton.onclick = function() {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                draggable.style.height = 'auto';
                toggleButton.textContent = '^';
            } else {
                content.style.display = 'none';
                draggable.style.height = `${header.offsetHeight}px`;
                toggleButton.textContent = '[]';
            }
        };

        // Add the button next to the close button
        closeButton.parentElement.insertBefore(toggleButton, closeButton);

        // Create an SVG element for the line graph
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "50");
        svg.setAttribute("height", "10");
        svg.style.marginLeft = "5px";
        header.appendChild(svg);

        // Function to update the gain display and line graph
        function updateGainDisplay() {
            const netGainElement = document.querySelector('[data-testid="bets-stats-profit"]');
            if (!netGainElement) return;

            const netGainValue = parseFloat(netGainElement.innerText);
            const isUp = netGainValue >= 0;
            const gainText = `${isUp ? 'U' : 'D'} ${netGainValue.toFixed(2)}`;
            gainSpan.className = `weight-semibold line-height-default align-left size-default text-size-default variant-${isUp ? 'success' : 'negative'} with-icon-space svelte-17v69ua`;
            gainSpan.innerText = gainText;

            // Clear previous SVG content
            while (svg.firstChild) {
                svg.removeChild(svg.firstChild);
            }

            // Create a line for the graph
            const line = document.createElementNS(svgNS, "line");
            const x1 = 0;
            const y1 = isUp ? 10 : 0; // Start from bottom if up, top if down
            const x2 = 50;
            const y2 = isUp ? 10 - Math.min(Math.abs(netGainValue) * 2, 10) : Math.min(Math.abs(netGainValue) * 2, 10); // Steeper line for higher gain/loss

            line.setAttribute("x1", x1);
            line.setAttribute("y1", y1);
            line.setAttribute("x2", x2);
            line.setAttribute("y2", y2);
            line.setAttribute("stroke", isUp ? "green" : "red");
            line.setAttribute("stroke-width", "2");

            svg.appendChild(line);
        }

        // Observe changes to the net gain element
        const netGainElement = document.querySelector('[data-testid="bets-stats-profit"]');
        if (netGainElement) {
            const observer = new MutationObserver(updateGainDisplay);
            observer.observe(netGainElement, { childList: true, characterData: true, subtree: true });
            // Initial update
            updateGainDisplay();
        }
    }

    // Function to check if the live stats window is opened
    function checkForLiveStatsWindow(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.addedNodes.length) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1 && node.matches('.draggable')) {
                        init();
                        break;
                    }
                }
            }
        }
    }

    // Observe the DOM for changes to detect when the live stats window is opened
    const observer = new MutationObserver(checkForLiveStatsWindow);
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check
    checkForLiveStatsWindow([{ addedNodes: document.querySelectorAll('.draggable') }]);
})();