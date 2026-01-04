// ==UserScript==
// @name         uBakiOrigin
// @namespace    none
// @version      0.1
// @description  Eklenen elementleri belirtilen site içerisinde engeller
// @author       crazyboy69
// @match        https://*/*
// @icon         https://getadblock.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489675/uBakiOrigin.user.js
// @updateURL https://update.greasyfork.org/scripts/489675/uBakiOrigin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sites = {
        '.*\.?evrimagaci\.org': {
            remove: ['.nokta-sticky-bottom','iframe','ins','.call-for-support','.support-btn-con.primary.main-btn','#user-call-info-card','#push-notification-info-card','.breaking-header','.btn-add','.feed-scroll-anim-container','.reading-position-indicator','footer','#keywords','.content-end-qna','#bottom-nav-container','.section-title','.info-card','.content-references','.figure-bottom','.contributors-container','.more-contents','.inarticle-feed','.popper-ref','#selection-text-options-container','#content-navigator','.ads--inarticle','.explore-btn','.support-mobile','.content-top','.reaction-counter','.type-generic.itembox div div .text .buttons','.hide-print','.content-copyright-btn','.ads--feed_inline','.type-ads','ads--various','.ads--tower_right','.ads--tower_left','.corresponding-authors','.sharp-blur-svg','.content-toolbox','#user-action-btn','.ads--masthead','.ads--content_top','.virgul-ad','.ads--sticky','.nokta-ad'],
            interaction: true,
            timeout: 0,
            interval: 2000, // Her 2 saniyede bir kontrol et
            trueRemove: true
        },
        '.*\.?eksisozluk\.com': {
            remove: ['.mobile-only.tracked','.pena-logo-mobile.no-hover.mobile-only','.eksiseyler-logo-mobile.no-hover.mobile-only','.rate-options','.avatar','.dropdown.entry-share','.mobile-inread-ad-not-loaded','.ads','#search-box-ad'],
            interaction: true,
            timeout: 0,
            interval: 2000, // Her 2 saniyede bir kontrol et
            trueRemove: true
        },
        '.*\.?donanimhaber\.com': {
            remove: ['.detay-yatay-sorgu','.medya-dev-kapsam','.detay .reklam','.open-with-app-square','.gundem-yap-btn','#ctl21_adCstmYorumUstuAlan','.breadcrumb','#likeBtn_pnl','.detay .google-news-subscribe-button','.buradakiler','.yorum-ustu-alan','.mobil-forum-tanitim','.cookie-kutu','#appIntroductionPopup','.lnk-bkz','.paylas','.ilgili-haberler','.tek.ara-reklam'],
            interaction: true,
            timeout: 0,
            interval: 2000, // Her 2 saniyede bir kontrol et
            trueRemove: true
        },
    }

    function cleanup() {
        console.log("Temizlik işlemi arka planda devam ediyor...");
        for (let hostname in sites) {
            if (sites.hasOwnProperty(hostname)) {
                if (location.hostname.match(new RegExp(hostname, "i"))) {
                    let site = sites[hostname];
                    if(site.interaction) {
                        document.body.dispatchEvent(new MouseEvent('mousemove'));
                    }
                    if(site.remove) {
                        let selectors = site.remove;
                        selectors.forEach(function(selector) {
                            let elements = document.querySelectorAll(selector);
                            elements.forEach(function(elem) {
                                if (!site.trueRemove) {
                                    elem.style.visibility = 'hidden';
                                    elem.style.width = '1px';
                                    elem.style.height = '1px';
                                    elem.style.overflow = 'hidden';
                                    elem.style.opacity = 0;
                                } else {
                                    elem.remove();
                                }
                            });
                        });
                    }
                }
            }
        }
    }

    // Sayfa yüklendiğinde direkt olarak temizleme işlemi yap
    cleanup();

    // Her 2 saniyede bir kontrol etme işlemi
    setInterval(cleanup, 2000);
})();