// ==UserScript==
// @name         Amazon Wee Checkout Confirm
// @namespace    com.anwinity.weewoo
// @version      2025-04-25
// @description  This is a private script for my wife. This should not be public. It will prompt confirm on amazon checkout.
// @author       Woo
// @license MIT
// @match        https://www.amazon.com/checkout/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534017/Amazon%20Wee%20Checkout%20Confirm.user.js
// @updateURL https://update.greasyfork.org/scripts/534017/Amazon%20Wee%20Checkout%20Confirm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_ENTRIES = "weewoo.amazon.checkout.entries";
    const STORAGE_LAST_CONFIRM = "weewoo.amazon.checkout.lastConfirm";

    function findOrderTotal() {
        const el1 = document.querySelector('.order-summary-line-definition');
        if(el1) {
            return el1.textContent.trim();
        }
        const el2 = document.querySelector('[data-testid="order-summary-total"]');
        if(el2) {
            return el2.textContent.trim();
        }
        return "unknown";
    }

    function addEntry(answer) {
        const total = findOrderTotal();
        const time = new Date().toISOString();
        const entry = {time, answer, total};
        let entries = [];
        try {
            entries = JSON.parse(localStorage.getItem(STORAGE_ENTRIES));
        }
        catch(err) {
            entries = [];
        }
        if(!Array.isArray(entries)) {
            entries = [];
        }
        entries.push(entry);
        localStorage.setItem(STORAGE_ENTRIES, JSON.stringify(entries));
        sessionStorage.setItem(STORAGE_LAST_CONFIRM, time);
    }

    function showPrompt() {
        const backdrop = document.createElement("div");
        backdrop.style.position = "fixed";
        backdrop.style.top = "0";
        backdrop.style.left = "0";
        backdrop.style.width = "100%";
        backdrop.style.height = "100%";
        backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
        backdrop.style.zIndex = "9999";
        backdrop.style.display = "flex";
        backdrop.style.justifyContent = "center";
        backdrop.style.alignItems = "center";

        // Create popup box
        const popup = document.createElement("div");
        popup.style.backgroundColor = "#fff";
        popup.style.padding = "30px";
        popup.style.borderRadius = "10px";
        popup.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
        popup.style.textAlign = "center";
        popup.style.minWidth = "300px";
        popup.style.maxWidth = "600px";
        popup.style.display = "flex";
        popup.style.flexDirection = "column";

        // Title
        const title = document.createElement("h2");
        title.innerText = "Talk To Woo!";
        popup.appendChild(title);

        // Button 1
        const button1 = document.createElement("button");
        button1.innerText = "I spoke with Woo and we're in agreement. 😊";
        button1.style.margin = "10px";
        button1.style.padding = "10px 20px";
        button1.style.width = "100%";
        button1.onclick = () => {
            addEntry("spoke with woo");
            document.body.removeChild(backdrop);
        };
        popup.appendChild(button1);

        // Button 2
        const button2 = document.createElement("button");
        button2.innerText = "Woo is a little bitch and I don't care. 😢";
        button2.style.margin = "10px";
        button2.style.padding = "10px 20px";
        button2.style.width = "100%";
        button2.onclick = () => {
            addEntry("i don't care");
            document.body.removeChild(backdrop);
        };
        popup.appendChild(button2);

        backdrop.appendChild(popup);
        document.body.appendChild(backdrop);
    }

    function printData() {
        const entries = localStorage.getItem(STORAGE_ENTRIES);
        if(entries) {
            try {
                console.log("entries", JSON.parse(entries));
            }
            catch(err) {
                console.log("entries", entries);
            }
        }
        else {
            console.log("entries", entries);
        }

        const lastConfirm = sessionStorage.getItem(STORAGE_LAST_CONFIRM);
        console.log("lastConfirm", lastConfirm);
    }

    window.addEventListener('load', () => {
        printData();
        let lastConfirm = sessionStorage.getItem(STORAGE_LAST_CONFIRM);
        if(lastConfirm) {
            lastConfirm = new Date(lastConfirm);
        }
        if(!lastConfirm || isNaN(lastConfirm.getTime())) {
            lastConfirm = null;
        }
        if(!lastConfirm || (new Date().getTime() - lastConfirm.getTime()) > 15 * 60 * 1000) {
            showPrompt();
        }
    });
})();