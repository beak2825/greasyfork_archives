// ==UserScript==
// @name         Latency notes
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Adds always-visible tooltip above specific task queue titles
// @author       Cassius + ChatGPT
// @match        https://orb-usa.xaminim.com/en/audit/collection
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543939/Latency%20notes.user.js
// @updateURL https://update.greasyfork.org/scripts/543939/Latency%20notes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script loaded!");

    const textMapping = [
        { keyword: "talkie npc first review new user", time: "15m" },
        { keyword: "talkie npc first review medium risk", time: "15m" },
        { keyword: "talkie moment high review", time: "30m" },
        { keyword: "talkie moment report review", time: "30m" },
        { keyword: "talkie npc bg video high-review", time: "30m" },
        { keyword: "talkie activity high PV view - 500", time: "30m" },
        { keyword: "talkie activity report", time: "30m" },
        { keyword: "talkie video card report review", time: "30m" },
        { keyword: "talkie first review - Non EN", time: "30m" },
        { keyword: "talkie npc bg video report-review", time: "30m" },
        { keyword: "talkie first review - user upload image", time: "30m" }
    ];

    function addTooltips() {
        console.log("Running addTooltips function...");

        document.querySelectorAll('a[class^="TaskQueueCard_queueTitle"]').forEach(element => {
            const fullText = element.textContent.trim().toLowerCase();
            console.log("Found text:", fullText);

            for (let item of textMapping) {
                if (fullText.includes(item.keyword.toLowerCase())) {
                    console.log("Match found! Adding tooltip for:", item.keyword);

                    if (element.parentNode.querySelector('.custom-tooltip')) {
                        console.log("Tooltip already exists, skipping...");
                        return;
                    }

                    // Create tooltip div
                    const tooltip = document.createElement('div');
                    tooltip.textContent = item.time;
                    tooltip.classList.add('custom-tooltip');

                    // Style the tooltip
                    tooltip.style.position = 'absolute';
                    tooltip.style.background = '#ffeb3b';
                    tooltip.style.color = '#000';
                    tooltip.style.padding = '4px 6px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.fontWeight = 'bold';
                    tooltip.style.borderRadius = '4px';
                    tooltip.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.2)';
                    tooltip.style.whiteSpace = 'nowrap';
                    tooltip.style.top = '-3px'; // Keeps it above the text
                    tooltip.style.left = '82%'; // Moves it to the right of the text
                    tooltip.style.marginLeft = '10px'; // Adds spacing from the text
                    tooltip.style.zIndex = '9999'; // Ensure it's on top

                    // Ensure the parent container allows tooltips to show
                    const parent = element.parentNode;
                    parent.style.position = 'relative';
                    parent.style.overflow = 'visible'; // Prevent clipping

                    // Insert tooltip
                    parent.appendChild(tooltip);

                    break;
                }
            }
        });
    }

    setTimeout(addTooltips, 1000);

    const observer = new MutationObserver(addTooltips);
    observer.observe(document.body, { childList: true, subtree: true });

})();