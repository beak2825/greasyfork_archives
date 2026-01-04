// ==UserScript==
// @name         Kleinanzeigen
// @namespace    https://greasyfork.org/users/156194
// @version      0.7
// @description  Diverses
// @author       rabe85
// @match        http://kleinanzeigen.de/*
// @match        https://kleinanzeigen.de/*
// @match        http://www.kleinanzeigen.de/*
// @match        https://www.kleinanzeigen.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425550/Kleinanzeigen.user.js
// @updateURL https://update.greasyfork.org/scripts/425550/Kleinanzeigen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function kleinanzeigen() {
        // Entfernung auf 2000km ändern
        function entfernung() {
            var entfernung200 = document.querySelector('li.selectbox-option[data-value="200"]');
            if(entfernung200) {
                entfernung200.dataset.value = '2000';
                entfernung200.innerHTML = ' + 2000 km';
                entfernung200.onclick = function() { document.querySelector('#site-search-distance-value').value = 2000; };
            }
            if(window.location.href.indexOf('r2000')>-1) {
                document.querySelector('#site-search-distance-value').value = 2000;
                document.querySelector('#site-search-distance-inpt').value = "+ 2000 km";
            }
        }

        window.addEventListener('load', entfernung, false);
        //window.addEventListener('mouseover', entfernung, false);
        //window.addEventListener('scroll', entfernung, false);


        // Linkfarben ändern
        // Verlängern deutlicher kennzeichnen
        // Bezahlfeatures und Banner ausblenden
        var load_style = document.createElement('style');
        load_style.type = 'text/css';
        load_style.innerHTML = '.manageaditem-features { visibility: hidden !important; } .manageadbox--features { visibility: hidden !important; } #postad-features { display: none !important; } .site-base--left-banner { visibility: hidden !important; } .site-base--right-banner { visibility: hidden !important; } #liberty-my_ads-top-banner { display: none !important; } #brws_banner-supersize { display: none !important; } #liberty-srpb-middle { display: none !important; } #srp-btf-billboard { display: none !important; } #liberty-home-above-header { display: none !important; } #liberty-vip_pro-billboard { display: none !important; } #liberty-vip_pro-belly { display: none !important; } #liberty-vip_pro-sky-atf-right-sidebar { display: none !important; } #liberty-vip_pro-top { display: none !important; } #liberty-vip_pro-middle { display: none !important; } #liberty-vip_pro-bottom { display: none !important; } #liberty-vip-billboard { display: none !important; } #liberty-vip-belly { display: none !important; } #liberty-vip-top { display: none !important; } #liberty-vip-middle { display: none !important; } #liberty-vip-bottom { display: none !important; } .banner { display: none !important; } .sticky-advertisement { display: none !important; } #viewad-sidebar-banner { display: none !important; } *#liberty-vip-similar-ads { display: none !important; } .manageitems-item-features { visibility: hidden !important; } .feature-offer-section { display: none !important; } #feature-offer-section { display: none !important; } .ad-listitem:not(.fully-clickable-card):not(.ad-listitem):not(.watchlist-listitem):not(.lazyload-item) { display: none !important; } #btf-billboard { display: none !important; } #lsrp-middle { display: none !important; } #srpb-middle { display: none !important; } #srp_adsense-top { display: none !important; } #home-billboard { display: none !important; } #vip-billboard { display: none !important; } #vip-belly { display: none !important; } #vip-middle { display: none !important; } #vip-bottom { display: none !important; } #vip-gallery-carrousel { display: none !important; } #soi-top-banner { display: none !important; } #soi-sky-btf-left { display: none !important; } #soi-result-list-0 { display: none !important; } #soi-result-list-1 { display: none !important; } #soi-result-list-2 { display: none !important; } #soi-result-list-3 { display: none !important; } #soi-result-list-4 { display: none !important; } #soi-result-list-5 { display: none !important; } #soi-result-list-6 { display: none !important; } #soi-result-list-7 { display: none !important; } #soi-result-list-8 { display: none !important; } #soi-result-list-9 { display: none !important; } #soi-result-list-10 { display: none !important; } #soi-result-list-11 { display: none !important; } #soi-result-list-12 { display: none !important; } #soi-result-list-13 { display: none !important; } #soi-result-list-14 { display: none !important; } #soi-result-list-15 { display: none !important; }';
        document.head.appendChild(load_style);
    }


    // Auf eines von mehreren Elementen der Seite warten und mehrfach auslösen bei neuen
    function daten_gefunden() {
        waitForAnyNewElm(['section#feature-offer-section', 'li.ad-listitem.fully-clickable-card', 'li.relative.flex.bg-surface', 'p#viewad-description-text', 'div.ConversationByDateList', 'li.ad-listitem.watchlist-listitem.lazyload-item', 'div.userprofile-details'], (elm) => {
            kleinanzeigen(elm);
        });
    }

    // Daten nachgeladen?
    function waitForAnyNewElm(selectors, callback) {
        const seenElements = new Set();

        // Initial check
        selectors.forEach(selector => {
            const found = document.querySelectorAll(selector);
            found.forEach(elm => {
                if (!seenElements.has(elm)) {
                    seenElements.add(elm);
                    callback(elm);
                }
            });
        });

        const observer = new MutationObserver(() => {
            selectors.forEach(selector => {
                const found = document.querySelectorAll(selector);
                found.forEach(elm => {
                    if (!seenElements.has(elm)) {
                        seenElements.add(elm);
                        callback(elm);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        daten_gefunden();
    } else {
        document.addEventListener('DOMContentLoaded', daten_gefunden, false);
    }

})();