// ==UserScript==
// @name         Material Calendar Advanced Auto-Clicker
// @namespace    http://tampermonkey.net/
// @version      4.15.2
// @description  Full-featured auto-clicker with rate-limiting/backoff, retry handling, spinner delays, draggable panel, and complete utility functions
// @match        https://inpol.mazowieckie.pl/home/cases/*
// @grant        none
// @run-at       document-idle
// @license      CC-BY-NC-ND-4.0
// @downloadURL https://update.greasyfork.org/scripts/542545/Material%20Calendar%20Advanced%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/542545/Material%20Calendar%20Advanced%20Auto-Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // -- CONFIGURATION PARAMETERS --
    const RETRY_LIMIT = 3;       // Number of retry attempts on failures
    const INITIAL_DELAY = 1000;  // Base backoff delay in ms
    const MAX_BACKOFF = 10000;   // Maximum backoff delay in ms
    const RANDOM_MIN = 500;      // Minimum random delay in ms
    const RANDOM_MAX = 1500;     // Maximum random delay in ms

    // -- STATE VARIABLES --
    let running = false;
    let stopRequested = false;
    let recordMode = false;
    let dayRange = [];
    let backoffCount = 0;

    // -- UTILITY FUNCTIONS --
    /** Pause execution for a given duration (ms) */
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** Generate a uniform random delay between RANDOM_MIN and RANDOM_MAX */
    function randomDelay() {
        return Math.floor(Math.random() * (RANDOM_MAX - RANDOM_MIN + 1)) + RANDOM_MIN;
    }

    /** Compute exponential backoff delay based on backoffCount */
    function getBackoffDelay() {
        const delay = Math.min(INITIAL_DELAY * Math.pow(2, backoffCount), MAX_BACKOFF);
        backoffCount = Math.min(backoffCount + 1, Math.log2(MAX_BACKOFF / INITIAL_DELAY));
        return delay;
    }

    /** Reset backoff counter after a successful operation */
    function resetBackoff() {
        backoffCount = 0;
    }

    // -- LOADING SPINNER DETECTION --
    /** Wait until the Angular spinner <circle> is gone from the DOM */
    async function waitForSpinnerGone(timeout = 5000) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const spinner = document.querySelector('circle.ng-star-inserted');
            if (!spinner) {
                return;
            }
            await sleep(100);
        }
        console.warn('Spinner did not disappear within timeout');
    }

    // -- DRAGGABLE PANEL SETUP --
/**
 * Make a panel draggable by a handle element
 * @param {HTMLElement} handle  The element to listen for drag events
 * @param {HTMLElement} panelEl The element to move
 */
