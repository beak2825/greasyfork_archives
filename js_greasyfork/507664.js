// ==UserScript==
// @name         Perplexity.ai Limits Overlay (Dark Mode, Draggable)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Overlays various limit values on Perplexity.ai main and search pages, updates on submit
// @match        https://www.perplexity.ai/
// @match        https://www.perplexity.ai/search*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/507664/Perplexityai%20Limits%20Overlay%20%28Dark%20Mode%2C%20Draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507664/Perplexityai%20Limits%20Overlay%20%28Dark%20Mode%2C%20Draggable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ---------------------------
    // Configuration
    // ---------------------------
    const CONFIG = {
        apiEndpoint: 'https://www.perplexity.ai/rest/rate-limit/all',
        triggerEndpoint: '/rest/sse/perplexity_ask',
        checkDelays: [2000, 5000] // Check after 2s and again after 5s to be safe
    };

    let limitsBox = null;

    // ---------------------------
    // Network Interception (The Fix)
    // ---------------------------
    // We run with @grant none, so window.fetch IS the page's fetch.

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        let url = args[0];
        if (url instanceof Request) url = url.url;
        url = url ? url.toString() : '';

        // Hook the specific ASK endpoint
        if (url.includes(CONFIG.triggerEndpoint)) {
            // Trigger updates
            CONFIG.checkDelays.forEach(delay => setTimeout(fetchLimits, delay));
        }

        return originalFetch.apply(this, args);
    };

    // Also hook XHR just in case Perplexity switches methods or uses mixed calls
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._url = url ? url.toString() : '';
        return originalXHROpen.apply(this, arguments);
    };

    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function() {
        if (this._url && this._url.includes(CONFIG.triggerEndpoint)) {
             CONFIG.checkDelays.forEach(delay => setTimeout(fetchLimits, delay));
        }
        return originalXHRSend.apply(this, arguments);
    };

    // ---------------------------
    // Fetch Limits From Server
    // ---------------------------
    async function fetchLimits() {
        try {
            // Add timestamp to prevent caching
            const timestamp = Date.now();
            const response = await originalFetch(`${CONFIG.apiEndpoint}?t=${timestamp}`, {
                credentials: 'include'
            });

            if (response.ok) {
                const data = await response.json();
                updateLimitsUI(data.remaining_pro);
            }
        } catch (error) {
            // Silent catch to avoid console spam
        }
    }

    // ---------------------------
    // UI Creation & Updates
    // ---------------------------
    function initUI() {
        if (document.getElementById('limits-box')) return;

        limitsBox = document.createElement('div');
        limitsBox.id = 'limits-box';
        limitsBox.style.cssText = `
            position: fixed;
            right: 20px;
            top: 20px;
            background-color: rgba(30, 30, 30, 0.95);
            color: #e8e8e8;
            border: 1px solid #444;
            border-radius: 8px;
            padding: 12px 16px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            z-index: 99999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            cursor: grab;
            user-select: none;
            backdrop-filter: blur(5px);
            min-width: 180px;
            transition: transform 0.1s ease;
        `;

        document.body.appendChild(limitsBox);

        // Restore position from localStorage (since we removed GM_)
        const savedY = parseFloat(localStorage.getItem('perplexity_limits_pos_y')) || 20;
        const maxY = window.innerHeight - 100;
        limitsBox.style.transform = `translateY(${Math.min(savedY, maxY)}px)`;

        setupDraggable(limitsBox);
        fetchLimits();
    }

    function updateLimitsUI(value) {
        if (!limitsBox) initUI();

        limitsBox.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 15px;">
                <span style="opacity: 0.8;">Remaining Queries :</span>
                <span style="font-weight: 700; color: #fff; font-size: 15px;">${value ?? '—'}</span>
            </div>
        `;
    }

    // ---------------------------
    // Draggable Logic
    // ---------------------------
    function setupDraggable(element) {
        let isDragging = false;
        let startY = 0;
        let initialTransformY = 0;

        element.addEventListener('mousedown', (e) => {
            isDragging = true;
            element.style.cursor = 'grabbing';
            startY = e.clientY;

            const style = window.getComputedStyle(element);
            const matrix = new WebKitCSSMatrix(style.transform);
            initialTransformY = matrix.m42;

            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const deltaY = e.clientY - startY;
            let newY = initialTransformY + deltaY;

            const maxY = window.innerHeight - element.offsetHeight;
            newY = Math.max(0, Math.min(newY, maxY));

            element.style.transform = `translateY(${newY}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = 'grab';

                const style = window.getComputedStyle(element);
                const matrix = new WebKitCSSMatrix(style.transform);
                // Save to localStorage
                localStorage.setItem('perplexity_limits_pos_y', matrix.m42);
            }
        });
    }

    // ---------------------------
    // Initialization
    // ---------------------------
    const observer = new MutationObserver(() => {
        if (document.body) {
            initUI();
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, { childList: true });

})();