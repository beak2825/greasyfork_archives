// ==UserScript==
// @name         LNB tlačítka Basketbal/Statistiky
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Přidá proklikávací tlačítka na skore a statistiky
// @author       Lukáš Malec
// @license      MIT
// @match        https://www.lnb.fr/elite/game-center/*
// @match        https://www.lnb.fr/espoirs-elite/game-center/*
// @match        https://www.lnb.fr/pro-b/game-center/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lnb.fr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521963/LNB%20tla%C4%8D%C3%ADtka%20BasketbalStatistiky.user.js
// @updateURL https://update.greasyfork.org/scripts/521963/LNB%20tla%C4%8D%C3%ADtka%20BasketbalStatistiky.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    console.log("Tampermonkey script initialized!");
 
    // Funkce pro přidání tlačítek
    function addButtons() {
        // Najít všechny odkazy s odpovídající strukturou (pro každý zápas)
        const elements = document.querySelectorAll("span.hour a[href]");
 
        if (elements.length === 0) {
            console.warn("No matching elements found! Ensure the page contains 'span.hour a[href]' elements.");
            return;
        }
 
        elements.forEach((element, index) => {
            const url = element.getAttribute("href");
            if (url && url.includes("/game-center-resume?id=")) {
                console.log(`Found URL at index ${index}: ${url}`);
 
                // Zkontrolovat, zda už byly odkazy přidány, aby se zabránilo duplicitám
                const parentDiv = element.closest("div.center");
                if (parentDiv.querySelector("a.custom-link")) {
                    console.log(`Links already exist for index ${index}, skipping.`);
                    return;
                }
 
                // Vytvoření odkazu pro Basketbal
                const basketballLink = document.createElement("a");
                basketballLink.href = url + "/"; // Přidání "/" na konec URL
                basketballLink.textContent = "Basketbal";
                basketballLink.style.display = "inline-block";
                basketballLink.style.textAlign = "center";
                basketballLink.style.padding = "5px 10px";
                basketballLink.style.marginRight = "10px";
                basketballLink.style.fontSize = "14px";
                basketballLink.style.border = "3px solid #ccc";
                basketballLink.style.borderRadius = "5px";
                basketballLink.style.borderColor = "#041832";
                basketballLink.style.backgroundColor = "#f0f0f0";
                basketballLink.style.textDecoration = "none";
                basketballLink.style.cursor = "pointer";
                basketballLink.target = "_blank";
                basketballLink.classList.add("custom-link");
 
                // Vytvoření odkazu pro Statistiky
                const statsLink = document.createElement("a");
                statsLink.href = url;
                statsLink.textContent = "Statistiky";
                statsLink.style.display = "inline-block";
                statsLink.style.textAlign = "center";
                statsLink.style.padding = "5px 10px";
                statsLink.style.fontSize = "14px";
                statsLink.style.border = "3px solid #ccc";
                statsLink.style.borderRadius = "5px";
                statsLink.style.borderColor = "#041832";
                statsLink.style.backgroundColor = "#f0f0f0";
                statsLink.style.textDecoration = "none";
                statsLink.style.cursor = "pointer";
                statsLink.target = "_blank";
                statsLink.classList.add("custom-link");
 
                // Vytvoření kontejneru pro odkazy
                const linkContainer = document.createElement("span");
                linkContainer.style.display = "flex";
                linkContainer.style.justifyContent = "start";
                linkContainer.style.gap = "10px";
                linkContainer.appendChild(basketballLink);
                linkContainer.appendChild(statsLink);
 
                // Najít specifický div pro vložení
                const centerDiv = element.closest("div.center");
                const stateDiv = centerDiv.querySelector("div.state");
                const linkDiv = centerDiv.querySelector("div.link");
 
                if (stateDiv && linkDiv) {
                    console.log(`Inserting links for index ${index}`);
                    // Vložit kontejner s odkazy mezi divy
                    linkDiv.parentNode.insertBefore(linkContainer, linkDiv);
                } else {
                    console.warn("Could not find 'state' or 'link' divs in the structure");
                }
            } else {
                console.warn(`Invalid or missing URL at index ${index}`);
            }
        });
    }
 
    // Sledujeme změny na stránce, aby se tlačítka generovala po změně obsahu
    function waitForContent() {
        const observer = new MutationObserver(() => {
            // Kontrola na nové zápasy při každé změně
            addButtons();
        });
 
        observer.observe(document.body, { childList: true, subtree: true });
 
        // Zajistíme, že se tlačítka vygenerují i po načtení stránky
        setTimeout(() => {
            addButtons();
        }, 2000);
    }
 
    // Počkáme na načtení stránky a spustíme monitorování
    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", waitForContent);
    } else {
        waitForContent();
    }
})();