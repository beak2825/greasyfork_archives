// ==UserScript==
// @name         Hírstart admin - RSS partner kattintható feed
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Várakozik a "rssPartnerFeedFormHolder" megjelenésére, majd debounce segítségével átalakítja az URL-t www.hirstart.hu-ról box.hirstart.hu-ra.
// @author       attila.virag@centralmediacsoport.hu
// @match        https://admin.hirstart.hu/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hirstart.hu
// @license      hirstart.hu
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528968/H%C3%ADrstart%20admin%20-%20RSS%20partner%20kattinthat%C3%B3%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/528968/H%C3%ADrstart%20admin%20-%20RSS%20partner%20kattinthat%C3%B3%20feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debounce segédfüggvény
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // XPath a kérdéses span-hoz
    const xpath = "/html/body/div[3]/div/div/div[3]/div[2]/div[2]/div[2]/div[2]/div/div[2]/div/div[1]/div/div[2]/div/div[1]/div/div/div/table/tbody/tr/td[2]/span";

    function transformUrl() {
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const urlSpan = result.singleNodeValue;
        if (!urlSpan) {
            console.log("URL span nem található.");
            return;
        }
        // Ha már átalakítottuk, nem dolgozunk tovább
        const existingLink = urlSpan.querySelector('a');
        if (existingLink && existingLink.href.indexOf("box.hirstart.hu") !== -1) {
            return;
        }
        const originalUrl = urlSpan.textContent.trim();
        if (!originalUrl) {
            console.log("A span üres.");
            return;
        }
        const newUrl = originalUrl.replace("www.hirstart.hu", "box.hirstart.hu");

        const link = document.createElement('a');
        link.href = newUrl;
        link.target = "_blank";
        link.textContent = newUrl;

        urlSpan.innerHTML = "";
        urlSpan.appendChild(link);

        console.log("URL átalakítva:", newUrl);
    }

    // Várunk a container-re, majd beindítjuk a megfigyelőt
    function waitForContainer() {
        const container = document.getElementById('rssPartnerFeedFormHolder');
        if (container) {
            startObserver(container);
            transformUrl();
        } else {
            setTimeout(waitForContainer, 500);
        }
    }

    function startObserver(container) {
        const debouncedTransform = debounce(transformUrl, 500);
        const observer = new MutationObserver(() => {
            debouncedTransform();
        });
        observer.observe(container, { childList: true, subtree: true });
    }

    waitForContainer();
})();
