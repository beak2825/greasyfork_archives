// ==UserScript==
// @name         Händlerlogo im Deal
// @namespace    https://github.com/9jS2PL5T/mydealz-Haendler-Logo
// @version      1.2.1
// @description  Fügt das Logo des Händlers als Hintergrund in jeden passenden Deal. Entfernt den Namen des Händlers aus dem Titel.
// @author       Flo (https://github.com/9jS2PL5T) (https://www.mydealz.de/profile/Basics0119)
// @license      MIT
// @match        https://www.mydealz.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mydealz.de
// @supportURL   https://github.com/9jS2PL5T/mydealz-Haendler-Logo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522701/H%C3%A4ndlerlogo%20im%20Deal.user.js
// @updateURL https://update.greasyfork.org/scripts/522701/H%C3%A4ndlerlogo%20im%20Deal.meta.js
// ==/UserScript==

// Versions-Änderungen:
// Fix: Button zum Kopieren des Gutscheincodes wird nicht mehrfach in den Deal platziert.
// Fix: Deals mit Button "Rabatt sichern" werden jetzt auch berücksichtigt.

// Add before IIFE
const LOGO_ENABLED_KEY = 'merchantLogoEnabled';
const TITLE_CLEAN_KEY = 'merchantTitleClean';
const MAX_LOGO_VERSION = 5; // Add at top with other constants
const LOGO_CACHE_KEY_PREFIX = 'logo_cache_';
const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 1 month in ms

// Add button style constant
const BUTTON_STYLE = `
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    background: #2c7;
    color: white;
    font-weight: bold;
`;

// Add before IIFE
let buttonContainer; // Add global container reference

// Add at top with other constants
const MERCHANT_PAGE_PATTERN = /^https:\/\/www\.mydealz\.de\/(?:search\/)?(?:deals|gutscheine)\?merchant-id=\d+/;

