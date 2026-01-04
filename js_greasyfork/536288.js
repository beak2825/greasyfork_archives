// ==UserScript==
// @name         Zendesk Brand Checker with Shortcut Warning and Ticket Memory
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Automatically extracts brand data from Zendesk API calls, remembers ticket-brand associations, and warns about mismatched shortcuts.
// @author       Swiftlyx
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536288/Zendesk%20Brand%20Checker%20with%20Shortcut%20Warning%20and%20Ticket%20Memory.user.js
// @updateURL https://update.greasyfork.org/scripts/536288/Zendesk%20Brand%20Checker%20with%20Shortcut%20Warning%20and%20Ticket%20Memory.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastUrl = window.location.href;
    let currentBrand = null;
    let currentTicketId = null;
    let ticketBrandCache = {};

    let mutationObserver = null;
    let urlCheckInterval = null;
    let shortcutCheckInterval = null;
    let globalClickHandler = null;
    let lastShortcutCheck = 0;

    try {
        const savedCache = localStorage.getItem('zendeskTicketBrandCache');
        if (savedCache) {
            ticketBrandCache = JSON.parse(savedCache);
        }
    } catch (e) {
        console.error('[Zendesk Script] Error loading cache from localStorage', e);
        ticketBrandCache = {};
    }

    function cleanup() {
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }

        if (globalClickHandler) {
            document.removeEventListener('mousedown', globalClickHandler, true);
            globalClickHandler = null;
        }
    }

    function isTicketPage() {
        return /https:\/\/.*\.zendesk\.com\/agent\/tickets\/\d+/.test(window.location.href);
    }

    function getTicketIdFromUrl() {
        if (!isTicketPage()) return null;
        const match = window.location.href.match(/\/tickets\/(\d+)/);
        return match ? match[1] : null;
    }

    function saveCache() {
        try {
            localStorage.setItem('zendeskTicketBrandCache', JSON.stringify(ticketBrandCache));
        } catch (e) {
             console.error('[Zendesk Script] Failed to save cache', e);
        }
    }

    const companyVariants = {
        'PDFAid': ['pdfaid', 'aid', 'pdf aid'],
        'PDFHouse': ['pdf house', 'house', 'pdfhouse'],
        'Howly': ['howly', 'howly docs', 'howlydocs', 'hdocs'],
    };

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function checkCurrentPage() {
        if (!isTicketPage()) return;

        const ticketId = getTicketIdFromUrl();
        currentTicketId = ticketId;

        if (!ticketId) return;

        if (ticketBrandCache[ticketId]) {
            const cachedBrand = ticketBrandCache[ticketId];
            if (typeof cachedBrand === 'string') {
                currentBrand = cachedBrand;
                updateTicketTimestamp();
                setupShortcutWarnings();
            } else {
                 console.warn('[Zendesk Debug] Cached brand for ticket', ticketId, 'is not a string. Removing from cache.', cachedBrand);
                 delete ticketBrandCache[ticketId];
                 saveCache();
                 currentBrand = null;
            }
        }
    }

    function interceptFetchAndXHR() {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            let requestUrl;
            const input = args[0];

            if (typeof input === 'string') {
                requestUrl = input;
            } else if (input instanceof Request) {
                requestUrl = input.url;
            } else {
                return originalFetch(...args);
            }

            const ticketId = getTicketIdFromUrl();
            if (ticketId && isTicketPage() && requestUrl.includes(`/api/v2/tickets/${ticketId}`) && requestUrl.includes('include=brands')) {
                return originalFetch(...args).then(response => {
                    response.clone().json().then(data => {
                        try {
                            extractBrandData(data);
                        } catch (e) {
                             console.error('[Zendesk Script] Error processing data from fetch', e);
                        }
                    }).catch(() => {});
                    return response;
                });
            }
            return originalFetch(...args);
        };

        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalXHROpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            const ticketId = getTicketIdFromUrl();
            if (ticketId && isTicketPage() && this._url && this._url.includes(`/api/v2/tickets/${ticketId}`) && this._url.includes('include=brands')) {
                this.addEventListener('load', function() {
                    if (this.status >= 200 && this.status < 300) {
                        try {
                            const data = JSON.parse(this.responseText);
                            extractBrandData(data);
                        } catch (e) {}
                    }
                });
            }
            return originalXHRSend.apply(this, arguments);
        };
    }

    function extractBrandData(responseData) {
        const ticketIdOnPage = getTicketIdFromUrl();
        if (!isTicketPage() || !ticketIdOnPage || ticketBrandCache[ticketIdOnPage]) return;

        if (responseData && responseData.brands && responseData.brands.length > 0) {
            const brand = responseData.brands[0];
            const brandName = brand.name;

            if (brandName && typeof brandName === 'string') {
                currentBrand = brandName;
                currentTicketId = ticketIdOnPage;
                ticketBrandCache[currentTicketId] = currentBrand;
                saveCache();
                setupShortcutWarnings();
            } else {
                console.error('[Zendesk Debug] Extracted brand name is not a string. API returned:', brand);
            }
        }
    }

    function getShortcutCompany(shortcutKey) {
        if (!shortcutKey) return null;
        const shortcutText = shortcutKey.toLowerCase();
        if (shortcutText.startsWith('/aid ') || shortcutText === '/aid') return 'PDFAid';
        if (shortcutText.startsWith('/house ') || shortcutText === '/house') return 'PDFHouse';
        if (shortcutText.startsWith('/howly ') || shortcutText === '/howly') return 'Howly';

        for (const company in companyVariants) {
            if (shortcutText.includes(company.toLowerCase())) return company;
            const variants = companyVariants[company];
            for (const variant of variants) {
                if (shortcutText.includes(variant.toLowerCase())) return company;
            }
        }
        return null;
    }

    function getBrandCompany(brandName) {
        if (!brandName || typeof brandName !== 'string') {
            return null;
        }
        const brandLower = brandName.toLowerCase();
        for (const company in companyVariants) {
            if (company.toLowerCase() === brandLower || brandLower.includes(company.toLowerCase())) {
                return company;
            }

            const variants = companyVariants[company];
            for (const variant of variants) {
                if (brandLower.includes(variant.toLowerCase())) {
                    return company;
                }
            }
        }
        return null;
    }

    function showPageNotification(title, message) {
        const existingNotifications = document.querySelectorAll('.zendesk-warning-notification');
        existingNotifications.forEach(n => n.remove());

        const notificationDiv = document.createElement('div');
        notificationDiv.className = 'zendesk-warning-notification';
        notificationDiv.style.cssText = `
            position: fixed; top: 40px; right: 45%; background-color: #fff3cd;
            border: 1px solid #ffeeba; border-left: 4px solid orange; color: #856404;
            padding: 15px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.2);
            z-index: 10000; max-width: 300px;
        `;

        const titleElement = document.createElement('h4');
        titleElement.textContent = title;
        titleElement.style.margin = '0 0 10px 0';
        notificationDiv.appendChild(titleElement);

        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.margin = '0';
        notificationDiv.appendChild(messageElement);

        document.body.appendChild(notificationDiv);

        setTimeout(() => {
            if (document.body.contains(notificationDiv)) {
                document.body.removeChild(notificationDiv);
            }
        }, 5000);
    }

    function setupShortcutWarnings() {
        if (!isTicketPage() || !currentBrand) return;

        if (mutationObserver) {
            mutationObserver.disconnect();
        }

        mutationObserver = new MutationObserver(debounce((mutations) => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    const shortcutLists = document.querySelectorAll('[data-test-id="rich-text-editor-autocomplete-menu-list"]');
                    if (shortcutLists.length > 0) {
                        setTimeout(addShortcutClickHandlers, 100);
                    }
                }
            }
        }, 300));

        mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    function addShortcutClickHandlers() {
        if (!isTicketPage() || !currentBrand) return;

        const now = Date.now();
        if (now - lastShortcutCheck < 500) return;
        lastShortcutCheck = now;

        const currentCompany = getBrandCompany(currentBrand);

        if (!currentCompany) {
            console.warn('[Zendesk Debug] Could not determine the current company. Shortcut check aborted.');
            return;
        }

        const shortcutKeys = document.querySelectorAll('bdi[data-test-id="rich-text-editor-shortcut-key"]');

        shortcutKeys.forEach(shortcutKey => {
            const shortcut = shortcutKey.closest('[data-test-id="rich-text-editor-autocomplete-item"]');
            if (!shortcut) return;

            const shortcutKeyText = shortcutKey.textContent;
            const shortcutCompany = getShortcutCompany(shortcutKeyText);

            if (shortcutCompany && shortcutCompany !== currentCompany) {
                // Visual styling removed, only add title and icon
                shortcut.setAttribute('title', `Warning! This shortcut belongs to ${shortcutCompany}, but you're working with ${currentCompany}`);

                if (!shortcut.querySelector('.warning-icon')) {
                    const warningIcon = document.createElement('span');
                    warningIcon.textContent = ' ⚠️ ';
                    warningIcon.style.color = 'orange';
                    warningIcon.classList.add('warning-icon');
                    shortcutKey.parentNode.insertBefore(warningIcon, shortcutKey.nextSibling);
                }
            } else {
                // Remove title and icon if they match
                shortcut.removeAttribute('title');
                const existingIcon = shortcut.querySelector('.warning-icon');
                if (existingIcon) {
                    existingIcon.remove();
                }
            }
        });

        if (!globalClickHandler) {
            globalClickHandler = function(e) {
                const shortcutElement = e.target.closest('[data-test-id="rich-text-editor-autocomplete-item"]');
                const shortcutKey = shortcutElement ? shortcutElement.querySelector('bdi[data-test-id="rich-text-editor-shortcut-key"]') : null;

                if (shortcutKey) {
                    const shortcutCompany = getShortcutCompany(shortcutKey.textContent);
                    const currentCompany = getBrandCompany(currentBrand);
                    if (shortcutCompany && currentCompany && shortcutCompany !== currentCompany) {
                        showWarningForShortcut(shortcutCompany, currentCompany);
                    }
                }
            };
            document.addEventListener('mousedown', globalClickHandler, true);
        }
    }

    function showWarningForShortcut(shortcutCompany, currentCompany) {
        showPageNotification(
            'Warning: Mismatched Shortcut!',
            `You're using a shortcut for ${shortcutCompany}, but working with ${currentCompany}`
        );
    }

    function cleanupOldCache() {
        const MAX_CACHE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days

        try {
            const now = new Date().getTime();
            let cacheTimestamps = {};
            try {
                const savedTimestamps = localStorage.getItem('zendeskTicketBrandTimestamps');
                if (savedTimestamps) {
                    cacheTimestamps = JSON.parse(savedTimestamps);
                }
            } catch (e) { cacheTimestamps = {}; }

            for (const ticketId in ticketBrandCache) {
                if (!cacheTimestamps[ticketId] || (now - cacheTimestamps[ticketId] > MAX_CACHE_AGE)) {
                    delete ticketBrandCache[ticketId];
                    delete cacheTimestamps[ticketId];
                }
            }

            localStorage.setItem('zendeskTicketBrandCache', JSON.stringify(ticketBrandCache));
            localStorage.setItem('zendeskTicketBrandTimestamps', JSON.stringify(cacheTimestamps));
        } catch (e) {}
    }

    function updateTicketTimestamp() {
        if (!currentTicketId) return;
        try {
            const now = new Date().getTime();
            let cacheTimestamps = {};
            try {
                const savedTimestamps = localStorage.getItem('zendeskTicketBrandTimestamps');
                if (savedTimestamps) {
                    cacheTimestamps = JSON.parse(savedTimestamps);
                }
            } catch (e) { cacheTimestamps = {}; }
            cacheTimestamps[currentTicketId] = now;
            localStorage.setItem('zendeskTicketBrandTimestamps', JSON.stringify(cacheTimestamps));
        } catch (e) {}
    }

    interceptFetchAndXHR();

    function checkUrlChange() {
        if (window.location.href === lastUrl) {
            return;
        }

        lastUrl = window.location.href;
        cleanup();

        currentBrand = null;
        currentTicketId = null;

        const newTicketId = getTicketIdFromUrl();

        if (newTicketId) {
            currentTicketId = newTicketId;

            if (ticketBrandCache[currentTicketId]) {
                const cachedBrand = ticketBrandCache[currentTicketId];
                if (typeof cachedBrand === 'string') {
                    currentBrand = cachedBrand;
                    updateTicketTimestamp();
                    setupShortcutWarnings();
                } else {
                    console.warn('[Zendesk Debug] Corrupted cache for ticket', currentTicketId, '- removing.');
                    delete ticketBrandCache[currentTicketId];
                    saveCache();
                }
            }
        }
    }


    urlCheckInterval = setInterval(checkUrlChange, 500);

    shortcutCheckInterval = setInterval(function() {
        if (isTicketPage() && currentBrand) {
            addShortcutClickHandlers();
        }
    }, 1000);

    setTimeout(function() {
        cleanupOldCache();
        checkCurrentPage(); // Initial check on first load
    }, 2000);

    window.testNotification = function() {
        showPageNotification('Test Notification', 'This is a test notification to verify functionality');
    };

    window.addEventListener('beforeunload', cleanup);

})();

