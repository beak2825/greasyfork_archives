// ==UserScript==
// @name         Torn - Easier Weapons & Armor Selling
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Allows the user to use their numpad keys to navigate and sell items to NPCs so you don't need to use your mouse. Numpad7 to move, Numpad8 to sell, Numpad9 to confirm. Refresh the page after changing item category
// @author       Stinky
// @match        https://www.torn.com/item.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538474/Torn%20-%20Easier%20Weapons%20%20Armor%20Selling.user.js
// @updateURL https://update.greasyfork.org/scripts/538474/Torn%20-%20Easier%20Weapons%20%20Armor%20Selling.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let deleteButtons = [];
    let currentIndex = 0;
    let observer = null;

    function highlightItem(index) {
        deleteButtons.forEach((btn, i) => {
            const li = btn.closest("li");
            if (li) li.style.backgroundColor = i === index ? "red" : "";
        });
    }

    function updateButtons() {
        const previousButton = deleteButtons[currentIndex];
        deleteButtons = Array.from(document.querySelectorAll("button.option-sell"));
        const restoredIndex = deleteButtons.indexOf(previousButton);
        currentIndex = restoredIndex !== -1 ? restoredIndex : 0;
        highlightItem(currentIndex);
    }


    function getCurrentItemElement() {
        return deleteButtons[currentIndex]?.closest("li") || null;
    }

    function isSpecialItem(li) {
        return li?.querySelector(".glow-yellow, .glow-orange, .glow-red") !== null;
    }

    function selectNextItem() {
        const total = deleteButtons.length;
        let loops = 0;

        do {
            currentIndex = (currentIndex + 1) % total;
            loops++;
        } while (loops < total && isSpecialItem(getCurrentItemElement()));

        highlightItem(currentIndex);
    }

    function handleKey(e) {
        const currentItem = getCurrentItemElement();

        if (e.code === "Numpad9") {
            const confirmBtn = document.querySelector("a.next-act");
            if (confirmBtn) confirmBtn.click();
        }

        if (e.code === "Numpad8") {
            const btn = deleteButtons[currentIndex];
            if (btn && !isSpecialItem(currentItem)) btn.click();
        }

        if (e.code === "Numpad7") selectNextItem();
    }

    function setupObserver() {
        const target = document.body;
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            updateButtons();
        });

        observer.observe(target, { childList: true, subtree: true });
    }

    function init() {
        const allowedSections = [
            '#primary-items',
            '#secondary-items',
            '#melee-items',
            '#armour-items'
        ];

        const anyOpen = allowedSections.some(selector => {
            const el = document.querySelector(`ul${selector}`);
            return el?.getAttribute("aria-expanded") === "true";
        });

        if (!anyOpen) return;

        updateButtons();
        setupObserver();
        document.addEventListener("keydown", handleKey);
    }


    const checkReady = setInterval(() => {
        if (document.querySelector("button.option-delete")) {
            clearInterval(checkReady);
            init();
        }
    }, 1000);
})();
