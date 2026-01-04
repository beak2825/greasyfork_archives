// ==UserScript==
// @name         Grok Model Patcher 3.5
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Patches grok.com POST requests to switch between grok-3, grok-2, and grok-3-5 models
// @author       GrokPatcher
// @match        https://grok.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535500/Grok%20Model%20Patcher%2035.user.js
// @updateURL https://update.greasyfork.org/scripts/535500/Grok%20Model%20Patcher%2035.meta.js
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
            <div id="rate_limit_grok3_5" class="text-white mt-1">grok-3-5 Rate Limit: N/A</div>
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
        const grok35Elem = document.getElementById('rate_limit_grok3_5');
        grok3Elem.textContent = limits?.['grok-3']
            ? `grok-3 Rate Limit: ${limits['grok-3'].remainingQueries}/${limits['grok-3'].totalQueries}`
            : 'grok-3 Rate Limit: N/A';
        grok2Elem.textContent = limits?.['grok-2']
            ? `grok-2 Rate Limit: ${limits['grok-2'].remainingQueries}/${limits['grok-2'].totalQueries}`
            : 'grok-2 Rate Limit: N/A';
        grok35Elem.textContent = limits?.['grok-3-5']
            ? `grok-3-5 Rate Limit: ${limits['grok-3-5'].remainingQueries}/${limits['grok-3-5'].totalQueries}`
            : 'grok-3-5 Rate Limit: N/A';
    };
    const fetchRateLimits = async () => {
        try {
            const models = ['grok-3', 'grok-2', 'grok-3-5'];
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
        let currentModel = 'grok-3';
        const isTargetUrl = (url) => {
            return (url.includes('/rest/app-chat/conversations/') && url.endsWith('/responses')) ||
                   url === 'https://grok.com/rest/app-chat/conversations/new';
        };
        const patchFetch = async (input, init) => {
            if (currentModel !== 'grok-3' && init?.method === 'POST' && typeof input === 'string' && isTargetUrl(input)) {
                try {
                    const payload = JSON.parse(init.body);
                    payload.modelName = currentModel;
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
            if (currentModel !== 'grok-3' && this._method === 'POST' && isTargetUrl(this._url)) {
                try {
                    const payload = JSON.parse(body);
                    payload.modelName = currentModel;
                    body = JSON.stringify(payload);
                } catch (error) {
                    alert('Failed to patch XHR request.');
                }
            }
            return originalXhrSend.call(this, body);
        };
        return {
            setModel: async (model) => {
                currentModel = model;
                window.fetch = model === 'grok-3' ? originalFetch : patchFetch;
                XMLHttpRequest.prototype.open = model === 'grok-3' ? originalXhrOpen : patchXhrOpen;
                XMLHttpRequest.prototype.send = model === 'grok-3' ? originalXhrSend : patchXhrSend;
                await fetchRateLimits();
            },
            getModel: () => currentModel
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
            const modelCycle = ['grok-3', 'grok-2', 'grok-3-5'];
            const buttonStyles = {
                'grok-3': { bg: 'bg-blue-600', hover: 'hover:bg-blue-700' },
                'grok-2': { bg: 'bg-red-600', hover: 'hover:bg-red-700' },
                'grok-3-5': { bg: 'bg-green-600', hover: 'hover:bg-green-700' }
            };
            toggleButton.addEventListener('click', async () => {
                try {
                    const currentIndex = modelCycle.indexOf(patcher.getModel());
                    const nextIndex = (currentIndex + 1) % modelCycle.length;
                    const nextModel = modelCycle[nextIndex];
                    await patcher.setModel(nextModel);
                    toggleButton.textContent = `Using ${nextModel}`;
                    Object.values(buttonStyles).forEach(style => {
                        toggleButton.classList.remove(style.bg, style.hover);
                    });
                    toggleButton.classList.add(buttonStyles[nextModel].bg, buttonStyles[nextModel].hover);
                } catch (error) {
                    alert('Failed to toggle model. Please try again.');
                }
            });
            startRateLimitRefresh();
        };
    };
    init();
})();