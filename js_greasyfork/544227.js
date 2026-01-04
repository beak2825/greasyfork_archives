// ==UserScript==
// @name         Athome.lu Price Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Keeps track of the price of athome.lu housing prices
// @license      MIT
// @author       Filipe Neves (me@filipeneves.net), Brian Tacchi (brian.tacchi@icloud.com)
// @match        https://www.athome.lu/vente/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=athome.lu
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544227/Athomelu%20Price%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/544227/Athomelu%20Price%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const API_BASE = 'https://athome-lu-tracker.red-limit-7cac.workers.dev/api';

    function getPageId() {
        const match = window.location.pathname.match(/\/vente\/[^/]+\/([^/]+\/id-\d+)/i);
        return match ? match[1] : null;
    }

    function getPrice() {
        const xpath = '/html/body/div[1]/div[1]/div/article/div[1]/div[1]/div[1]/div[2]/span[2]/span/span/span';
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const node = result.singleNodeValue;
        if (!node) return null;
        const raw = node.textContent.replace(/[^\d]/g, '');
        return parseInt(raw, 10);
    }

    async function sendPriceData(id, price) {
        try {
            const res = await fetch(`${API_BASE}/record`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, price }),
            });

            const text = await res.text();
            console.log('[Athome Tracker] ✅ Sent:', { id, price, status: res.status, body: text });

            if (!res.ok) {
                console.warn('[Athome Tracker] ❌ Server error', res.status, text);
            }
        } catch (err) {
            console.error('[Athome Tracker] ❌ Network error:', err);
        }
    }

    async function fetchHistory(id) {
        try {
            const res = await fetch(`${API_BASE}/history?id=${encodeURIComponent(id)}`);
            if (!res.ok) throw new Error('Request failed');
            return await res.json();
        } catch (err) {
            console.error('[Athome Tracker] ❌ Failed to fetch history', err);
            return [];
        }
    }

    function injectHistoryGraph(id) {
        const infoBlock = document.querySelector('.info-block');
        if (!infoBlock) {
            console.warn('[Athome Tracker] Could not find .info-block to insert chart after.');
            return;
        }

        // Check if we already injected a graph to avoid duplicates
        if (document.getElementById('price-history-chart')) return;

        // Create characteristics-container + title
        const container = document.createElement('div');
        container.className = 'characteristics-container';

        const title = document.createElement('h2');
        title.className = 'characteristics-main-title';
        title.textContent = 'Price History';
        container.appendChild(title);

        // Create chart wrapper
        const wrapper = document.createElement('div');
        wrapper.style.marginTop = '10px';
        wrapper.style.background = '#ffffff'; // ← white background
        wrapper.style.border = 'none';        // ← remove border
        wrapper.style.borderRadius = '8px';
        wrapper.style.padding = '10px';
        wrapper.style.width = '100%';
        wrapper.style.boxSizing = 'border-box';

        const canvas = document.createElement('canvas');
        canvas.id = 'price-history-chart';
        canvas.style.width = '100%';
        canvas.style.height = '180px';
        wrapper.appendChild(canvas);
        container.appendChild(wrapper);

        // Insert container after .info-block
        infoBlock.parentNode.insertBefore(container, infoBlock.nextSibling);

        // Load Chart.js and render
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
        script.onload = async () => {
            const history = await fetchHistory(id);
            if (!history || !history.length) {
                const note = document.createElement('div');
                note.textContent = 'No price history available.';
                wrapper.appendChild(note);
                return;
            }

            const labels = history.map(e => {
                const d = new Date(e.timestamp);
                return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
            });

            const prices = history.map(e => e.price);

            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels,
                    datasets: [{
                        label: 'Price (€)',
                        data: prices,
                        borderColor: '#e4002b',
                        backgroundColor: 'rgba(0, 150, 136, 0.15)',
                        pointBackgroundColor: '#e4002b',
                        pointBorderColor: '#fff',
                        pointRadius: 3,
                        pointHoverRadius: 5,
                        borderWidth: 2,
                        tension: 0.25
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: '#333',
                            titleColor: '#fff',
                            bodyColor: '#eee',
                            padding: 8,
                            cornerRadius: 4
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                maxTicksLimit: 6,
                                color: '#666',
                                font: { size: 12 },
                                autoSkipPadding: 12
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.03)'
                            }
                        },
                        y: {
                            beginAtZero: false,
                            ticks: {
                                color: '#666',
                                font: { size: 12 },
                                callback: val => val.toLocaleString() + '€'
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.05)'
                            }
                        }
                    }
                }
            });
        };

        document.body.appendChild(script);
    }

    function observePageAndInject() {
        const observer = new MutationObserver(() => {
            const id = getPageId();
            const price = getPrice();
            const infoBlock = document.querySelector('.info-block');

            if (id && price && infoBlock && !document.getElementById('price-history-chart')) {
                sendPriceData(id, price);
                injectHistoryGraph(id);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', () => {
        observePageAndInject();
    });
})();
