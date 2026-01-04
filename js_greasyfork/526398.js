// ==UserScript==
// @name         Bootlegging 1N spam
// @namespace    http://tampermonkey.net/
// @version      1.2.2.3
// @description  Monitor Online Store value and nerve points in Torn bootlegging page
// @author       Mr_Bob [479620]
// @match        https://www.torn.com/loader.php?sid=crime*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526398/Bootlegging%201N%20spam.user.js
// @updateURL https://update.greasyfork.org/scripts/526398/Bootlegging%201N%20spam.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastValue = null; // Store last known "Online store" value
    const beepSoundUrl = "https://www.soundjay.com/buttons/beep-07a.mp3";

    function playBeep(times) {
        times = Math.min(times, 10); // Limit to 10 beeps

        console.log(`[Monitor] Playing beep sound ${times} times.`);

        for (let i = 0; i < times; i++) {
            setTimeout(() => {
                try {
                    let beep = new Audio(beepSoundUrl);
                    beep.play().catch(() => {});
                } catch (e) {
                    console.warn("[Monitor] Beep sound failed to play:", e);
                }
            }, i * 250);
        }
    }

    function checkOnlineStore() {
        let storeElement = document.querySelector("div.crimeOptionSection___hslpu.moneyToCollectSection___RFncq span");
        if (!storeElement) {
            console.warn("[Monitor] Online store element not found.");
            return;
        }

        let valueMatch = storeElement.innerText.match(/\$([\d,]+)/);
        if (!valueMatch) {
            console.warn("[Monitor] Online store value not found.");
            return;
        }

        let currentValue = parseInt(valueMatch[1].replace(/,/g, ""), 10);
        // console.log(`[Monitor] Current value: $${currentValue}`);
    //   console.log(`[Monitor] Last value: $${lastValue}`);

        if (lastValue === null || currentValue > lastValue) {
            let changeAmount = Math.abs(currentValue - (lastValue || 0));
            console.log(`[Monitor] Store value increased by $${changeAmount}. Triggering beep.`);

            let beepCount = Math.ceil(currentValue / 20);
                if (currentValue % 20 === 0) {
        playBeep(beepCount);
    }
        }
      lastValue = currentValue;
    }

function checkNervePoints() {
    let nerveBar = document.querySelector("a.bar___Bv5Ho.nerve___AyYv_");
    if (!nerveBar) {
        console.warn("[Monitor] Nerve bar element not found.");
        return;
    }

    let pointsElement = nerveBar.querySelector("p.bar-value___NTdce");
    if (!pointsElement) {
        console.warn("[Monitor] Nerve points value not found.");
        return;
    }

    let match = pointsElement.innerText.trim().match(/^(\d+)\s*\/\s*(\d+)$/);
    if (!match) {
        console.warn("[Monitor] Nerve points format incorrect.");
        return;
    }

    let points = parseInt(match[1], 10);
    console.log(`[Monitor] Current nerve points: ${points}`);

    let actionButton = document.querySelector("input.input___Pgrid");
    if (actionButton) {
        actionButton.style.backgroundColor = points === 0 ? "red" : "";
    }

    // Adding or updating pointsElement in the specific Online Store section
    let crimeOptionSections = document.querySelectorAll("div.crimeOptionSection___hslpu.flexGrow___S5IUQ");
    crimeOptionSections.forEach(section => {
        if (section.textContent.includes("Online Store")) {
            let container = section.querySelector(".pointsContainer");
            if (!container) {
                container = document.createElement("div");
                container.className = "pointsContainer";
                section.innerHTML = ""; // Clear existing content
                section.appendChild(container);

                let onlineStoreText = document.createElement("span");
                onlineStoreText.innerText = "Online Store";
                container.appendChild(onlineStoreText);

                let newPointsElement = document.createElement("span");
                newPointsElement.className = "pointsElement";
                newPointsElement.innerText = `Nerve: ${points}`;
                container.appendChild(newPointsElement);
            } else {
                let existingPointsElement = container.querySelector(".pointsElement");
                existingPointsElement.innerText = `Nerve: ${points}`;
            }
        }
    });
}
    function hideSellButton() {
        let sellButton = document.querySelector('button[aria-label="Sell, 5 nerve"]');
        if (sellButton) {
            sellButton.style.display = 'none';
            console.log("[Monitor] Sell button hidden.");
        } else {
            console.warn("[Monitor] Sell button not found.");
        }
    }

    function monitorChanges() {
        checkOnlineStore();
        checkNervePoints();
        hideSellButton();
        setTimeout(monitorChanges, 250);
    }

    // CSS to align the elements
const style = document.createElement('style');
style.innerHTML = `
    .pointsContainer {
        display: flex;
        justify-content: space-between;
        width: 100%;
    }
    .pointsElement {
        margin-left: auto;
    }
`;
document.head.appendChild(style);

    console.log("[Monitor] Torn Bootlegging Monitor script initialized.");
    monitorChanges();
})();
