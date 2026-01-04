// ==UserScript==
// @name         Ghost Trade Buttons v2
// @namespace    Titanic_
// @version      2.2
// @description  Adds buttons to remove at million $ intervals to the trade page to make it easier to manage money in ghost trades.
// @license      MIT
// @author       Titanic_ [2968477]
// @match        https://www.torn.com/trade.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532660/Ghost%20Trade%20Buttons%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/532660/Ghost%20Trade%20Buttons%20v2.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // Feel free to add to or change these
    const BUTTONS = [
        { label: "-100k", amount: 100000 },
        { label: "-500k", amount: 500000 },
        { label: "-1m", amount: 1000000 },
        { label: "-5m", amount: 5000000 },
        { label: "-10m", amount: 10000000 }
    ];
 
    function addElements() {
        const div = document.querySelector("div.input-money-group");
        if (!div) return;
 
        const spacerRef = document.querySelector("span.btn-wrap.silver");
        if (!spacerRef) return;
 
        const spacer = spacerRef.previousElementSibling?.cloneNode();
        const parent = document.createElement("div");
 
        if (spacer) parent.prepend(spacer);
        BUTTONS.forEach(btn => addButton(parent, btn.label, btn.amount));
        addCustomButton(parent);
        addPasteButton(parent);
 
        div.parentNode.insertBefore(parent, div.nextSibling);
    }
 
    function addButton(parent, label, amount) {
        let btn = createButton(label, () => adjustMoney(-amount));
        parent.appendChild(btn);
    }
 
    function addPasteButton(parent) {
        let btn = createButton("Paste", async () => {
            try {
                let text = await navigator.clipboard.readText();
                let value = parseInt(text.replace(/[, $]/g, ""));
                if (isNaN(value)) alert("Clipboard does not contain a valid number.");
                else adjustMoney(value, true);
            } catch (err) {
                alert("Clipboard access denied. Please paste manually.");
            }
        });
        parent.appendChild(btn);
    }
 
    function addCustomButton(parent) {
        let btn = createButton("Custom", async () => {
            let input = prompt("Enter amount to subtract:");
            let value = parseInt(input.replace(/[, $]/g, ''));
            if (!isNaN(value)) adjustMoney(-value);
            else alert("Invalid number entered.");
        });
        parent.appendChild(btn);
    }
 
    function createButton(label, onClick) {
        let btn = document.createElement("input");
        btn.value = label;
        btn.type = "button";
        btn.classList.add("torn-btn");
        btn.addEventListener("click", onClick);
        return btn;
    }
 
    function adjustMoney(amount, set = false) {
        let [inputVisible, inputHidden] = document.querySelectorAll(".user-id.input-money");
        if (!inputVisible || !inputHidden) return;
 
        let newValue = set ? amount : (parseInt(inputHidden.value) || 0) + amount;
        if (newValue < 0) newValue = 0;
 
        inputVisible.value = newValue;
        inputVisible.dispatchEvent(new Event("input", { bubbles: true }));
    }
 
    function observe() {
        if (!window.location.href.includes("trade.php#step=addmoney")) return;
        clearInterval(window.GhostTradeInterval);
        window.GhostTradeInterval = setInterval(() => {
            if (document.querySelector('.user-id.input-money') &&
                document.querySelectorAll("ul.inputs > li > div").length < 3) {
                clearInterval(window.GhostTradeInterval);
                addElements();
            }
        }, 100);
    }
 
    window.addEventListener("hashchange", observe);
    observe();
})();