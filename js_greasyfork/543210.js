// ==UserScript==
// @name         Miniflux Mark Above/Below as Read
// @namespace    xxx
// @version      1.0
// @description  Add buttons to mark entries above or below as read in Miniflux
// @author       brfuk
// @match        https://your_miniflux_url/feed/*
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543210/Miniflux%20Mark%20AboveBelow%20as%20Read.user.js
// @updateURL https://update.greasyfork.org/scripts/543210/Miniflux%20Mark%20AboveBelow%20as%20Read.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_TOKEN = 'SAMPLE_API_TOKEN';
    const MINIFLUX_API = 'https://your_miniflux_url/v1/entries';

    function getEntryId(entry) {
        return (
            parseInt(entry.getAttribute('data-entry-id')) ||
            parseInt(entry.dataset?.id) ||
            parseInt(entry.querySelector('a[href*="/entry/"]')?.href.match(/\d+$/)?.[0]) ||
            null
        );
    }

    function sendMarkAsRead(ids) {
        if (!ids || ids.length === 0) {
            alert("⚠️ No entries to be marked");
            return;
        }

        console.log('📡 Sending API request，entry_ids:', ids);

        fetch(MINIFLUX_API, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Auth-Token': API_TOKEN
            },
            body: JSON.stringify({
                entry_ids: ids,
                status: 'read'
            })
        }).then(res => {
            if (res.ok) {
                console.log('✅ Mark as read successfully');
                const candidates = document.querySelectorAll('.item');
                ids.forEach(id => {
                    candidates.forEach(item => {
                        const itemId = getEntryId(item);
                        if (itemId === id) {
                            item.style.setProperty('opacity', '0.5', 'important');
                            item.style.pointerEvents = 'none';
                        }
                    });
                });
            } else {
                res.text().then(msg => {
                    console.error('❌ Mark failed:', msg);
                    alert('❌ Mark failed:\n' + msg);
                });
            }
        }).catch(err => {
            console.error('❌ Network error:', err);
            alert('❌ Network error:\n' + err.message);
        });
    }

    function addButtons() {
        const entries = Array.from(document.querySelectorAll('.item'));
        console.log("🔍 Amount of articles found：", entries.length);

        if (entries.length === 0) return;

        entries.forEach((entry, index) => {
            const id = getEntryId(entry);
            if (!id) return;

            entry.style.position = 'relative';

            const container = document.createElement('div');
            container.className = 'custom-buttons';
            container.style.position = 'absolute';
            container.style.bottom = '6px';
            container.style.right = '8px';
            container.style.display = 'none';
            container.style.gap = '4px';
            container.style.flexDirection = 'column';  // ✅ Display buttons vertically
            container.style.zIndex = '99';
            container.style.pointerEvents = 'auto';

            const btnAbove = document.createElement('button');
            btnAbove.textContent = '↑ Above';
            btnAbove.style.fontSize = '12px';
            btnAbove.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const ids = entries.slice(0, index).map(e => getEntryId(e)).filter(Boolean);
                sendMarkAsRead(ids);
            });

            const btnBelow = document.createElement('button');
            btnBelow.textContent = '↓ Below';
            btnBelow.style.fontSize = '12px';
            btnBelow.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                const ids = entries.slice(index + 1).map(e => getEntryId(e)).filter(Boolean);
                sendMarkAsRead(ids);
            });

            container.appendChild(btnAbove);
            container.appendChild(btnBelow);
            entry.appendChild(container);

            // Floating display button
            entry.addEventListener('mouseenter', () => container.style.display = 'flex');
            entry.addEventListener('mouseleave', () => container.style.display = 'none');
        });
    }

    function waitForEntriesAndInject() {
        const check = () => {
            const entries = document.querySelectorAll('.item');
            if (entries.length > 0) {
                addButtons();
            } else {
                setTimeout(check, 500);
            }
        };
        check();
    }

    waitForEntriesAndInject();
})();
