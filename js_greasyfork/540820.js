// ==UserScript==
// @name         DF UI Enhancer + Expired Inventory Closer + Auto Scroll Above Center
// @namespace    http://tampermonkey.net/
// @version      2025-06-29
// @description  Adds UI shortcuts, auto-closes expired inventory pages, and auto-scrolls slightly above center in Dead Frontier.
// @author       Disk217 + Gemini
// @match        https://fairview.deadfrontier.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deadfrontier.com
// @license      MIT
// @grant        window.close
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/540820/DF%20UI%20Enhancer%20%2B%20Expired%20Inventory%20Closer%20%2B%20Auto%20Scroll%20Above%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/540820/DF%20UI%20Enhancer%20%2B%20Expired%20Inventory%20Closer%20%2B%20Auto%20Scroll%20Above%20Center.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==============================
    // Expired Inventory Tab Closer
    // ==============================

    function checkAndCloseTab() {
        const searchText = '<font color="red">This inventory page has expired.</font>';
        if (document.body.innerHTML.includes(searchText)) {
            console.log("Expired inventory message detected. Closing tab...");
            window.close();
        }
    }

    window.addEventListener('DOMContentLoaded', checkAndCloseTab);
    setTimeout(checkAndCloseTab, 1000);

    // ==============================
    // UI Enhancer Buttons
    // ==============================

    function waitForElement(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element && callback(element)) {
                clearInterval(interval);
            }
        }, 100);
    }

    function createLink(text, href) {
        const link = document.createElement("a");
        link.textContent = text;
        link.href = href;
        link.style.display = "block";
        link.style.margin = "8px 0";
        link.style.color = "#fff";
        return link;
    }

    waitForElement('td.design2010[width="44"]', (elem) => {
        try {
            elem.appendChild(createLink("The Yard", "index.php?page=24"));
        } catch (e) {
            console.error("Yard button error:", e);
            return false;
        }
        return true;
    });

    waitForElement('td.design2010[width="53"]', (elem) => {
        try {
            elem.appendChild(createLink("Vendor", "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=84"));
        } catch (e) {
            console.error("Vendor button error:", e);
            return false;
        }
        return true;
    });

    waitForElement('td.design2010[width="49"]', (elem) => {
        try {
            elem.appendChild(createLink("Storage", "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50"));
        } catch (e) {
            console.error("Storage button error:", e);
            return false;
        }
        return true;
    });

    waitForElement('td.design2010[width="56"]', (elem) => {
        try {
            const craftingLink = createLink("Crafting", "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=59");
            craftingLink.style.marginTop = "10px";
            elem.appendChild(craftingLink);
        } catch (e) {
            console.error("Crafting link error:", e);
            return false;
        }
        return true;
    });

    waitForElement('td.design2010[width="72"]', (elem) => {
        try {
            const looterLink = createLink("Looter", "https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=22&list=looters_day#list");
            looterLink.style.marginTop = "10px";
            elem.appendChild(looterLink);
        } catch (e) {
            console.error("Looter link error:", e);
            return false;
        }
        return true;
    });

    // ==============================
    // Auto Scroll Slightly Above Center (30% from top)
    // ==============================

    function scrollSlightlyAboveCenter() {
        const scrollY = (document.body.scrollHeight - window.innerHeight) * 0.3;
        window.scrollTo({ top: scrollY, behavior: "instant" });
    }

    const observer = new MutationObserver(() => {
        scrollSlightlyAboveCenter();
    });

    window.addEventListener("load", () => {
        scrollSlightlyAboveCenter();
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    });

    window.addEventListener("resize", scrollSlightlyAboveCenter);

})();
