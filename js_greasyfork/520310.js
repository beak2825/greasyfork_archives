// ==UserScript==
// @name         365scores.com DynamicRedirect
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Přesměruje detail zápasu na zdroják ve chvíli, kdy obsahuje data.
// @author       Martin
// @match        https://www.365scores.com/football/match/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/520310/365scorescom%20DynamicRedirect.user.js
// @updateURL https://update.greasyfork.org/scripts/520310/365scorescom%20DynamicRedirect.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CHECK_INTERVAL = 30000; // 30 sekund
    let isRedirected = false; // Zabránění opakovanému přesměrování

    // Funkce pro získání gameId z aktuální URL
    function getGameId() {
        const urlParams = new URL(window.location.href);
        const gameId = urlParams.hash.split("=")[1]; // Získání všeho za '#id='
        return gameId || null;
    }

    // Funkce pro konstrukci TARGET_URL s unikátním timestampem
    function constructTargetUrl(gameId) {
        const timestamp = new Date().getTime(); // Unikátní časový záznam
        return `https://webws.365scores.com/web/athletes/games/lineups?gameId=${gameId}&_t=${timestamp}`;
    }

    // Funkce pro základní TARGET_URL bez timestampu
    function constructBaseTargetUrl(gameId) {
        return `https://webws.365scores.com/web/athletes/games/lineups?gameId=${gameId}&`;
    }

    // Funkce pro kontrolu obsahu na URL
    async function checkForData(targetUrl, baseUrl) {
        try {
            const response = await fetch(targetUrl); // Fetch bez úpravy hlaviček

            if (!response.ok) {
                console.log("[Check Failed] URL není dostupná:", response.status);
                return false;
            }

            const text = await response.text(); // Načtení textového obsahu
            console.log("[Data Check] Kontrola obsahu na URL:", targetUrl);

            // Kontrola na znak '%'
            if (text.includes('%')) {
                console.log("[Data Available] Znak '%' nalezen. Přesměrování na základní URL...");
                if (!isRedirected) {
                    isRedirected = true; // Zabránění opakování
                    window.location.href = baseUrl; // Přesměrování na základní URL bez timestampu
                }
                return true;
            } else {
                console.log("[Data Missing] Znak '%' nenalezen. Pokračuji v kontrole...");
                return false;
            }
        } catch (error) {
            console.error("[Error] Chyba při načítání URL:", error);
            return false;
        }
    }

    // Hlavní funkce
    async function monitorData() {
        const gameId = getGameId();
        if (!gameId) {
            console.error("[Error] Nelze najít gameId v aktuální URL.");
            return;
        }

        const targetUrl = constructTargetUrl(gameId);
        const baseUrl = constructBaseTargetUrl(gameId);

        console.log("[Monitor] Kontroluji data na URL:", targetUrl);

        const dataAvailable = await checkForData(targetUrl, baseUrl);
        if (!dataAvailable) {
            setTimeout(monitorData, CHECK_INTERVAL); // Opakuj kontrolu za 60 sekund
        }
    }

    // Spuštění monitorování
    monitorData();
})();