(function() {
    'use strict';

    // Add toggle states
    let showLogos = localStorage.getItem(LOGO_ENABLED_KEY) !== 'false';
    let cleanTitles = localStorage.getItem(TITLE_CLEAN_KEY) !== 'false';

    // Add clear cache button function
    const addClearButton = () => {
        const clearButton = document.createElement('button');
        clearButton.textContent = 'Cache leeren';
        clearButton.style.cssText = BUTTON_STYLE + 'background: #c22;';
        clearButton.onclick = () => {
            logoCache.clear();
            location.reload();
        };
        buttonContainer.appendChild(clearButton);
    };

    // Add at top with other constants
    const MENU_BUTTON_STYLE = `
        ${BUTTON_STYLE}
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
    `;

    const MENU_CONTAINER_STYLE = `
        position: fixed;
        bottom: 70px;
        right: 20px;
        background: white;
        border-radius: 8px;
        padding: 10px;
        display: none;
        flex-direction: column;
        gap: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 9999;
    `;

    // Update createToggleButtons
    const createToggleButtons = () => {
        // Create menu button
        const menuButton = document.createElement('button');
        menuButton.textContent = '☰';
        menuButton.style.cssText = MENU_BUTTON_STYLE; // <-- Fix: Apply menu button style

        // Create menu container
        const menuContainer = document.createElement('div');
        menuContainer.style.cssText = MENU_CONTAINER_STYLE;

        // Create menu buttons
        const logoButton = document.createElement('button');
        const titleButton = document.createElement('button');
        const clearButton = document.createElement('button');

        [logoButton, titleButton, clearButton].forEach(btn => {
            btn.style.cssText = BUTTON_STYLE;
        });

        // Setup buttons
        logoButton.textContent = `Logos: ${showLogos ? 'An' : 'Aus'}`;
        titleButton.textContent = `Händler: ${cleanTitles ? 'Aus' : 'An'}`;
        clearButton.textContent = 'Cache leeren';
        clearButton.style.background = '#c22';

        // Add button logic
        menuButton.onclick = () => {
            const isVisible = menuContainer.style.display === 'flex';
            menuContainer.style.display = isVisible ? 'none' : 'flex';
        };

        logoButton.onclick = () => {
            showLogos = !showLogos;
            localStorage.setItem(LOGO_ENABLED_KEY, showLogos);
            logoButton.textContent = `Logos: ${showLogos ? 'An' : 'Aus'}`;
            logoButton.style.background = showLogos ? '#2c7' : '#777';

            document.querySelectorAll('.merchant-logo-bg').forEach(logo => {
                logo.style.display = showLogos ? 'block' : 'none';
            });

            if (showLogos) {
                processDeals();
            }
        };

        titleButton.onclick = () => {
            cleanTitles = !cleanTitles;
            localStorage.setItem(TITLE_CLEAN_KEY, cleanTitles);
            titleButton.textContent = `Händler: ${cleanTitles ? 'Aus' : 'An'}`;
            titleButton.style.background = cleanTitles ? '#2c7' : '#777';

            // ...existing title button logic...
        };

        clearButton.onclick = () => {
            logoCache.clear();
            location.reload();
        };

        // Add buttons to menu
        menuContainer.appendChild(logoButton);
        menuContainer.appendChild(titleButton);
        menuContainer.appendChild(clearButton);

        // Add menu to page
        document.body.appendChild(menuButton);
        document.body.appendChild(menuContainer);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuContainer.contains(e.target) && e.target !== menuButton) {
                menuContainer.style.display = 'none';
            }
        });
    };

    // Add initialization function
    const initializeDeals = () => {
        document.querySelectorAll([
            'article.thread--deal',
            'article.thread--voucher'
        ].join(', ')).forEach(deal => {
            const merchantLink = deal.querySelector('a[data-t="merchantLink"]');
            const titleLink = deal.querySelector('.thread-title .thread-link');

            if (merchantLink && titleLink) {
                const merchantName = merchantLink.textContent.trim();

                // Store original title if not already stored
                if (!deal.hasAttribute('data-original-title')) {
                    deal.setAttribute('data-original-title', titleLink.textContent);
                }

                const originalTitle = deal.getAttribute('data-original-title');

                if (originalTitle && cleanTitles) {
                    // Enhanced pattern to handle all cases
                    const newTitle = cleanMerchantFromTitle(originalTitle, merchantName);

                    titleLink.textContent = newTitle;
                }
            }
        });
    };

    // Constants
    const PROCESSED_ATTR = 'data-bg-processed';

    // Extract merchant ID from deal
    const getMerchantId = (dealElement) => {
        try {
            // Find merchant link with all possible patterns
            const merchantLink = dealElement.querySelector([
                'a[href*="deals?merchant-id="]',
                'a[href*="gutscheine?merchant-id="]',
                'a[href*="search/gutscheine?merchant-id="]'
            ].join(', '));

            if (!merchantLink) return null;

            // Extract ID from URL pattern
            const match = merchantLink.href.match(/merchant-id=(\d+)/);
            return match ? match[1] : null;
        } catch (error) {
            console.debug('[Merchant BG] Error extracting merchant ID:', error);
            return null;
        }
    };

    // Build logo URL for merchant
    const getLogoUrl = (merchantId, version = 1, highRes = true) => {
        const size = highRes ? '280x280' : '140x140';
        return `https://static.mydealz.de/merchants/raw/avatar/${merchantId}_${version}/re/${size}/qt/70/${merchantId}_${version}.jpg`;
    };

    const checkLogoExists = async (url) => {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) {
                if (url.includes('280x280')) {
                    // Try fallback resolution
                    const fallbackUrl = url.replace('280x280', '140x140');
                    console.debug('[Logo] Trying fallback:', fallbackUrl);
                    const fallbackResponse = await fetch(fallbackUrl, { method: 'HEAD' });
                    return {
                        exists: fallbackResponse.ok,
                        url: fallbackResponse.ok ? fallbackUrl : null
                    };
                }
                return { exists: false, url: null };
            }
            return { exists: true, url };
        } catch (error) {
            return { exists: false, url: null };
        }
    };

    // Add cache management
    const logoCache = {
        set: (merchantId, data) => {
            try {
                localStorage.setItem(`${LOGO_CACHE_KEY_PREFIX}${merchantId}`, JSON.stringify({
                    ...data,
                    timestamp: Date.now()
                }));
            } catch (e) {
                console.debug('[Logo Cache] Storage failed:', e);
            }
        },

        get: (merchantId) => {
            try {
                const data = localStorage.getItem(`${LOGO_CACHE_KEY_PREFIX}${merchantId}`);
                if (!data) return null;

                const parsed = JSON.parse(data);
                // Check for newer version if expired
                if (Date.now() - parsed.timestamp > CACHE_EXPIRY) {
                    // Don't remove cache, instead check for newer version
                    console.debug(`[Logo Cache] Entry expired for ${merchantId}, checking newer version`);
                    return {
                        ...parsed,
                        expired: true
                    };
                }
                return parsed;
            } catch (e) {
                console.debug('[Logo Cache] Read failed:', e);
                return null;
            }
        },

        clear: () => {
            try {
                Object.keys(localStorage)
                    .filter(key => key.startsWith(LOGO_CACHE_KEY_PREFIX))
                    .forEach(key => localStorage.removeItem(key));
            } catch (e) {
                console.debug('[Logo Cache] Clear failed:', e);
            }
        }
    };

    // Throttle requests
    const queue = []; // Removed TypeScript type
    let processing = false;

    const findLatestLogoVersion = async function(merchantId) {
        try {
            let version = 1;
            let latestVersion = null;

            while (version <= MAX_LOGO_VERSION) {
                const url = getLogoUrl(merchantId, version, true);

                const response = await fetch(url, { method: 'HEAD' });
                if (!response.ok) {
                    break;
                }

                latestVersion = { version, url };

                if (version === MAX_LOGO_VERSION) {
                    break;
                }
                version++;
            }

            return latestVersion;
        } catch (error) {
            console.error(`[Logo] [${merchantId}] Error:`, error);
            return null;
        }
    };

    const processQueue = async () => {
        if (processing || queue.length === 0) return;
        processing = true;

        try {
            const deal = queue.shift();
            if (!deal) return;

            const merchantId = getMerchantId(deal);
            if (!merchantId) return;

            // Check cache
            const cached = logoCache.get(merchantId);
            if (cached?.url) {
                // Check if version update needed (>1 month old)
                if (Date.now() - cached.timestamp > CACHE_EXPIRY) {
                    const nextVersion = cached.version + 1;
                    // Try next version without MAX_LOGO_VERSION limit
                    const url = getLogoUrl(merchantId, nextVersion, true);
                    const {exists} = await checkLogoExists(url);

                    if (exists) {
                        console.debug(`[Logo Cache] Upgraded ${merchantId} to v${nextVersion}`);
                        logoCache.set(merchantId, { url, version: nextVersion });
                        applyLogo(deal, url);
                        return;
                    }
                    // No newer version - refresh timestamp
                    console.debug(`[Logo Cache] Keeping ${merchantId} at v${cached.version}`);
                    logoCache.set(merchantId, cached);
                }
                // Use cached version
                applyLogo(deal, cached.url);
                return;
            }

            // No cache - find latest version
            const latestVersion = await findLatestLogoVersion(merchantId);
            if (!latestVersion) return;

            logoCache.set(merchantId, {
                url: latestVersion.url,
                version: latestVersion.version
            });
            applyLogo(deal, latestVersion.url);

        } catch (error) {
            console.error('Error processing queue:', error);
        } finally {
            processing = false;
            if (queue.length > 0) {
                void processQueue();
            }
        }
    };

    const applyLogo = (deal, logoUrl) => {
        if (!logoUrl || !deal || deal.querySelector('.merchant-logo-bg')) return;

        // Set deal content styles
        deal.style.position = 'relative';
        deal.style.overflow = 'hidden';

        // Create and style logo container
        const container = document.createElement('div');
        container.classList.add('merchant-logo-bg'); // Add class for tracking
        container.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            background-image: url("${logoUrl}");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 50%;
            opacity: 0.25;
            pointer-events: none;
            z-index: 0;
        `;

        deal.insertBefore(container, deal.firstChild);
        deal.setAttribute(PROCESSED_ATTR, 'true');
    };

    // Add type safety
    const shouldCleanTitle = (title, merchantName) => {
        // Include partial matches within brackets/parentheses
        const patterns = [
            // Full merchant name
            new RegExp(`\\s*\\(${merchantName}\\)\\s*$`, 'i'),
            new RegExp(`^\\(${merchantName}\\)\\s*`, 'i'),
            new RegExp(`\\s*\\[${merchantName}\\]\\s*$`, 'i'),
            new RegExp(`^\\[${merchantName}\\]\\s*`, 'i'),
            // Merchant name with additional content in brackets
            new RegExp(`\\[(.*\\s)?${merchantName}(\\s.*)?\\]`, 'i'),
            new RegExp(`\\((.*\\s)?${merchantName}(\\s.*)?\\)`, 'i'),
            // Plain merchant name
            new RegExp(`\\s*[-–|]?\\s*${merchantName}\\s*$`, 'i'),
            new RegExp(`^${merchantName}\\s*[-–|]?\\s*`, 'i')
        ];
        return patterns.some(pattern => pattern.test(title));
    };

    const cleanMerchantFromTitle = (title, merchantName) => {
        let cleanTitle = title;

        // Check for merchant name alone in brackets/parentheses
        const soloPatterns = [
            new RegExp(`^\\[${merchantName}\\]\\s*`, 'i'),
            new RegExp(`^\\(${merchantName}\\)\\s*`, 'i')
        ];

        // If merchant name is alone in brackets, remove entire bracket section
        if (soloPatterns.some(pattern => pattern.test(title))) {
            cleanTitle = cleanTitle
                .replace(new RegExp(`^\\[${merchantName}\\]\\s*`, 'i'), '')
                .replace(new RegExp(`^\\(${merchantName}\\)\\s*`, 'i'), '');
        } else {
            // Otherwise handle mixed content in brackets
            cleanTitle = cleanTitle
            // Handle merchant name within brackets
                .replace(new RegExp(`\\[(.*\\s)?${merchantName}(\\s+)(.+?)\\]`, 'i'), '[$3]')
                .replace(new RegExp(`\\[${merchantName}(\\s+)(.+?)\\]`, 'i'), '[$2]')
                .replace(new RegExp(`\\[(.+?)(\\s+)${merchantName}\\]`, 'i'), '[$1]')
            // Handle merchant name within parentheses
                .replace(new RegExp(`\\((.*\\s)?${merchantName}(\\s+)(.+?)\\)`, 'i'), '($3)')
                .replace(new RegExp(`\\(${merchantName}(\\s+)(.+?)\\)`, 'i'), '($2)')
                .replace(new RegExp(`\\((.+?)(\\s+)${merchantName}\\)`, 'i'), '($1)')
            // Handle standalone merchant name
                .replace(new RegExp(`\\s*[-–|]?\\s*${merchantName}\\s*$`, 'i'), '')
                .replace(new RegExp(`^${merchantName}\\s*[-–|]?\\s*`, 'i'), '');
        }

        return cleanTitle
            .replace(/^\s*[:]\s*/, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const processDeal = (deal) => {
        if (!deal || deal.hasAttribute(PROCESSED_ATTR)) return;

        if (cleanTitles) {
            const merchantLink = deal.querySelector('a[data-t="merchantLink"]');
            const titleLink = deal.querySelector('.thread-title .thread-link');

            if (merchantLink && titleLink) {
                const merchantName = merchantLink.textContent.trim();
                const title = titleLink.textContent;

                // Only store if title contains merchant name
                if (shouldCleanTitle(title, merchantName) && !deal.hasAttribute('data-original-title')) {
                    deal.setAttribute('data-original-title', title);
                }

                if (deal.hasAttribute('data-original-title')) {
                    const cleanTitle = cleanMerchantFromTitle(title, merchantName);

                    titleLink.textContent = cleanTitle;
                }
            }
        }

        // Don't show logos on merchant pages
        if (showLogos && !window.location.href.match(MERCHANT_PAGE_PATTERN)) {
            queue.push(deal);
            void processQueue();
        }

        // Find footer elements
        const footerMeta = deal.querySelector('.footerMeta-actionSlot');
        const voucherInput = deal.querySelector('.js-voucherCode input');
        const commentsButton = footerMeta?.querySelector('a[data-t="commentsLink"]');

        // Handle voucher code if exists
        if (footerMeta && voucherInput && commentsButton) {
            // Add margin to comments button
            commentsButton.classList.add('space--mr-1');

            // Hide original voucher container
            const voucherContainer = voucherInput.closest('.width--fromW2-6');
            if (voucherContainer) {
                voucherContainer.style.display = 'none';
            }

            // Hide empty voucher container and parent
            const emptyContainer = deal.querySelector('.flex--fromW2.boxAlign-ai--all-c.flex--dir-row-reverse');
            if (emptyContainer) {
                emptyContainer.style.display = 'none';
            }

            // Get deal or rebate button - expanded selector
            const actionButton = deal.querySelector('.width--fromW2-6 a[data-t="dealLink"], .width--fromW2-6 a[data-t="redeemLink"]')?.closest('.width--fromW2-6');
            if (actionButton) {
                actionButton.style.display = 'none';
            }

            // Remove any existing copy buttons first
            footerMeta.querySelectorAll('.button--code').forEach(btn => btn.remove());

            // Create single copy button container
            const copyButtonContainer = document.createElement('div');
            copyButtonContainer.style.cssText = `
                height: 36px;
                display: flex;
                align-items: center;
            `;

            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'button button--type-primary button--shape-circle button--size-m button--code flex--shrink-0 space--mr-1 button--mode-brand';
            copyButton.innerHTML = `
                <span data-t="copyVoucherCode" data-t-click="">
                    <svg width="19px" height="22px" class="icon icon--duplicate">
                        <use xlink:href="/assets/img/ico_c6302.svg#duplicate"></use>
                    </svg>
                </span>
            `;

            // Add copy functionality
            const codeValue = voucherInput.value;
            copyButton.onclick = (e) => {
                navigator.clipboard.writeText(codeValue);

                const feedback = document.createElement('div');
                feedback.style.cssText = `
                    position: fixed;
                    left: ${e.clientX}px;
                    top: ${e.clientY - 60}px;
                    transform: translateX(-50%);
                    background: white;
                    color: black;
                    padding: 12px 24px;
                    border-radius: 4px;
                    font-size: 14px;
                    white-space: pre-line;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 100000;
                    animation: fadeIn 0.2s ease-in-out;
                `;

                // Add keyframes for fade-in
                const style = document.createElement('style');
                style.textContent = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translate(-50%, 10px); }
                        to { opacity: 1; transform: translate(-50%, 0); }
                    }
                `;
                document.head.appendChild(style);

                feedback.textContent = `Code "${codeValue}"\nin Zwischenablage kopiert`;
                document.body.appendChild(feedback);

                setTimeout(() => {
                    feedback.style.animation = 'fadeOut 0.2s ease-in-out forwards';
                    setTimeout(() => feedback.remove(), 200);
                }, 1800);
            };

            // Add button to container
            copyButtonContainer.appendChild(copyButton);

            // Insert container instead of button directly
            footerMeta.appendChild(copyButtonContainer);

            // Move action button after copy button container
            if (actionButton) {
                footerMeta.appendChild(actionButton);
                actionButton.style.display = 'block';
            }
        }
    };

    // Debounce observer callback
    const debounce = (fn, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn(...args), delay);
        };
    };

    // Create debounced processDeals
    const debouncedProcessDeals = debounce(() => {
        document.querySelectorAll([
            'article.thread--deal:not([data-bg-processed])',
            'article.thread--voucher:not([data-bg-processed])'
        ].join(', '))
            .forEach(element => {
            if (element instanceof HTMLElement && !element.querySelector('.merchant-logo-bg')) {
                processDeal(element);
            }
        });
    }, 250);

    // Update observer
    const observer = new MutationObserver(debouncedProcessDeals);

    // Add error handling
    const processDeals = () => {
        try {
            document.querySelectorAll([
                'article.thread--deal:not([data-bg-processed])',
                'article.thread--voucher:not([data-bg-processed])'
            ].join(', '))
                .forEach((element) => {
                if (element instanceof HTMLElement) {
                    processDeal(element);
                }
            });
        } catch (error) {
            console.error('Error processing deals:', error);
        }
    };

    // Add cleanup
    // Start observing with disconnect handling
    try {
        createToggleButtons();
        initializeDeals();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial processing
        processDeals();
    } catch (error) {
        console.error('Error setting up observer:', error);
        observer.disconnect();
    }

    // Add at bottom of IIFE before closing
    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

})();