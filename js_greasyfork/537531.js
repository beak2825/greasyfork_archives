// ==UserScript==
// @name         Kleinanzeigen: Endlich SCHÖN & SCHNELL 🚀
// @namespace    http://tampermonkey.net/
// @version      1.24 // Versionsnummer erhöht
// @description  🚫Blockiert Werbung/Tracking, 🔍Zoomt bei Bild-Hover mit HighRes🖼️, 💾speichert eingestellte Sortierung, ⌨️A&D für Seitennavigation, 🖥️passt die Hauptseite optisch an einen großen Monitor an
// @author       just bob (mit Erweiterungen)
// @match        https://www.kleinanzeigen.de/*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kleinanzeigen.de&size=64
// @license      MIT
// @run-at       document-start // Beibehalten, um so früh wie möglich zu starten
// @downloadURL https://update.greasyfork.org/scripts/537531/Kleinanzeigen%3A%20Endlich%20SCH%C3%96N%20%20SCHNELL%20%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/537531/Kleinanzeigen%3A%20Endlich%20SCH%C3%96N%20%20SCHNELL%20%F0%9F%9A%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Definiere blockScriptPatterns, bevor es verwendet wird ---
    const blockScriptPatterns = [
        /criteo\.net/, /theadex\.com/, /clarity\.ms/, /teads\.tv/, /taboola\.com/, /bing\.com/,
        /facebook\.net/, /creativecdn\.com/, /doubleclick\.net/, /google\.com\/adsense/,
        /amazon-adsystem\.com/, /fastclick\.net/, /id5-sync\.com/, /promotion-frontend/,
        /advertisingWebRenderer\.min\.js/, /prebid\.js/, /adblock-detection/, /liberty\.min\.js/,
        /GATrackingDispatcher/, /GoogleAnalyticsTags/, /gtag\/js/, /gtm\.js/, /bffstatic/,
        /ats-wrapper\.privacymanager\.io/, /FuEHlC\/Yum\/94H\/ZRG4AA\/uOX72DYDt9Qm\/YEZIU28\/YFAK\/LyEBG3s/
    ];

    // --- CSS direkt in den <head> einfügen ---
    const style = document.createElement('style');
    style.textContent = `
        /* Deine bestehenden CSS-Regeln bleiben hier unverändert */
        .site-base--left-banner,
        .site-base--right-banner,
        #btf-billboard,
        div[data-liberty-position-name="home-billboard"],
        div[data-liberty-position-name="srpb-middle"],
        .mb-large.flex.flex-col.bg-utilityNonessential.p-small,
        li.ad-listitem div[data-liberty-position-name],
        li.ad-listitem.badge-topad.is-topad,
        section.rounded-xsmall.bg-surface.p-small {
            display: none !important;
        }

        .w-\\[700px\\] {
            width: 2213px !important;
        }
        .w-full {
            width: 173% !important;
        }

        ul.mb-large.flex.flex-wrap.justify-around.gap-small,
        #brws_banner-supersize,
        #viewad-sidebar-banner,
        #vip-billboard,
        #pstrads-atf-728x90,
        div.mb-medium.flex.justify-between,
        #feature-offer-section,
        #srp-skyscraper-btf {
            display: none !important;
        }

        div.flex.min-w-\\[_255px_\\].flex-col.gap-medium { display: block !important; }
        section.rounded-xsmall.bg-surface.p-small.px-xsmall.text-onSurfaceSubdued { display: block !important; }
    `;
    document.documentElement.appendChild(style);
    console.log("[Kleinanzeigen Script] CSS injected.");

    const selectorsToHideFallBack = [
        '.site-base--left-banner',
        '.site-base--right-banner'
    ];

    const hideDynamicElements = () => {
        selectorsToHideFallBack.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                element.style.display = 'none';
            });
        });
        const skyscraperBtf = document.getElementById('srp-skyscraper-btf');
        if (skyscraperBtf) {
            skyscraperBtf.style.display = 'none';
        }
    };

    const scriptObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (
                    node.tagName === 'SCRIPT' &&
                    node.src &&
                    blockScriptPatterns.some(pattern => pattern.test(node.src))
                ) {
                    console.log("[Kleinanzeigen Script] Blockiere Skript:", node.src);
                    node.type = 'javascript/blocked';
                    if (node.parentNode) node.parentNode.removeChild(node);
                }
            });
        });
    });
    scriptObserver.observe(document.documentElement, { childList: true, subtree: true });

    const blockAlreadyLoadedScripts = () => {
        document.querySelectorAll('script[src]').forEach(node => {
            if (
                blockScriptPatterns.some(pattern => pattern.test(node.src))
            ) {
                node.type = 'javascript/blocked';
                if (node.parentNode) node.parentNode.removeChild(node);
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runLateScripts);
    } else {
        runLateScripts();
    }

    function runLateScripts() {
        blockAlreadyLoadedScripts();

        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        }

        // --- START: VERBESSERTE LOGIK FÜR "MEHR ANZEIGEN" BUTTON (schnellstmögliche Aktivierung) ---
        let moreButtonObserver = null;

        function attemptClickMoreButton() {
            const button = document.querySelector('div.flex.justify-center.p-small button');
            console.log("[Kleinanzeigen Script] Suche nach 'Mehr anzeigen' Button.");
            if (button && getComputedStyle(button).display !== 'none') {
                console.log("[Kleinanzeigen Script] 'Mehr anzeigen' Button gefunden und geklickt (sofort).");
                button.click();

                // Nach dem ersten Klick den Observer trennen, da wir ihn nicht mehr brauchen
                if (moreButtonObserver) {
                    moreButtonObserver.disconnect();
                }
                return true; // Button wurde gefunden und geklickt
            }
            console.log("[Kleinanzeigen Script] 'Mehr anzeigen' Button nicht gefunden oder nicht sichtbar.");
            return false; // Button noch nicht gefunden
        }

        // MutationObserver, um auf das Erscheinen des Buttons zu warten
        moreButtonObserver = new MutationObserver(() => {
            console.log("[Kleinanzeigen Script] MutationObserver ausgelöst.");
            if (attemptClickMoreButton()) {
                // Wenn der Button gefunden und geklickt wurde, den Observer trennen
                console.log("[Kleinanzeigen Script] Button gefunden und geklickt, Observer wird getrennt.");
                moreButtonObserver.disconnect();
            }
        });

        // Starte den Observer so früh wie möglich
        moreButtonObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        console.log("[Kleinanzeigen Script] MutationObserver gestartet.");

        // Versuche, den Button auch sofort zu klicken, falls er schon da ist
        attemptClickMoreButton();
        // --- ENDE: VERBESSERTE LOGIK FÜR "MEHR ANZEIGEN" BUTTON (schnellstmögliche Aktivierung) ---

        const debouncedHideDynamicElements = debounce(hideDynamicElements, 300);
        const dynamicElementObserver = new MutationObserver(debouncedHideDynamicElements);
        dynamicElementObserver.observe(document.body, { childList: true, subtree: true });

        // 🔍 HOCHAUFLÖSENDE BILDER ERZWINGEN
        function forceHighResImages() {
            document.querySelectorAll('li.ad-listitem img[src*="kleinanzeigen.de/api/v1/prod-ads/images/"]').forEach(img => {
                if (!img.src.includes('rule=$_57.AUTO')) {
                    img.src = img.src.replace(/rule=\$_\d+\.AUTO/, 'rule=$_57.AUTO');
                    if (img.srcset) {
                        img.removeAttribute('srcset');
                    }
                }
            });
        }
        forceHighResImages();
        const imageObserver = new MutationObserver(forceHighResImages);
        const adListContainer = document.querySelector('#srchrslt-adtable, .itemlist');
        if (adListContainer) {
            imageObserver.observe(adListContainer, { childList: true, subtree: true });
        }

        // --- NEU: Tastaturkürzel für Seitenwechsel (noch robuster, wartet auf Pagination) ---
        function activateKeyboardShortcuts() {
            document.addEventListener('keydown', function(event) {
                console.log("[Kleinanzeigen Script] Keydown Event ausgelöst.");
                const targetTagName = event.target.tagName.toLowerCase();
                if (targetTagName === 'input' || targetTagName === 'textarea' || event.target.isContentEditable) {
                    return;
                }
                const key = event.key.toLowerCase();
                if (key === 'a') {
                    // Vorherige Seite
                    let prevElement = document.querySelector('.pagination-prev');
                    if (prevElement) {
                        console.log("[Kleinanzeigen Script] 'A' gedrückt, klicke auf .pagination-prev.");
                        console.log("[Kleinanzeigen Script] Element vor dem Klick:", prevElement);
                        prevElement.click(); // Einfach klicken!
                        console.log("[Kleinanzeigen Script] Element nach dem Klick:", prevElement);
                    }
                } else if (key === 'd') {
                    // Nächste Seite
                    let nextElement = document.querySelector('.pagination-next');
                    if (nextElement) {
                        console.log("[Kleinanzeigen Script] 'D' gedrückt, klicke auf .pagination-next.");
                        console.log("[Kleinanzeigen Script] Element vor dem Klick:", nextElement);
                        nextElement.click(); // Einfach klicken!
                        console.log("[Kleinanzeigen Script] Element nach dem Klick:", nextElement);
                    }
                }
            });
            console.log("[Kleinanzeigen Script] Tastaturkürzel aktiviert.");
        }

        // MutationObserver, um auf das Erscheinen der Pagination-Elemente zu warten
        const paginationObserver = new MutationObserver((mutations, observer) => {
            const next = document.querySelector('.pagination-next');
            if (next) {
                console.log("[Kleinanzeigen Script] Pagination-Element gefunden, aktiviere Tastaturkürzel.");
                activateKeyboardShortcuts();
                observer.disconnect(); // Stoppe den Observer, sobald die Pagination gefunden wurde
            }
        });

        // Starte den Observer so früh wie möglich
        paginationObserver.observe(document.body, { childList: true, subtree: true });

        // --- NEU: Sortierung speichern und anwenden mit besserer Kontrolle ---
        const SORT_STORAGE_KEY = 'kleinanzeigen_preferredSortOrder';

        function applySortingIfNoManualOverride() {
            const savedSortValue = GM_getValue(SORT_STORAGE_KEY, null);
            const aktuellesSortierfeldInput = document.querySelector('#sortingField-selector-value');

            if (savedSortValue && aktuellesSortierfeldInput && aktuellesSortierfeldInput.value !== savedSortValue) {
                const zielOption = document.querySelector(`.srchresult-sorting li.selectbox-option[data-value="${savedSortValue}"]`);
                if (zielOption) {
                    console.log("[Kleinanzeigen Script] Setze Sortierung auf gespeicherten Wert.");
                    zielOption.click();
                }
            }
        }

        function setupSortListeners() {
            const sortOptionsContainer = document.querySelector('.srchresult-sorting ul.selectbox-list');
            if (!sortOptionsContainer || sortOptionsContainer.dataset.listenerAttached) {
                return;
            }
            sortOptionsContainer.dataset.listenerAttached = 'true';

            const sortOptions = sortOptionsContainer.querySelectorAll('li.selectbox-option');
            sortOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const newSortValue = this.getAttribute('data-value');
                    GM_setValue(SORT_STORAGE_KEY, newSortValue);
                    console.log('[Kleinanzeigen Script] Sortierung manuell geändert und gespeichert:', newSortValue);
                });
            });
        }

        function initSorting() {
            setupSortListeners();
            applySortingIfNoManualOverride();
        }

        // Initiale Anwendung und Observer für Sortierung erst nach dem Laden
        window.addEventListener('load', () => {
            console.log("[Kleinanzeigen Script] window.load Event ausgelöst (Sortierung).");
            initSorting();

            const sortContainer = document.querySelector('.srchresult-sorting');
            if (sortContainer) {
                const sortObserver = new MutationObserver(() => {
                    console.log("[Kleinanzeigen Script] Sortierung hat sich geändert, initialisiere neu.");
                    initSorting();
                });
                sortObserver.observe(sortContainer, { childList: true, subtree: true });
            }
        });

    } // Ende runLateScripts

})();
