// ==UserScript==
// @name         NHentai - Infinite Scroll & Enhanced Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Dynamically loads more comics as you scroll, blocks extra ads, pop-up video ads, and unwanted new tab redirects.
// @author       Hentiedup (original), [Snow2122] (adaptation)
// @license      MIT
// @match        https://nhentai.net/*
// @match        *://*/* // Added broader match for universal ad blocking features
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        GM_getValue
// @grant        GM_addStyle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/532733/NHentai%20-%20Infinite%20Scroll%20%20Enhanced%20Ad%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/532733/NHentai%20-%20Infinite%20Scroll%20%20Enhanced%20Ad%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- NHENTAI SPECIFIC SETTINGS ---
    // These features are on by default. You can manually set them to false in your
    // UserScript manager (e.g., Tampermonkey) if you need to disable them.
    const infinite_load = GM_getValue("infinite_load", true);
    const block_extra_ads_nhentai_specific = GM_getValue("block_extra_ads", true); // Renamed to avoid conflict

    // --- GLOBAL VARIABLES ---
    let infinite_load_isLoadingNextPage = false;

    // --- AD BLOCKER CONFIGURATION ---
    // A list of common ad-related CSS selectors to hide or remove.
    // This list is based on common patterns found in advertising elements.
    const adSelectors = [
        // Generic ad containers
        '.ad', '.ads', '.advert', '.ad-container', '.banner-ad', '.google-ad',
        '.top-ad', '.bottom-ad', '.sidebar-ad', '.popup-ad',
        // Common element IDs
        '#ad', '#ads', '#advertisement', '#banner', '#google_ads_iframe',
        // Elements commonly used by ad networks or for injecting ads
        'iframe[src*="adserver"]', 'iframe[src*="doubleclick.net"]',
        'iframe[src*="googlesyndication.com"]', 'iframe[src*="adnxs.com"]',
        'iframe[src*="taboola.com"]', 'iframe[src*="outbrain.com"]',
        'iframe[src*="mgid.com"]', 'iframe[src*="monetize"]',
        'div[id*="ad_"]', 'div[class*="ad_"]',
        'div[id*="banner"]', 'div[class*="banner"]',
        'div[id*="advert"]', 'div[class*="advert"]',
        'div[data-google-query-id]', // Google AdSense specific
        // Elements often associated with "suggested content" or native ads
        '.native-ad', '.recommended-content', '.sponsored-content',
        // Pop-up related
        '.modal-backdrop', '.ad-popup-overlay', '.no-scroll',
        'body.adblock-active', // Some sites add this class when detecting adblock
        'div[style*="z-index: 99999"]', // Common for pop-ups
        'div[style*="position: fixed"]', // Common for sticky ads/pop-ups

        // --- Selectors specifically for video ads ---
        'video', // Directly target video tags
        'div[class*="video-ad"]', 'div[id*="video-ad"]', // Common video ad containers
        'div[class*="video-overlay"]', 'div[id*="video-overlay"]', // Overlays often used for video pop-ups
        'div[class*="video-player-ad"]', 'div[id*="video-player-ad"]', // More specific video player ad identifiers
        'iframe[src*="videoplaza.tv"]', // Known video ad server
        'iframe[src*="adform.net"]',   // Known video ad server
    ];

    // CSS rules to hide elements immediately. This is injected via GM_addStyle.
    // Using !important to try and override inline styles.
    const hideCss = adSelectors.join(', ') + ' { display: none !important; visibility: hidden !important; }';

    // Anti-adblock detection circumvention attempts.
    // These are common variables or functions websites might check.
    const antiAdblockDefeaters = {
        // Common global variables checked by adblock detection scripts
        'AdBlock': false,
        'adblock': false,
        'blockAdblock': false,
        '_AdBlock_': false,
        'canRunAds': true, // Some scripts check this
        // Overriding common detection functions/properties
        'checkAdblock': () => false,
        'isAdblockActive': false,
    };

    // Blacklist for unwanted pop-up/redirect URLs
    const popupRedirectBlacklist = [
        'doubleclick.net', 'googlesyndication.com', 'adserver', 'popads.net',
        'onclickads.net', 'admaven.com', 'redirect.', 'trafficjunky.net',
        'exoclick.com', 'propellerads.com', 'adsterra.com', 'mgid.com',
        'popunder.', 'popcash.net', 'cpm-gate.com', 'adclick', 'ad-track'
    ];


    // --- NHENTAI SPECIFIC FUNCTIONS ---

    /**
     * Adds CSS to hide specific ad elements in the navigation bar for NHentai.
     */
    function addExtraAdBlockingStylesheets() {
        if (block_extra_ads_nhentai_specific) {
            GM_addStyle(`
                /* Hides the 'Porn Z' and similar ad links in the header menu */
                nav ul.menu.left > li:has(a[href^="//tsyndicate.com"]) {
                    display: none;
                }
            `);
        }
    }

    /**
     * Adds CSS for the loading spinner animation used by the infinite scroll.
     */
    function addInfiniteLoadStylesheets() {
        if (infinite_load) {
            GM_addStyle(`
                #NHI_loader_icon {
                    height: 355px;
                    line-height: 355px;
                    width: 100%;
                    text-align: center;
                }
                #NHI_loader_icon > div {
                    display: inline-flex;
                }
                .loader {
                    color: #ed2553;
                    font-size: 10px;
                    width: 1em;
                    height: 1em;
                    border-radius: 50%;
                    position: relative;
                    text-indent: -9999em;
                    animation: mulShdSpin 1.3s infinite linear;
                    transform: translateZ(0);
                }
                @keyframes mulShdSpin {
                    0%, 100% {
                        box-shadow: 0 -3em 0 0.2em, 2em -2em 0 0em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 0;
                    }
                    12.5% {
                        box-shadow: 0 -3em 0 0, 2em -2em 0 0.2em, 3em 0 0 0, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
                    }
                    25% {
                        box-shadow: 0 -3em 0 -0.5em, 2em -2em 0 0, 3em 0 0 0.2em, 2em 2em 0 0, 0 3em 0 -1em, -2em 2em 0 -1em, -3em 0 0 -1em, -2em -2em 0 -1em;
                    }
                    37.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 0, 2em 2em 0 0.2em, 0 3em 0 0em, -2em 2em 0 -1em, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    50% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 0em, 0 3em 0 0.2em, -2em 2em 0 0, -3em 0em 0 -1em, -2em -2em 0 -1em;
                    }
                    62.5% {
                        box-shadow: 0 -3em 0 -1em, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 0, -2em 2em 0 0.2em, -3em 0 0 0, -2em -2em 0 -1em;
                    }
                    75% {
                        box-shadow: 0em -3em 0 -1em, 2em -2em 0 -1em, 3em 0em 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0.2em, -2em -2em 0 0;
                    }
                    87.5% {
                        box-shadow: 0em -3em 0 0, 2em -2em 0 -1em, 3em 0 0 -1em, 2em 2em 0 -1em, 0 3em 0 -1em, -2em 2em 0 0, -3em 0em 0 0, -2em -2em 0 0.2em;
                    }
                }
            `);
        }
    }

    /**
     * Applies the necessary CSS styles for both NHentai and universal ad blocking.
     */
    function applyStylesheets() {
        addExtraAdBlockingStylesheets(); // NHentai specific ads
        addInfiniteLoadStylesheets(); // NHentai infinite scroll loader
        injectHideCss(); // Universal ad blocker CSS
    }

    /**
     * Initializes the infinite scroll functionality for NHentai.
     * Sets up scroll listeners and determines the URLs for fetching subsequent pages.
     */
    function infiniteLoadHandling() {
        if (!infinite_load) return;

        const paginator = $(".pagination");
        // Only run if a paginator exists on the page
        if (paginator?.length && window.location.pathname !== "/favorites/") {
            const lastPageNum = Number.parseInt(paginator.find(".last").attr("href")?.split("page=")[1] || '1');
            // Build the base URL for fetching pages, removing any existing page parameter
            const queryWithNoPage = window.location.search.replace(/[\?\&]page=\d+/, "").replace(/^\&/, "?");
            const finalUrlWithoutPageNum = `${window.location.pathname + queryWithNoPage + (queryWithNoPage.length ? "&" : "?")}page=`;

            // Add scroll event listener to trigger loading new pages
            $(window).scroll(() => {
                if ($(window).scrollTop() + (window.visualViewport?.height || $(window).height()) >= $(document).height() - 500) {
                    const loadingPageNum = Number.parseInt($(".pagination > .page.current:last").attr("href")?.split("page=")[1] || '1') + 1;
                    tryLoadInNextPageComics(loadingPageNum, lastPageNum, finalUrlWithoutPageNum);
                }
            });

            // If the initial page content is not tall enough to have a scrollbar,
            // keep loading pages until it does or until the last page is reached.
            const autoLoadWhileScrollNotAvailableInterval = setInterval(() => {
                const loadingPageNum = Number.parseInt($(".pagination > .page.current:last").attr("href")?.split("page=")[1] || '1') + 1;
                if (loadingPageNum > lastPageNum) {
                    clearInterval(autoLoadWhileScrollNotAvailableInterval);
                    return;
                }

                const doc = document.documentElement;
                if (doc.scrollHeight <= doc.clientHeight) {
                    tryLoadInNextPageComics(loadingPageNum, lastPageNum, finalUrlWithoutPageNum);
                } else {
                    clearInterval(autoLoadWhileScrollNotAvailableInterval);
                }
            }, 200);
        }
    }

    /**
     * Fetches and appends comics from the next page.
     * @param {number} pageNumToLoad The page number to fetch.
     * @param {number} lastPageNum The last available page number.
     * @param {string} fetchUrlWithoutPageNum The base URL for fetching.
     * @param {number} retryNum Current retry attempt number.
     * @param {number} maxFetchAttempts Maximum number of retries.
     */
    function tryLoadInNextPageComics(pageNumToLoad, lastPageNum, fetchUrlWithoutPageNum, retryNum = 0, maxFetchAttempts = 5) {
        if (retryNum === 0 && infinite_load_isLoadingNextPage) return;
        if (pageNumToLoad > lastPageNum) return;

        infinite_load_isLoadingNextPage = true;

        // Add the loading spinner to the UI
        if ($("#NHI_loader_icon").length === 0) {
             $(".container.index-container:not(.advertisement, .index-popular)").first().append('<div id="NHI_loader_icon" class="gallery"><div><span class="loader"></span></div></div>');
        }

        $.get({
            url: fetchUrlWithoutPageNum + pageNumToLoad,
            dataType: "html"
        }, (data) => {
            const galleryContainer = $(".container.index-container:not(.advertisement, .index-popular)").first();

            // Process each comic gallery found on the fetched page
            $(data).find("div.gallery").each((i, el) => {
                const $el = $(el);
                // If comic is already on the page, skip it
                if ($(`.cover[href='${$el.find(".cover").attr("href")}']`, galleryContainer).length > 0) return;

                // The thumbnail lazy-loads, so we must set the 'src' from 'data-src'
                $el.find("img").attr("src", $el.find("img").attr("data-src"));
                galleryContainer.append($el);
            });

            // Update the paginator to show the newly loaded page as "current"
            const paginatorItem = $(`.pagination > .page[href$='page=${pageNumToLoad}']`);
            if (paginatorItem?.length) {
                paginatorItem.addClass("current");
            } else {
                $(".pagination > .next").before(`<a href="${fetchUrlWithoutPageNum}${pageNumToLoad}" class="page current">${pageNumToLoad}</a>`);
            }

            $("#NHI_loader_icon").remove();
            infinite_load_isLoadingNextPage = false;

        }).fail((jqXHR, textStatus, errorThrown) => {
            if (retryNum < maxFetchAttempts) {
                console.log(`NHI: Infinite load - Failed loading page ${pageNumToLoad} - Retrying... (${retryNum + 1})`);
                setTimeout(() => {
                     tryLoadInNextPageComics(pageNumToLoad, lastPageNum, fetchUrlWithoutPageNum, retryNum + 1, maxFetchAttempts);
                }, 1000); // Wait 1 second before retrying
            } else {
                $("#NHI_loader_icon").remove();
                console.log(`NHI: Infinite load - Failed loading page ${pageNumToLoad} - Giving up after ${maxFetchAttempts} retries.`);
                infinite_load_isLoadingNextPage = false;
            }
        });
    }

    // --- UNIVERSAL AD BLOCKER FUNCTIONS ---

    /**
     * Injects CSS rules into the document head to hide ad elements using GM_addStyle.
     */
    function injectHideCss() {
        GM_addStyle(hideCss);
        console.log('[Universal Ad Blocker] Injected CSS to hide ads.');
    }

    /**
     * Attempts to apply anti-adblock detection circumvention.
     * This tries to make the browser appear as if no ad blocker is present.
     */
    function circumventAntiAdblock() {
        for (const prop in antiAdblockDefeaters) {
            if (Object.prototype.hasOwnProperty.call(antiAdblockDefeaters, prop)) {
                try {
                    Object.defineProperty(window, prop, {
                        value: antiAdblockDefeaters[prop],
                        writable: false,
                        configurable: true
                    });
                    console.log(`[Universal Ad Blocker] Set window.${prop} to ${antiAdblockDefeaters[prop]}`);
                } catch (e) {
                    console.warn(`[Universal Ad Blocker] Failed to define window.${prop}:`, e);
                    window[prop] = antiAdblockDefeaters[prop];
                }
            }
        }

        const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth');
        const originalOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight');

        if (originalOffsetWidth) {
            Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
                get: function() {
                    if (this.id && this.id.includes('ad') || this.className && this.className.includes('ad')) {
                        return 100;
                    }
                    return originalOffsetWidth.get.apply(this);
                },
                configurable: true
            });
        }

        if (originalOffsetHeight) {
            Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
                get: function() {
                    if (this.id && this.id.includes('ad') || this.className && this.className.includes('ad')) {
                        return 100;
                    }
                    return originalOffsetHeight.get.apply(this);
                },
                configurable: true
            });
        }
        console.log('[Universal Ad Blocker] Attempted to circumvent anti-adblock size checks.');
    }

    /**
     * Overrides window.open to block unwanted pop-up and redirect tabs.
     */
    function blockPopunders() {
        const originalWindowOpen = window.open;

        window.open = function(url, name, features) {
            const isBlocked = popupRedirectBlacklist.some(pattern => url && url.includes(pattern));

            if (isBlocked) {
                console.warn(`[Universal Ad Blocker] Blocked pop-under/redirect attempt to: ${url}`);
                return null;
            }

            return originalWindowOpen.apply(this, arguments);
        };
        console.log('[Universal Ad Blocker] window.open override active for pop-under blocking.');
    }

    /**
     * Removes or hides elements matching ad selectors.
     * This function can be called repeatedly, e.g., on DOM mutations.
     * @param {HTMLElement | Document} container - The element or document to search within.
     */
    function blockAds(container = document) {
        let blockedCount = 0;
        adSelectors.forEach(selector => {
            try {
                const elements = container.querySelectorAll(selector);
                elements.forEach(el => {
                    if (el.style.display !== 'none' && el.style.visibility !== 'hidden') {
                        if (el.tagName === 'IFRAME') {
                            el.remove();
                            console.log(`[Universal Ad Blocker] Removed iframe: ${selector}`);
                        } else if (el.tagName === 'VIDEO') {
                            if (!el.paused) el.pause();
                            el.src = '';
                            while (el.firstChild) {
                                el.removeChild(el.firstChild);
                            }
                            el.remove();
                            console.log(`[Universal Ad Blocker] Removed video ad: ${selector}`);
                        }
                        else {
                            el.style.setProperty('display', 'none', 'important');
                            el.style.setProperty('visibility', 'hidden', 'important');
                            console.log(`[Universal Ad Blocker] Hidden element: ${selector}`);
                        }
                        blockedCount++;
                    }
                });
            } catch (e) {
                console.error(`[Universal Ad Blocker] Error querying selector ${selector}:`, e);
            }
        });
        if (blockedCount > 0) {
            console.log(`[Universal Ad Blocker] Blocked ${blockedCount} elements.`);
        }
    }

    /**
     * Initializes the MutationObserver to watch for DOM changes.
     * When new nodes are added, it re-applies ad-blocking logic.
     */
    function setupMutationObserver() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Node.ELEMENT_NODE
                            blockAds(node);
                        }
                    });
                }
            });
        });

        // Start observing the entire document body for child list changes and subtree changes
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('[Universal Ad Blocker] MutationObserver set up.');
    }


    // --- SCRIPT EXECUTION ---

    // 1. Run universal ad blocker's anti-adblock circumvention and pop-under blocking
    //    attempts immediately at document-start, before most scripts have a chance to run their checks.
    circumventAntiAdblock();
    blockPopunders();

    // 2. Apply all CSS styles (NHentai specific and universal ad blocker)
    applyStylesheets();

    // 3. Perform an initial ad blocking pass on the existing document.
    //    This catches elements present in the initial HTML.
    blockAds();

    // 4. Set up a MutationObserver to catch dynamically loaded ads or elements
    //    that change after the initial page load. This ensures continuous blocking.
    //    Wait for the document body to be available before setting up the observer.
    if (document.body) {
        setupMutationObserver();
    } else {
        document.addEventListener('DOMContentLoaded', setupMutationObserver);
    }

    // 5. Initialize the NHentai infinite scroll functionality if on a comic list page.
    if ($(".container.index-container, #favcontainer.container, #recent-favorites-container, #related-container").length !== 0) {
        infiniteLoadHandling();
    }

    console.log('[NHentai - Infinite Scroll & Enhanced Ad Blocker] UserScript initialized.');

})();
