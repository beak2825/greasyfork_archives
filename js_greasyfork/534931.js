// ==UserScript==
// @name         Grok Model Patcher
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Patches grok.com POST requests to switch between grok-3 and grok-2 models
// @author       GrokPatcher
// @match        https://grok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534931/Grok%20Model%20Patcher.user.js
// @updateURL https://update.greasyfork.org/scripts/534931/Grok%20Model%20Patcher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const generateId = () => Math.random().toString(16).slice(2);
    const createMenu = () => {
        const menu = document.createElement('div');
        menu.id = 'grok-patcher-menu';
        menu.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 10000;
            background: #1f2937;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            cursor: move;
            user-select: none;
        `;
        menu.innerHTML = `
            <div class="mb-2">
                <button id="toggle_model" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full">Using grok-3</button>
            </div>
            <div id="rate_limit_grok3" class="text-white">grok-3 Rate Limit: N/A</div>
            <div id="rate_limit_grok2" class="text-white mt-1">grok-2 Rate Limit: N/A</div>
            <a id="donation_link" class="text-white underline text-sm mt-2 inline-block cursor-pointer">Donate</a>
        `;
        document.body.appendChild(menu);
        makeDraggable(menu);
        return menu;
    };
    const makeDraggable = (element) => {
        let dragging = false;
        let xOffset = 0;
        let yOffset = 0;
        element.addEventListener('mousedown', (e) => {
            dragging = true;
            xOffset = e.clientX - parseInt(element.style.left || '10');
            yOffset = e.clientY - parseInt(element.style.top || '10');
        });
        document.addEventListener('mousemove', (e) => {
            if (dragging) {
                element.style.left = `${e.clientX - xOffset}px`;
                element.style.top = `${e.clientY - yOffset}px`;
            }
        });
        document.addEventListener('mouseup', () => {
            dragging = false;
        });
    };
    const updateRateLimits = (limits) => {
        const grok3Elem = document.getElementById('rate_limit_grok3');
        const grok2Elem = document.getElementById('rate_limit_grok2');
        grok3Elem.textContent = limits?.['grok-3']
            ? `grok-3 Rate Limit: ${limits['grok-3'].remainingQueries}/${limits['grok-3'].totalQueries}`
            : 'grok-3 Rate Limit: N/A';
        grok2Elem.textContent = limits?.['grok-2']
            ? `grok-2 Rate Limit: ${limits['grok-2'].remainingQueries}/${limits['grok-2'].totalQueries}`
            : 'grok-2 Rate Limit: N/A';
    };
    const fetchRateLimits = async () => {
        try {
            const models = ['grok-3', 'grok-2'];
            const limits = {};
            for (const model of models) {
                const response = await fetch('https://grok.com/rest/rate-limits', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Xai-Request-Id': generateId(),
                        'Accept-Language': 'en-US,en;q=0.9',
                        'User-Agent': navigator.userAgent,
                        'Accept': '*/*',
                        'Origin': 'https://grok.com',
                        'Sec-Fetch-Site': 'same-origin',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Dest': 'empty',
                        'Referer': 'https://grok.com/',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Priority': 'u=1, i'
                    },
                    body: JSON.stringify({ requestKind: 'DEFAULT', modelName: model })
                });
                if (!response.ok) throw new Error(`Failed to fetch ${model} rate limits`);
                limits[model] = await response.json();
            }
            updateRateLimits(limits);
            return limits;
        } catch (error) {
            updateRateLimits(null);
            alert('Failed to fetch rate limits. Please try again later.');
        }
    };
    const startRateLimitRefresh = () => {
        fetchRateLimits();
        setInterval(fetchRateLimits, 30000);
    };
    const createPatcher = () => {
        const originalFetch = window.fetch;
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;
        let grok2Active = false;
        const isTargetUrl = (url) => {
            return (url.includes('/rest/app-chat/conversations/') && url.endsWith('/responses')) ||
                   url === 'https://grok.com/rest/app-chat/conversations/new';
        };
        const patchFetch = async (input, init) => {
            if (grok2Active && init?.method === 'POST' && typeof input === 'string' && isTargetUrl(input)) {
                try {
                    const payload = JSON.parse(init.body);
                    payload.modelName = 'grok-2';
                    init.body = JSON.stringify(payload);
                } catch (error) {
                    alert('Failed to patch fetch request.');
                }
            }
            return originalFetch(input, init);
        };
        const patchXhrOpen = function(method, url) {
            this._url = url;
            this._method = method;
            return originalXhrOpen.apply(this, arguments);
        };
        const patchXhrSend = function(body) {
            if (grok2Active && this._method === 'POST' && isTargetUrl(this._url)) {
                try {
                    const payload = JSON.parse(body);
                    payload.modelName = 'grok-2';
                    body = JSON.stringify(payload);
                } catch (error) {
                    alert('Failed to patch XHR request.');
                }
            }
            return originalXhrSend.call(this, body);
        };
        return {
            enable: async () => {
                grok2Active = true;
                window.fetch = patchFetch;
                XMLHttpRequest.prototype.open = patchXhrOpen;
                XMLHttpRequest.prototype.send = patchXhrSend;
                await fetchRateLimits();
            },
            disable: async () => {
                grok2Active = false;
                window.fetch = originalFetch;
                XMLHttpRequest.prototype.open = originalXhrOpen;
                XMLHttpRequest.prototype.send = originalXhrSend;
                await fetchRateLimits();
            },
            isActive: () => grok2Active
        };
    };
    const init = () => {
        const tailwind = document.createElement('script');
        tailwind.src = 'https://cdn.tailwindcss.com';
        tailwind.onerror = () => alert('Failed to load TailwindCSS. Some styles may not work.');
        document.head.appendChild(tailwind);
        const menu = createMenu();
        const patcher = createPatcher();
        tailwind.onload = () => {
            const toggleButton = document.getElementById('toggle_model');
            const donationLink = document.getElementById('donation_link');
            toggleButton.addEventListener('click', async () => {
                try {
                    if (patcher.isActive()) {
                        await patcher.disable();
                        toggleButton.textContent = 'Using grok-3';
                        toggleButton.classList.replace('bg-red-600', 'bg-blue-600');
                        toggleButton.classList.replace('hover:bg-red-700', 'hover:bg-blue-700');
                    } else {
                        await patcher.enable();
                        toggleButton.textContent = 'Using grok-2';
                        toggleButton.classList.replace('bg-blue-600', 'bg-red-600');
                        toggleButton.classList.replace('hover:bg-blue-700', 'hover:bg-red-700');
                    }
                } catch (error) {
                    alert('Failed to toggle model. Please try again.');
                }
            });
            donationLink.addEventListener('click', (e) => {
                e.preventDefault();
                const walletPage = window.open('', '_blank');
                walletPage.document.write(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <title>Donation Wallets</title>
                        <style>
                            body { background: #111827; color: white; padding: 20px; font-family: Arial, sans-serif; }
                            h1 { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
                            p { margin-bottom: 10px; }
                            ul { list-style: disc; padding-left: 20px; }
                            li { margin-bottom: 8px; }
                            code { font-family: monospace; }
                        </style>
                    </head>
                    <body>
                        <h1>Donate to Support Us</h1>
                        <p>Send donations to these wallet addresses:</p>
                        <ul>
                            <li>Bitcoin: <code>bc1q7crku5553xc32fqr4mhugu8jneeuywy4rn5eny</code></li>
                            <li>Ethereum: <code>0x634F663F87DBC3C2938aA95fC6C0eE53CA1bB6a3</code></li>
                            <li>Monero: <code>42nARSjJfk3MWXERnZ7on3DDowKVDn6sC3b35XRtSJM1SSpVN34CC7x5jcMeBeacMrEHuDo24kh1HaYq5BPpG1Fo3UeZtAL</code></li>
                        </ul>
                    </body>
                    </html>
                `);
                walletPage.document.close();
            });
            startRateLimitRefresh();
        };
    };
    init();
})();