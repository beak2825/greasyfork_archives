// ==UserScript==
// @name         Intervals for QC in Zendesk (Tag-Style Cards, No Duplicate Timestamp)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Show relative time, local Zendesk timestamp, UTC timestamp (both clickable) and highlight long intervals in Zendesk; minimal tag-style card design. Original timestamp hidden to avoid duplicates.
// @author       ChatGPT
// @match        https://askcrew.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523409/Intervals%20for%20QC%20in%20Zendesk%20%28Tag-Style%20Cards%2C%20No%20Duplicate%20Timestamp%29.user.js
// @updateURL https://update.greasyfork.org/scripts/523409/Intervals%20for%20QC%20in%20Zendesk%20%28Tag-Style%20Cards%2C%20No%20Duplicate%20Timestamp%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastUpdateTime = Date.now();
    let lastSeenDateTime = null;
    let observer = null;

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function getFormattedTimeDifference(dateTime) {
        const eventTime = new Date(dateTime).getTime();
        const now = Date.now();
        const diff = Math.floor((now - eventTime) / 1000);

        if (diff < 60) return `${diff} sec ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} min ${diff % 60} sec ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)} hr ${Math.floor((diff % 3600) / 60)} min ago`;
        return `${Math.floor(diff / 86400)} days ${Math.floor((diff % 86400) / 3600)} hr ago`;
    }

    function getIntervalTimeDifference(prev, current) {
        const p = new Date(prev).getTime();
        const c = new Date(current).getTime();
        const diff = Math.floor((c - p) / 1000);

        if (diff < 60) return { text: `${diff} sec`, seconds: diff };
        if (diff < 3600) return { text: `${Math.floor(diff / 60)} min ${diff % 60} sec`, seconds: diff };
        if (diff < 86400) return { text: `${Math.floor(diff / 3600)} hr ${Math.floor((diff % 3600) / 60)} min`, seconds: diff };
        return { text: `${Math.floor(diff / 86400)} days ${Math.floor((diff % 86400) / 3600)} hr`, seconds: diff };
    }

    function copyToClipboard(text, el, color = '#008000') {
        navigator.clipboard.writeText(text).then(() => {
            el.style.transition = 'color 0.5s, background-color 0.3s';
            const prevColor = el.style.color;
            const prevBg = el.style.backgroundColor;
            el.style.color = color;
            el.style.backgroundColor = 'rgba(0,0,0,0.1)';
            setTimeout(() => {
                el.style.color = prevColor;
                el.style.backgroundColor = prevBg;
            }, 600);
        });
    }

    // Inject minimal tag-style CSS
    const style = document.createElement('style');
    style.textContent = `
        .qc-tag {
            display: inline-block;
            border-radius: 4px;
            background-color: #f0f0f0;
            padding: 2px 6px;
            margin-right: 4px;
            font-family: inherit;
            font-size: 0.85em;
            cursor: default;
            transition: background-color 0.3s, color 0.3s;
        }
        .qc-tag:hover {
            background-color: #e0e0e0;
        }
        .qc-utc-time, .qc-local-time {
            text-decoration: underline;
            cursor: copy;
            color: #666;
        }
    `;
    document.head.appendChild(style);

    function formatUTCtoZendesk(dateTime) {
        const d = new Date(dateTime);
        const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' });
        const day = String(d.getUTCDate()).padStart(2, '0');
        const hours = String(d.getUTCHours()).padStart(2, '0');
        const minutes = String(d.getUTCMinutes()).padStart(2, '0');
        return `${month} ${day} ${hours}:${minutes}`;
    }

    function formatLocalZendesk(dateTime) {
        const d = new Date(dateTime);
        const month = d.toLocaleString('en-US', { month: 'short' });
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${month} ${day} ${hours}:${minutes}`;
    }

    function updateTimestamps() {
        try {
            const timeElements = document.querySelectorAll('time[data-test-id="timestamp-relative"]');
            let previousDateTime = lastSeenDateTime;

            timeElements.forEach((el) => {
                const dateTime = el.getAttribute('datetime');
                if (!dateTime) return;

                // Hide the original Zendesk timestamp to avoid duplicate
                el.style.display = 'none';

                const exact = getFormattedTimeDifference(dateTime);
                const utcString = formatUTCtoZendesk(dateTime);
                const localString = formatLocalZendesk(dateTime);

                let interval = { text: '', seconds: 0 };
                if (previousDateTime) interval = getIntervalTimeDifference(previousDateTime, dateTime);
                const highlight = interval.seconds > 180;

                let info = el.nextElementSibling;
                if (!info || !info.classList.contains('qc-time-info')) {
                    info = document.createElement('span');
                    info.className = 'qc-time-info';
                    info.style.marginLeft = '4px';
                    el.insertAdjacentElement('afterend', info);
                }

                // Build tag-style card
                info.innerHTML = `
                    <span class="qc-tag">${exact}</span>
                    <span class="qc-tag qc-local-time">${localString}</span>
                    <span class="qc-tag qc-utc-time">${utcString}</span>
                    ${interval.text ? `<span class="qc-tag" style="background-color:${highlight?'#fdd':'#f0f0f0'};">⏱ ${interval.text}</span>` : ''}
                `;

                // Click-to-copy UTC
                const utcEl = info.querySelector('.qc-utc-time');
                if (utcEl && !utcEl.dataset.qcCopyEnabled) {
                    utcEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(utcString, utcEl, '#d00');
                    });
                    utcEl.dataset.qcCopyEnabled = 'true';
                }

                // Click-to-copy local timestamp
                const localEl = info.querySelector('.qc-local-time');
                if (localEl && !localEl.dataset.qcCopyEnabled) {
                    localEl.addEventListener('click', (e) => {
                        e.stopPropagation();
                        copyToClipboard(localString, localEl, '#008000');
                    });
                    localEl.dataset.qcCopyEnabled = 'true';
                }

                previousDateTime = dateTime;
            });

            lastSeenDateTime = previousDateTime;
        } catch (err) {
            console.warn('[QC Intervals] updateTimestamps error:', err);
        }
    }

    const debouncedUpdate = debounce(updateTimestamps, 300);

    function startObserving() {
        const chatContainer = document.querySelector('[data-test-id="conversation-log"]') || document.body;
        if (!chatContainer) return;

        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            const now = Date.now();
            if (now - lastUpdateTime > 4000) {
                lastUpdateTime = now;
                debouncedUpdate();
            }
        });

        observer.observe(chatContainer, { childList: true, subtree: true });
    }

    function init() {
        startObserving();
        updateTimestamps();
    }

    init();

    const reinitObserver = new MutationObserver(() => {
        const chat = document.querySelector('[data-test-id="conversation-log"]');
        if (chat && (!observer || !chat.contains(observer.target))) {
            init();
        }
    });
    reinitObserver.observe(document.body, { childList: true, subtree: true });
})();
