// ==UserScript==
// @name         Safe AdBlocker + Ultra Performance
// @namespace    https://tampermonkey.net/
// @version      1.8
// @description  Visual cleanup via CSS + precise domain-based ad hiding, without breaking sites or triggering anti-adblock
// @author       Rubystance
// @license      MIT
// @match        https://donaldco.in/*
// @match        https://freeltc.online/*
// @match        https://zerads.com/*
// @match        https://claimcrypto.in/*
// @match        https://claimcoin.in/*
// @match        https://starlavinia.name.tr/*
// @match        https://rimakoko.com/*
// @match        https://faucetcrypto.com/*
// @match        https://eftacrypto.com/*
// @match        https://keran.co/*
// @match        https://wheelofgold.com/*
// @match        https://bagi.co.in/*
// @match        https://blockpulse.fun/*
// @match        https://viefaucet.com/*
// @match        https://ourcoincash.xyz/*
// @match        https://coinkeel.com/*
// @match        https://bitcotasks.com/*
// @exclude      https://earnbitmoon.club/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543786/Safe%20AdBlocker%20%2B%20Ultra%20Performance.user.js
// @updateURL https://update.greasyfork.org/scripts/543786/Safe%20AdBlocker%20%2B%20Ultra%20Performance.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        *,
        *::before,
        *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
            transition-delay: 0ms !important;
            scroll-behavior: auto !important;
        }

        * {
            filter: none !important;
            backdrop-filter: none !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }

        [class*="animate-"],
        [class*="motion-"],
        [class*="transition-"],
        [class*="duration-"],
        [class*="ease-"] {
            animation: none !important;
            transition: none !important;
        }

        /* Generic ad / banner containers */
        [id*="ad-"],
        [id^="ad"],
        [id*="ads"],
        [id*="banner"],
        [id*="promo"],
        [id*="sponsor"],
        [id*="marketing"],
        [class*="ad-"],
        [class^="ad"],
        [class*="ads"],
        [class*="banner"],
        [class*="promo"],
        [class*="sponsor"],
        [class*="marketing"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Iframe ads (hidden, not blocked) */
        iframe {
            max-width: 0 !important;
            max-height: 0 !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }

        /* Cookie / GDPR banners */
        [id*="cookie"],
        [class*="cookie"],
        [id*="consent"],
        [class*="consent"],
        [aria-label*="cookie"],
        [aria-label*="consent"] {
            display: none !important;
        }

        /* Floating elements without killing layout */
        [style*="position: fixed"],
        [style*="position:sticky"],
        [style*="position: sticky"] {
            z-index: auto !important;
        }

        body {
            overflow-x: hidden !important;
        }
    `;
    document.documentElement.appendChild(style);

    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function (query) {
        if (query.includes('prefers-reduced-motion')) {
            return {
                matches: true,
                media: query,
                onchange: null,
                addListener: () => {},
                removeListener: () => {},
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => false
            };
        }
        return originalMatchMedia(query);
    };

    const originalScrollTo = window.scrollTo;
    window.scrollTo = function (options, y) {
        if (typeof options === 'object') {
            return originalScrollTo(options.left || 0, options.top || 0);
        }
        return originalScrollTo(options, y);
    };

    window.addEventListener('DOMContentLoaded', () => {

        const adDomains = [
            "a-ads.com",
            "bitmedia.io",
            "cryptocoinsad.com",
            "bank.gov.ua",
            "zerads.com",
            "cdn.bmcdn6.com",
            "faucetpay.io",
            "cdn.conzilla.com",
            "api.fpadserver.com",
            "coinzilla.com",
            "propellerads.com",
            "popads.net",
            "adsterra.com",
            "doubleclick.net",
            "googlesyndication.com",
            "media.net",
            "taboola.com",
            "widgets.adskeeper.com/*",
            "outbrain.com",
            "clck.adskeeper.com",
            "cIck.adskeeper.com",
            "revcontent.com",
            "mgid.com"
        ];

        function isAdUrl(url) {
            if (!url) return false;
            return adDomains.some(domain => url.includes(domain));
        }

        function hideEl(el) {
            el.style.display = 'none';
            el.setAttribute('data-hidden-by', 'safe-adblocker');
        }

        function process() {
            const elements = document.querySelectorAll('iframe[src], script[src], img[src]');
            elements.forEach(el => {
                if (el.hasAttribute('data-hidden-by')) return;
                const src = el.getAttribute('src');
                if (isAdUrl(src)) hideEl(el);
            });
        }

        setTimeout(process, 3000);
        setInterval(process, 3000);

        const observer = new MutationObserver(process);
        observer.observe(document.body, { childList: true, subtree: true });
    });

})();
