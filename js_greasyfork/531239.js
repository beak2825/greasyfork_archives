// ==UserScript==
// @name         Mydealz Navigation Draft
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Optimierte Navigation mit DOM-Kategorien und direktem Gutschein-Link
// @author       You
// @match        https://www.mydealz.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531239/Mydealz%20Navigation%20Draft.user.js
// @updateURL https://update.greasyfork.org/scripts/531239/Mydealz%20Navigation%20Draft.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS-Anpassungen
    const customCSS = `
        .nav, .subNav--light {
            background-color: #009900 !important;
            transition: none !important;
        }

        .nav a, .nav span, .nav button,
        .subNav--light a, .subNav--light span, .subNav--light button {
            color: white !important;
            font-weight: bold !important;
        }

        .nav svg, .subNav--light svg {
            color: white !important;
            fill: white !important;
        }

        .search-icon {
            color: #009900 !important;
            fill: #009900 !important;
        }

        .input--search {
            background-color: white !important;
            color: #333 !important;
        }

        .nav-button.button--type-secondary {
            background-color: transparent !important;
            border-color: transparent !important;
        }

        .nav button, .subNav--light button,
        .button--type-tag, .button--mode-flat {
            background-color: transparent !important;
            border-color: transparent !important;
        }

        .nav button:hover, .subNav--light button:hover,
        .button--type-tag:hover, .button--mode-flat:hover {
            background-color: transparent !important;
            border-color: transparent !important;
        }

        .nav a:hover, .nav span:hover, .nav button:hover,
        .subNav--light a:hover, .subNav--light span:hover, .subNav--light button:hover,
        .nav-item:hover, .nav-link:hover {
            background-color: transparent !important;
        }

        [data-t="dealAlarms"]:hover,
        a[href*="deal-alarm"]:hover {
            background-color: transparent !important;
        }

        .nav-logo > span {
            display: none !important;
        }

        .nav-logo {
            background-image: url("https://www.mydealz.de/assets/img/logo/default-light_d4b86.svg") !important;
            background-repeat: no-repeat !important;
            background-position: center !important;
            background-size: contain !important;
            width: 195px !important;
            height: 60px !important;
        }

        .nav-hideSearch .button--mode-brand {
            background-color: white !important;
            color: #005B94 !important;
        }

        .nav-hideSearch .button--mode-brand svg {
            color: #005B94 !important;
            fill: #005B94 !important;
        }

        .nav-hideSearch .button--mode-brand span {
            color: #005B94 !important;
        }

        /* Bilder in Bildergalerien erhalten */
        .threadItemCard-img .scrollBox-container:not(.carousel--isNext) {
            display: none !important;
        }

        /* Dropdown-Menüs */
        .mydealz-dropdown {
            position: absolute;
            z-index: 10000;
            background-color: white;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            width: 220px;
            padding: 8px 0;
            top: 100%;
            left: 0;
            margin-top: 0;
        }

        .mydealz-dropdown-item {
            display: block;
            padding: 10px 16px;
            color: #333 !important;
            text-decoration: none;
            font-weight: normal !important;
            white-space: nowrap;
        }

        .mydealz-dropdown-item:hover {
            background-color: #f5f5f5;
        }

        .scrollBox-item {
            position: relative;
        }
    `;

    // DOM-Kategoriebaum mit Link-Zielen
    const categoryTree = [
{ name: "Auto & Motorrad", url: "/gruppe/auto-motorrad" },
{ name: "Beauty & Gesundheit", url: "/gruppe/beauty" },
{ name: "Dienstleistungen & Vertr\u00e4ge", url: "/gruppe/dienstleistungen-vertraege" },
{ name: "Elektronik", url: "/gruppe/elektronik" },
{ name: "Family & Kids", url: "/gruppe/family-kids" },
{ name: "Fashion & Accessoires", url: "/gruppe/fashion-accessoires" },
{ name: "Gaming", url: "/gruppe/gaming" },
{ name: "Garten & Baumarkt", url: "/gruppe/garten-baumarkt" },
{ name: "Home & Living", url: "/gruppe/home-living" },
{ name: "Kultur & Freizeit", url: "/gruppe/kultur-freizeit" },
{ name: "Lebensmittel & Haushalt", url: "/gruppe/food" },
{ name: "Sport & Outdoor", url: "/gruppe/sport" },
{ name: "Telefon- & Internet-Vertr\u00e4ge", url: "/gruppe/telefon-internet" },
{ name: "Urlaub & Reisen", url: "/gruppe/reisen" },
{ name: "Versicherung & Finanzen", url: "/gruppe/vertraege-finanzen" }
    ];

    // Häufige Gutscheine
    const vouchers = [
        { name: "Adidas", url: "/gutscheine/adidas-de" },
        { name: "Amazon", url: "/gutscheine/amazon-de" },
        { name: "IKEA", url: "/gutscheine/ikea-com" },
        { name: "Lidl", url: "/gutscheine/lidl-de" },
        { name: "Media Markt", url: "/gutscheine/mediamarkt-de" },
        { name: "OTTO", url: "/gutscheine/otto-de" },
        { name: "Saturn", url: "/gutscheine/saturn-de" },
        { name: "Zalando", url: "/gutscheine/zalando-de" },

        { name: "alle anzeigen ", url: "/gutscheine/" },
    ];

    // Style-Element hinzufügen
    const styleElement = document.createElement('style');
    styleElement.textContent = customCSS;
    document.head.appendChild(styleElement);

    // Subnavigation ersetzen
    let subNavReplaced = false;

    function replaceSubNav() {
        if (subNavReplaced) return;

        // Speziell nur die Header-Navigation auswählen
        const subNavContainer = document.querySelector('header .subNav--light .scrollBox-container');
        if (!subNavContainer) return;

        subNavContainer.innerHTML = `
            <div class="scrollBox-item flex--shrink-0">
                <a href="https://www.mydealz.de/gruppe" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="16" height="16" class="space--mr-1 color--graphic-TranslucentSecondary icon icon--categories">
                            <use xlink:href="/assets/img/ico_f3562.svg#categories"></use>
                        </svg>
                        Kategorien
                    </span>
                </a>
            </div>
            <div class="scrollBox-item flex--shrink-0">
                <a href="https://www.mydealz.de/gutscheine" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="18" height="18" class="color--graphic-TranslucentSecondary icon icon--voucher">
                            <use xlink:href="/assets/img/ico_f3562.svg#voucher"></use>
                        </svg>
                        <span class="space--mr-1 space--ml-1">Gutscheine</span>
                    </span>
                </a>
            </div>
            <div class="scrollBox-item flex--shrink-0">
                <a href="/deals-new" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="16" height="16" class="space--mr-1 color--graphic-TranslucentSecondary icon icon--tag icon-d--1">
                            <use xlink:href="/assets/img/ico_f3562.svg#tag"></use>
                        </svg>
                        Deals
                    </span>
                </a>
            </div>
            <div class="scrollBox-item flex--shrink-0">
                <a href="/gruppe/freebies?temperatureFrom=any" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="18" height="18" class="space--mr-1 color--graphic-TranslucentSecondary icon icon--gift icon-u--1">
                            <use xlink:href="/assets/img/ico_f3562.svg#gift"></use>
                        </svg>
                        Freebies
                    </span>
                </a>
            </div>
            <div class="scrollBox-item flex--shrink-0">
                <a href="/diskussion" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="16" height="16" class="space--mr-1 color--graphic-TranslucentSecondary icon icon--comments">
                            <use xlink:href="/assets/img/ico_f3562.svg#comments"></use>
                        </svg>
                        Diskussionen
                    </span>
                </a>
            </div>
            <div class="scrollBox-item flex--shrink-0">
                <a href="https://www.mydealz.de/feedback" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="16" height="16" class="space--mr-1 color--graphic-TranslucentSecondary icon icon--campaign">
                            <use xlink:href="/assets/img/ico_f3562.svg#campaign"></use>
                        </svg>
                        Feedback
                    </span>
                </a>
            </div>
            <div class="scrollBox-item flex--shrink-0">
                <a href="/2035404#comments" class="space--mr-2 text--normal size--all-m space--h-1 button button--type-tag button--mode-flat">
                    <span class="flex--inline boxAlign-ai--all-c">
                        <svg width="16" height="16" class="space--mr-1 color--graphic-TranslucentSecondary icon icon--comments">
                            <use xlink:href="/assets/img/ico_f3562.svg#cake"></use>
                        </svg>
                        Sammlung
                    </span>
                </a>
            </div>
        `;

        subNavReplaced = true;
        observer.disconnect();
    }


    // MutationObserver für DOM-Änderungen
    const observer = new MutationObserver(mutations => {
        if (!subNavReplaced) {
            const subNav = document.querySelector('header .subNav--light');
            if (subNav) {
                replaceSubNav();
            }
        }
    });

    // Observer starten
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initialer Aufruf beim Laden der Seite
    replaceSubNav();
})();
