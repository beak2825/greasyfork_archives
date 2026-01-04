// ==UserScript==
// @name         Feed Thomas Reminder
// @namespace    https://farmrpg.com/
// @version      2.8
// @description  Feed reminder overlay with 3 snooze modes (1hr @ hh:02, 10s, 24hr), sync, Open Sans, Snooze button, and visual mode indicators. Updated 1hr mode to resume 2 minutes past the hour. 🐾🐈🕒⏱️📅🧭🔕
// @author       Clientcoin
// @match        *://*/*
// @icon         https://farmrpg.com/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @license      Unlicense
// @homepage     https://farmrpg.com/
// @supportURL   https://farmrpg.com/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/532404/Feed%20Thomas%20Reminder.user.js
// @updateURL https://update.greasyfork.org/scripts/532404/Feed%20Thomas%20Reminder.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const FORCE_SHOW_NEXT_LOAD = false;

    const ID = 'feed-thomas-box';
    const SCALE_KEY = 'feedThomasScale';
    const STORAGE_KEY = 'feedThomasHiddenUntil';
    const MODE_KEY = 'feedThomasMode';
    const FORCE_KEY = 'feedThomasForceFlag';

    let scale = parseFloat(localStorage.getItem(SCALE_KEY)) || 1.0;
    let mode = parseInt(await GM_getValue(MODE_KEY, 0), 10);
    let hiddenUntil = parseInt(await GM_getValue(STORAGE_KEY, 0), 10) || 0;
    let clockInterval = null;

    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    if (FORCE_SHOW_NEXT_LOAD) {
        await GM_setValue(FORCE_KEY, true);
    }
    const forceOverride = await GM_getValue(FORCE_KEY, false);
    if (forceOverride) {
        hiddenUntil = 0;
        await GM_setValue(FORCE_KEY, false);
    }

    function shouldShowBox() {
        return Date.now() >= hiddenUntil;
    }

    async function handleSnooze() {
        const now = new Date();
        let next;
        if (mode === 1) {
            next = new Date(now);
            const remainder = 10 - (now.getSeconds() % 10);
            next.setSeconds(now.getSeconds() + remainder, 0);
        } else if (mode === 2) {
            next = new Date(now);
            next.setDate(now.getDate() + 1);
        } else {
            next = new Date(now);
            next.setMinutes(2, 0, 0);  // set to next hour @ 02:00
            next.setHours(next.getHours() + 1);
        }
        await GM_setValue(STORAGE_KEY, next.getTime());
    }

    function createBox() {
        if (document.getElementById(ID)) return;

        const box = document.createElement('div');
        box.id = ID;
        box.title = 'Click to snooze until next hour +2min, 10s or 24h depending on mode';
        Object.assign(box.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: '999999',
            backgroundColor: 'blue',
            color: 'yellow',
            fontSize: `${scale}em`,
            padding: '10px',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            fontFamily: "'Open Sans', sans-serif",
            lineHeight: '1.1'
        });

        const text = document.createElement('div');
        text.textContent = 'Feed Thomas';
        text.style.fontSize = '1em';
        box.appendChild(text);

        const clock = document.createElement('div');
        clock.style.fontSize = '0.8em';
        clock.style.marginTop = '4px';
        box.appendChild(clock);

        const date = document.createElement('div');
        date.style.fontSize = '0.75em';
        box.appendChild(date);

        updateClockAndDate(clock, date);
        clockInterval = setInterval(() => updateClockAndDate(clock, date), 1000);

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '6px';
        controls.style.marginTop = '6px';

        const minusBtn = document.createElement('button');
        minusBtn.textContent = '-';
        minusBtn.title = 'Decrease size';
        styleControlButton(minusBtn);
        minusBtn.style.width = '28px';
        minusBtn.onclick = (e) => {
            e.stopPropagation();
            scale = Math.max(0.5, scale - 0.1);
            localStorage.setItem(SCALE_KEY, scale.toFixed(2));
            document.getElementById(ID).style.fontSize = `${scale}em`;
        };

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '+';
        plusBtn.title = 'Increase size';
        styleControlButton(plusBtn);
        plusBtn.style.width = '28px';
        plusBtn.onclick = (e) => {
            e.stopPropagation();
            scale = Math.min(3.0, scale + 0.1);
            localStorage.setItem(SCALE_KEY, scale.toFixed(2));
            document.getElementById(ID).style.fontSize = `${scale}em`;
        };

        controls.appendChild(minusBtn);
        controls.appendChild(plusBtn);
        box.appendChild(controls);

        const modeBtn = document.createElement('button');
        updateModeButtonStyle(modeBtn, mode);
        modeBtn.title = 'Click to cycle reminder interval (1hr, 10s, 24hr)';
        modeBtn.onclick = async (e) => {
            e.stopPropagation();
            mode = (mode + 1) % 3;
            await GM_setValue(MODE_KEY, mode);
        };
        box.appendChild(modeBtn);

        const snoozeBtn = document.createElement('button');
        snoozeBtn.textContent = 'Snooze';
        snoozeBtn.title = 'Manually snooze this reminder';
        Object.assign(snoozeBtn.style, {
            marginTop: '4px',
            fontSize: '11px'
        });
        styleControlButton(snoozeBtn);
        snoozeBtn.onclick = async (e) => {
            e.stopPropagation();
            await handleSnooze();
        };
        box.appendChild(snoozeBtn);

        box.onclick = async () => {
            await handleSnooze();
        };

        document.body.appendChild(box);
    }

    function styleControlButton(btn) {
        btn.style.background = 'yellow';
        btn.style.color = 'blue';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.padding = '2px 6px';
        btn.style.fontWeight = 'bold';
        btn.style.borderRadius = '4px';
        btn.style.fontFamily = "'Open Sans', sans-serif";
    }

    function updateModeButtonStyle(btn, modeValue) {
        const labels = ['Mode: 1hr', 'Mode: 10s', 'Mode: 24hr'];
        btn.textContent = labels[modeValue];
        btn.style.marginTop = '6px';
        btn.style.fontSize = '10px';

        styleControlButton(btn);

        if (modeValue === 1) {
            btn.style.opacity = '0.6';
        } else if (modeValue === 2) {
            btn.style.background = 'blue';
            btn.style.color = 'yellow';
            btn.style.opacity = '1.0';
        } else {
            btn.style.opacity = '1.0';
            btn.style.background = 'yellow';
            btn.style.color = 'blue';
        }
    }

    function updateClockAndDate(clockEl, dateEl) {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const year = now.getFullYear();
        const month = now.toLocaleString('default', { month: 'short' });
        const day = String(now.getDate()).padStart(2, '0');
        const weekday = now.toLocaleString('default', { weekday: 'short' });
        const dateStr = `${year}-${month}-${day} (${weekday})`;

        clockEl.textContent = timeStr;
        dateEl.textContent = dateStr;
    }

    function checkAndShowBox() {
        const box = document.getElementById(ID);
        if (shouldShowBox()) {
            if (!box) createBox();
        } else if (box) {
            clearInterval(clockInterval);
            box.remove();
        }
    }

    GM_addValueChangeListener(STORAGE_KEY, (_, __, newValue) => {
        hiddenUntil = parseInt(newValue, 10);
        checkAndShowBox();
    });

    GM_addValueChangeListener(MODE_KEY, (_, __, newValue) => {
        mode = parseInt(newValue, 10);
        const box = document.getElementById(ID);
        if (box) {
            const btn = [...box.querySelectorAll('button')]
                .find(b => b.textContent.startsWith('Mode:'));
            if (btn) {
                updateModeButtonStyle(btn, mode);
            }
        }
    });

    function init() {
        checkAndShowBox();
        setInterval(checkAndShowBox, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
