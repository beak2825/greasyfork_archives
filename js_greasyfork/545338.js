// ==UserScript==
// @name         GeForce NOW Syncer - The Polished Final
// @namespace    http://tampermonkey.net/
// @version      9.0
// @description  The final, polished script that handles all store cases.
// @author       ajwaj600 & AI
// @match        https://play.geforcenow.com/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545338/GeForce%20NOW%20Syncer%20-%20The%20Polished%20Final.user.js
// @updateURL https://update.greasyfork.org/scripts/545338/GeForce%20NOW%20Syncer%20-%20The%20Polished%20Final.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIG & STATE ---------------------------------------------------
    let gameTitles = [
        //paste your game title list here
        ];
    let SEARCH_DELAY = 2500;
    let TILE_DELAY = 2000;
    let CONFIRM_DELAY = 2000;
    let stopFlag = false;
    const syncedGames = [], skippedGames = [];

    const gfn = {
        total: 0,
        searchInput: null,
        currentTitle: null,
        logElement: null,

        dispatchClick(element) {
            if (!element) return;
            const options = { bubbles: true, cancelable: true, view: window };
            element.dispatchEvent(new MouseEvent('mousedown', options));
            element.dispatchEvent(new MouseEvent('mouseup', options));
            element.dispatchEvent(new MouseEvent('click', options));
        },

        waitForElement(selector, timeout = 7000, condition = () => true) {
            return new Promise((resolve) => {
                const interval = 100;
                let timer = 0;
                const checker = setInterval(() => {
                    const element = Array.from(document.querySelectorAll(selector)).find(condition);
                    if (element || stopFlag) { clearInterval(checker); resolve(element); }
                    timer += interval;
                    if (timer >= timeout) { clearInterval(checker); resolve(null); }
                }, interval);
            });
        },

        log(message, type = 'info') {
            console.log(message);
            if (this.logElement) {
                const p = document.createElement('p');
                p.textContent = message;
                if (type === 'error') p.style.color = 'red';
                if (type === 'warn') p.style.color = 'orange';
                if (type === 'success') p.style.color = 'lightgreen';
                this.logElement.appendChild(p);
                this.logElement.scrollTop = this.logElement.scrollHeight;
            }
        },

        createUI() {
            if (document.getElementById('gfn-syncer-container')) return;
            const container = document.createElement('div');
            container.id = 'gfn-syncer-container';
            container.style.cssText = 'position: fixed; top: 100px; right: 20px; width: 350px; max-height: 500px; background-color: rgba(0,0,0,0.8); color: white; border: 1px solid #76b900; border-radius: 5px; z-index: 9999; padding: 10px; font-family: sans-serif;';
            const header = document.createElement('h3');
            header.textContent = 'GFN Syncer';
            header.style.margin = '0 0 10px 0';
            this.logElement = document.createElement('div');
            this.logElement.style.cssText = 'height: 350px; overflow-y: scroll; border: 1px solid #333; padding: 5px; margin-bottom: 10px; font-size: 12px;';
            const startButton = document.createElement('button');
            startButton.textContent = '▶️ Start Sync';
            startButton.style.cssText = 'width: 100%; padding: 10px; background-color: #76b900; border: none; color: white; font-size: 16px; cursor: pointer;';
            const stopButton = document.createElement('button');
            stopButton.textContent = '🛑 Stop Sync';
            stopButton.style.cssText = 'width: 100%; padding: 10px; background-color: #c00; border: none; color: white; font-size: 16px; cursor: pointer; display: none; margin-top: 5px;';
            container.append(header, this.logElement, startButton, stopButton);
            document.body.appendChild(container);
            startButton.onclick = () => { startButton.style.display = 'none'; stopButton.style.display = 'block'; this.run(); };
            stopButton.onclick = () => { stopFlag = true; this.log('🛑 Anulowano przez użytkownika.', 'warn'); startButton.style.display = 'block'; stopButton.style.display = 'none'; };
        },

        async run() {
            stopFlag = false; this.total = gameTitles.length;
            if (this.total === 0) return this.log("Brak gier do przetworzenia.", 'warn');
            this.searchInput = await this.waitForElement("input.search-input");
            if (!this.searchInput) return this.log("❌ Nie znaleziono pola wyszukiwania", 'error');
            this.log(`Rozpoczynam synchronizację ${this.total} gier…`);
            this.searchNext();
        },

        async searchNext() {
            if (stopFlag) return;
            if (gameTitles.length === 0) { this.log("✅ Zakończono.", 'success'); return this.reportSummary(); }
            const title = gameTitles.shift();
            this.currentTitle = title;
            const count = this.total - gameTitles.length;
            this.log(`🔍 [${count}/${this.total}] Wyszukuję "${title}"…`);
            this.searchInput.value = title;
            this.searchInput.dispatchEvent(new Event("input", { bubbles: true }));
            this.dispatchClick(this.searchInput);
            await new Promise(r => setTimeout(r, SEARCH_DELAY));
            this.openFirstTile(title);
        },

        async openFirstTile(title) {
            if (stopFlag) return;
            await this.waitForElement('gfn-game-tile');
            const items = window.latestSearchResult || [];
            if (items.length === 0) { this.log(`⚠️ Brak wyników dla "${title}". Pomijam.`, 'warn'); skippedGames.push(title); return this.searchNext(); }
            const norm = s => s.toLowerCase().replace(/[^\w\s]/g, "").trim();
            const match = items.find(i => norm(i.title) === norm(title) && i.variants.some(v => v.appStore === "EPIC"));
            if (!match) { this.log(`⚠️ "${title}" nie znaleziono w wynikach lub brak wersji Epic.`, 'warn'); skippedGames.push(title); return this.searchNext(); }
            const epicVariant = match.variants.find(v => v.appStore === "EPIC");
            if (epicVariant.gfn.library.status !== "NOT_OWNED") { this.log(`ℹ️ "${match.title}" jest już posiadana/zsynchronizowana.`); syncedGames.push(match.title); return this.searchNext(); }

            const idx = items.indexOf(match);
            const cards = Array.from(document.querySelectorAll("gfn-game-tile"));
            const card = cards[idx];
            if (!card) {
                this.log(`❌ Nie znaleziono kafelka w DOM o indeksie ${idx} dla "${match.title}".`, 'error');
                skippedGames.push(title);
                return this.searchNext();
            }

            const clickTarget = card.childNodes[0]?.childNodes[0]?.childNodes[0];
            if (!clickTarget) {
                this.log(`❌ Nie znaleziono wewnętrznego celu do kliknięcia dla "${match.title}".`, 'error');
                skippedGames.push(title);
                return this.searchNext();
            }

            clickTarget.click();

            this.log(`📂 Otwarto kafelek dla: "${match.title}"`);
            await new Promise(r => setTimeout(r, TILE_DELAY));
            this.clickEpicTagAndAdd();
        },

        async clickEpicTagAndAdd() {
            if (stopFlag) return;
            const title = this.currentTitle;
            try {
                // ❗❗❗ KEY CHANGE IS HERE ❗❗❗
                const allChips = Array.from(document.querySelectorAll("mat-chip.digital-store-chip"));
                if (allChips.length > 1) {
                    const epicChip = allChips.find(el => el.textContent.includes("Epic Games Store"));
                    if (epicChip) {
                        this.log(`▶️ Znaleziono wiele sklepów. Aktywuję chip Epic...`);
                        this.dispatchClick(epicChip);
                        await new Promise(r => setTimeout(r, 500)); // Short delay after clicking
                    } else {
                        throw new Error("Znaleziono wiele sklepów, ale żaden nie jest Epic Games.");
                    }
                } else {
                    this.log(`ℹ️ Tylko jeden sklep dostępny (lub żaden chip nie jest widoczny). Przechodzę dalej.`);
                }

                const addBtn = await this.waitForElement('button.mat-raised-button.mat-accent', 7000, el => !el.disabled);
                if (!addBtn) throw new Error("Przycisk 'OZNACZ' nie stał się aktywny.");

                this.log(`🟢 Klikam "OZNACZ JAKO POSIADANA"...`);
                this.dispatchClick(addBtn);

                const confirmBtn = await this.waitForElement("mat-dialog-container button.mat-flat-button.mat-accent", 5000, el => el.textContent.includes("TAK, KONTYNUUJ"));
                if (confirmBtn) { this.log(`✅ Potwierdzam...`); this.dispatchClick(confirmBtn); }
                else { this.log(`✅ Brak okna dialogowego, zakładam sukces.`); }
                syncedGames.push(title);
                this.log(`✨ Zsynchronizowano "${title}"!`, 'success');

            } catch (error) {
                this.log(`❌ Błąd: ${error.message}`, 'error');
                skippedGames.push(title);
            } finally {
                const closeBtn = await this.waitForElement('gfn-game-details button[aria-label="close"]', 1000);
                if(closeBtn) this.dispatchClick(closeBtn);
                await new Promise(r => setTimeout(r, CONFIRM_DELAY));
                this.searchNext();
            }
        },

        reportSummary() {
            this.log("--- Podsumowanie ---");
            this.log(`Zsynchronizowano: ${syncedGames.length}`, 'success');
            this.log(`Pominięto: ${skippedGames.length}`, 'warn');
        }
    };

    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url) { this._url = url; return open.apply(this, arguments); };
        const origSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function(body) {
            this.addEventListener("load", () => {
                if (this._url?.includes("games.geforce.com/graphql") && this.responseText.includes('"apps"')) {
                    try { window.latestSearchResult = JSON.parse(this.responseText).data.apps.items; } catch { /* ignore */ }
                }
            });
            return origSend.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    const initializer = setInterval(() => {
        if (document.body) { clearInterval(initializer); gfn.createUI(); }
    }, 1000);

})();