// ==UserScript==
// @name         AdBlock
// @namespace    https://github.com/ondarion-t
// @version      1.1
// @description  Elimina TODOS los anuncios de cualquier página web (incluyendo popups, banners, videos, overlays y más) - Versión Mega Avanzada
// @author       KaitoNeko & Gemini
// @match        *://*/*
// @icon         https://i.ibb.co/8D277XCT/fa2e10c5aa9a.png
// @license      MPL-2.0
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      *
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/532891/AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/532891/AdBlock.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* Configuración avanzada */
    let config = { /* Cambiado a let para permitir la fusión con la configuración guardada */
        debugMode: false,
        aggressiveMode: true,
        updateInterval: 3600, /* 1 hora en segundos */
        lastUpdate: 0, /* Se actualizará desde GM_getValue o se forzará la primera vez */
        filterLists: [
            'https://raw.githubusercontent.com/uBlockOrigin/uAssets/master/filters/filters.txt',
            'https://easylist.to/easylist/easylist.txt',
            'https://easylist.to/easylist/easyprivacy.txt',
            'https://secure.fanboy.co.nz/fanboy-annoyance.txt',
            'https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext',
            'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/EnglishFilter/sections/general_optimized.txt',
            'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/SpywareFilter/sections/spyware_optimized.txt',
            'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/SocialMediaFilter/sections/socialmedia_optimized.txt',
            'https://raw.githubusercontent.com/AdguardTeam/AdguardFilters/master/AnnoyancesFilter/sections/annoyances_optimized.txt'
        ],
        customFilters: [],
        whitelist: [], /* Se actualizará desde GM_getValue */
        stats: {
            adsBlocked: 0,
            elementsRemoved: 0,
            scriptsBlocked: 0,
            requestsBlocked: 0
        }
    };

    /* Estilos CSS para bloquear elementos (ampliados y más agresivos) */
    /* Esta lista es extensa y se aplica directamente. Se complementa con selectores dinámicos. */
    const blockingStyles = `
        /* Clases y IDs comunes de anuncios */
        .ad, .ads, .advert, .advertisement, .ad-banner, .ad-container, .ad-wrapper, .ad-slot, .ad-unit,
        .google-ad, .doubleclick-ad, .banner-ad, .text-ad, .video-ad, .popup-ad, .interstitial-ad,
        .sponsored-post, .promoted-content, .ad-placeholder, .ad-label, .ad-notice, .ad-choices,
        [id*="ad"], [class*="ad-"], [class*="-ad"], [id*="google_ads_"], [id*="gpt_ad_"],
        [class*="adsbygoogle"], [class*="amzn_ad"], [class*="OUTBRAIN"], [class*="taboola"],
        [class*="criteo"], [class*="revcontent"], [class*="mgid"], [class*="adthrive"],
        [class*="ezoic"], [class*="mediavine"], [class*="adroll"], [class*="carbonads"],
        [class*="buysellads"], [class*="adblade"], [class*="adsonar"], [class*="infolinks"],
        [class*="chitika"], [class*="kontera"], [class*="viglink"], [class*="skimlinks"],
        [aria-label*="ad"], [aria-label*="advertisement"], [aria-label*="sponsored"],
        [data-ad-format], [data-ad-layout-key], [data-ad-client], [data-ad-slot], [data-ad-unit],
        [data-google-query-id], [data-ad-manager], [data-ad-name], [data-ad-size],
        [data-ad-targeting], [data-ad-type], [data-ad-id], [data-ad-index], [data-ad-position],
        [data-ad-network], [data-ad-placement], [data-ad-status], [data-ad-impression-url"],
        [data-ad-click-url"], [data-ad-viewability-url"], [data-ad-error-url"],
        [data-ad-visibility-observer"], [data-ad-responsive"], [data-ad-lazy"],
        [data-ad-load"], [data-ad-refresh"], [data-ad-render"], [data-ad-state"],
        [data-ad-debug"], [data-ad-test"], [data-ad-preview"], [data-ad-config"],
        [data-ad-options"], [data-ad-settings"], [data-ad-properties"], [data-ad-attributes"],
        [data-ad-metadata"], [data-ad-info"], [data-ad-details"], [data-ad-data"],
        [data-ad-json"], [data-ad-xml"], [data-ad-html"], [data-ad-script"],
        [data-ad-iframe"], [data-ad-embed"], [data-ad-object"], [data-ad-applet"],
        [data-ad-plugin"], [data-ad-flash"], [data-ad-silverlight"], [data-ad-java"],
        [data-ad-activex"], [data-ad-vpaid"], [data-ad-vast"], [data-ad-ima"],
        [data-ad-gpt"], [data-ad-dfp"], [data-ad-header-bidding"], [data-ad-prebid"],
        [data-ad-postbid"], [data-ad-waterfall"], [data-ad-mediation"], [data-ad-exchange"],
        [data-ad-marketplace"], [data-ad-auction"], [data-ad-bid"], [data-ad-cpm"],
        [data-ad-cpc"], [data-ad-ctr"], [data-ad-ecpm"], [data-ad-fill-rate"],
        [data-ad-impressions"], [data-ad-clicks"], [data-ad-conversions"], [data-ad-revenue"],
        [data-ad-profit"], [data-ad-roi"], [data-ad-performance"], [data-ad-analytics"],
        [data-ad-tracking"], [data-ad-pixel"], [data-ad-beacon"], [data-ad-tag"],
        [data-ad-container-id"], [data-ad-unit-path"], [data-ad-size-mapping"],
        [data-ad-targeting-map"], [data-ad-category-exclusions"], [data-ad-custom-targeting"],
        [data-ad-collapse-empty-div"], [data-ad-force-collapse"], [data-ad-override-width"],
        [data-ad-override-height"], [data-ad-override-display"], [data-ad-safeframe"],
        [data-ad-sandbox"], [data-ad-allow-same-origin"], [data-ad-allow-scripts"],
        [data-ad-allow-forms"], [data-ad-allow-popups"], [data-ad-allow-pointer-lock"],
        [data-ad-allow-top-navigation"], [data-ad-allow-modals"], [data-ad-allow-orientation-lock"],
        [data-ad-allow-presentation"], [data-ad-allow-fullscreen"], [data-ad-allow-payment-request"],
        [data-ad-allow-downloads"], [data-ad-allow-storage-access-by-user-activation"],
        [data-ad-allow-top-navigation-by-user-activation"], [data-ad-allow-popups-to-escape-sandbox"],
        [data-ad-allow-downloads-without-user-activation"],
        /* Selectores de iframes de anuncios */
        iframe[src*="ads"], iframe[src*="adserver"], iframe[src*="doubleclick.net"],
        iframe[src*="googlesyndication.com"], iframe[src*="googleads.g.doubleclick.net"],
        iframe[src*="adservice.google.com"], iframe[src*="amazon-adsystem.com"],
        iframe[src*="adnxs.com"], iframe[src*="criteo.com"], iframe[src*="rubiconproject.com"],
        iframe[src*="pubmatic.com"], iframe[src*="openx.net"], iframe[src*="smartadserver.com"],
        iframe[src*="yieldmo.com"], iframe[src*="bidswitch.net"], iframe[src*="adsrvr.org"],
        iframe[src*="taboola.com"], iframe[src*="outbrain.com"], iframe[src*="zedo.com"],
        iframe[src*="scorecardresearch.com"], iframe[src*="contextweb.com"], iframe[src*="media.net"],
        iframe[src*="adtech.com"], iframe[src*="advertising.com"], iframe[src*="serving-sys.com"],
        iframe[src*="eyeblaster.com"], iframe[src*="revsci.net"], iframe[src*="yieldlab.net"],
        iframe[src*="adform.net"], iframe[src*="appnexus.com"], iframe[src*="casalemedia.com"],
        iframe[src*="quantserve.com"], iframe[src*="turn.com"], iframe[src*="mathtag.com"],
        iframe[src*="sitescout.com"], iframe[src*="simpli.fi"], iframe[src*="fout.jp"],
        iframe[src*="amoad.com"], iframe[src*="genieessp.com"], iframe[src*="adstir.com"],
        iframe[src*="soom.cz"], iframe[src*="innovid.com"], iframe[src*="flashtalking.com"],
        iframe[src*="sizmek.com"], iframe[src*="adroll.com"], iframe[src*="sharethrough.com"],
        iframe[src*="lijit.com"], iframe[src*="districtm.io"], iframe[src*="indexexchange.com"],
        iframe[src*="gumgum.com"], iframe[src*="teads.tv"], iframe[src*="vidible.tv"],
        iframe[src*="spotxchange.com"], iframe[src*="brightroll.com"], iframe[src*="tremorhub.com"],
        iframe[src*="adap.tv"], iframe[src*="lkqd.net"], iframe[src*="stickyadstv.com"],
        iframe[src*="aniview.com"], iframe[src*="playtem.com"], iframe[src*="exoclick.com"],
        iframe[src*="juicyads.com"], iframe[src*="ero-advertising.com"], iframe[src*="plugrush.com"],
        iframe[src*="trafficjunky.net"], iframe[src*="trafficforce.com"], iframe[src*="traffichaus.com"],
        iframe[src*="zeropark.com"], iframe[src*="admaven.com"], iframe[src*="propellerads.com"],
        iframe[src*="popads.net"], iframe[src*="popcash.net"], iframe[src*="onclickads.net"],
        iframe[src*="onclicktop.com"], iframe[src*="ad-maven.com"], iframe[src*="adcash.com"],
        iframe[src*="exdynsrv.com"], iframe[src*="adk2.com"], iframe[src*="adxpansion.com"],
        iframe[src*="adsupply.com"], iframe[src*="adreactor.com"], iframe[src*="adkernel.com"],
        iframe[src*="adtarget.com"], iframe[src*="adverdirect.com"], iframe[src*="adversal.com"],
        iframe[src*="adxpedia.com"], iframe[src*="adxcore.com"], iframe[src*="adxvalue.com"],
        iframe[src*="adxpremium.com"], iframe[src*="adxmarket.com"], iframe[src*="adxpartner.com"],
        iframe[src*="adxnetwork.com"], iframe[src*="adxchange.com"], iframe[src*="adxapi.com"],
        iframe[src*="adxserve.com"], iframe[src*="adxflow.com"], iframe[src*="adxpower.com"],
        iframe[src*="adxengine.com"], iframe[src*="adxplatform.com"], iframe[src*="adxsystem.com"],
        iframe[src*="adxtech.com"], iframe[src*="adxmedia.com"], iframe[src*="adxcreative.com"],
        iframe[src*="adxoptimizer.com"], iframe[src*="adxmonetize.com"], iframe[src*="adxyield.com"],
        iframe[src*="adxperformance.com"], iframe[src*="adxanalytics.com"], iframe[src*="adxtracking.com"],
        iframe[src*="adxpixel.com"], iframe[src*="adxbeacon.com"], iframe[src*="adxtag.com"],
        iframe[src*="adxcontainer.com"], iframe[src*="adxunit.com"], iframe[src*="adxslot.com"],
        iframe[src*="adxframe.com"], iframe[src*="adxbanner.com"], iframe[src*="adxcontent.com"],
        iframe[src*="adxtext.com"], iframe[src*="adximage.com"], iframe[src*="adxvideo.com"],
        iframe[src*="adxsidebar.com"], iframe[src*="adxheader.com"], iframe[src*="adxfooter.com"],
        iframe[src*="adxsticky.com"], iframe[src*="adxfloating.com"], iframe[src*="adxnative.com"],
        iframe[src*="adxsponsored.com"], iframe[src*="adxchoices.com"], iframe[src*="adxfeed.com"],
        iframe[src*="adxg.com"], iframe[src*="adxform.com"], iframe[src*="adxblade.com"],
        iframe[src*="adxcell.com"], iframe[src*="adxition.com"], iframe[src*="adxengage.com"],
        iframe[src*="adxfactor.com"], iframe[src*="adxfusion.com"], iframe[src*="adxmagnet.com"],
        iframe[src*="adxmeta.com"], iframe[src*="adxmotion.com"], iframe[src*="adxroll.com"],
        iframe[src*="adxspirit.com"], iframe[src*="adxstir.com"], iframe[src*="adxswizz.com"],
        iframe[src*="adxtrade.com"], iframe[src*="adxverster.com"], iframe[src*="adxview.com"],
        iframe[src*="adxwave.com"], iframe[src*="adxworx.com"], iframe[src*="adxzerk.com"],
        iframe[src*="adxbutler.com"], iframe[src*="adxcolt.com"], iframe[src*="adxfox.com"],
        iframe[src*="adxfront.com"], iframe[src*="adxgear.com"], iframe[src*="adxgrs.com"],
        iframe[src*="adxhese.com"], iframe[src*="adxhood.com"], iframe[src*="adxinfuse.com"],
        iframe[src*="adxjuggler.com"], iframe[src*="adxlegend.com"], iframe[src*="adxman.com"],
        iframe[src*="adxmarvel.com"], iframe[src*="adxmaster.com"], iframe[src*="adxmedo.com"],
        iframe[src*="adxmicro.com"], iframe[src*="adxmost.com"], iframe[src*="adxnegah.com"],
        iframe[src*="adxnexus.com"], iframe[src*="adxnologies.com"], iframe[src*="adxoperator.com"],
        iframe[src*="adxorika.com"], iframe[src*="adxotomi.com"], iframe[src*="adxperfect.com"],
        iframe[src*="adxplugg.com"], iframe[src*="adxscale.com"], iframe[src*="adxshost.com"],
        iframe[src*="adxshuffle.com"], iframe[src*="adxspruce.com"], iframe[src*="adxstage.com"],
        iframe[src*="adxsteam.com"], iframe[src*="adxswapper.com"], iframe[src*="adxswich.com"],
        iframe[src*="adxsynergy.com"], iframe[src*="adxtegrity.com"], iframe[src*="adxthink.com"],
        iframe[src*="adxtoma.com"], iframe[src*="adxtruth.com"], iframe[src*="adxunity.com"],
        iframe[src*="adxup.com"], iframe[src*="adxverline.com"], iframe[src*="adxverticum.com"],
        iframe[src*="adxvertserve.com"],
        /* Elementos vacíos o muy pequeños que podrían ser placeholders */
        div:empty:not([class*="spacer"]):not([class*="divider"]):not([id*="spacer"]):not([id*="divider"]),
        span:empty, a:empty, p:empty,
        div[style*="height:1px"], div[style*="height: 1px"], div[style*="width:1px"], div[style*="width: 1px"],
        div[style*="height:0px"], div[style*="height: 0px"], div[style*="width:0px"], div[style*="width: 0px"],
        /* Popups y overlays */
        .modal-overlay, .popup-overlay, .lightbox-overlay, .fancybox-overlay,
        .modal-dialog, .popup-window, .lightbox-content, .fancybox-wrap,
        [id*="modal"], [id*="popup"], [id*="lightbox"], [id*="fancybox"],
        [class*="modal"], [class*="popup"], [class*="lightbox"], [class*="fancybox"],
        [role="dialog"], [role="alertdialog"],
        /* Elementos fijos o pegajosos que suelen ser anuncios */
        div[style*="position:fixed"][style*="bottom:0"], div[style*="position:fixed"][style*="top:0"],
        div[style*="position:sticky"][style*="bottom:0"], div[style*="position:sticky"][style*="top:0"],
        /* Selectores de YouTube (ejemplos, pueden necesitar ajustes) */
        ytd-promoted-sparkles-text-search-renderer, ytd-promoted-video-renderer,
        .ytd-display-ad-renderer, .ytd-promoted-sparkles-web-renderer,
        #masthead-ad, #player-ads, .video-ads,
        /* Selectores de Facebook (ejemplos) */
        div[data-pagelet*="FeedUnit_"], div[aria-label="Patrocinado"],
        /* Selectores de Twitter/X (ejemplos) */
        article[data-testid="tweet"][aria-labelledby*="social_context"],
        div[data-testid="placementTracking"],
        /* Selectores de Twitch (ejemplos) */
        .player-ad-overlay, .persistent-player--ad-showing,
        /* Selectores genéricos de "molestias" */
        .cookie-banner, .gdpr-consent, .newsletter-popup, .push-notification-prompt,
        .social-share-buttons.sticky, .floating-chat-widget, .interstitial-message,
        .full-page-takeover, .exit-intent-popup
         {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            max-height: 0 !important;
            max-width: 0 !important;
            overflow: hidden !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            position: absolute !important;
            left: -99999px !important;
            top: -99999px !important;
            pointer-events: none !important;
            z-index: -1 !important;
        }
        /* Para elementos que intentan sobreescribir el overflow */
        body[style*="overflow: hidden !important"], html[style*="overflow: hidden !important"] {
            overflow: auto !important;
        }
        body[style*="overflow-y: hidden !important"], html[style*="overflow-y: hidden !important"] {
            overflow-y: auto !important;
        }
    `;

    /* Aplicar estilos de bloqueo inmediatamente */
    GM_addStyle(blockingStyles);

    /* Función para bloquear scripts de anuncios */
    function blockAdScripts() {
        const scripts = document.querySelectorAll('script[src], script:not([src])');
        const adScriptKeywords = [
            'ad', 'ads', 'advert', 'banner', 'sponsor', 'popup', 'popunder', 'track', 'pixel', 'beacon',
            'doubleclick', 'googleadservices', 'googlesyndication', 'googletagmanager', 'googletagservices',
            'analytics', 'metrics', 'collect', 'segment', 'optimizely', 'hotjar', 'criteo', 'taboola',
            'outbrain', 'revcontent', 'mgid', 'propellerads', 'adroll', 'rubiconproject', 'pubmatic',
            'openx', 'adnxs', 'amazon-adsystem', 'scorecardresearch', 'yieldmo', 'bidswitch', 'adsrvr.org',
            'contextweb', 'media.net', 'adtech', 'serving-sys', 'eyeblaster', 'revsci', 'yieldlab',
            'adform', 'appnexus', 'casalemedia', 'quantserve', 'turn', 'mathtag', 'sitescout', 'simpli.fi',
            'fout.jp', 'amoad.com', 'genieessp.com', 'adstir.com', 'soom.cz', 'innovid.com', 'flashtalking.com',
            'sizmek.com', 'lijit.com', 'districtm.io', 'indexexchange.com', 'gumgum.com', 'teads.tv',
            'vidible.tv', 'spotxchange.com', 'brightroll.com', 'tremorhub.com', 'adap.tv', 'lkqd.net',
            'stickyadstv.com', 'aniview.com', 'playtem.com', 'exoclick.com', 'juicyads.com', 'ero-advertising.com',
            'plugrush.com', 'trafficjunky.net', 'trafficforce.com', 'traffichaus.com', 'zeropark.com',
            'admaven.com', 'popads.net', 'popcash.net', 'onclickads.net', 'onclicktop.com', 'ad-maven.com',
            'adcash.com', 'exdynsrv.com', 'adk2.com', 'adxpansion.com', 'adsupply.com', 'adreactor.com',
            'adkernel.com', 'adtarget.com', 'adverdirect.com', 'adversal.com', 'adxpedia.com',
            'adxcore.com', 'adxvalue.com', 'adxpremium.com', 'adxmarket.com', 'adxpartner.com',
            'adxnetwork.com', 'adxchange.com', 'adxapi.com', 'adxserve.com', 'adxflow.com',
            'adxpower.com', 'adxengine.com', 'adxplatform.com', 'adxsystem.com', 'adxtech.com',
            'adxmedia.com', 'adxcreative.com', 'adxoptimizer.com', 'adxmonetize.com', 'adxyield.com',
            'adxperformance.com', 'adxanalytics.com', 'adxtracking.com', 'adxpixel.com', 'adxbeacon.com',
            'adxtag.com', 'adxcontainer.com', 'adxunit.com', 'adxslot.com', 'adxframe.com',
            'adxbanner.com', 'adxcontent.com', 'adxtext.com', 'adximage.com', 'adxvideo.com',
            'adxsidebar.com', 'adxheader.com', 'adxfooter.com', 'adxsticky.com', 'adxfloating.com',
            'adxnative.com', 'adxsponsored.com', 'adxchoices.com', 'adxfeed.com', 'adxg.com',
            'adxform.com', 'adxblade.com', 'adxcell.com', 'adxition.com', 'adxengage.com',
            'adxfactor.com', 'adxfusion.com', 'adxmagnet.com', 'adxmeta.com', 'adxmotion.com',
            'adxroll.com', 'adxspirit.com', 'adxstir.com', 'adxswizz.com', 'adxtrade.com',
            'adxverster.com', 'adxview.com', 'adxwave.com', 'adxworx.com', 'adxzerk.com',
            'adxbutler.com', 'adxcolt.com', 'adxfox.com', 'adxfront.com', 'adxgear.com',
            'adxgrs.com', 'adxhese.com', 'adxhood.com', 'adxinfuse.com', 'adxjuggler.com',
            'adxlegend.com', 'adxman.com', 'adxmarvel.com', 'adxmaster.com', 'adxmedo.com',
            'adxmicro.com', 'adxmost.com', 'adxnegah.com', 'adxnexus.com', 'adxnologies.com',
            'adxoperator.com', 'adxorika.com', 'adxotomi.com', 'adxperfect.com', 'adxplugg.com',
            'adxscale.com', 'adxshost.com', 'adxshuffle.com', 'adxspruce.com', 'adxstage.com',
            'adxsteam.com', 'adxswapper.com', 'adxswich.com', 'adxsynergy.com', 'adxtegrity.com',
            'adxthink.com', 'adxtoma.com', 'adxtruth.com', 'adxunity.com', 'adxup.com',
            'adxverline.com', 'adxverticum.com', 'adxvertserve.com'
        ];

        scripts.forEach(script => {
            const src = script.src ? script.src.toLowerCase() : '';
            const textContent = script.textContent ? script.textContent.toLowerCase() : '';

            if (adScriptKeywords.some(keyword => src.includes(keyword) || textContent.includes(keyword))) {
                try {
                    script.type = 'text/plain-blocked'; /* Cambiar tipo para evitar ejecución */
                    if (script.parentNode) {
                        script.parentNode.removeChild(script);
                    }
                    config.stats.scriptsBlocked++;
                    if (config.debugMode) {
                        console.log('AdBlocker: Script bloqueado (src/text):', src || textContent.substring(0, 100));
                    }
                } catch (e) {
                    if (config.debugMode) console.warn('AdBlocker: Error removiendo script:', e, script);
                }
            }
        });
    }

    /* Función para eliminar elementos de anuncios (complementa CSS) */
    function removeAdElements(aggressive = false) {
        let adSelectors = [
            'iframe[src*="ads"]', 'iframe[src*="adserver"]', 'iframe[name*="ad"]', 'iframe[id*="ad"]',
            'div[data-ad-status]', 'div[data-ad-unit]', 'div[data-ad-slot]', 'div[data-ad-client]',
            'div[id^="google_ads"]', 'div[id^="div-gpt-ad"]', 'div[id*="taboola"]', 'div[id*="outbrain"]',
            'ins.adsbygoogle', 'div.ad-container', 'div.ad-wrapper', 'div.ad-banner', 'div.advertisement',
            'a[href*="/ads/"]', 'a[href*="doubleclick.net"]', 'a[href*="adclick.g.doubleclick.net"]',
            'img[src*="/ads/"]', 'img[alt*="advertisement"]', 'img[alt*="sponsored"]',
            '[class*="ad-"]', '[id*="ad-"]', '[class*="-ad"]', '[id*="-ad"]',
            '[class*="sponsor"]', '[id*="sponsor"]', '[class*="banner"]', '[id*="banner"]',
            '[class*="popup"]', '[id*="popup"]', '[class*="advert"]', '[id*="advert"]',
            '[aria-label*="ad"], [aria-label*="advertisement"], [aria-label*="sponsored"]',
            '[data-ad-format], [data-ad-layout-key], [data-ad-client], [data-ad-slot], [data-ad-unit]',
            '[data-google-query-id], [data-ad-manager], [data-ad-name], [data-ad-size]',
            '[data-ad-targeting], [data-ad-type], [data-ad-id], [data-ad-index], [data-ad-position]',
            '[data-ad-network], [data-ad-placement], [data-ad-status], [data-ad-impression-url"]',
            '[data-ad-click-url"], [data-ad-viewability-url"], [data-ad-error-url"]',
            '[data-ad-visibility-observer"], [data-ad-responsive"], [data-ad-lazy"]',
            '[data-ad-load"], [data-ad-refresh"], [data-ad-render"], [data-ad-state"]',
            '[data-ad-debug"], [data-ad-test"], [data-ad-preview"], [data-ad-config"]',
            '[data-ad-options"], [data-ad-settings"], [data-ad-properties"], [data-ad-attributes"]',
            '[data-ad-metadata"], [data-ad-info"], [data-ad-details"], [data-ad-data"]',
            '[data-ad-json"], [data-ad-xml"], [data-ad-html"], [data-ad-script"]',
            '[data-ad-iframe"], [data-ad-embed"], [data-ad-object"], [data-ad-applet"]',
            '[data-ad-plugin"], [data-ad-flash"], [data-ad-silverlight"], [data-ad-java"]',
            '[data-ad-activex"], [data-ad-vpaid"], [data-ad-vast"], [data-ad-ima"]',
            '[data-ad-gpt"], [data-ad-dfp"], [data-ad-header-bidding"], [data-ad-prebid"]',
            '[data-ad-postbid"], [data-ad-waterfall"], [data-ad-mediation"], [data-ad-exchange"]',
            '[data-ad-marketplace"], [data-ad-auction"], [data-ad-bid"], [data-ad-cpm"]',
            '[data-ad-cpc"], [data-ad-ctr"], [data-ad-ecpm"], [data-ad-fill-rate"]',
            '[data-ad-impressions"], [data-ad-clicks"], [data-ad-conversions"], [data-ad-revenue"]',
            '[data-ad-profit"], [data-ad-roi"], [data-ad-performance"], [data-ad-analytics"]',
            '[data-ad-tracking"], [data-ad-pixel"], [data-ad-beacon"], [data-ad-tag"]',
            '[data-ad-container-id"], [data-ad-unit-path"], [data-ad-size-mapping"]',
            '[data-ad-targeting-map"], [data-ad-category-exclusions"], [data-ad-custom-targeting"]',
            '[data-ad-collapse-empty-div"], [data-ad-force-collapse"], [data-ad-override-width"]',
            '[data-ad-override-height"], [data-ad-override-display"], [data-ad-safeframe"]',
            '[data-ad-sandbox"], [data-ad-allow-same-origin"], [data-ad-allow-scripts"]',
            '[data-ad-allow-forms"], [data-ad-allow-popups"], [data-ad-allow-pointer-lock"]',
            '[data-ad-allow-top-navigation"], [data-ad-allow-modals"], [data-ad-allow-orientation-lock"]',
            '[data-ad-allow-presentation"], [data-ad-allow-fullscreen"], [data-ad-allow-payment-request"]',
            '[data-ad-allow-downloads"], [data-ad-allow-storage-access-by-user-activation"]',
            '[data-ad-allow-top-navigation-by-user-activation"], [data-ad-allow-popups-to-escape-sandbox"]',
            '[data-ad-allow-downloads-without-user-activation"]'
        ];

        if (aggressive) {
            adSelectors = adSelectors.concat([
                'div[class*="ad-"]:empty', 'div[id*="ad-"]:empty',
                'div:empty:not([class*="spacer"]):not([class*="divider"]):not([id*="spacer"]):not([id*="divider"])', /* Evitar falsos positivos comunes */
                'iframe:not([src])', 'iframe[src="about:blank"]',
                'img[src=""]', 'img[src^="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"]', /* Pixel transparente */
                'a[href="#"]:empty', 'a[href="javascript:void(0)"]:empty',
                'div[style*="width:1px"], div[style*="width: 1px"]', 'div[style*="height:1px"], div[style*="height: 1px"]',
                'div[style*="width:0px"], div[style*="width: 0px"]', 'div[style*="height:0px"], div[style*="height: 0px"]',
                'div[style*="visibility:hidden"][style*="position:absolute"]', /* Elementos ocultos posicionados */
                'div[style*="z-index:9999"]', 'div[style*="z-index: 9999"]', /* Popups con z-index alto */
                'div[style*="z-index:2147483647"]' /* Max z-index */
            ]);
        }

        adSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    removeElement(element, `Selector: ${selector}`);
                });
            } catch (e) {
                if (config.debugMode) console.warn(`AdBlocker: Error con selector "${selector}":`, e);
            }
        });
    }

    /* Función para manejar nuevos nodos añadidos al DOM (MutationObserver) */
    function handleNewNodes() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) { /* Solo elementos */
                        processNodeAndChildrenForObserver(node);
                        traverseShadowDOM(node, processNodeAndChildrenForObserver);
                    }
                });
                /* También comprobar cambios en atributos que podrían revelar un anuncio */
                if (mutation.type === 'attributes' && mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
                     if (isAdElement(mutation.target)) {
                        removeElement(mutation.target, 'Attribute change revealed ad');
                     }
                }
            });
        });

        function processNodeAndChildrenForObserver(node) {
            if (isAdElement(node)) {
                removeElement(node, 'MutationObserver detected ad');
                return; /* Detener el procesamiento de hijos si el padre es eliminado */
            }
            if (node.children) {
                Array.from(node.children).forEach(child => {
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        processNodeAndChildrenForObserver(child);
                    }
                });
            }
        }

        observer.observe(document.documentElement, {
            childList: true,
            subtree: true,
            attributes: true, /* Observar cambios en atributos */
            attributeFilter: ['class', 'id', 'style', 'src', 'href', 'name', 'data-ad-status', 'hidden', 'aria-hidden', 'aria-label', 'role', 'data-ad', 'data-google-query-id'] /* Atributos relevantes */
        });
        if (config.debugMode) console.log('AdBlocker: Advanced MutationObserver started.');
    }

    function traverseShadowDOM(node, visitCallback) {
        if (node.shadowRoot) {
            Array.from(node.shadowRoot.children).forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE) {
                    visitCallback(child);
                    traverseShadowDOM(child, visitCallback);
                }
            });
        }
        if (node.children) {
            Array.from(node.children).forEach(childNode => {
                if (childNode.nodeType === Node.ELEMENT_NODE) {
                    traverseShadowDOM(childNode, visitCallback);
                }
            });
        }
    }

    function blockAdsRecursively(element) {
        if (element.nodeType !== Node.ELEMENT_NODE) return;

        if (isAdElement(element)) {
            removeElement(element, 'Recursive check');
            return;
        }

        if (element.shadowRoot) {
            Array.from(element.shadowRoot.children).forEach(child => blockAdsRecursively(child));
        }

        if (element.children) {
            Array.from(element.children).forEach(child => blockAdsRecursively(child));
        }
    }

    function isAdElement(element) {
        const adKeywords = [
            'ad', 'ads', 'advert', 'advertisement', 'banner', 'sponsor', 'promo', 'promotion',
            'popup', 'popunder', 'interstitial', 'preroll', 'postroll', 'midroll',
            'reklama', 'annonce', 'anuncio', 'publicidade', 'publicidad', 'werbung',
            'google_ads', 'doubleclick', 'adsense', 'adservice', 'adunit', 'adslot',
            'adcontainer', 'adwrapper', 'adplaceholder', 'adbox', 'adframe', 'adbanner',
            'adcontent', 'adtext', 'adimage', 'advideo', 'sidebarad', 'headerad', 'footerad',
            'sticky-ad', 'floating-ad', 'video-ads', 'native-ad', 'sponsored-content',
            'outbrain', 'taboola', 'criteo', 'revcontent', 'mgid', 'propellerads', 'adchoices',
            'feedads', 'gads', 'adform', 'adtech', 'adblade', 'adcell', 'adition', 'adengage',
            'adfactor', 'adfusion', 'admagnet', 'admedia', 'admeta', 'admotion', 'adreactor',
            'adroll', 'adspirit', 'adstir', 'adswizz', 'adtarget', 'adtrade', 'adversal',
            'adverster', 'adview', 'adwave', 'adworx', 'adx', 'adzerk', 'adblade', 'adbutler',
            'adcolt', 'adfox', 'adform', 'adfront', 'adgear', 'adgrs', 'adhese', 'adhood',
            'adinfuse', 'adition', 'adjuggler', 'adlegend', 'adman', 'admarvel', 'admaster',
            'admedo', 'admeta', 'admicro', 'admost', 'adnegah', 'adnexus', 'adnologies',
            'adoperator', 'adorika', 'adotomi', 'adperfect', 'adplugg', 'adscale', 'adserver',
            'adshost', 'adshuffle', 'adspirit', 'adspruce', 'adstage', 'adsteam', 'adsupply',
            'adswapper', 'adswich', 'adsynergy', 'adtegrity', 'adthink', 'adtoma', 'adtruth',
            'adunity', 'adup', 'adverline', 'adverticum', 'advertserve', 'adzerk', 'appnexus',
            'contextweb', 'conversantmedia', 'infolinks', 'intellitxt', 'kontera', 'ligatus',
            'matomymedia', 'media.net', 'meridian', 'netseer', 'pulsepoint', 'rhythmone',
            'sharethrough', 'skimlinks', 'sovrn', 'specificmedia', 'spotxchange', 'tribalfusion',
            'undertone', 'valueclick', 'vibrantmedia', 'vidora', 'viglink', 'xaxis', 'yieldads',
            'yieldbot', 'yieldbuild', 'yieldlab', 'yieldmanager', 'yieldmo', 'zdbb.net',
            'zedo', 'zergnet', 'zumobi', 'bannerflow', 'bannergrabber', 'bannersnack',
            'popads', 'popcash', 'onclickads', 'onclicktop', 'exoclick', 'juicyads', 'eroadvertising',
            'plugrush', 'trafficjunky', 'trafficforce', 'traffichaus', 'zeropark', 'admaven',
            'propelleradsmedia', 'revcontent', 'content.ad'
        ];
        const adAttributes = ['class', 'id', 'style', 'data-ad', 'data-adsbygoogle', 'aria-label', 'role', 'name', 'alt', 'title', 'data-ad-client', 'data-ad-slot', 'data-ad-format', 'data-ad-unit', 'data-ad-layout-key', 'data-ad-manager', 'data-ad-identifier', 'data-ad-name', 'data-ad-type', 'data-ad-channel', 'data-ad-targeting', 'data-ad-params', 'data-ad-size', 'data-ad-dimensions', 'data-ad-network', 'data-ad-placement', 'data-ad-position', 'data-ad-id', 'data-ad-index', 'data-ad-group', 'data-ad-campaign', 'data-ad-creative', 'data-ad-impression-url', 'data-ad-click-url', 'data-ad-viewability-url', 'data-ad-error-url', 'data-ad-visibility-observer', 'data-ad-responsive', 'data-ad-lazy', 'data-ad-load', 'data-ad-refresh', 'data-ad-render', 'data-ad-status', 'data-ad-state', 'data-ad-debug', 'data-ad-test', 'data-ad-preview', 'data-ad-config', 'data-ad-options', 'data-ad-settings', 'data-ad-properties', 'data-ad-attributes', 'data-ad-metadata', 'data-ad-info', 'data-ad-details', 'data-ad-data', 'data-ad-json', 'data-ad-xml', 'data-ad-html', 'data-ad-script', 'data-ad-iframe', 'data-ad-embed', 'data-ad-object', 'data-ad-applet', 'data-ad-plugin', 'data-ad-flash', 'data-ad-silverlight', 'data-ad-java', 'data-ad-activex', 'data-ad-vpaid', 'data-ad-vast', 'data-ad-ima', 'data-ad-gpt', 'data-ad-dfp', 'data-ad-header-bidding', 'data-ad-prebid', 'data-ad-postbid', 'data-ad-waterfall', 'data-ad-mediation', 'data-ad-exchange', 'data-ad-marketplace', 'data-ad-auction', 'data-ad-bid', 'data-ad-cpm', 'data-ad-cpc', 'data-ad-ctr', 'data-ad-ecpm', 'data-ad-fill-rate', 'data-ad-impressions', 'data-ad-clicks', 'data-ad-conversions', 'data-ad-revenue', 'data-ad-profit', 'data-ad-roi', 'data-ad-performance', 'data-ad-analytics', 'data-ad-tracking', 'data-ad-pixel', 'data-ad-beacon', 'data-ad-tag', 'data-ad-container-id', 'data-ad-unit-path', 'data-ad-size-mapping', 'data-ad-targeting-map', 'data-ad-category-exclusions', 'data-ad-custom-targeting', 'data-ad-collapse-empty-div', 'data-ad-force-collapse', 'data-ad-override-width', 'data-ad-override-height', 'data-ad-override-display', 'data-ad-safeframe', 'data-ad-sandbox', 'data-ad-allow-same-origin', 'data-ad-allow-scripts', 'data-ad-allow-forms', 'data-ad-allow-popups', 'data-ad-allow-pointer-lock', 'data-ad-allow-top-navigation', 'data-ad-allow-modals', 'data-ad-allow-orientation-lock', 'data-ad-allow-presentation', 'data-ad-allow-fullscreen', 'data-ad-allow-payment-request', 'data-ad-allow-downloads', 'data-ad-allow-storage-access-by-user-activation', 'data-ad-allow-top-navigation-by-user-activation', 'data-ad-allow-popups-to-escape-sandbox', 'data-ad-allow-downloads-without-user-activation'];

        if (!element || element.nodeType !== Node.ELEMENT_NODE || typeof element.getAttribute !== 'function') {
            return false;
        }

        /* Evitar que el script se marque a sí mismo o a sus elementos de UI como anuncios */
        if (element.id === 'adblocker-stats-div' || (element.classList && element.classList.contains('adblocker-ui-element'))) {
            return false;
        }

        try {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();

            if (config.aggressiveMode) {
                /* Elementos muy pequeños o invisibles con palabras clave son sospechosos */
                if ((rect.width < 2 && rect.height < 2 && rect.width >= 0 && rect.height >= 0) || parseFloat(style.opacity || '1') < 0.05) {
                    const outerHTML = element.outerHTML.toLowerCase();
                    if (adKeywords.some(keyword => outerHTML.includes(keyword))) {
                        if (config.debugMode) console.log('AdBlocker: Tiny/invisible element with ad keyword', element);
                        return true;
                    }
                }

                /* Elementos posicionados fuera de la pantalla */
                if (rect.right < 0 || rect.bottom < 0 || rect.left > window.innerWidth || rect.top > window.innerHeight) {
                    const outerHTML = element.outerHTML.toLowerCase();
                     if (adKeywords.some(keyword => outerHTML.includes(keyword))) {
                        if (config.debugMode) console.log('AdBlocker: Off-screen element with ad keyword', element);
                        return true;
                    }
                }
            }

            /* Comprobación de dimensiones comunes de anuncios */
            const adSizes = [
                { w: 728, h: 90 }, { w: 300, h: 250 }, { w: 336, h: 280 }, { w: 160, h: 600 },
                { w: 120, h: 600 }, { w: 468, h: 60 }, { w: 320, h: 50 }, { w: 320, h: 100 },
                { w: 300, h: 600 }, { w: 970, h: 250 }, { w: 970, h: 90 }, { w: 250, h: 250 },
                { w: 200, h: 200 }, { w: 1, h: 1}, {w: 2, h: 2} /* Píxeles de seguimiento */
            ];
            if (adSizes.some(size => Math.abs(rect.width - size.w) < 10 && Math.abs(rect.height - size.h) < 10)) {
                const outerHTML = element.outerHTML.toLowerCase();
                if (adKeywords.some(keyword => outerHTML.includes(keyword))) {
                    if (config.debugMode) console.log('AdBlocker: Element matches common ad size and has ad keyword', element);
                    return true;
                }
            }

            /* Comprobar elementos fijos/pegajosos */
            if (style.position === 'fixed' || style.position === 'sticky') {
                if ((rect.bottom > window.innerHeight - 20 && rect.height < 250 && rect.width > 30) ||
                    (rect.top < 20 && rect.height < 250 && rect.width > 30) ||
                    (rect.right > window.innerWidth - 20 && rect.width < 250 && rect.height > 30) ||
                    (rect.left < 20 && rect.width < 250 && rect.height > 30) ||
                    (rect.width >= window.innerWidth * 0.9 && rect.height < 150) || /* Banner ancho completo */
                    (rect.height >= window.innerHeight * 0.8 && rect.width < 150)   /* Banner alto completo */
                ) {
                     const outerHTML = element.outerHTML.toLowerCase();
                     if (adKeywords.some(keyword => outerHTML.includes(keyword))) {
                        if (config.debugMode) console.log('AdBlocker: Sticky/fixed element with ad keyword and typical ad position/size', element);
                        return true;
                    }
                }
            }

        } catch (e) { /* Ignorar errores de getComputedStyle o getBoundingClientRect */ }


        for (const attribute of adAttributes) {
            const attrValue = element.getAttribute(attribute);
            if (attrValue) {
                const lowerAttrValue = attrValue.toLowerCase();
                for (const keyword of adKeywords) {
                    if (lowerAttrValue.includes(keyword)) {
                        if (config.debugMode) console.log(`AdBlocker: Keyword '${keyword}' in attribute '${attribute}' for`, element);
                        return true;
                    }
                }
            }
        }

        if (element.tagName === 'IFRAME') {
            const src = element.src ? element.src.toLowerCase() : '';
            if (src === '' || src === 'about:blank') {
                if (element.innerHTML === '' && (element.offsetWidth < 15 || element.offsetHeight < 15) && element.offsetWidth >=0 && element.offsetHeight >=0) {
                     if (config.debugMode) console.log('AdBlocker: Empty/small iframe detected', element);
                     return true;
                }
            }
            const adIframeDomains = ['doubleclick.net', 'googlesyndication.com', 'googleads.g.doubleclick.net', 'adservice.google.com', 'amazon-adsystem.com', 'adnxs.com', 'criteo.com', 'rubiconproject.com', 'pubmatic.com', 'openx.net', 'smartadserver.com', 'yieldmo.com', 'bidswitch.net', 'adsrvr.org', 'taboola.com', 'outbrain.com', 'zedo.com', 'scorecardresearch.com', 'contextweb.com', 'media.net', 'adtech.com', 'advertising.com', 'serving-sys.com', 'eyeblaster.com', 'revsci.net', 'yieldlab.net', 'adform.net', 'appnexus.com', 'casalemedia.com', 'quantserve.com', 'turn.com', 'mathtag.com', 'sitescout.com', 'simpli.fi', 'fout.jp', 'amoad.com', 'genieessp.com', 'adstir.com', 'soom.cz', 'innovid.com', 'flashtalking.com', 'sizmek.com', 'adroll.com', 'sharethrough.com', 'lijit.com', 'districtm.io', 'indexexchange.com', 'gumgum.com', 'teads.tv', 'vidible.tv', 'spotxchange.com', 'brightroll.com', 'tremorhub.com', 'adap.tv', 'lkqd.net', 'stickyadstv.com', 'aniview.com', 'playtem.com', 'exoclick.com', 'juicyads.com', 'ero-advertising.com', 'plugrush.com', 'trafficjunky.net', 'trafficforce.com', 'traffichaus.com', 'zeropark.com', 'admaven.com', 'propellerads.com', 'popads.net', 'popcash.net', 'onclickads.net', 'onclicktop.com', 'ad-maven.com', 'adcash.com', 'exdynsrv.com', 'adk2.com', 'adxpansion.com', 'adsupply.com', 'adreactor.com', 'adkernel.com', 'adtarget.com', 'adverdirect.com', 'adversal.com', 'adxpedia.com', 'adxcore.com', 'adxvalue.com', 'adxpremium.com', 'adxmarket.com', 'adxpartner.com', 'adxnetwork.com', 'adxchange.com', 'adxapi.com', 'adxserve.com', 'adxflow.com', 'adxpower.com', 'adxengine.com', 'adxplatform.com', 'adxsystem.com', 'adxtech.com', 'adxmedia.com', 'adxcreative.com', 'adxoptimizer.com', 'adxmonetize.com', 'adxyield.com', 'adxperformance.com', 'adxanalytics.com', 'adxtracking.com', 'adxpixel.com', 'adxbeacon.com', 'adxtag.com', 'adxcontainer.com', 'adxunit.com', 'adxslot.com', 'adxframe.com', 'adxbanner.com', 'adxcontent.com', 'adxtext.com', 'adximage.com', 'adxvideo.com', 'adxsidebar.com', 'adxheader.com', 'adxfooter.com', 'adxsticky.com', 'adxfloating.com', 'adxnative.com', 'adxsponsored.com', 'adxchoices.com', 'adxfeed.com', 'adxg.com', 'adxform.com', 'adxblade.com', 'adxcell.com', 'adxition.com', 'adxengage.com', 'adxfactor.com', 'adxfusion.com', 'adxmagnet.com', 'adxmeta.com', 'adxmotion.com', 'adxroll.com', 'adxspirit.com', 'adxstir.com', 'adxswizz.com', 'adxtrade.com', 'adxverster.com', 'adxview.com', 'adxwave.com', 'adxworx.com', 'adxzerk.com', 'adxbutler.com', 'adxcolt.com', 'adxfox.com', 'adxfront.com', 'adxgear.com', 'adxgrs.com', 'adxhese.com', 'adxhood.com', 'adxinfuse.com', 'adxjuggler.com', 'adxlegend.com', 'adxman.com', 'adxmarvel.com', 'adxmaster.com', 'adxmedo.com', 'adxmicro.com', 'adxmost.com', 'adxnegah.com', 'adxnexus.com', 'adxnologies.com', 'adxoperator.com', 'adxorika.com', 'adxotomi.com', 'adxperfect.com', 'adxplugg.com', 'adxscale.com', 'adxshost.com', 'adxshuffle.com', 'adxspruce.com', 'adxstage.com', 'adxsteam.com', 'adxswapper.com', 'adxswich.com', 'adxsynergy.com', 'adxtegrity.com', 'adxthink.com', 'adxtoma.com', 'adxtruth.com', 'adxunity.com', 'adxup.com', 'adxverline.com', 'adxverticum.com', 'adxvertserve.com'];
            if (adKeywords.some(keyword => src.includes(keyword)) || adIframeDomains.some(domain => src.includes(domain))) {
                if (config.debugMode) console.log('AdBlocker: Keyword or ad domain in iframe src', element);
                return true;
            }
        }

        if (element.tagName === 'SCRIPT') {
            const src = element.src ? element.src.toLowerCase() : '';
            const textContent = element.textContent ? element.textContent.toLowerCase() : '';
            const scriptKeywords = adKeywords.concat(['track', 'analytics', 'pixel', 'fingerprint', 'collect', 'telemetry', 'beacon', 'segment', 'gtag', 'gaq', 'mixpanel', 'amplitude', 'heap', 'hotjar', 'optimizely', 'crazyegg', 'fullstory', 'inspectlet', 'mouseflow', 'logrocket', 'sentry', 'bugsnag', 'newrelic', 'datadog', 'appdynamics', 'dynatrace', 'akamaihd.net', 'cloudfront.net', 'cloudflare.com', 'fastly.net', 'azureedge.net', 'akamai.net', 'edgekey.net', 'cedexis.com', 'incapsula.com', 'imperva.com', 'distilnetworks.com', 'shapesecurity.com', 'perimeterx.com', 'datadome.co', 'shieldsquare.com', 'humansecurity.com', 'arkoselabs.com', 'f5.com', 'radware.com', 'netacea.com', 'kasada.io', 'threatx.com', 'pingidentity.com', 'okta.com', 'auth0.com', 'onelogin.com', 'duo.com', 'cyberark.com', 'sailpoint.com', 'beyondtrust.com', 'centrify.com', 'thycotic.com', 'balabit.com', 'observeit.com', 'forcepoint.com', 'proofpoint.com', 'mimecast.com', 'barracuda.com', 'cisco.com', 'paloaltonetworks.com', 'fortinet.com', 'checkmk', 'checkpoint.com', 'sophos.com', 'symantec.com', 'mcafee.com', 'trendmicro.com', 'kaspersky.com', 'eset.com', 'bitdefender.com', 'avast.com', 'avg.com', 'malwarebytes.com', 'webroot.com', 'f-secure.com', 'gdatasoftware.com', 'pandasecurity.com', 'comodo.com', 'emsisoft.com', 'zillya.com', 'drweb.com', 'ahnlab.com', 'qihoo360.cn', 'tencent.com', 'baidu.com', 'kingsoft.com', 'rising.com.cn', 'jiangmin.com', 'k7computing.com', 'quickheal.co.in', 'npav.net', 'escanav.com', 'microworldsystems.com', 'protegent360.com', 'unthreat.com', 'totalav.com', 'scanguard.com', 'pcprotect.com', 'bullguard.com', 'norton.com', 'webinspector.com', 'sucuri.net', 'wordfence.com', 'ithemes.com', 'malcare.com', 'patchstack.com', 'ninjafirewall.com', 'wpcerber.com', 'allinone']);
            for (const keyword of scriptKeywords) {
                if (src.includes(keyword) || textContent.includes(keyword)) {
                    if (config.debugMode) console.log(`AdBlocker: Keyword '${keyword}' in SCRIPT tag`, element);
                    if (config.aggressiveMode || (!['analytics', 'track', 'collect', 'telemetry', 'pixel', 'beacon', 'segment', 'gtag', 'gaq'].includes(keyword) && !src.includes('jquery') && !src.includes('gsap') && !src.includes('lodash') && !src.includes('moment') && !src.includes('react') && !src.includes('vue') && !src.includes('angular'))) {
                        return true;
                    }
                }
            }
        }

        if (element.children.length === 1 && element.firstElementChild && element.firstElementChild.tagName === 'IFRAME') {
            if (isAdElement(element.firstElementChild)) {
                if (config.debugMode) console.log('AdBlocker: Element wraps an ad iframe', element);
                return true;
            }
        }

        if (element.tagName === 'DIV' && !element.children.length && (!element.textContent || !element.textContent.trim())) {
            const style = element.style;
            if (style.width && style.height && (parseInt(style.width) > 30 || parseInt(style.height) > 30)) {
                const classId = (element.className + ' ' + element.id).toLowerCase();
                if (adKeywords.some(kw => classId.includes(kw))) {
                    if (config.debugMode) console.log('AdBlocker: Empty div with ad-like class/id and dimensions', element);
                    return true;
                }
            }
        }

        /* Comprobar si el elemento es un 'a' con href a un dominio de publicidad conocido y sin contenido visible significativo */
        if (element.tagName === 'A' && element.href) {
            const adLinkDomains = ['doubleclick.net', 'adservice.google.com', 'redirect.ads', 'syndication.exoclick.com', 'trafficjunky.net', 'outbrain.com', 'taboola.com', 'revcontent.com', 'mgid.com', 'propellerads.com', 'admaven.com', 'popads.net', 'onclickads.net', 'juicyads.com', 'ero-advertising.com', 'plugrush.com', 'trafficforce.com', 'zeropark.com', 'adcash.com', 'adk2.com', 'adxpansion.com', 'adsupply.com', 'adreactor.com', 'adkernel.com', 'adtarget.com', 'adverdirect.com', 'adversal.com', 'adxpedia.com', 'adxcore.com', 'adxvalue.com', 'adxpremium.com', 'adxmarket.com', 'adxpartner.com', 'adxnetwork.com', 'adxchange.com', 'adxapi.com', 'adxserve.com', 'adxflow.com', 'adxpower.com', 'adxengine.com', 'adxplatform.com', 'adxsystem.com', 'adxtech.com', 'adxmedia.com', 'adxcreative.com', 'adxoptimizer.com', 'adxmonetize.com', 'adxyield.com', 'adxperformance.com', 'adxanalytics.com', 'adxtracking.com', 'adxpixel.com', 'adxbeacon.com', 'adxtag.com', 'adxcontainer.com', 'adxunit.com', 'adxslot.com', 'adxframe.com', 'adxbanner.com', 'adxcontent.com', 'adxtext.com', 'adximage.com', 'adxvideo.com', 'adxsidebar.com', 'adxheader.com', 'adxfooter.com', 'adxsticky.com', 'adxfloating.com', 'adxnative.com', 'adxsponsored.com', 'adxchoices.com', 'adxfeed.com', 'adxg.com', 'adxform.com', 'adxblade.com', 'adxcell.com', 'adxition.com', 'adxengage.com', 'adxfactor.com', 'adxfusion.com', 'adxmagnet.com', 'adxmeta.com', 'adxmotion.com', 'adxroll.com', 'adxspirit.com', 'adxstir.com', 'adxswizz.com', 'adxtrade.com', 'adxverster.com', 'adxview.com', 'adxwave.com', 'adxworx.com', 'adxzerk.com', 'adxbutler.com', 'adxcolt.com', 'adxfox.com', 'adxfront.com', 'adxgear.com', 'adxgrs.com', 'adxhese.com', 'adxhood.com', 'adxinfuse.com', 'adxjuggler.com', 'adxlegend.com', 'adxman.com', 'adxmarvel.com', 'adxmaster.com', 'adxmedo.com', 'adxmicro.com', 'adxmost.com', 'adxnegah.com', 'adxnexus.com', 'adxnologies.com', 'adxoperator.com', 'adxorika.com', 'adxotomi.com', 'adxperfect.com', 'adxplugg.com', 'adxscale.com', 'adxshost.com', 'adxshuffle.com', 'adxspruce.com', 'adxstage.com', 'adxsteam.com', 'adxswapper.com', 'adxswich.com', 'adxsynergy.com', 'adxtegrity.com', 'adxthink.com', 'adxtoma.com', 'adxtruth.com', 'adxunity.com', 'adxup.com', 'adxverline.com', 'adxverticum.com', 'adxvertserve.com'];
            const hrefLower = element.href.toLowerCase();
            if (adLinkDomains.some(domain => hrefLower.includes(domain))) {
                if (!element.textContent.trim() && !element.querySelector('img, svg, canvas')) { /* Sin texto visible ni imagen */
                    if (config.debugMode) console.log('AdBlocker: Empty link to ad domain', element);
                    return true;
                }
            }
        }

        return false;
    }
    /* Función para cargar listas de filtros */
    function loadFilterLists() {
        const now = Math.floor(Date.now() / 1000);
        if (now - config.lastUpdate > config.updateInterval || GM_getValue('forceFilterUpdate', false)) {
            GM_setValue('forceFilterUpdate', false); /* Reset flag */
            config.customFilters = []; /* Limpiar filtros antes de recargar */
            let listsLoaded = 0;
            const totalLists = config.filterLists.length;

            config.filterLists.forEach(url => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    timeout: 15000, /* Timeout de 15 segundos por lista */
                    onload: function(response) {
                        listsLoaded++;
                        if (response.status === 200) {
                            const filters = response.responseText.split('\n');
                            filters.forEach(filter => {
                                if (filter && !filter.startsWith('!') && !filter.startsWith('#') && filter.length > 2) {
                                    config.customFilters.push(filter.trim());
                                }
                            });
                            if (config.debugMode) {
                                console.log('Lista de filtros cargada:', url);
                            }
                        } else {
                            if (config.debugMode) {
                                console.warn('Error al cargar lista de filtros:', url, response.status);
                            }
                        }
                        if (listsLoaded === totalLists) {
                            GM_setValue('lastUpdate', now);
                            GM_setValue('customFiltersCache', JSON.stringify(config.customFilters));
                            if (config.debugMode) console.log('Todas las listas de filtros procesadas. Total de filtros:', config.customFilters.length);
                            applyCustomFilters(); /* Re-aplicar filtros después de cargar */
                        }
                    },
                    onerror: function(error) {
                        listsLoaded++;
                        if (config.debugMode) console.error('Error de red al cargar lista de filtros:', url, error);
                        if (listsLoaded === totalLists) {
                             /* Aún así, guardar la fecha de actualización para no reintentar inmediatamente */
                            GM_setValue('lastUpdate', now);
                            if (config.debugMode) console.log('Procesamiento de listas de filtros completado con errores.');
                        }
                    },
                    ontimeout: function() {
                        listsLoaded++;
                        if (config.debugMode) console.warn('Timeout al cargar lista de filtros:', url);
                         if (listsLoaded === totalLists) {
                            GM_setValue('lastUpdate', now);
                            if (config.debugMode) console.log('Procesamiento de listas de filtros completado con timeouts.');
                        }
                    }
                });
            });
        } else {
            /* Cargar filtros desde caché si no es tiempo de actualizar */
            const cachedFilters = GM_getValue('customFiltersCache', null);
            if (cachedFilters) {
                try {
                    config.customFilters = JSON.parse(cachedFilters);
                    if (config.debugMode) console.log('Filtros cargados desde caché. Total:', config.customFilters.length);
                } catch (e) {
                    if (config.debugMode) console.error('Error al parsear filtros cacheados:', e);
                    GM_setValue('forceFilterUpdate', true); /* Forzar actualización en la próxima carga */
                }
            } else {
                 GM_setValue('forceFilterUpdate', true); /* Forzar actualización si no hay caché */
            }
        }
    }

    /* Función para aplicar filtros personalizados */
    function applyCustomFilters() {
        if (!config.customFilters || config.customFilters.length === 0) {
            if (config.debugMode) console.log('No hay filtros personalizados para aplicar.');
            return;
        }
        config.customFilters.forEach(filter => {
            try {
                if (filter.startsWith('||')) {
                    /* Bloquear dominios (principalmente para GM_xmlhttpRequest y fetch, ya manejado) */
                    /* Esta sección podría usarse para eliminar elementos si el script se carga después de que se hayan insertado */
                    const domain = filter.substring(2).split('^')[0].split('$')[0];
                    if (window.location.hostname.includes(domain) || document.documentElement.innerHTML.includes(domain)) {
                        document.querySelectorAll(`script[src*="${domain}"], iframe[src*="${domain}"], img[src*="${domain}"], link[href*="${domain}"], object[data*="${domain}"], embed[src*="${domain}"]`).forEach(element => {
                            removeElement(element, `Custom filter domain block: ${domain}`);
                        });
                    }
                } else if (filter.includes('##') || filter.includes('#?#') || filter.includes('#@#')) {
                    /* Ocultar/eliminar elementos CSS. #?# y #@# son para selectores extendidos en uBlock/AdGuard */
                    let selector = filter.split('##')[1] || filter.split('#?#')[1] || filter.split('#@#')[1];
                    if (selector) {
                        /* Simplificar: eliminar opciones de selector extendido por ahora para compatibilidad básica */
                        selector = selector.split(':style(')[0].split(':remove(')[0].trim();
                        if (selector) {
                            document.querySelectorAll(selector).forEach(element => {
                                removeElement(element, `Custom filter CSS selector: ${selector}`);
                            });
                        }
                    }
                } else if (!filter.includes('$') && (filter.startsWith('.') || filter.startsWith('#') || filter.includes('['))) {
                    /* Asumir que es un selector CSS si no tiene modificadores de uBlock y parece un selector */
                     document.querySelectorAll(filter).forEach(element => {
                        removeElement(element, `Custom filter simple CSS: ${filter}`);
                    });
                }
            } catch (e) {
                if (config.debugMode) {
                    console.error('Error aplicando filtro personalizado:', filter, e);
                }
            }
        });
        if (config.debugMode) console.log('Filtros personalizados aplicados.');
    }

    function removeElement(element, reason = 'Unknown') {
        if (element && element.parentNode) {
            /* Marcar como oculto para el bypass de anti-adblocker antes de remover */
            element.setAttribute('data-adblock-hidden', 'true');
            element.style.setProperty('display', 'none', 'important');
            element.style.setProperty('visibility', 'hidden', 'important');
            element.style.setProperty('width', '0px', 'important');
            element.style.setProperty('height', '0px', 'important');
            element.style.setProperty('opacity', '0', 'important');
            element.style.setProperty('pointer-events', 'none', 'important');

            /* Intentar remover del DOM de forma segura */
            try {
                element.parentNode.removeChild(element);
                config.stats.elementsRemoved++;
                if (config.debugMode) {
                    console.log(`Elemento removido (${reason}):`, element.tagName, element.id, element.className.substring(0,50));
                }
            } catch (e) {
                if (config.debugMode) {
                    console.warn(`Error al remover elemento del DOM (${reason}):`, e, element);
                }
            }
        } else if (config.debugMode && element) {
            /* console.warn(`No se pudo remover el elemento (no parentNode o ya removido, razón: ${reason}):`, element.tagName, element.id, element.className); */
        }
    }

    /* Función para mostrar estadísticas */
    function showStats() {
        let statsDiv = document.getElementById('adblocker-stats-div');
        if (!statsDiv) {
            statsDiv = document.createElement('div');
            statsDiv.id = 'adblocker-stats-div';
            statsDiv.classList.add('adblocker-ui-element'); /* Para evitar que se autobloquee */
            statsDiv.style.position = 'fixed';
            statsDiv.style.bottom = '10px';
            statsDiv.style.right = '10px';
            statsDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
            statsDiv.style.color = 'white';
            statsDiv.style.padding = '12px';
            statsDiv.style.borderRadius = '8px';
            statsDiv.style.zIndex = '2147483647';
            statsDiv.style.fontFamily = 'Arial, sans-serif';
            statsDiv.style.fontSize = '13px';
            statsDiv.style.lineHeight = '1.6';
            statsDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            if (document.body) {
                 document.body.appendChild(statsDiv);
            } else {
                /* Fallback si el body no está listo, aunque en document-start es improbable */
                document.documentElement.appendChild(statsDiv);
            }
        }

        statsDiv.innerHTML = `
            <strong>AdBlocker Avanzado</strong><br>
            Elementos eliminados: ${config.stats.elementsRemoved}<br>
            Scripts bloqueados: ${config.stats.scriptsBlocked}<br>
            Solicitudes bloqueadas: ${config.stats.requestsBlocked}<br>
            Total bloqueado: ${config.stats.elementsRemoved + config.stats.scriptsBlocked + config.stats.requestsBlocked}
        `;
    }

    /* Menú de configuración */
    GM_registerMenuCommand('AdBlocker: Alternar Modo Agresivo', function() {
        config.aggressiveMode = !config.aggressiveMode;
        GM_setValue('aggressiveMode', config.aggressiveMode);
        alert(`Modo agresivo ${config.aggressiveMode ? 'ACTIVADO' : 'DESACTIVADO'}. La página se recargará.`);
        location.reload();
    });

    GM_registerMenuCommand('AdBlocker: Mostrar/Ocultar Estadísticas', function() {
        let statsDiv = document.getElementById('adblocker-stats-div');
        if (statsDiv && statsDiv.style.display !== 'none') {
            statsDiv.style.display = 'none';
            GM_setValue('showStats', false);
        } else {
            showStats(); /* Crea o muestra */
            if (statsDiv) statsDiv.style.display = 'block';
            GM_setValue('showStats', true);
        }
    });

    GM_registerMenuCommand('AdBlocker: Forzar Actualización de Filtros', function() {
        GM_setValue('lastUpdate', 0); /* Forzar la actualización en la próxima carga/llamada */
        GM_setValue('forceFilterUpdate', true);
        alert('Actualización de filtros forzada. Se aplicará al recargar o en la próxima comprobación.');
        loadFilterLists(); /* Intentar cargar inmediatamente */
    });

    GM_registerMenuCommand('AdBlocker: Alternar Modo Depuración', function() {
        config.debugMode = !config.debugMode;
        GM_setValue('debugMode', config.debugMode);
        alert(`Modo depuración ${config.debugMode ? 'ACTIVADO' : 'DESACTIVADO'}.`);
        if (config.debugMode && GM_getValue('showStats', true)) {
            showStats();
        }
    });

    function loadInitialConfig() {
        const savedConfig = GM_getValue('adBlockerConfig', null);
        if (savedConfig) {
            try {
                const parsedConfig = JSON.parse(savedConfig);
                /* Fusionar solo las claves que existen en la configuración por defecto para evitar errores */
                Object.keys(config).forEach(key => {
                    if (parsedConfig.hasOwnProperty(key) && typeof parsedConfig[key] === typeof config[key]) {
                        if (typeof config[key] === 'object' && !Array.isArray(config[key]) && config[key] !== null) {
                             /* Para objetos anidados como 'stats', fusionar con cuidado o reemplazar */
                             if (key !== 'stats') { /* No sobrescribir stats con valores viejos */
                                Object.assign(config[key], parsedConfig[key]);
                             }
                        } else {
                            config[key] = parsedConfig[key];
                        }
                    }
                });
                 if (config.debugMode) console.log('Configuración cargada desde GM_getValue', config);
            } catch (e) {
                if (config.debugMode) console.error('Error al parsear configuración guardada:', e);
            }
        }
        /* Aplicar valores individuales que podrían haber sido establecidos por comandos de menú */
        config.aggressiveMode = GM_getValue('aggressiveMode', config.aggressiveMode);
        config.debugMode = GM_getValue('debugMode', config.debugMode);
        config.lastUpdate = GM_getValue('lastUpdate', config.lastUpdate);
        config.whitelist = GM_getValue('whitelist', []); /* Cargar whitelist */
    }

    function saveConfig() {
        /* No guardar stats en la configuración persistente, ya que son de sesión */
        const configToSave = { ...config };
        delete configToSave.stats;
        delete configToSave.customFilters; /* Los filtros se cachean por separado */
        try {
            GM_setValue('adBlockerConfig', JSON.stringify(configToSave));
        } catch (e) {
            if (config.debugMode) console.error('Error guardando configuración:', e);
        }
    }

    /* Intercepción de Timers */
    function overrideTimers() {
        const originalSetTimeout = window.setTimeout;
        const originalSetInterval = window.setInterval;

        window.setTimeout = function(callback, delay, ...args) {
            if (typeof callback === 'string') {
                if (config.aggressiveMode && (callback.toLowerCase().includes('ad') || callback.toLowerCase().includes('banner'))) {
                    if (config.debugMode) console.log('AdBlocker: Bloqueando setTimeout basado en cadena sospechosa:', callback.substring(0,100));
                    return 0;
                }
            }
            /* Podríamos añadir más heurísticas aquí si es necesario, ej. callback.toString().includes('adKeyword') */
            return originalSetTimeout.call(window, callback, delay, ...args);
        };

        window.setInterval = function(callback, delay, ...args) {
            if (typeof callback === 'string') {
                 if (config.aggressiveMode && (callback.toLowerCase().includes('ad') || callback.toLowerCase().includes('banner'))) {
                    if (config.debugMode) console.log('AdBlocker: Bloqueando setInterval basado en cadena sospechosa:', callback.substring(0,100));
                    return 0;
                }
            }
            return originalSetInterval.call(window, callback, delay, ...args);
        };
        if (config.debugMode) console.log('AdBlocker: Timers (setTimeout, setInterval) interceptados.');
    }

    /* Bypass de Anti-AdBlockers */
    function antiAdBlockerBypass() {
        try {
            const originalGetComputedStyle = window.getComputedStyle;
            window.getComputedStyle = function(element, pseudoElt) {
                const style = originalGetComputedStyle.call(window, element, pseudoElt);
                if (element && element.hasAttribute && element.hasAttribute('data-adblock-hidden')) {
                    const newStyle = {};
                    for (let i = 0; i < style.length; i++) {
                        const prop = style[i];
                        newStyle[prop] = style.getPropertyValue(prop);
                    }
                    newStyle.display = 'block'; /* O su display original si se conociera */
                    newStyle.visibility = 'visible';
                    newStyle.width = element.getAttribute('data-og-width') || 'auto'; /* Restaurar si se guardó */
                    newStyle.height = element.getAttribute('data-og-height') || 'auto';
                    newStyle.opacity = '1';
                    newStyle.getPropertyValue = function(propName) { return this[propName]; };
                    newStyle.setProperty = function() {}; /* No permitir que anti-adblockers lo modifiquen */
                    Object.defineProperty(newStyle, 'length', { get: () => Object.keys(newStyle).filter(k => k !== 'getPropertyValue' && k !== 'setProperty' && k !== 'length').length });
                    return newStyle;
                }
                return style;
            };

            const functionsToCloak = [
                {obj: window, name: 'fetch'},
                {obj: XMLHttpRequest.prototype, name: 'open'},
                {obj: XMLHttpRequest.prototype, name: 'send'},
                {obj: document, name: 'createElement'}
            ];

            functionsToCloak.forEach(item => {
                if (item.obj && typeof item.obj[item.name] === 'function') {
                    const originalToString = item.obj[item.name].toString;
                    Object.defineProperty(item.obj[item.name], 'toString', {
                        value: function() { return `function ${item.name}() { [native code] }`; },
                        writable: false, configurable: false, enumerable: false
                    });
                }
            });

            /* Ocultar variables globales comunes de extensiones de bloqueo */
            try {
                Object.defineProperty(window, 'uBlockOrigin', { get: () => undefined, configurable: false });
                Object.defineProperty(window, 'AdGuard', { get: () => undefined, configurable: false });
                Object.defineProperty(window, '__ABPROFILE_MAST__', { get: () => undefined, configurable: false });
            } catch(e) { /* Ignorar si no se puede definir */}

            if (config.debugMode) console.log('AdBlocker: Medidas anti-adblocker aplicadas.');
        } catch (e) {
            if (config.debugMode) console.error('AdBlocker: Error en antiAdBlockerBypass', e);
        }
    }

    /* Override document.write and writeln */
    const originalDocWrite = document.write;
    const originalDocWriteln = document.writeln;
    const adPatternsForWrite = [/ad(s|d|v|_)?serv(er|ice)/i, /doubleclick/i, /googlead/i, /banner/i, /popup/i, /advertising/i, /sponsor/i, /taboola/i, /outbrain/i, /criteo/i, /adnxs/i, /pubmatic/i, /openx/i, /yieldmo/i, /bidswitch/i, /adsrvr.org/i, /revcontent/i, /mgid.com/i, /propellerads/i, /admaven.com/i, /popads.net/i, /onclickads.net/i, /juicyads.com/i, /ero-advertising.com/i, /plugrush.com/i, /trafficjunky.net/i, /trafficforce.com/i, /zeropark.com/i, /adcash.com/i, /adk2.com/i, /adxpansion.com/i, /adsupply.com/i, /adreactor.com/i, /adkernel.com/i, /adtarget.com/i, /adverdirect.com/i, /adversal.com/i, /adxpedia.com/i, /adxcore.com/i, /adxvalue.com/i, /adxpremium.com/i, /adxmarket.com/i, /adxpartner.com/i, /adxnetwork.com/i, /adxchange.com/i, /adxapi.com/i, /adxserve.com/i, /adxflow.com/i, /adxpower.com/i, /adxengine.com/i, /adxplatform.com/i, /adxsystem.com/i, /adxtech.com/i, /adxmedia.com/i, /adxcreative.com/i, /adxoptimizer.com/i, /adxmonetize.com/i, /adxyield.com/i, /adxperformance.com/i, /adxanalytics.com/i, /adxtracking.com/i, /adxpixel.com/i, /adxbeacon.com/i, /adxtag.com/i, /adxcontainer.com/i, /adxunit.com/i, /adxslot.com/i, /adxframe.com/i, /adxbanner.com/i, /adxcontent.com/i, /adxtext.com/i, /adximage.com/i, /adxvideo.com/i, /adxsidebar.com/i, /adxheader.com/i, /adxfooter.com/i, /adxsticky.com/i, /adxfloating.com/i, /adxnative.com/i, /adxsponsored.com/i, /adxchoices.com/i, /adxfeed.com/i, /adxg.com/i, /adxform.com/i, /adxblade.com/i, /adxcell.com/i, /adxition.com/i, /adxengage.com/i, /adxfactor.com/i, /adxfusion.com/i, /adxmagnet.com/i, /adxmeta.com/i, /adxmotion.com/i, /adxroll.com/i, /adxspirit.com/i, /adxstir.com/i, /adxswizz.com/i, /adxtrade.com/i, /adxverster.com/i, /adxview.com/i, /adxwave.com/i, /adxworx.com/i, /adxzerk.com/i, /adxbutler.com/i, /adxcolt.com/i, /adxfox.com/i, /adxfront.com/i, /adxgear.com/i, /adxgrs.com/i, /adxhese.com/i, /adxhood.com/i, /adxinfuse.com/i, /adxjuggler.com/i, /adxlegend.com/i, /adxman.com/i, /adxmarvel.com/i, /adxmaster.com/i, /adxmedo.com/i, /adxmicro.com/i, /adxmost.com/i, /adxnegah.com/i, /adxnexus.com/i, /adxnologies.com/i, /adxoperator.com/i, /adxorika.com/i, /adxotomi.com/i, /adxperfect.com/i, /adxplugg.com/i, /adxscale.com/i, /adxshost.com/i, /adxshuffle.com/i, /adxspruce.com/i, /adxstage.com/i, /adxsteam.com/i, /adxswapper.com/i, /adxswich.com/i, /adxsynergy.com/i, /adxtegrity.com/i, /adxthink.com/i, /adxtoma.com/i, /adxtruth.com/i, /adxunity.com/i, /adxup.com/i, /adxverline.com/i, /adxverticum.com/i, /adxvertserve.com/];

    document.write = function(...text) {
        const fullText = text.join('').toLowerCase();
        if (adPatternsForWrite.some(pattern => pattern.test(fullText))) {
            if (config.debugMode) console.log('AdBlocker: Bloqueado intento de document.write:', text.join('').substring(0,100));
            config.stats.scriptsBlocked++;
            return;
        }
        return originalDocWrite.apply(document, text);
    };
    document.writeln = function(...text) {
        const fullText = text.join('').toLowerCase();
        if (adPatternsForWrite.some(pattern => pattern.test(fullText))) {
            if (config.debugMode) console.log('AdBlocker: Bloqueado intento de document.writeln:', text.join('').substring(0,100));
            config.stats.scriptsBlocked++;
            return;
        }
        return originalDocWriteln.apply(document, text);
    };
    if (config.debugMode) console.log('AdBlocker: document.write y document.writeln interceptados.');


    /* Inicialización */
    function init() {
        loadInitialConfig(); /* Cargar configuración guardada primero */

        if (config.whitelist.includes(window.location.hostname)) {
            if (config.debugMode) console.log('AdBlocker: Sitio en lista blanca, no se bloqueará nada.');
            if (typeof GM_notification === 'function') {
                GM_notification({
                    text: `AdBlocker: ${window.location.hostname} está en la lista blanca.`,
                    title: 'AdBlocker Info',
                    timeout: 3000
                });
            }
            return;
        }

        if (config.debugMode) console.log('AdBlocker: Iniciando Ultra Bloqueador de Anuncios...');

        overrideTimers();
        antiAdBlockerBypass();

        loadFilterLists(); /* Cargar/actualizar listas de filtros */
        blockAdScripts(); /* Bloquear scripts conocidos inicialmente */
        removeAdElements(config.aggressiveMode); /* Eliminar elementos conocidos inicialmente */
        blockAdsRecursively(document.documentElement); /* Escaneo profundo inicial */
        traverseShadowDOM(document.documentElement, (node) => { /* Escanear Shadow DOMs existentes */
            if (node.nodeType === Node.ELEMENT_NODE) blockAdsRecursively(node);
        });
        applyCustomFilters(); /* Aplicar filtros personalizados después del escaneo inicial */
        blockRequestsByKeywords(); /* Configurar bloqueo de solicitudes de red */

        handleNewNodes(); /* Observar cambios dinámicos en el DOM */


        if (GM_getValue('showStats', true) || config.debugMode) {
            showStats();
        }

        /* Actualizar estadísticas periódicamente y guardar configuración */
        setInterval(() => {
            if (GM_getValue('showStats', true) || config.debugMode) {
                showStats();
            }
            saveConfig(); /* Guardar configuración periódicamente */
        }, 5000); /* Actualizar cada 5 segundos */

        if (config.debugMode) {
            console.log('Ultra Bloqueador de Anuncios iniciado completamente.');
        }
         if (typeof GM_notification === 'function' && (config.stats.elementsRemoved > 0 || config.stats.scriptsBlocked > 0 || config.stats.requestsBlocked > 0)) {
            GM_notification({
                text: `AdBlocker: ${config.stats.elementsRemoved + config.stats.scriptsBlocked + config.stats.requestsBlocked} elementos bloqueados en ${window.location.hostname}.`,
                title: 'AdBlocker Activo',
                timeout: 4000
            });
        }
    }

    /* Esperar a que el DOM esté listo, pero algunas funciones @run-at document-start necesitan ejecutarse antes */
    /* Las funciones que modifican prototipos o interceptan deben ejecutarse lo antes posible */
    overrideTimers();
    antiAdBlockerBypass();
    /* document.write override ya está definido globalmente en el IIFE */
    blockRequestsByKeywords(); /* Configurar esto temprano también */


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* Configuration object */
    function blockRequestsByKeywords() {
    const blockedKeywordsPatterns = [
        /ad\./i, /\.ads/i, /banner/i, /sponsor/i, /reklama/i, /reklamy/i, /* /\.gif/i, /\.jpg/i, /\.jpeg/i, /\.png/i, -- Demasiado agresivo para imágenes genéricas */
        /doubleclick\.net/i, /googleadservices\.com/i, /googlesyndication\.com/i, /adsense/i,
        /adservice/i, /\/ad\//i, /\/ads\//i, /track(er|ing)?/i, /pixel/i, /beacon/i, /delivery/i, /click/i, /view/i,
        /impression/i, /redirect/i, /exchange/i, /yield/i, /popunder/i, /popup/i, /popad/i,
        /analytics/i, /collect/i, /telemetry/i, /stats/i, /metrics/i, /segment/i, /gtag/i, /gaq/i,
        /optimizely/i, /hotjar/i, /crazyegg/i, /mouseflow/i, /fullstory/i, /inspectlet/i, /logrocket/i,
        /scorecardresearch\.com/i, /crwdcntrl\.net/i, /adobedtm\.com/i, /demdex\.net/i, /everesttech\.net/i,
        /quantserve\.com/i, /rubiconproject\.com/i, /openx\.net/i, /pubmatic\.com/i, /criteo\.com/i,
        /adnxs\.com/i, /taboola\.com/i, /outbrain\.com/i, /revcontent\.com/i, /mgid\.com/i, /sharethrough\.com/i,
        /bidswitch\.net/i, /smartadserver\.com/i, /contextweb\.com/i, /media\.net/i, /advertising\.com/i,
        /serving-sys\.com/i, /eyeblaster\.com/i, /revsci\.net/i, /yieldlab\.net/i, /adform\.net/i,
        /appnexus\.com/i, /casalemedia\.com/i, /turn\.com/i, /mathtag\.com/i, /sitescout\.com/i,
        /simpli\.fi/i, /fout\.jp/i, /amoad\.com/i, /genieessp\.com/i, /adstir\.com/i, /soom\.cz/i,
        /innovid\.com/i, /flashtalking\.com/i, /sizmek\.com/i, /adroll\.com/i, /lijit\.com/i,
        /districtm\.io/i, /indexexchange\.com/i, /gumgum\.com/i, /teads\.tv/i, /vidible\.tv/i,
        /spotxchange\.com/i, /brightroll\.com/i, /tremorhub\.com/i, /adap\.tv/i, /lkqd\.net/i,
        /stickyadstv\.com/i, /aniview\.com/i, /playtem\.com/i, /exoclick\.com/i, /juicyads\.com/i,
        /ero-advertising\.com/i, /plugrush\.com/i, /trafficjunky\.net/i, /trafficforce\.com/i,
        /traffichaus\.com/i, /zeropark\.com/i, /admaven\.com/i, /propellerads\.com/i, /popads\.net/i,
        /popcash\.net/i, /onclickads\.net/i, /onclicktop\.com/i, /ad-maven\.com/i, /adcash\.com/i,
        /exdynsrv\.com/i, /adk2\.com/i, /adxpansion\.com/i, /adsupply\.com/i, /adreactor\.com/i,
        /adkernel\.com/i, /adtarget\.com/i, /adverdirect\.com/i, /adversal\.com/i, /adxpedia\.com/i,
        /adxcore\.com/i, /adxvalue\.com/i, /adxpremium\.com/i, /adxmarket\.com/i, /adxpartner\.com/i,
        /adxnetwork\.com/i, /adxchange\.com/i, /adxapi\.com/i, /adxserve\.com/i, /adxflow\.com/i,
        /adxpower\.com/i, /adxengine\.com/i, /adxplatform\.com/i, /adxsystem\.com/i, /adxtech\.com/i,
        /adxmedia\.com/i, /adxcreative\.com/i, /adxoptimizer\.com/i, /adxmonetize\.com/i, /adxyield\.com/i,
        /adxperformance\.com/i, /adxanalytics\.com/i, /adxtracking\.com/i, /adxpixel\.com/i, /adxbeacon\.com/i,
        /adxtag\.com/i, /adxcontainer\.com/i, /adxunit\.com/i, /adxslot\.com/i, /adxframe\.com/i,
        /adxbanner\.com/i, /adxcontent\.com/i, /adxtext\.com/i, /adximage\.com/i, /adxvideo\.com/i,
        /adxsidebar\.com/i, /adxheader\.com/i, /adxfooter\.com/i, /adxsticky\.com/i, /adxfloating\.com/i,
        /adxnative\.com/i, /adxsponsored\.com/i, /adxchoices\.com/i, /adxfeed\.com/i, /adxg\.com/i,
        /adxform\.com/i, /adxblade\.com/i, /adxcell\.com/i, /adxition\.com/i, /adxengage\.com/i,
        /adxfactor\.com/i, /adxfusion\.com/i, /adxmagnet\.com/i, /adxmeta\.com/i, /adxmotion\.com/i,
        /adxroll\.com/i, /adxspirit\.com/i, /adxstir\.com/i, /adxswizz\.com/i, /adxtrade\.com/i,
        /adxverster\.com/i, /adxview\.com/i, /adxwave\.com/i, /adxworx\.com/i, /adxzerk\.com/i,
        /adxbutler\.com/i, /adxcolt\.com/i, /adxfox\.com/i, /adxfront\.com/i, /adxgear\.com/i,
        /adxgrs\.com/i, /adxhese\.com/i, /adxhood\.com/i, /adxinfuse\.com/i, /adxjuggler\.com/i,
        /adxlegend\.com/i, /adxman\.com/i, /adxmarvel\.com/i, /adxmaster\.com/i, /adxmedo\.com/i,
        /adxmicro\.com/i, /adxmost\.com/i, /adxnegah\.com/i, /adxnexus\.com/i, /adxnologies\.com/i,
        /adxoperator\.com/i, /adxorika\.com/i, /adxotomi\.com/i, /adxperfect\.com/i, /adxplugg\.com/i,
        /adxscale\.com/i, /adxshost\.com/i, /adxshuffle\.com/i, /adxspruce\.com/i, /adxstage\.com/i,
        /adxsteam\.com/i, /adxswapper\.com/i, /adxswich\.com/i, /adxsynergy\.com/i, /adxtegrity\.com/i,
        /adxthink\.com/i, /adxtoma\.com/i, /adxtruth\.com/i, /adxunity\.com/i, /adxup\.com/i,
        /adxverline\.com/i, /adxverticum\.com/i, /adxvertserve\.com/i
    ];

    const originalFetch = window.fetch;
    window.fetch = function(url, options) {
        const urlString = (typeof url === 'string') ? url : (url && url.url) ? url.url : '';
        if (urlString && blockedKeywordsPatterns.some(pattern => pattern.test(urlString))) {
            config.stats.requestsBlocked++;
            if (config.debugMode) {
                console.log('AdBlocker: Fetch request bloqueado:', urlString);
            }
            return Promise.reject(new Error('Solicitud bloqueada por AdBlocker Avanzado'));
        }
        return originalFetch.call(this, url, options);
    };

    const originalXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url) {
        if (typeof url === 'string' && blockedKeywordsPatterns.some(pattern => pattern.test(url))) {
            config.stats.requestsBlocked++;
            if (config.debugMode) {
                console.log('AdBlocker: XMLHttpRequest bloqueado:', url);
            }
            /* Lanzar un error o abortar la solicitud de forma que no continúe */
            /* No se puede simplemente retornar; hay que evitar que la solicitud se envíe. */
            /* Esto se logra no llamando al originalXHROpen y posiblemente estableciendo un estado de error. */
            /* Sin embargo, para Tampermonkey, simplemente no llamar al original y no hacer nada más */
            /* puede ser suficiente para que no se envíe, o se puede intentar abortar si se llama a send. */
            /* La forma más segura es interceptar 'send' también. */
            this.isBlockedByAdBlocker = true; /* Marcar para interceptar en 'send' */
            return; /* No llamar a originalXHROpen */
        }
        this.isBlockedByAdBlocker = false;
        return originalXHROpen.apply(this, arguments);
    };

    const originalXHRSend = window.XMLHttpRequest.prototype.send;
    window.XMLHttpRequest.prototype.send = function() {
        if (this.isBlockedByAdBlocker) {
            if (config.debugMode) console.log('AdBlocker: XMLHttpRequest send() prevenido para URL bloqueada.');
            /* Simular un error de red o simplemente no hacer nada */
            /* Disparar un evento de error podría ser más limpio para el código que usa XHR */
            const errorEvent = new ProgressEvent('error');
            if (this.onerror) {
                this.onerror(errorEvent);
            }
            if (this.dispatchEvent) {
                this.dispatchEvent(errorEvent);
            }
            return;
        }
        return originalXHRSend.apply(this, arguments);
    };


    if (config.debugMode) {
        console.log('AdBlocker: Bloqueo de solicitudes por palabras clave activado.');
    }

     /* Bloquear URLs de imágenes de anuncios comunes */
    const adImageUrls = ['/ads/', '/adverts/', 'adbanner', 'adsquare', 'advertisement', 'sponsor', '/popups/', '/banners/', '/adimg/', '/adimage/', '/adpic/', '/adpicture/', '/adgfx/', '/adgraphics/', '/admedia/', '/adserver/', '/adcontent/', '/adtrack/', '/adpixel/', '/adbeacon/', '/adview/', '/adclick/', '/adimpression/', '/adredirect/', '/adexchange/', '/adyield/', '/adtech/', '/adsystem/', '/adplatform/', '/adnetwork/', '/adcreative/', '/adcampaign/', '/adgroup/', '/adunit/', '/adslot/', '/adframe/', '/adbox/', '/adcontainer/', '/adwrapper/', '/adplaceholder/', '/adchoices/', '/feedads/', '/gads/', '/adform/', '/adblade/', '/adcell/', '/adition/', '/adengage/', '/adfactor/', '/adfusion/', '/admagnet/', '/admeta/', '/admotion/', '/adreactor/', '/adroll/', '/adspirit/', '/adstir/', '/adswizz/', '/adtarget/', '/adtrade/', 'adversal', 'adverster', 'adwave', 'adworx', 'adx', 'adzerk', 'adbutler', 'adcolt', 'adfox', 'adfront', 'adgear', 'adgrs', 'adhese', 'adhood', 'adinfuse', 'adjuggler', 'adlegend', 'adman', 'admarvel', 'admaster', 'admedo', 'admicro', 'admost', 'adnegah', 'adnexus', 'adnologies', 'adoperator', 'adorika', 'adotomi', 'adperfect', 'adplugg', 'adscale', 'adshost', 'adshuffle', 'adspruce', 'adstage', 'adsteam', 'adsupply', 'adswapper', 'adswich', 'adsynergy', 'adtegrity', 'adthink', 'adtoma', 'adtruth', 'adunity', 'adup', 'adverline', 'adverticum', 'advertserve', 'appnexus', 'contextweb', 'conversantmedia', 'infolinks', 'intellitxt', 'kontera', 'ligatus', 'matomymedia', 'media.net', 'meridian', 'netseer', 'pulsepoint', 'rhythmone', 'sharethrough', 'skimlinks', 'sovrn', 'specificmedia', 'spotxchange', 'tribalfusion', 'undertone', 'valueclick', 'vibrantmedia', 'vidora', 'viglink', 'xaxis', 'yieldads', 'yieldbot', 'yieldbuild', 'yieldlab', 'yieldmanager', 'yieldmo', 'zdbb.net', 'zedo', 'zergnet', 'zumobi', 'bannerflow', 'bannergrabber', 'bannersnack', 'popads', 'popcash', 'onclickads', 'onclicktop', 'exoclick', 'juicyads', 'eroadvertising', 'plugrush', 'trafficjunky', 'trafficforce', 'traffichaus', 'zeropark', 'admaven', 'propelleradsmedia', 'revcontent', 'content.ad'];
    adImageUrls.forEach(urlPart => {
        try {
            document.querySelectorAll(`img[src*="${urlPart}"i], div[style*="background-image"][style*="${urlPart}"i], a[style*="background-image"][style*="${urlPart}"i]`).forEach(el => removeElement(el, `Common ad image URL/style: ${urlPart}`));
        } catch (e) {
            if (config.debugMode) console.warn(`Error con selector para adImageUrls: img[src*="${urlPart}"i]`, e);
        }
    });

    } 

})();
