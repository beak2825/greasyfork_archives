// ==UserScript==
// @name         GC Safety Deposit Box Multiple Remove Shortcut
// @namespace    http://devipotato.net/
// @version      1
// @description  Adds a shortcut to remove a specified number of every item currently being searched in the SDB on grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/safetydeposit/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488143/GC%20Safety%20Deposit%20Box%20Multiple%20Remove%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/488143/GC%20Safety%20Deposit%20Box%20Multiple%20Remove%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let items = [];

    const head = document.getElementsByTagName('head')[0];
    let style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    head.appendChild(style);

    function addStyle( css ) {
        style.sheet.insertRule( css, style.sheet.cssRules.length );
    }

    addStyle(`.sdbs_rmcount {
        width:2em;
        margin-left:0.2em;
    }`);
    addStyle(`.sdbs_button {
        width:4em;
        margin-left:0.2em;
    }`);

    function removeShortcut() {
        let container = document.createElement("div");
        container.classList.add("action","justify-right","sdbs_rmshortcut");
        let label = document.createElement("label");
        label.classList.add("bold","sdbs_text");
        label.innerText="Rm From All";
        container.append(label);
        let rmCount = document.createElement("input");
        rmCount.classList.add("form-control","rm","sdbs_rmcount");
        rmCount.type="text";
        rmCount.inputmode = "numeric";
        rmCount.pattern = "[0-9]*";
        rmCount.value="1";
        container.append(rmCount);
        let button = document.createElement("input");
        button.classList.add("form-control", "sdbs_button");
        button.type="button";
        button.value="OK";
        container.append(button);
        rmCount.addEventListener("input", (event) => {
            if (isNaN(rmCount.value) || !Number.isInteger(rmCount.value)) {
                rmCount.value = rmCount.value.replace(/\D/g, '');
            }
        }, false);
        rmCount.addEventListener("keydown", (event) => {
            if(event.key === "Enter") {
                event.preventDefault();
                button.click();
            }
        }, false);
        button.addEventListener("click", () => {
            for(let item of items) {
                item.rmElement.value = item.qty<rmCount.value?item.qty:rmCount.value;
            }
        });
        return container;
    }

    function parseItems() {
        let items = []
        let nameElements = document.querySelectorAll(".sdb .data.flex-column.small-gap strong");
        let qtyElements = document.querySelectorAll(".sdb .data.justify-center strong");
        let rmElements = document.querySelectorAll(".sdb .form-control.rm");
        for(let i=0;i<nameElements.length; i++) {
            items.push({
                name: nameElements[i].innerText,
                qty: parseInt(qtyElements[i].innerText),
                rmElement: rmElements[i]
            });
        }
        return items;
    }
    items = parseItems();

    let rmAllElement = document.querySelector(".sdb .action");
    rmAllElement.after(removeShortcut());

})();