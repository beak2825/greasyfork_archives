// ==UserScript==
// @name         🃏🔄 My Carrds Auto Loader ⭐ClopoStars⭐
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically loads all cards on My Carrds and adds extra info links for easy access.
// @author       GPT-5
// @match        https://clopostars.com/base
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546546/%F0%9F%83%8F%F0%9F%94%84%20My%20Carrds%20Auto%20Loader%20%E2%AD%90ClopoStars%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/546546/%F0%9F%83%8F%F0%9F%94%84%20My%20Carrds%20Auto%20Loader%20%E2%AD%90ClopoStars%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==== CONFIG ====
    const debug = true;
    const defaultDelay = 1000; // ms
    const minDelay = 90;// ms
    const maxDelay = 2500;// ms
    const adjustFactor = 0.2;
    const thresholdPercent = 5;
    const infinitescrollSelector = '[infinitescroll]';

    let delay = parseFloat(localStorage.getItem('cardLoadDelay')) || defaultDelay;
    delay = Math.round(delay / 10) * 10;

    // ==== STATE ====
    let counterEl;
    let lastCount = 0;
    let batchStart = 0;
    let container;

    // ---------------- FUNCTIONS ----------------
    function OverlayBlocker() {
        const css = `
          loading,
          loading > div {
            display: none !important;
          }
        `;

        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);

        console.log("✅ OverlayBlocker active (loading overlay hidden)");
    }

    function injectCustomStyles() {
        const css = `
        .normalized-row {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        }
        .normalized-row-child {
            margin: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .green-info-icon {
            position: relative;
            top: -3px;
            flex: none;
            border-radius: 0.375rem; /* same as rounded-md */
            font-weight: 600; /* same as font-semibold */
            transition: color 0.2s;
        }
        .green-info-icon svg {
            stroke: #32CD32;
        }
        .green-info-icon:hover svg {
            stroke: rgb(156,163,175); /* gray-400 */
        }
    `;
        const style = document.createElement("style");
        style.innerHTML = css;
        document.head.appendChild(style);
    }
    // ---------------- MODULE: Open Card Info in New Tab ----------------
    function CardInfoNewTabLite() {
        document.addEventListener("click", (e) => {
            const link = e.target.closest("a.card-info");
            if (link && link.getAttribute("href")?.startsWith("/base/detail/")) {
                e.preventDefault();// stop browser from navigating current tab
                e.stopImmediatePropagation(); // stop other handlers that might trigger navigation
                window.open(link.href, "_blank"); // open new tab
            }
        }, true); // capture phase
    }

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) return callback(el);

        const observer = new MutationObserver(() => {
            const found = document.querySelector(selector);
            if (found) {
                observer.disconnect();
                callback(found);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function createCounterUI() {
        counterEl = document.createElement('div');
        counterEl.style.position = 'fixed';
        counterEl.style.top = '10px';
        counterEl.style.right = '10px';
        counterEl.style.background = 'rgba(0,0,0,0.8)';
        counterEl.style.color = '#0f0';
        counterEl.style.padding = '8px 12px';
        counterEl.style.fontSize = '14px';
        counterEl.style.fontFamily = 'monospace';
        counterEl.style.zIndex = '9999';
        counterEl.style.borderRadius = '5px';
        document.body.appendChild(counterEl);
    }

    function updateCounter() {
        counterEl.textContent = `Cards: ${lastCount} | Delay: ${delay.toFixed(0)}ms`;
    }

    function adjustDelay(loadTime) {
        // Dead zone tolerance to avoid small jitter changes
        const tolerancePercent = 5; // adjust only if change is >5%
        const diffPercent = Math.abs(loadTime - delay) / delay * 100;
        if (diffPercent < tolerancePercent) {
            if (debug) console.log(`⚖ Within ${tolerancePercent}% tolerance, keeping delay at ${delay} ms`);
            return;
        }

        // Adjust toward measured load time
        delay += (loadTime - delay) * adjustFactor;

        // Clamp within limits
        delay = Math.max(minDelay, Math.min(maxDelay, delay));

        // Round for neatness
        delay = Math.round(delay / 10) * 10;

        // Save for persistence between visits
        localStorage.setItem('cardLoadDelay', delay);

        if (debug) console.log(`🔄 Adjusted delay to ${delay} ms based on load time ${loadTime} ms`);
    }

    let firstRun = true;
    function loadNextBatch() {
        const beforeCount = document.querySelectorAll('.card, [card-single-item]').length;
        batchStart = Date.now();

        let safetyTimer;
        const safetyLimit = 5000; // ms before giving up on this batch

        const observer = new MutationObserver(() => {
            const afterCount = document.querySelectorAll('.card, [card-single-item]').length;
            const newCards = afterCount - beforeCount;

            if (newCards > 0) {
                clearTimeout(safetyTimer);
                const loadTime = Date.now() - batchStart;
                if (debug) console.log(`✅ Loaded ${newCards} cards in ${loadTime} ms`);

                observer.disconnect();
                adjustDelay(loadTime);

                lastCount = afterCount;
                updateCounter();

                if (!firstRun) {
                    if (debug) console.log("✨ Injecting green icons after batch");
                    processCardRows();
                } else {
                    firstRun = false;
                }

                setTimeout(loadNextBatch, delay);
            } else {
                clearTimeout(safetyTimer);
                observer.disconnect();
                if (debug) console.log("⏹ No more cards detected. Stopping.");
            }
        });

        observer.observe(document.querySelector('my-cards'), { childList: true, subtree: true });

        if (debug) console.log("📡 Triggering batch load via scrolled event");
        container.dispatchEvent(new Event('scrolled'));

        safetyTimer = setTimeout(() => {
            observer.disconnect();
            if (debug) console.log(`⏹ No new cards within ${safetyLimit} ms. Stopping.`);
        }, safetyLimit);
    }

    function startAutoLoader(el) {
        container = el;
        if (debug) console.log(`🚀 Auto-loader starting with delay: ${delay} ms`);

        createCounterUI();
        lastCount = document.querySelectorAll('.card, [card-single-item]').length;
        batchStart = Date.now();
        updateCounter();
        processCardRows();// run on first batch immediately
        if (debug) console.log("✨ Initial batch loaded, skipping green icons (will run on next batch)");
        loadNextBatch();
    }

    let lastProcessedIndex = 0;
    function processCardRows() {
        const cards = document.querySelectorAll('[card-single-item]');
        let updatedCount = 0;

        for (let i = lastProcessedIndex; i < cards.length; i++) {
            const card = cards[i];
            const row = card.querySelector('.flex.items-center.justify-center.mt-4');
            if (!row) {
                if (debug) console.warn(`⚠️ No row found for card ${i}`);
                continue;
            }

            normalizeRow(row);
            injectGreenInfo(card, row);

            updatedCount++;
        }

        lastProcessedIndex = cards.length;
        if (debug) console.log(`✨ processCardRows updated ${updatedCount} rows. New index = ${lastProcessedIndex}`);
    }

    function normalizeRow(row) {
        row.classList.add('normalized-row');
        Array.from(row.children).forEach(child => child.classList.add('normalized-row-child'));
    }

    function injectGreenInfo(card, row) {
        if (row.querySelector('a.green-info-icon')) return;

        const playerId = card.querySelector('.player-id')?.innerText.trim();
        if (!playerId) {
            if (debug) console.warn(`⚠️ No playerId for card`);
            return;
        }

        const greenLink = createGreenInfoIcon(playerId);
        row.insertBefore(greenLink, row.firstChild);
    }

    function createGreenInfoIcon(playerId) {
        const greenLink = document.createElement('a');
        greenLink.href = `https://erepublik.tools/en/society/citizen/${playerId}`;
        greenLink.target = '_blank';
        greenLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" class="w-10 h-10">
        <path stroke-linecap="round" stroke-linejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"></path>
      </svg>`;

        greenLink.classList.add('green-info-icon');
        return greenLink;
    }

    // auto-run
    CardInfoNewTabLite();
    // auto-run
    OverlayBlocker();
    // auto-run
    injectCustomStyles();
    // ---------------- INIT ----------------
    waitForElement(infinitescrollSelector, startAutoLoader);

})();
