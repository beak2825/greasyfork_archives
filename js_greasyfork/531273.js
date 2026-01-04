// ==UserScript==
// @name         Adblock Protector
// @name:uk      Захисник Adblock
// @name:de      Adblock Protector
// @name:fr      Adblock Protector
// @name:es      Adblock Protector
// @name:et      Adblock Protector
// @name:it      Adblock Protector
// @version      1.3
// @description  Advanced Adblock protector with invasive shit blocking
// @description:uk  Adblock Protector. Захищає від стеження та обходу блокувальників реклами
// @description:de  Fortschrittlicher Adblock-Schutz mit invasivem Scheiß-Blockieren
// @description:fr  Protecteur Adblock avancé avec blocage de merde invasive
// @description:es  Protector Adblock avanzado con bloqueo de mierda invasiva
// @description:et  Täiustatud Adblocki kaitse invasivse jama blokeerimisega
// @description:it  Protettore Adblock avanzato con blocco di merda invasiva
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @noframes
// @namespace https://greasyfork.org/users/1451793
// @downloadURL https://update.greasyfork.org/scripts/531273/Adblock%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/531273/Adblock%20Protector.meta.js
// ==/UserScript==

/* Configuration Object */
var config = {
    blockingLevel: 2, // 1-3 (1=yandex, 2=+RU companies, 3=nuclear)
    aggressiveness: 2, // 1-3 (1=reqs, 2=+scripts, 3=all elements)
    advancedProtection: 1, // 0-1 (external scripts)
    proactiveDefense: true, // Active bypass prevention
    sanitizeInterval: 2000 // DOM cleanup interval
};

/* Domain Patterns */
var domainPatterns = {
    yandex: ['ya.*', 'yandex.*', 'yastatic.*'],
    ruCompanies: ['mail.ru', 'zen.ru', 'vk.ru', 'vk.com', 'ok.ru'],
    nuclear: ['*.ru', '*.by', '*.рф', '*.su']
};

(function() {
    'use strict';

    // Build blocked domains array
    var blockedDomains = domainPatterns.yandex.slice();
    if (config.blockingLevel >= 2) blockedDomains.push.apply(blockedDomains, domainPatterns.ruCompanies);
    if (config.blockingLevel >= 3) blockedDomains.push.apply(blockedDomains, domainPatterns.nuclear);

    // Create regex patterns
    var domainRegexes = blockedDomains.map(function(pattern) {
        var base = pattern
            .replace(/\./g, '\\.')
            .replace(/\*/g, '.*');
        return [
            new RegExp('^(https?|wss?)://([a-z0-9-]+\\.)*' + base),
            new RegExp('//([a-z0-9-]+\\.)*' + base),
            new RegExp('([a-z0-9-]+\\.)*' + base + '/', 'i')
        ];
    }).reduce(function(acc, val) { return acc.concat(val); }, []);

    // Block check function
    function isBlocked(url) {
        try {
            var cleanUrl = decodeURIComponent(url).toLowerCase();
            return domainRegexes.some(function(regex) {
                return regex.test(cleanUrl);
            });
        } catch(e) {
            return domainRegexes.some(function(regex) {
                return regex.test(url.toLowerCase());
            });
        }
    }

    // Network blocking
    var nativeFetch = window.fetch;
    window.fetch = function(input, init) {
        var url = (typeof input === 'string') ? input : input.url;
        return isBlocked(url) 
            ? new Response(null, { status: 403 })
            : nativeFetch.call(window, input, init);
    };

    var originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        if (isBlocked(url)) {
            console.warn('Blocked XHR:', url);
            this.abort();
            return;
        }
        originalOpen.apply(this, arguments);
    };

    // DOM cleaning
    function sanitizeDOM() {
        var elements = document.querySelectorAll(
            'script, iframe, img, link, embed, object, source'
        );
        
        Array.prototype.forEach.call(elements, function(element) {
            var sources = [
                element.src,
                element.href,
                element.dataset && element.dataset.src,
                element.srcset
            ].filter(Boolean);

            if (sources.some(isBlocked)) {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        });
    }

    // Mutation observer
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            Array.prototype.forEach.call(mutation.addedNodes, function(node) {
                if (node.nodeType === 1 && (node.src || node.href)) {
                    if (isBlocked(node.src || node.href)) {
                        node.parentNode && node.parentNode.removeChild(node);
                    }
                }
            });
        });
        if (config.aggressiveness >= 2) sanitizeDOM();
    });

    observer.observe(document, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'href', 'data-src']
    });

    // External scripts
    if (config.advancedProtection) {
        [
            'https://userscripts.adtidy.org/release/popup-blocker/2.5/popupblocker.user.js',
            'https://userscripts.adtidy.org/release/adguard-extra/1.0/adguard-extra.user.js',
            'https://cdn.jsdelivr.net/npm/@list-kr/tinyshield@latest/dist/tinyShield.user.js'
        ].forEach(function(src) {
            var script = document.createElement('script');
            script.src = src;
            document.head.appendChild(script);
        });
    }

    // Proactive defense
    if (config.proactiveDefense) {
        setInterval(sanitizeDOM, config.sanitizeInterval);
        Object.defineProperty(window, 'fetch', { 
            value: window.fetch,
            writable: false,
            configurable: false
        });
    }

    console.info('Domain Blocker active - Level ' + config.blockingLevel);
})();