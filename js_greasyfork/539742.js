// ==UserScript==
// @name         EP Timestamp
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Format timestamps with name and time on one line, no date, intervals in minutes only (now includes seconds)
// @match        https://expert-portal.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539742/EP%20Timestamp.user.js
// @updateURL https://update.greasyfork.org/scripts/539742/EP%20Timestamp.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const TIMESTAMP_SELECTOR = '._messageTime_hbfhl_151';
    const TRANSLATE_BTN_CLASS = '_toggleTranslationBtn_hbfhl_262';

    function parseTime(text) {
        const [hours, minutes, seconds = 0] = text.split(':').map(Number);
        const now = new Date();
        now.setHours(hours, minutes, seconds, 0);
        return now;
    }

    function formatInterval(ms) {
        const totalMinutes = Math.floor(ms / 60000);
        return `${totalMinutes}m`;
    }

    function extractVisibleTextExcludingButton(el, btn) {
        let texts = [];
        el.childNodes.forEach(node => {
            if (node === btn) return;
            if (node.nodeType === Node.TEXT_NODE) {
                texts.push(node.textContent.trim());
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                texts.push(...extractVisibleTextExcludingButton(node, btn));
            }
        });
        return texts.filter(text => text !== '' && text !== '-');
    }

    function processTimestamps() {
        const elements = Array.from(document.querySelectorAll(TIMESTAMP_SELECTOR))
            .map(el => {
                const btn = el.querySelector(`.${TRANSLATE_BTN_CLASS}`);
                const textParts = extractVisibleTextExcludingButton(el, btn);

                const timeLine = textParts.find(line => /^\d{1,2}:\d{2}(:\d{2})?$/.test(line));
                if (!timeLine) return null;

                const nameLines = textParts.filter(line => line !== timeLine);
                const name = nameLines.join(' ');

                return {
                    el,
                    name,
                    timeText: timeLine,
                    time: parseTime(timeLine),
                    btn
                };
            })
            .filter(item => item !== null)
            .sort((a, b) => a.time - b.time);

        let prevTime = null;

        elements.forEach(({ el, name, timeText, time, btn }) => {
            if (el.dataset.formatted === 'true') return;

            let intervalText = '';
            let color = 'inherit';

            if (prevTime) {
                const diff = time - prevTime;
                intervalText = ` (+${formatInterval(diff)})`;
                color = diff < 180000 ? 'green' : 'red';
            }
            prevTime = time;

            el.innerHTML = '';

            const span = document.createElement('span');
            span.innerText = name ? `${name} - ${timeText}${intervalText}` : `${timeText}${intervalText}`;
            span.style.color = color;
            span.style.fontWeight = 'bold';
            el.appendChild(span);

            if (btn) {
                btn.style.display = 'inline-block';
                btn.style.marginLeft = '8px';
                el.appendChild(btn);
            }

            el.dataset.formatted = 'true';
        });
    }

    function observeDynamicChanges() {
        const observer = new MutationObserver(() => processTimestamps());
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            processTimestamps();
            observeDynamicChanges();
        }, 1000);
    });
})();
