// ==UserScript==
// @name         Preview Trip Details on bustimes.org
// @namespace    https://bustimes.org/
// @version      1.0
// @description  Preview trip information by hovering over block links on the detailed view of bustimes.org timetables
// @match        https://bustimes.org/services/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544292/Preview%20Trip%20Details%20on%20bustimesorg.user.js
// @updateURL https://update.greasyfork.org/scripts/544292/Preview%20Trip%20Details%20on%20bustimesorg.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SHOW_DELAY = 400;
    const HIDE_DELAY = 200;

    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.zIndex = '9999';
    popup.style.display = 'none';
    popup.style.pointerEvents = 'none';
    popup.style.padding = '10px';
    popup.style.margin = '0';
    popup.style.maxWidth = '90vw';
    popup.style.maxHeight = '80vh';
    popup.style.overflow = 'auto';
    popup.style.borderRadius = '4px';
    popup.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    popup.style.transition = 'background 0.3s, border-color 0.3s';

    document.body.appendChild(popup);

    const shadow = popup.attachShadow({ mode: 'open' });
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    shadow.appendChild(wrapper);

    const hostStyle = document.createElement('style');
    hostStyle.textContent = `
        :host {
            background: var(--popup-bg, #fff);
            border: 1px solid var(--popup-border, #ccc);
            border-radius: 4px;
            padding: 10px;
            box-sizing: border-box;
            font-size: 12px;
            color: var(--popup-color, #000);
            max-width: 90vw;
            max-height: 80vh;
            overflow: auto;
            display: block;
        }
        table, th, td {
            white-space: nowrap !important;
        }
    `;
    shadow.appendChild(hostStyle);

    let hoverTimeout = null;
    let hideTimeout = null;
    let currentLink = null;
    let lastMouseEvent = null;

    function isDarkMode() {
        return document.body.classList.contains('dark-mode');
    }

    function applyPopupTheme() {
        if (isDarkMode()) {
            shadow.host.style.setProperty('--popup-bg', '#222');
            shadow.host.style.setProperty('--popup-border', '#555');
            shadow.host.style.setProperty('--popup-color', '#eee');
        } else {
            shadow.host.style.setProperty('--popup-bg', '#fff');
            shadow.host.style.setProperty('--popup-border', '#ccc');
            shadow.host.style.setProperty('--popup-color', '#000');
        }
    }

    function updatePopupPosition(x, y) {
        const offsetX = 20;
        const offsetY = 20;

        let left = x + offsetX;
        let top = y + offsetY;

        const popupRect = popup.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left + popupRect.width > viewportWidth) {
            left = x - popupRect.width - offsetX;
        }
        if (top + popupRect.height > viewportHeight) {
            top = y - popupRect.height - offsetY;
        }

        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }

    document.addEventListener('mousemove', e => {
        lastMouseEvent = e;
        if (popup.style.display === 'block') {
            updatePopupPosition(e.clientX, e.clientY);
        }
    });

    document.addEventListener('mouseover', e => {
        const link = e.target.closest('a[href]');
        if (!link || !link.href.startsWith('https://bustimes.org/trips/')) return;

        currentLink = link;
        clearTimeout(hideTimeout);

        hoverTimeout = setTimeout(() => {
            fetch(link.href)
                .then(res => res.text())
                .then(html => {
                    const doc = new DOMParser().parseFromString(html, 'text/html');
                    const table = doc.querySelector('table');
                    if (!table) return;

                    wrapper.innerHTML = '';

                    [...shadow.querySelectorAll('link[rel="stylesheet"]')].forEach(link => link.remove());

                    const stylesheets = doc.querySelectorAll('link[rel="stylesheet"]');
                    stylesheets.forEach(sheet => {
                        const linkEl = document.createElement('link');
                        linkEl.rel = 'stylesheet';
                        linkEl.href = sheet.href;
                        shadow.appendChild(linkEl);
                    });

                    wrapper.appendChild(table.cloneNode(true));

                    applyPopupTheme();

                    if (lastMouseEvent) {
                        updatePopupPosition(lastMouseEvent.clientX, lastMouseEvent.clientY);
                    }

                    popup.style.display = 'block';
                })
                .catch(err => {
                    console.error('Failed to fetch trip table preview:', err);
                });
        }, SHOW_DELAY);
    });

    document.addEventListener('mouseout', e => {
        if (e.target === currentLink || popup.contains(e.relatedTarget)) {
            clearTimeout(hoverTimeout);
            hideTimeout = setTimeout(() => {
                popup.style.display = 'none';
                wrapper.innerHTML = '';
                [...shadow.querySelectorAll('link[rel="stylesheet"]')].forEach(link => link.remove());
            }, HIDE_DELAY);
        }
    });

    window.addEventListener('scroll', () => {
        popup.style.display = 'none';
        wrapper.innerHTML = '';
        [...shadow.querySelectorAll('link[rel="stylesheet"]')].forEach(link => link.remove());
    });
})();