function makeDraggable(handle, panelEl) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let panelX = 0, panelY = 0;

    handle.addEventListener('mousedown', e => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = panelEl.getBoundingClientRect();
        panelX = rect.left;
        panelY = rect.top;
        e.preventDefault();
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        panelEl.style.left = panelX + dx + 'px';
        panelEl.style.top = panelY + dy + 'px';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
}

    // -- VISUAL FEEDBACK --
    /** Flash a red overlay briefly as an error indicator */
    function flashRed() {
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0, left: 0,
            width: '100%', height: '100%',
            backgroundColor: 'rgba(255,0,0,0.3)',
            zIndex: 99999
        });
        document.body.appendChild(overlay);
        setTimeout(() => document.body.removeChild(overlay), 300);
    }

    // -- CONTROL PANEL UI --
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed', top: '10px', left: '10px',
        width: '360px', maxHeight: '90vh', overflowY: 'auto',
        background: '#222', color: '#fff', padding: '10px',
        borderRadius: '5px', fontFamily: 'Arial, sans-serif', fontSize: '14px',
        zIndex: 99998
    });
    document.body.appendChild(panel);
    // Make the header draggable instead of entire panel to allow input focus
    // makeDraggable(panel);  // removed global drag


    const header = document.createElement('h3');
    header.textContent = 'Material Calendar Auto-Clicker v4.14';
    Object.assign(header.style, { margin: '0 0 8px 0', cursor: 'move', textAlign: 'center', userSelect: 'none' });
    panel.appendChild(header);
    makeDraggable(header, panel); // enable dragging by header

    // Day range input
    const rangeLabel = document.createElement('label');
    rangeLabel.htmlFor = 'dayRangeInput';
    rangeLabel.textContent = 'Enter days to click (e.g. 29,31):';
    panel.appendChild(rangeLabel);

    const rangeInput = document.createElement('input');
    rangeInput.id = 'dayRangeInput';
    rangeInput.type = 'text';
    Object.assign(rangeInput.style, { width: '100%', padding: '4px', margin: '4px 0' });
    rangeInput.placeholder = '29,31';
    rangeInput.addEventListener('change', () => {
        dayRange = rangeInput.value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
        console.log('Day range set to:', dayRange);
    });
    panel.appendChild(rangeInput);

    // Log container
    const logContainer = document.createElement('div');
    Object.assign(logContainer.style, {
        width: '100%', height: '140px', overflowY: 'auto',
        background: '#111', padding: '6px', borderRadius: '3px', margin: '8px 0'
    });
    panel.appendChild(logContainer);

    function appendLog(message, color) {
        const entry = document.createElement('div');
        entry.textContent = message;
        if (color) entry.style.color = color;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    ['log', 'warn', 'error'].forEach(level => {
        const original = console[level];
        console[level] = (...args) => {
            original.apply(console, args);
            const msg = args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
            const col = level === 'warn' ? '#f90' : level === 'error' ? '#f33' : '#fff';
            appendLog(msg, col);
        };
    });

    function createButton(text, bgColor, handler) {
        const btn = document.createElement('button');
        btn.textContent = text;
        Object.assign(btn.style, {
            width: '100%', padding: '6px', margin: '4px 0',
            background: bgColor, color: '#fff', border: 'none',
            borderRadius: '3px', cursor: 'pointer'
        });
        btn.addEventListener('click', handler);
        panel.appendChild(btn);
        return btn;
    }

    createButton('Clear Logs', '#555', () => { logContainer.innerHTML = ''; });
    createButton('Export Calendar HTML', '#28a745', () => {
        const cal = document.querySelector('mat-calendar') || document.querySelector('div.mat-calendar');
        if (!cal) return console.warn('No calendar element found');
        console.log('=== CALENDAR HTML START ===');
        console.log(cal.outerHTML);
        console.log('=== CALENDAR HTML END ===');
    });
    const recordBtn = createButton('Record OFF', '#cc7700', () => {
        recordMode = !recordMode;
        recordBtn.textContent = recordMode ? 'Record ON' : 'Record OFF';
        recordBtn.style.background = recordMode ? '#dc3545' : '#cc7700';
        console.log('Record mode', recordMode ? 'ENABLED' : 'DISABLED');
    });
    const toggleBtn = createButton('Start Auto-Click', '#007bff', () => {
        running ? stop() : start();
    });
    // -- FAKE SLOT INJECTION --
    const injectBtn = createButton('Inject Fake Slots', '#6f42c1', () => {
        // choose random date cell
        const dates = getDates();
        if (!dates.length) return console.warn('No dates to inject into');
        const cell = dates[Math.floor(Math.random() * dates.length)];
        // create container for fake slots
        const fakeContainer = document.createElement('div');
        fakeContainer.setAttribute('data-fake-slot', 'true');
        // sample HTML snippet
        fakeContainer.innerHTML = `
<div class="reservation__hours">
  <div class="tiles tiles--hours">
    <div class="row">
      <div class="col-md-3 tiles__item"><button class="tiles__link">99:99</button></div>
    </div>
  </div>
</div>`;
        // append under calendar body
        cell.parentElement.appendChild(fakeContainer);
        console.log('Injected fake slots under date', cell.textContent.trim());
    });
// });    <--- **This closing brace+paren was extraneous; now commented out**

    // -- DOM INTERACTION HELPERS --
    /** Get all clickable date cells matching dayRange */
    function getDates() {
        const all = Array.from(document.querySelectorAll(
            'div.mat-calendar-body-cell-content.mat-focus-indicator'
        ));
        return all.filter(cell => {
            const parent = cell.parentElement;
            const dayNum = parseInt(cell.textContent.trim(), 10);
            return parent &&
                   !parent.classList.contains('mat-calendar-body-disabled') &&
                   cell.offsetParent &&
                   (!dayRange.length || dayRange.includes(dayNum));
        });
    }

    /** Wait until a clicked cell appears selected */
    function waitForSelection(cell, timeout = 5000) {
        return new Promise(resolve => {
            const parent = cell.parentElement;
            const start = Date.now();
            (function check() {
                if (parent.classList.contains('mat-calendar-body-selected') || Date.now() - start > timeout) {
                    resolve();
                } else {
                    setTimeout(check, 100);
                }
            })();
        });
    }

    /** Get all visible time-slot buttons */
    function getTimes() {
        const container = document.querySelector('.tiles--hours, .reservation__hours');
        if (!container) return [];
        return Array.from(container.querySelectorAll('button')).filter(btn => btn.offsetParent);
    }

    /** Click the Yes/Tak button in any open confirmation dialog */
    function confirmDialog() {
        const dlg = document.querySelector('mat-dialog-container, .mat-dialog-container');
        if (!dlg) return;
        const yesBtn = Array.from(dlg.querySelectorAll('button')).find(b =>
            /^(Tak|Yes)$/i.test(b.textContent.trim())
        );
        if (yesBtn) yesBtn.click();
    }

    // -- RETRY/ERROR HANDLING --
    async function attemptWithRetry(fn, description) {
        for (let attempt = 1; attempt <= RETRY_LIMIT; attempt++) {
            try {
                return await fn();
            } catch (err) {
                console.error(`${description} failed on attempt ${attempt}`, err);
                flashRed();
                if (attempt === RETRY_LIMIT) {
                    console.error(`Giving up on ${description} after ${RETRY_LIMIT} attempts`);
                    throw err;
                }
                const backoff = getBackoffDelay();
                console.log(`Retrying ${description} in ${backoff} ms`);
                await sleep(backoff);
            }
        }
    }

    // -- MAIN AUTO-CLICK LOOP --
    async function autoClickLoop() {
        while (!stopRequested) {
            const dates = getDates();
            if (!dates.length) {
                console.warn('No dates matching range, backing off');
                const backoff = getBackoffDelay();
                await sleep(backoff);
                continue;
            }
            resetBackoff();

            for (const cell of dates) {
                if (stopRequested) break;
                const dayText = cell.textContent.trim();
                console.log(`Processing date ${dayText}`);

                // 1) Click the date, wait to be selected
                await attemptWithRetry(async () => {
                    cell.click();
                    await waitForSelection(cell);
                    await waitForSpinnerGone();
                }, `Select date ${dayText}`);

                // 2) Random delay after spinner disappears
                const postDateDelay = randomDelay();
                console.log(`Waiting ${postDateDelay} ms after date select`);
                await sleep(postDateDelay);

                // 3) Fetch time slots
                const times = getTimes();
                if (!times.length) {
                    console.log(`No time slots for date ${dayText}, moving to next`);
                    continue;
                }

                // 4) If recordMode off, flash and skip reservation
                if (!recordMode) {
                    flashRed();
                    console.log('Record OFF: detected slots but not booking');
                    continue;
                }

                // 5) Choose a slot (earliest ≥ noon, else earliest)
                const entries = times.map(btn => {
                    const hour = Number(btn.textContent.trim().split(':')[0]);
                    return { btn, minutes: hour * 60 };
                });
                let candidates = entries.filter(e => e.minutes >= 750);
                if (!candidates.length) candidates = entries;
                candidates.sort((a, b) => a.minutes - b.minutes);
                const chosen = candidates[0].btn;
                const timeText = chosen.textContent.trim();

                // 6) Click and confirm
                await attemptWithRetry(async () => {
                    console.log(`Clicking time slot ${timeText}`);
                    chosen.click();
                    await waitForSpinnerGone();
                    confirmDialog();
                    await waitForSpinnerGone();
                    console.log(`Confirmed appointment at ${timeText}`);
                }, `Book time ${timeText}`);

                // 7) Random delay before next date iteration
                const delayNext = randomDelay();
                console.log(`Waiting ${delayNext} ms before next date`);
                await sleep(delayNext);
            }
        }
    }

    // -- START/STOP CONTROLS --
    function start() {
        if (running) return;
        running = true;
        stopRequested = false;
        toggleBtn.textContent = 'Stop Auto-Click';
        console.log('Auto-click started');
        autoClickLoop();
    }

    function stop() {
        if (!running) return;
        stopRequested = true;
        running = false;
        toggleBtn.textContent = 'Start Auto-Click';
        console.log('Auto-click stopped');
    }

    console.log('Material Calendar Advanced Auto-Clicker v4.15.2 loaded');
})();

/* EOF */
