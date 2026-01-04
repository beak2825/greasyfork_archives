// ==UserScript==
// @name         Grok Model Switcher
// @description  Allows switching between Grok-3 and Grok-2 models on grok.com by patching POST requests, with a header UI for model selection and rate limit display.
// @author       James007
// @namespace    https://greasyfork.org/users/1463345-james007
// @version      1.6
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @license      MIT
// @grant        none
// @run-at       document-end
// @homepageURL  https://greasyfork.org/scripts/your-script-id
// @supportURL   https://greasyfork.org/scripts/your-script-id/feedback
// @downloadURL https://update.greasyfork.org/scripts/534988/Grok%20Model%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/534988/Grok%20Model%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const generateId = () => Math.random().toString(16).slice(2);

    const createMenu = () => {
        const menu = document.createElement('div');
        menu.id = 'grok-switcher-menu';
        menu.className = 'flex flex-row items-center gap-2';
        menu.innerHTML = `
            <div class="flex flex-col">
                <div id="rate_limit_grok3" class="text-gray-400 text-xs">grok-3: N/A</div>
                <div id="rate_limit_grok2" class="text-gray-400 text-xs">grok-2: N/A</div>
            </div>
            <button id="toggle_model" class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-colors duration-100 bg-blue-600 hover:bg-blue-700 text-white h-8 px-3 rounded-full">Using grok-3</button>
        `;
        return menu;
    };

    const insertMenu = () => {
        const headerContainer = document.querySelector('.absolute.flex.flex-row.items-center.gap-0\\.5.ml-auto.end-3');
        if (headerContainer) {
            const menu = createMenu();
            headerContainer.insertBefore(menu, headerContainer.firstChild);
            return menu;
        } else {
            console.error('Header container not found, retrying...');
            return null;
        }
    };

    const waitForHeader = (callback) => {
        const maxAttempts = 20;
        let attempts = 0;

        const tryInsert = () => {
            const menu = insertMenu();
            if (menu) {
                callback(menu);
            } else if (attempts < maxAttempts) {
                attempts++;
                setTimeout(tryInsert, 500); // Retry every 500ms
            } else {
                console.error('Failed to find header container after max attempts, falling back to body');
                const menu = createMenu();
                document.body.appendChild(menu);
                callback(menu);
            }
        };

        tryInsert();
    };

    const updateRateLimits = (limits) => {
        const grok3Elem = document.getElementById('rate_limit_grok3');
        const grok2Elem = document.getElementById('rate_limit_grok2');
        grok3Elem.textContent = limits?.['grok-3']
            ? `grok-3: ${limits['grok-3'].remainingQueries}/${limits['grok-3'].totalQueries}`
            : 'grok-3: N/A';
        grok2Elem.textContent = limits?.['grok-2']
            ? `grok-2: ${limits['grok-2'].remainingQueries}/${limits['grok-2'].totalQueries}`
            : 'grok-2: N/A';
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

        const patcher = createPatcher();

        const setupMenu = (menu) => {
            const toggleButton = document.getElementById('toggle_model');
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
            startRateLimitRefresh();
        };

        tailwind.onload = () => {
            if (document.readyState === 'complete' || document.readyState === 'interactive') {
                waitForHeader(setupMenu);
            } else {
                document.addEventListener('DOMContentLoaded', () => waitForHeader(setupMenu));
            }
        };
    };

    init();
})();