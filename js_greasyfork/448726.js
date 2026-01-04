// ==UserScript==
// @name         Cookie Consent & Login Request Remover
// @namespace    https://greasyfork.org/en/scripts/448726-cookie-consent-login-request-remover/
// @version      0.1.7
// @description  Enjoy web navigation without cookie consent and login request \(*.*)/!
// @author       BLIBWU
// @match        *://*/*
// @exclude      https://*chuppito.fr/*
// @exclude      https://*facebook.com/*
// @exclude      https://*instagram.com/*
// @exclude      https://www.pinterest.*/business/*
// @exclude      https://www.pinterest.*/login/
// @exclude      https://www.tiktok.com/login*
// @exclude      https://www.tiktok.com/signup*
// @exclude      https://*x.com/i/flow/*
// @grant        none
// @run-at       document-start
// @icon         data:image/x-icon;base64,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AA0FCxMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGRspAAAAABFeiJDKlvT6/5P3/v+U+P//lvj//5X0+/+Q4en/kOPs/5b2/v+V+P//lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lfn//5Tz+f+M4ef/lOXt/5T4//+T+P//lff//5X4//+B5Oz/P2p3jv///wAIEBYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQkBKAP///wBKYmmHjuDm/5H5//+T+P//lPf//5T3//+V+P//lfj//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+V+P//lfj//5T3//+U9///lPf//5H6//9qwsf2HzZCSCZFUAACChEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKis2ACs2QAAlKzUzdq216Jb4/f+U+P//lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//47y9/9VkJS9AAAADwgPHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIPHwAAAAABRmhygore4/+W+v//lff//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPj//4PZ4PNJaG9RaJqiAAUZKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABsdLAAWKDQABREdF2qdpr+V7vP/lPj//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///kfP5/3i8x5AAAAADFyIwABcWIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwj4wAhM7UAFmAjXWQ4un/lfn//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///kPX8/43e6bRzlacRdqKyADBSXgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6V2QAMUNREYLEzsSW9v7/lPf//5T3//+U9///lPf//5T3//+V9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lPf//5X3//+U9///lPf//5T3//+U9///jff//4Pv+f2Bx9Jtwf//AAAWKwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMuPABsn6gAYYyWTY3i6PeV+f//lPf//5T3//+V9v//k/f9/5X5//+X+f//lvj//5T4//+U+P//lPj//5T3//+U9///lPf//5T3//+U9///lPf//5T3//+U9///lff//5f4/v+U9v//k/X//5X3//+V9///kvf//4P2//+D2uLPTmx0GExzegBpeHoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADU8SwD///8AbamwlZPz9/+U+P//lPf//5T3//+U9///ke30/4na3/+X7vP/l/j//5L3//+S9/3/k/j//5T3//+U9///lPf//5T3//+U9///lPf//5T4//+U9///lvb+/5Dp7v+D3uX/lPX//5b3//+W9///lfb//4b1//+F4uz8WIiNW3a0uQAAAgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADJFUAAqMz8VfbzD0Jb4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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhYfAAYIEQAMDBUADQ4XABkaJAAaHCUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///////8AAP///////wAA//wAB///AAD/8AAA//8AAP/AAAB//wAA/4AAAB//AAD/AAAAD/8AAP4AAAAH/wAA/AAAAAP/AAD8AAAAAf8AAPwAAAAAHwAA+AAAAAADAAD4AAAAAAMAAPgAAAAAAwAA8AAAAAADAADgAAAAAAMAAOAAAAAAAwAA4AAAAAADAADgAAAAAAMAAOAAAAAAAwAA4AAAAAB/AADgAAAAAH8AAOAAAAAAfwAA4AAAAAB/AADgAAAAAP8AAPAAAAAA/wAA8AAAAAD/AADwAAAAAP8AAPAAAAAA/wAA8AAAAAD/AADwAAAAAP8AAPAAAAAB/wAA+AAAAAH/AAD4AAAAAf8AAPgAAAAB/wAA+AAAAAD/AAD4AAAAAP8AAPgAAAAA/wAA8AAAAAD/AADwAAAAAP8AAPAAAAAA/wAA8AD/+AD/AADwAP/4AP8AAPAB//wA/wAA8AP//gD/AADwB///AP8AAPAf///A/wAA8H//////AAA=
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/448726/Cookie%20Consent%20%20Login%20Request%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/448726/Cookie%20Consent%20%20Login%20Request%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

//1. Add custom style...
    var custom_style = document.createElement('style');

    function add_cookie_global_style() {
        //Html & Body
        custom_style.textContent +=
            'html, body { overflow: initial !important; pointer-events: initial !important; }\n';

        //Data
        custom_style.textContent +=
            'body [data-cookie]:not(article), body [data-cookie-notice]:not(article), body [data-cookie-path]:not(article), body [data-popup-cookies]:not(article), body [data-sp-cc]:not(article) { display: none !important; }\n';

        //CC (Cookie Consent | cc-)
        //Exclude Cambridge Dictionary (https://dictionary.cambridge.org/), Carter-Cash (https://www.carter-cash.com/), Honor (https://www.hihonor.com/), Kana (https://www.kana.fr/) and Waze Centercode (https://waze.centercode.com/).
        if (!document.location.href.includes('/dictionary.cambridge.org') && !document.location.href.includes('/www.carter-cash.com') && !document.location.href.includes('/www.hihonor.com') && !document.location.href.includes('/www.kana.fr') && !document.location.href.includes('/waze.centercode.com')) {
            custom_style.textContent +=
                'body [aria-label*="cc-" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="cc-" i]:not(article), body [data-m*="cc-" i]:not(article), body [data-name*="cc-" i]:not(article), body [data-t*="cc-" i]:not(article), body [data-test-id*="cc-" i]:not(article), body [data-testid*="cc-" i]:not(article), body [data-type*="cc-" i]:not(article), body [data-widget*="cc-" i]:not(article) { display: none !important; }\n' +
                'body [class^="cc-" i]:not(article), body [class*=" cc-" i]:not(article), body [class*="-cc-" i]:not(article), body [class*="_cc-" i]:not(article) { display: none !important; }\n' +
                'body [id^="cc-" i]:not(article), body [id*=" cc-" i]:not(article), body [id*="-cc-" i]:not(article), body [id*="_cc-" i]:not(article) { display: none !important; }\n' +
                'body [name^="cc-" i]:not(article), body [name*="-cc-" i]:not(article), body [name*="_cc-" i]:not(article) { display: none !important; }\n';
        }

        //CC (Cookie Consent | cc_)
        //Exclude Cambridge Dictionary (https://dictionary.cambridge.org/) and Reverso (https://www.reverso.net/).
        if (!document.location.href.includes('/dictionary.cambridge.org') && !document.location.href.includes('.reverso.net')) {
            custom_style.textContent +=
                'body [aria-label*="cc_" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="cc_" i]:not(article), body [data-m*="cc_" i]:not(article), body [data-name*="cc_" i]:not(article), body [data-t*="cc_" i]:not(article), body [data-test-id*="cc_" i]:not(article), body [data-testid*="cc_" i]:not(article), body [data-type*="cc_" i]:not(article), body [data-widget*="cc-" i]:not(article) { display: none !important; }\n' +
                'body [class^="cc_" i]:not(article), body [class*=" cc_" i]:not(article), body [class*="-cc_" i]:not(article), body [class*="_cc_" i]:not(article) { display: none !important; }\n' +
                'body [id^="cc_" i]:not(article), body [id*=" cc_" i]:not(article), body [id*="-cc_" i]:not(article), body [id*="_cc_" i]:not(article) { display: none !important; }\n' +
                'body [name*="cc_" i]:not(article), body [name*="-cc_" i]:not(article), body [name*="_cc_" i]:not(article) { display: none !important; }\n';
        }

        //CMP (Consent Management Platforms)
        //Exclude Amazon (https://www.amazon.fr/), AMD (https://www.amd.com/ | https://community.amd.com/), Boulanger (https://www.boulanger.com/), GSMArena (https://www.gsmarena.com/), Kiabi (https://www.kiabi.com/), Logitech (https://www.logitech.com/ | https://www.logitechg.com/), MANN-FILTER (https://www.mann-filter.com/), Microsoft (https://www.microsoft.com/), Sony (https://www.sony.fr/), TCL (https://www.tcl.com/) and Under Amour (https://www.underarmour.fr/).
        if (!document.location.href.includes('/www.amazon.') && !document.location.href.includes('.amd.com') && !document.location.href.includes('/www.boulanger.com') && !document.location.href.includes('/www.gsmarena.com') && !document.location.href.includes('/www.kiabi.com') && !document.location.href.includes('/www.logitech.com') && !document.location.href.includes('/www.logitechg.com') && !document.location.href.includes('/www.mann-filter.com') && !document.location.href.includes('/www.microsoft.com') && !document.location.href.includes('/www.sony.') && !document.location.href.includes('/www.tcl.com') && !document.location.href.includes('/www.underarmour.fr')) {
            custom_style.textContent +=
                'body [aria-label*="cmp" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="cmp" i]:not(article), body [data-m*="cmp" i]:not(article), body [data-name*="cmp" i]:not(article), body [data-t*="cmp" i]:not(article), body [data-test-id*="cmp" i]:not(article), body [data-testid*="cmp" i]:not(article), body [data-type*="cmp" i]:not(article), body [data-widget*="cmp" i]:not(article) { display: none !important; }\n' +
                'body [class^="cmp" i]:not(article), body [class*=" cmp" i]:not(article), body [class*="-cmp" i]:not(article), body [class*="_cmp" i]:not(article) { display: none !important; }\n' +
                'body [id^="cmp" i]:not(article), body [id*=" cmp" i]:not(article), body [id*="-cmp" i]:not(article), body [id*="_cmp" i]:not(article) { display: none !important; }\n' +
                'body [name*="cmp" i]:not(article) { display: none !important; }\n';
        }

        //Consent
        //Exclude Amazon (https://www.amazon.fr/), France Connect, GOG (https://www.gog.com/) and Docaposte Trust & Sign.
        if (!document.location.href.includes('/www.amazon.') && !document.location.href.includes('/app.franceconnect.gouv.fr') && !document.location.href.includes('/www.gog.com') && !document.location.href.includes('/sig-1.trustnsign.docaposte.com')) {
            custom_style.textContent +=
                'body [aria-label*="consent" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="consent" i]:not(article), body [data-m*="consent" i]:not(article), body [data-name*="consent" i]:not(article), body [data-t*="consent" i]:not(article), body [data-test-id*="consent" i]:not(article), body [data-testid*="consent" i]:not(article), body [data-type*="consent" i]:not(article), body [data-widget*="consent" i]:not(article) { display: none !important; }\n' +
                'body [class^="consent" i]:not(article), body [class*=" consent" i]:not(article), body [class*="-consent" i]:not(article), body [class*="_consent" i]:not(article) { display: none !important; }\n' +
                'body [id^="consent" i]:not(article), body [id*=" consent" i]:not(article), body [id*="-consent" i]:not(article), body [id*="_consent" i]:not(article) { display: none !important; }\n' +
                'body [name*="consent" i]:not(article) { display: none !important; }\n';
        }

        //Cookie
        //Exclude Realme Community (https://c.realme.com/) and Lascaux Dordogne (https://www.lascaux-dordogne.com/).
        if (!document.location.href.includes('/c.realme.com') && !document.location.href.includes('/www.lascaux-dordogne.com')) {
            custom_style.textContent +=
                'body [aria-label*="cookie" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="cookie" i]:not(article), body [data-m*="cookie" i]:not(article), body [data-name*="cookie" i]:not(article), body [data-t*="cookie" i]:not(article), body [data-test-id*="cookie" i]:not(article), body [data-testid*="cookie" i]:not(article), body [data-type*="cookie" i]:not(article), body [data-widget*="cookie" i]:not(article) { display: none !important; }\n' +
                'body [class^="cookie" i]:not(article), body [class*=" cookie" i]:not(article), body [class*="-cookie" i]:not(article), body [class*="_cookie" i]:not(article) { display: none !important; }\n' +
                'body [id^="cookie" i]:not(article), body [id*=" cookie" i]:not(article), body [id*="-cookie" i]:not(article), body [id*="_cookie" i]:not(article) { display: none !important; }\n' +
                'body [name*="cookie" i]:not(article) { display: none !important; }\n';
        }

        //GDPR (General Data Protection Regulation)
        //Exclude Motointegrator Mobile (https://m.motointegrator.fr/).
        if (!document.location.href.includes('/m.motointegrator.')) {
            custom_style.textContent +=
                'body [aria-label*="gdpr" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="gdpr" i]:not(article), body [data-m*="gdpr" i]:not(article), body [data-name*="gdpr" i]:not(article), body [data-t*="gdpr" i]:not(article), body [data-test-id*="gdpr" i]:not(article), body [data-testid*="gdpr" i]:not(article), body [data-type*="gdpr" i]:not(article), body [data-widget*="gdpr" i]:not(article) { display: none !important; }\n' +
                'body [class^="gdpr" i]:not(article), body [class*=" gdpr" i]:not(article), body [class*="-gdpr" i]:not(article), body [class*="_gdpr" i]:not(article) { display: none !important; }\n' +
                'body [id^="gdpr" i]:not(article), body [id*=" gdpr" i]:not(article), body [id*="-gdpr" i]:not(article), body [id*="_gdpr" i]:not(article) { display: none !important; }\n' +
                'body [name*="gdpr" i]:not(article) { display: none !important; }\n';
        }

        //Policy
        //Exclude Microsoft (https://www.microsoft.com/).
        if (!document.location.href.includes('/www.microsoft.com')) {
            custom_style.textContent +=
                'body [aria-label*="policy" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="policy" i]:not(article), body [data-m*="policy" i]:not(article), body [data-name*="policy" i]:not(article), body [data-t*="policy" i]:not(article), body [data-test-id*="policy" i]:not(article), body [data-testid*="policy" i]:not(article), body [data-type*="policy" i]:not(article), body [data-widget*="policy" i]:not(article) { display: none !important; }\n' +
                'body [class^="policy" i]:not(article), body [class*=" policy" i]:not(article), body [class*="-policy" i]:not(article), body [class*="_policy" i]:not(article) { display: none !important; }\n' +
                'body [id^="policy" i]:not(article), body [id*=" policy" i]:not(article), body [id*="-policy" i]:not(article), body [id*="_policy" i]:not(article) { display: none !important; }\n' +
                'body [name*="policy" i]:not(article) { display: none !important; }\n';
        }

        //Privacy
        //Exclude Realme Community (https://c.realme.com/).
        if (!document.location.href.includes('/c.realme.com')) {
            custom_style.textContent +=
                'body [aria-label*="privacy" i]:not(article) { display: none !important; }\n' +
                'body [data-controller*="privacy" i]:not(article), body [data-m*="privacy" i]:not(article), body [data-name*="privacy" i]:not(article), body [data-t*="privacy" i]:not(article), body [data-test-id*="privacy" i]:not(article), body [data-testid*="privacy" i]:not(article), body [data-type*="privacy" i]:not(article), body [data-widget*="privacy" i]:not(article) { display: none !important; }\n' +
                'body [class^="privacy" i]:not(article), body [class*=" privacy" i]:not(article), body [class*="-privacy" i]:not(article), body [class*="_privacy" i]:not(article) { display: none !important; }\n' +
                'body [id^="privacy" i]:not(article), body [id*=" privacy" i]:not(article), body [id*="-privacy" i]:not(article), body [id*="_privacy" i]:not(article) { display: none !important; }\n' +
                'body [name*="privacy" i]:not(article) { display: none !important; }\n';
        }

        //RGPD (Règlement Général sur la Protection des Données)
        custom_style.textContent +=
            'body [aria-label*="rgpd" i]:not(article) { display: none !important; }\n' +
            'body [data-controller*="rgpd" i]:not(article), body [data-m*="rgpd" i]:not(article), body [data-name*="rgpd" i]:not(article), body [data-t*="rgpd" i]:not(article), body [data-test-id*="rgpd" i]:not(article), body [data-testid*="rgpd" i]:not(article), body [data-type*="rgpd" i]:not(article), body [data-widget*="rgpd" i]:not(article) { display: none !important; }\n' +
            'body [class^="rgpd" i]:not(article), body [class*=" rgpd" i]:not(article), body [class*="-rgpd" i]:not(article), body [class*="_rgpd" i]:not(article) { display: none !important; }\n' +
            'body [id^="rgpd" i]:not(article), body [id*=" rgpd" i]:not(article), body [id*="-rgpd" i]:not(article), body [id*="_rgpd" i]:not(article) { display: none !important; }\n' +
            'body [name*="rgpd" i]:not(article) { display: none !important; }\n';
    }

    function add_cookie_module_style() {
        //Axeptio (https://www.axeptio.eu/)
        custom_style.textContent +=
            '#axeptio_overlay, #digiconsentpopinwrapper { display: none !important; }\n';

        //Borlabs (https://borlabs.io/)
        custom_style.textContent +=
            '#BorlabsCookieBox { display: none !important; }\n';

        //Civic UK (https://www.civicuk.com/)
        custom_style.textContent +=
            '#ccc { display: none !important; }\n';

        //Clickio (https://clickio.com/)
        custom_style.textContent +=
            '[aria-label="cookieconsent"], #cl-consent { display: none !important; }\n';

        //Complianz (https://complianz.io/)
        custom_style.textContent +=
            '#cmplz-cookiebanner-container { display: none !important; }\n';

        //Confirmic (https://confirmic.com/)
        custom_style.textContent +=
            '#mtm-root-container { display: none !important; }\n';

        //Consent Manager (https://www.consentmanager.fr/)
        custom_style.textContent +=
            '#cmpwrapper, #cmpbox { display: none !important; }\n';

        //CookieBAR (https://cookie-bar.eu/)
        custom_style.textContent +=
            'div#cookie-bar { display: none !important; }\n';

        //CookieFirst (https://cookiefirst.com/)
        custom_style.textContent +=
            '.cookiefirst-root, #cookiefirst-root { display: none !important; }\n';

        //Cookie information (https://cookieinformation.com/)
        custom_style.textContent +=
            'html.noScroll, html.noScroll body { overflow: initial !important; }\n' +
            'div#cookie-information-template-wrapper { display: none !important; }\n';

        //CookieYes (https://www.cookieyes.com/)
        custom_style.textContent +=
            '[class^="cky-consent"], [class*=" cky-consent"] { display: none !important; }\n';

        //Devowl (https://devowl.io/)
        custom_style.textContent +=
            'body > * { filter: none !important; }\n' +
            '[id^="cntnt-"], [id*=" cntnt-"] { display: none !important; }\n';

        //Didomi (https://www.didomi.io/)
        custom_style.textContent +=
            '#didomi-popup, #didomi-host { display: none !important; }\n' +
            'body.didomi-popup-open { overflow: initial !important; position: initial !important; }\n';

        //Ethyca (https://ethyca.com/)
        custom_style.textContent +=
            '#cconsent-bar { display: none !important; }\n';

        //FastCMP (https://corporate.fastcmp.com/)
        custom_style.textContent +=
            'button#fast-cmp-settings, div#fast-cmp-root, img#fast-cmp-tracing { display: none !important; }\n' +
            'html[data-fast-cmp-locked] body { position: initial !important; }';

        //GDPR Legal Cookie App for Shopify (https://gdpr-legal-cookie.myshopify.com/)
        custom_style.textContent +=
            'body > div#banner-wrapper { display: none !important; }\n';

        //Hu-manity (https://hu-manity.co/)
        custom_style.textContent +=
            'div[aria-label="Cookie Compliance"] { display: none !important; }\n';

        //Illow (https://illow.io/)
        custom_style.textContent +=
            '#illow-banner-widget { display: none !important; }\n';

        //Iubenda (https://www.iubenda.com/)
        custom_style.textContent +=
            '#iubenda-cs-banner { display: none !important; }\n';

        //js-cookie (https://github.com/js-cookie/js-cookie)
        custom_style.textContent +=
            '#js-cookie { display: none !important; }\n';

        //Ketch (https://www.ketch.com/)
        custom_style.textContent +=
            '#lanyard_root { display: none !important; }\n';

        //Linea Gráfica (https://www.lineagrafica.es/)
        custom_style.textContent +=
            '[class^="lgcookieslaw"], [class*=" lgcookieslaw"], [id^="lgcookieslaw"], [id*=" lgcookieslaw"] { display: none !important; }\n';

        //Mine PrivacyOps (https://business.saymine.com/)
        custom_style.textContent +=
            '#CybotCookiebotDialogBodyUnderlay, #CybotCookiebotDialog { display: none !important; }\n';

        //OceanWP (https://oceanwp.org/)
        custom_style.textContent +=
            '#ocn-cookie-wrap { display: none !important; }\n';

        //Openli (https://openli.com/)
        custom_style.textContent +=
            '.legalmonster-cleanslate { display: none !important; }\n';

        //OneTrust (https://www.onetrust.fr/)
        custom_style.textContent +=
            '.js-consent-banner, #onetrust-consent-sdk { display: none !important; }\n' +
            '[class^="optanon-"], [class*=" optanon-"], #optanon { display: none !important; }\n';

        //Orejime (https://orejime.empreintedigitale.fr/)
        custom_style.textContent +=
            '#orejime { display: none !important; }\n' +
            'body[class^="orejime"], body[class*=" orejime"] { position: initial !important; }\n';

        //Orest Bida (https://orestbida.com/)
        custom_style.textContent +=
            '#cc_div { display: none !important; }\n';

        //Osano (https://www.osano.com/)
        custom_style.textContent +=
            '.osano-cm-dialog { display: none !important; }\n';

        //Quantcast (https://www.quantcast.com/)
        custom_style.textContent +=
            '#qc-cmp2-container { display: none !important; }\n';

        //Secure Privacy (https://secureprivacy.ai/)
        custom_style.textContent +=
            '.sp-overlay, #main-cookie-banner { display: none !important; }\n';

        //Sibbo Ventures (https://sibboventures.com/)
        custom_style.textContent +=
            'sibbo-cmp-layout { display: none !important; }\n';

        //Seers (https://seersco.com/)
        custom_style.textContent +=
            '#SeersPWVBannerContainer { display: none !important; }\n';

        //Sirdata (https://www.sirdata.com/)
        custom_style.textContent +=
            '#sd-cmp { display: none !important; }\n';

        //Tarteaucitron (https://tarteaucitron.io/)
        custom_style.textContent +=
            '#tarteaucitronRoot { display: none !important; }\n';

        //Tealium (https://tealium.com/)
        custom_style.textContent +=
            '#__tealiumGDPRecModal { display: none !important; }\n';

        //Truendo (https://www.truendo.com/)
        custom_style.textContent +=
            '.truendo_container .tru_overlay, .truendo_container .tru_cookie-dialog_wrapper { display: none !important; }\n';

        //TrustArc (https://trustarc.com/)
        custom_style.textContent +=
            '.truste_overlay, .truste_box_overlay, #trustarcNoticeFrame, #truste-consent-track { display: none !important; }\n';

        //Unknown -> Websites with sd-cmp- (https://www.journaldugeek.com/ | https://lecrabeinfo.net/)
        custom_style.textContent +=
            'html[class^="sd-cmp-"], html[class*=" sd-cmp-"] { overflow: initial !important; }\n';

        //Unknown -> Websites with sp-message (https://www.bbc.com/ | https://www.gentside.com/ | https://namemc.com/ | https://www.politico.eu/ ...)
        custom_style.textContent +=
            'body > div[id^="sp_message_container"], body > div[id*=" sp_message_container"] { display: none !important; }\n' +
            'html.sp-message-open > body { margin-top: initial !important; overflow: initial !important; position: initial !important; }\n';

        //Unknown -> Websites with tc-modal-open (https://www.edf.fr/)
        custom_style.textContent +=
            'body.tc-modal-open { position: initial !important; }\n';

        //Usercentrics (https://usercentrics.com/)
        custom_style.textContent +=
            'body > div#usercentrics-button, #usercentrics-root { display: none !important; }\n' +
            '.overflowHidden { overflow: initial !important; }\n';

        //Webtoffee (https://www.webtoffee.com/)
        custom_style.textContent +=
            '#cookie-law-info-bar { display: none !important; }\n';
    }

    function add_cookie_website_style() {
        //About Cookies (https://www.aboutcookies.org/)
        if (document.location.href.includes('/www.aboutcookies.org')) {
            custom_style.textContent +=
                'div.banner-overlay.is--visible { display: none !important; }\n';
        }

        //AUTODOC (https://www.auto-doc.fr/)
        else if (document.location.href.includes('/www.auto-doc.fr')) {
            custom_style.textContent +=
                'body > div#app > div.overlay { display: none !important; }\n';
        }

        //Ameli (https://assure.ameli.fr/)
        else if (document.location.href.includes('.ameli.fr')) {
            custom_style.textContent +=
                '#bandeauConsentement, #idPopupWARecueilConsentement, #pageConsentement { display: none !important; }\n';
        }

        //Alexia (https://www.alexia.fr/)
        else if (document.location.href.includes('/www.alexia.fr')) {
            custom_style.textContent +=
                'body._cc_op::before { display: none !important; }\n';
        }

        //Arm Developer (https://developer.arm.com/)
        else if (document.location.href.includes('/developer.arm.com')) {
            custom_style.textContent +=
                '.fixedPolicyBox { display: none !important; }\n';
        }

        //ASMALLWORD (https://www.asmallworld.com/)
        else if (document.location.href.includes('/www.asmallworld.com')) {
            custom_style.textContent +=
                'body > div.modal-backdrop { display: none !important; }\n';
        }

        //Belgium.be (https://www.belgium.be/)
        else if (document.location.href.includes('/www.belgium.be')) {
            custom_style.textContent +=
                '#fedconsent { display: none !important; }\n';
        }

        //Breakflip (https://www.breakflip.com/)
        else if (document.location.href.includes('/www.breakflip.com')) {
            custom_style.textContent +=
                'html[data-fast-cmp-locked] > body { position: initial !important; }\n';
        }

        //CAF (https://www.caf.fr/)
        else if (document.location.href.includes('/caf.fr') || document.location.href.includes('.caf.fr')) {
            custom_style.textContent +=
                '#sliding-popup { display: none !important; }\n';
        }

        //Coolblue (https://www.coolblue.be/)
        else if (document.location.href.includes('/www.coolblue.be')) {
            custom_style.textContent +=
                'body > div[aria-labelledby="modal-box-header"] { display: none !important; }\n';
        }

        //Cultura (https://www.cultura.com/)
        else if (document.location.href.includes('/www.cultura.com')) {
            custom_style.textContent +=
                'body > div#privacy-overlay { display: none !important; }\n';
        }

        //Dailymotion (https://www.dailymotion.com/)
        else if (document.location.href.includes('/www.dailymotion.com')) {
            custom_style.textContent +=
                'body.TCF2Popup__gdprNoScroll___3sJZO > div#portal-root { display: none !important; }\n';
        }

        //Darjeeling (https://www.darjeeling.fr/)
        else if (document.location.href.includes('/www.darjeeling.fr')) {
            custom_style.textContent +=
                'div.eprivacy-module { display: none !important; }\n';
        }

        //Deals (https://www.chollometro.com/ | https://www.dealabs.com/ | https://www.hotukdeals.com/ | https://www.mydealz.de/ | https://www.pepper.it/ | https://www.preisjaeger.at/)
        else if (document.location.href.includes('/www.chollometro.com') || document.location.href.includes('/www.dealabs.com') || document.location.href.includes('/www.hotukdeals.com') || document.location.href.includes('/www.mydealz.de') || document.location.href.includes('/www.pepper.it') || document.location.href.includes('/www.preisjaeger.at')) {
            custom_style.textContent +=
                'body > div > div.popover-portal.vue-portal-target > div > div.popover-cover, body > div > div.popover-portal.vue-portal-target > div > section.popover[role="dialog"] div[data-t="cookiesMessage"] { display: none !important; }\n' +
                'body > main > div > div > div > div.popover-portal.vue-portal-target > div:first-child { display: none !important; }\n';
        }

        //El Español (https://www.elespanol.com/)
        else if (document.location.href.includes('/www.elespanol.com')) {
            custom_style.textContent +=
                '#nhfp_didomi_block_page { display: none !important; }\n';
        }

        //Etsy (https://www.etsy.com/)
        else if (document.location.href.includes('/www.etsy.com')) {
            custom_style.textContent +=
                'body.wt-body-no-scroll { position: initial !important; }\n';
        }

        //France Travail (https://www.francetravail.fr/)
        else if (document.location.href.includes('.francetravail.fr')) {
            custom_style.textContent +=
                'pe-cookies { display: none !important; }\n';
        }

        //Glamuse (https://www.glamuse.com/)
        else if (document.location.href.includes('/www.glamuse.com')) {
            custom_style.textContent +=
                'div#cookbar_overlay { display: none !important; }\n';
        }

        //Google (https://www.google.com/)
        else if (document.location.href.includes('/www.google.')) {
            custom_style.textContent +=
                'body.EM1Mrb div#xe7COe { display: none !important; }\n' +
                'body.EM1Mrb { overflow: initial !important; }\n';
        }

        //Kodaki (https://www.kokadi.de/)
        else if (document.location.href.includes('/www.kokadi.')) {
            custom_style.textContent +=
                'body > section#shopify-pc__banner { display: none !important; }\n';
        }

        //Larousse (https://www.larousse.fr/)
        else if (document.location.href.includes('/www.larousse.fr')) {
            custom_style.textContent +=
                'div[class^="pub-"], div[class*=" pub-"], div#poool-widget { display: none !important; }\n' +
                'div[style="filter: blur(3px);"] { filter: none !important; }\n';
        }

        //Laurent Willen (https://www.laurentwillen.be/)
        else if (document.location.href.includes('/www.laurentwillen.be') || document.location.href.includes('/laurentwillen.be')) {
            custom_style.textContent +=
                'body > div#overlay_background { display: none !important; }\n';
        }

        //Le Figaro (https://www.lefigaro.fr/)
        else if (document.location.href.includes('/www.lefigaro.fr')) {
            custom_style.textContent +=
                '#appconsent { display: none !important; }\n' +
                '.appconsent_noscroll { overflow: initial !important; }\n';
        }

        //Lead liaison (https://www.leadliaison.com/)
        else if (document.location.href.includes('/www.leadliaison.com')) {
            custom_style.textContent +=
                'body > div.ll_banner { display: none !important; }\n';
        }

        //Leroy Merlin (https://www.leroymerlin.fr/)
        else if (document.location.href.includes('/www.leroymerlin.')) {
            custom_style.textContent +=
                'body > div[class="mc-modal-overlay is-visible"][id="js-modal-overlay"] { display: none !important; }\n' +
                'html.is-scroll-locked { overflow: initial !important; }\n';
        }

        //Motointegrator (https://www.motointegrator.de/)
        else if (document.location.href.includes('/www.motointegrator.')) {
            custom_style.textContent +=
                'body > div[id^="fancybox"] { display: none !important; }\n';
        }

        //nPerf (https://www.nperf.com/)
        else if (document.location.href.includes('nperf.com')) {
            custom_style.textContent +=
                'div.SpeedTest.blur { filter: none !important; }\n';
        }

        //OOGarden (https://www.oogarden.com/)
        else if (document.location.href.includes('/www.oogarden.com')) {
            custom_style.textContent +=
                'div#bodyCookiesContainer { display: none !important; }\n';
        }

        //OVH (https://www.ovh.com/ | https://www.ovhcloud.com/)
        else if (document.location.href.includes('/www.ovh.com') || document.location.href.includes('/www.ovhcloud.com')) {
            custom_style.textContent +=
                'body > div#tc_priv_CustomOverlay { display: none !important; }';
        }

        //Paylib (https://www.paylib.fr/)
        else if (document.location.href.includes('/www.paylib.fr')) {
            custom_style.textContent +=
                'cookies-consent { display: none !important; }\n';
        }

        //Pelando (https://www.pelando.com.br/)
        else if (document.location.href.includes('/www.pelando.com.br')) {
            custom_style.textContent +=
                'body > div > div > div { display: none !important; }\n';
        }

        //Poco (https://www.po.co/)
        else if (document.location.href.includes('/www.po.co')) {
            custom_style.textContent +=
                '.agree-tokens-modal { display: none !important; }\n';
        }

        //Poco Community (https://c.po.co/global/)
        else if (document.location.href.includes('/c.po.co')) {
            custom_style.textContent +=
                '#root > .hy-musk-wrapper { display: none !important; }\n';
        }

        //PrestaModule (https://www.presta-module.com/)
        else if (document.location.href.includes('/www.presta-module.com')) {
            custom_style.textContent +=
                '.acbBackdrop, #acbModal { display: none !important; }\n';
        }

        //PvPoke (https://pvpoke-re.com/)
        else if (document.location.href.includes('pvpoke-re.com')) {
            custom_style.textContent +=
                'body > div:not(.main-wrap) { display: none !important; }\n';
        }

        //Realme Community (https://c.realme.com/)
        else if (document.location.href.includes('/c.realme.com')) {
            custom_style.textContent +=
                'html[class^="realme-"] > body > div#app.cookie-privacy { height: auto !important; overflow: initial !important; }\n' +
                'html[class^="realme-"] > body > div#app.cookie-privacy > div[data-v-e081aa22] { display: none !important; }\n';
        }

        //Reddit (https://www.reddit.com/)
        else if (document.location.href.includes('/www.reddit.com')) {
            custom_style.textContent +=
                'shreddit-async-loader[bundlename="reddit_cookie_banner"] { display: none !important; }\n';
        }

        //Sonia Rykiel (https://www.soniarykiel.com/)
        else if (document.location.href.includes('/www.soniarykiel.com')) {
            custom_style.textContent +=
                '.ui-widget-overlay { display: none !important; }\n';
        }

        //Speedtest by Ookla (https://www.speedtest.net/)
        else if (document.location.href.includes('/www.speedtest.net')) {
            custom_style.textContent +=
                'body > div#modal-overlay { display: none !important; }\n';
        }

        //TikTok (https://www.tiktok.com/)
        else if (document.location.href.includes('/www.tiktok.com')) {
            custom_style.textContent +=
                'tiktok-cookie-banner { display: none !important; }\n';
        }

        //Too Good To Go (https://www.toogoodtogo.fr/)
        else if (document.location.href.includes('/www.toogoodtogo.fr')) {
            custom_style.textContent +=
                '.noScroll, .noScroll body { overflow: initial !important; }\n';
        }

        //Tumblr (https://www.tumblr.com/)
        else if (document.location.href.includes('/www.tumblr.com')) {
            custom_style.textContent +=
                'body#tumblr > div#root > div > div#base-container div.Lq1wm { display: none !important; }\n';
        }

        //Ubaldi (https://www.ubaldi.com/)
        else if (document.location.href.includes('ubaldi.com')) {
            custom_style.textContent +=
                'body > div#cb-frame { display: none !important; }\n';
        }

        //Userlike (https://www.userlike.com/)
        else if (document.location.href.includes('userlike.com')) {
            custom_style.textContent +=
                'body > div.ch2 { display: none !important; }\n';
        }

        //Vroomly (https://www.vroomly.com/)
        else if (document.location.href.includes('/www.vroomly.com')) {
            custom_style.textContent +=
                'body > div.ReactModalPortal { display: none !important; }\n';
        }

        //Winparts (https://www.winparts.eu/)
        else if (document.location.href.includes('/www.winparts.')) {
            custom_style.textContent +=
                '.cookie-consent-active { overflow: initial !important; }\n';
        }

        //Wix (https://www.wix.com/)
        else if (document.location.href.includes('/www.wix.')) {
            custom_style.textContent +=
                '[data-hook="ccsu-banner-wrapper"] { display: none !important; }\n';
        }

        //WP Engine (https://wpengine.com/)
        else if (document.location.href.includes('/wpengine.com')) {
            custom_style.textContent +=
                'aside.opt-in-modal.js-opt-in-modal { display: none !important; }\n';
        }

        //X (https://x.com/)
        else if (document.location.href.includes('/x.com')) {
            custom_style.textContent +=
                'div#react-root div#layers div[data-testid="BottomBar"] { display: none !important; }\n';
        }

        //Youtube (https://www.youtube.com/)
        else if (document.location.href.includes('/www.youtube.com')) {
            custom_style.textContent +=
                'ytd-consent-bump-v2-lightbox, tp-yt-iron-overlay-backdrop { display: none !important; }\n';
        }
    }

    function add_LAA_website_style() {
        //APKMirror (https://www.apkmirror.com/)
        if (document.location.href.includes('/www.apkmirror.com')) {
            custom_style.textContent +=
                //Ads
                'div[class^="ains-apkm"], div[class*=" ains-apkm"], #bottom-slider.apkm-timed-slider { display: none !important; }\n';
        }

        //AUTODOC (https://www.auto-doc.fr/)
        else if (document.location.href.includes('/www.auto-doc.fr')) {
            custom_style.textContent +=
                //Mobile - Ads
                'body > div#app > main#main > div[data-traffic-banner-wrapper] { display: none !important; }\n';
        }

        //AUTODOC Club (https://club.auto-doc.fr/)
        else if (document.location.href.includes('club.auto-doc.fr')) {
            custom_style.textContent +=
                //Log in | Sign up
                '.popup-restriction-manager { display: none !important; }\n' +
                '.restricted-steps__mask.steps-list { background: none !important; filter: none !important; }\n';
        }

        //Bonial (https://www.bonial.fr/)
        else if (document.location.href.includes('/www.bonial.fr')) {
            custom_style.textContent +=
                //Download app
                '[data-testid="AppInfoBanner"] { display: none !important; }\n' +
                //Mobile - Download app
                '[data-testid="AppBannerTop"], .download-app-banner { display: none !important; }\n';
        }

        //Deals (https://www.chollometro.com/ | https://www.dealabs.com/ | https://www.hotukdeals.com/ | https://www.mydealz.de/ | https://www.pepper.it/ | https://www.preisjaeger.at/)
        else if (document.location.href.includes('/www.chollometro.com') || document.location.href.includes('/www.dealabs.com') || document.location.href.includes('/www.hotukdeals.com') || document.location.href.includes('/www.mydealz.de') || document.location.href.includes('/www.pepper.it') || document.location.href.includes('/www.preisjaeger.at')) {
            custom_style.textContent +=
                //Ads
                'div.listLayout section#toc-target-deals div[data-track].js-banner.overflow--hidden.cept-banner, div.listLayout section#toc-target-deals section[data-track].cept-widget-list.js-newsletter-widget, div.plSurveyContainer { display: none !important; }\n' +
                //Mobile - Download app
                'body > div > span > section.popover.popover--bottomSheet, [data-t="appDownloadMessage"] { display: none !important; }\n';
        }

        //Developpez.com (https://www.developpez.com/)
        else if (document.location.href.includes('.developpez.com')) {
            custom_style.textContent +=
                //Ads
                'body > div#gabarit_megaban_bas, div[id^="gabarit_pub"], div[id*=" gabarit_pub"], div#colonneDroite > aside > div#encart_droite { display: none !important; }\n';
        }

        //Le Monde (https://www.lemonde.fr/)
        else if (document.location.href.includes('/www.lemonde.fr')) {
            custom_style.textContent +=
                //Mobile - Download app
                '.paywall { display: none !important; }\n' +
                '.LeMondeMain .article__content--restricted-media { height: auto !important }\n';
        }

        //Mail.ru (https://mail.ru/)
        else if (document.location.href.includes('.mail.ru')) {
            custom_style.textContent +=
                //Mobile - Download app
                'div[data-testid="ad-overlay"], div.ads-bottom__fixed, div#tp-1-main { display: none !important; }\n' +
                'body[class$="-overlay-fixed"], body[class*="-overlay-fixed "] { position: initial !important; }\n';
        }

        //OK (https://ok.ru/) | OK Mobile (https://m.ok.ru/)
        else if (document.location.href.includes('ok.ru')) {
            custom_style.textContent +=
                //Log in | Sign up
                'body.h-mod > div#hook_Block_LoginPopupReact, body.h-mod > div#hook_Block_AuthLoginAutoOpen { display: none !important; }\n' +
                //Mobile - Log in | Sign up
                'div.invite-banner, div.invite-block { display: none !important; }\n';
        }

        //Oscaro (https://www.oscaro.com/)
        else if (document.location.href.includes('/www.oscaro.com')) {
            custom_style.textContent +=
                //Mobile - Ads
                'body > div#root > aside.popin.promo-aside { display: none !important; }\n' +
                //Mobile - Download app
                'body > div.smartbanner { display: none !important; }\n';
        }

        //Pinterest (https://www.pinterest.com/)
        else if (document.location.href.includes('/www.pinterest.')) {
            custom_style.textContent +=
                //Log in | Sign up
                'div#__PWS_ROOT__ div[data-test-id="fullPageSignupModal"], div#__PWS_ROOT__ div[data-test-id="bottom-right-upsell"] { display: none !important; }\n' +
                //Mobile - Download app
                'div#__PWS_ROOT__ div[data-test-id="floating-app-upsell"] { display: none !important; }\n';
        }

        //Promocatalogues (https://www.promocatalogues.fr/)
        else if (document.location.href.includes('/www.promocatalogues.fr')) {
            custom_style.textContent +=
                //Mobile - Download app
                'body > div#navigation-vue > div.download-mobile-app-popup { display: none !important; }\n';
        }

        //Quora (https://www.quora.com/)
        else if (document.location.href.includes('.quora.com')) {
            custom_style.textContent +=
                //Log in | Sign up
                'div#root div.qu-zIndex--blocking_wall { display: none !important; }\n' +
                'div#root > div.q-box > div.q-box > div.q-box { filter: none !important; }\n' +
                'div#root > div.q-box > div.q-box > div.q-box > div[slidein="bottom"][slideout="bottom"] { display: none !important; }\n' +
                //Mobile - "Open in App" & "Sign-in" navbar buttons
                'body.q-platform--mobile div#root div.q-sticky.qu-zIndex--header div.q-flex.qu-pr--small { display: none !important; }\n' +
                'body.q-platform--mobile div#root a.q-box.qu-display--inline-flex.qu-px--medium.qu-cursor--pointer { margin: 0 auto !important; }\n';
        }

        //Reddit (https://www.reddit.com/)
        else if (document.location.href.includes('/www.reddit.com')) {
            custom_style.textContent +=
                //Download app
                'body > shreddit-app > shreddit-experience-tree, div.App > div.AppMainPage div[class^="XPromo"], div.App > div.AppMainPage div[class*=" XPromo"], div.App > div.AppMainPage li.TopNav__promoButton { display: none !important; }\n' +
                'shreddit-async-loader[bundlename="bottom_bar_xpromo"] { display: none !important; }\n' +
                'body.scroll-disabled { position: initial !important; }\n' +
                //Mobile - Log in to view the conversation
                'inline-auth-landing-experience-xpromo-shell { display: none !important; }\n' +
                //Mobile - "See Reddit in..."
                'shreddit-async-loader[bundlename="app_selector"] { display: none !important; }\n';
        }

        //SeeFrench (https://www.seefrench.xyz/)
        else if (document.location.href.includes('/seefrench.') || document.location.href.includes('/www.seefrench.')) {
            custom_style.textContent +=
                //AdBlock popup
                'body > main > div > div.fixed.justify-center.z-50 { display: none !important; }\n';
        }

        //Speedtest by Ookla (https://www.speedtest.net/)
        else if (document.location.href.includes('/www.speedtest.net')) {
            custom_style.textContent +=
                //Download app
                'div[data-view-name="masthead-app-promo"], div[data-view-name="mobile"][data-view-cid] [data-view-name="mobile-during-test-banner"], div[data-view-name="mobile"][data-view-cid] [data-view-name="mobile-eot-banner"], div[data-view-name="mobile"][data-view-cid] div[data-view-name="mobile-pretest"], div[data-view-name="mobile"][data-view-cid] div.result-area.result-area-ad { display: none !important; }\n';
        }

        //Tiendeo (https://www.tiendeo.com/)
        else if (document.location.href.includes('/www.tiendeo.')) {
            custom_style.textContent +=
                //Ads
                '.ads_overlay, .modalBackground, .pushpopupcontainer, .text-ad, #bannerSection { display: none !important; }\n' +
                //Mobile - Download app
                '[data-view="banners-appImgStories"], .popup_container { display: none !important; }\n';
        }

        //TikTok (https://www.tiktok.com/)
        else if (document.location.href.includes('/www.tiktok.com')) {
            custom_style.textContent +=
                //Log in
                'body > div[class$="DivModalContainer"], body > div[class*="DivModalContainer "] { display: none !important; }\n' +
                //"Get App" button
                'div#app div[class$="DivPromotionContainer"], div#app div[class*="PromotionContainer "] { display: none !important; }\n' +
                //"Something went wrong" popup
                'body > div > div.css-feuqz4 { display: none !important; }\n' +
                //Mobile - Download app
                'div#app div[class$="DivBottomBanner"], div#app div[class*="DivBottomBanner "], div[class$="DivTopBannerAB"], div#app div[class*="DivTopBannerAB "] { display: none !important; }\n' +
                'div#app div[data-e2e="bottom-cta-container"], div#app div[data-e2e="float-banner"], div#app div[data-e2e="footer-guide"], div#app div[data-e2e="guide-container"] { display: none !important; }\n' +
                'div#app div[class*="tux-base-dialog__"], div#app div[data-theme] > div[class*="text-color-"].box-border, div#app div[data-theme] > div[class*="tux-base-dialog"].box-border { display: none !important; }\n' +
                'body[tux-screen-lock-offset] > div[data-theme][dir] > div[class*="tux-base-dialog"] { display: none !important; }\n' +
                'body[tux-screen-lock-offset] { position: initial !important; }\n' +
                //Mobile - Live page -> Download app
                'body[data-web-id][data-request-id] > div#__APP_ROOT__ > div.container.live > header.top-banner, body[data-web-id][data-request-id] > div#__APP_ROOT__ > div.container.live > div.bottom-banner { display: none !important; }\n' +
                'body[data-web-id][data-request-id] > div#__APP_ROOT__ > div.container.live { padding-top: 0 !important; padding-bottom: 0 !important; }\n' +
                //Mobile - Log in
                'body > div.tiktok-hsy0fo-DivContainer { display: none !important; }\n' +
                //Mobile - Open TikTok
                'body > div[data-theme][dir] { display: none !important; }\n' +
                'body > div > div > div > span[data-e2e="float-banner"] { display: none !important; }\n';
        }

        //Tumblr (https://www.tumblr.com/)
        else if (document.location.href.includes('/www.tumblr.com')) {
            custom_style.textContent +=
                //Ads
                'body#tumblr > div#root > div > div#base-container > div#adBanner { display: none !important; }\n' +
                //Download app
                'body#tumblr > div#root > div > div#base-container #app-download-links-container { display: none !important; }\n' +
                //Log in | Sign up
                'body#tumblr > div#root > div > div#base-container div.smX3m { display: none !important; }\n' +
                //"Sponsored" -> "Wanna go ad-free?"
                'body#tumblr > div#root > div > div#base-container div.ohi9S { display: none !important; }\n' +
                //Mobile - Download app
                'body#tumblr > div#root > div > div#base-container div[aria-label="Notification"] { display: none !important; }\n';
        }

        //VK (https://vk.com/) | VK Mobile (https://m.vk.com/)
        else if (document.location.href.includes('/vk.') || document.location.href.includes('/m.vk.')) {
            custom_style.textContent +=
                //Log in | Sign up
                'body[scheme^="vkcom"] > div#box_layer_bg, body[scheme^="vkcom"] > div#box_layer_wrap, div.PageBottomBanner--unauth { display: none !important; }\n' +
                //Mobile - Log in | Sign up
                'html.vk body > div.ModalMenu { display: none !important; }\n' +
                'html.vk body.fixed { position: initial !important }\n';
        }

        //Wattpad (https://www.wattpad.com/)
        else if (document.location.href.includes('/www.wattpad.com')) {
            custom_style.textContent +=
                //Ads
                '[id^="storylanding_"], [id*=" storylanding_"] { display: none !important; }\n' +
                //Log in | Sign up
                'main section#authentication-panel, main section#section-authentication, div#app-container div.story-details-page  div.signup-modal { display: none !important; }\n' +
                //Log in | Sign up | Mobile - Download app
                'div#bottom-banner-container { display: none !important; }\n' +
                //"Try Premium" navbar button
                'div#header div#go-premium-button { display: none !important; }\n';
        }

        //Waze (https://www.waze.com/)
        else if (document.location.href.includes('/www.waze.com')) {
            custom_style.textContent +=
                //Download app
                'div#root > div.wz-downloadbar { display: none !important; }\n';
        }

        //WikiHow (https://www.wikihow.com/)
        else if (document.location.href.includes('/www.wikihow.com')) {
            custom_style.textContent +=
                //Ads
                'body.mediawiki > div#mw-mf-viewport > div#mw-mf-page-center > div#article_courses_banner { display: none !important; }\n';
        }

        //Wix (https://www.wix.com/)
        else if (document.location.href.includes('/www.wix.') || document.location.href.includes('.wixsite.com')) {
            custom_style.textContent +=
                //Ads
                'div#WIX_ADS { display: none !important; }\n' +
                ':root { --wix-ads-height: 0 !important; --wix-ads-top-height: 0 !important; }\n';
        }

        //Google Sign-in popup
        custom_style.textContent +=
            'body > div#credential_picker_container { display: none !important; }\n' +
            'body div#g_id_onload > div#credential_picker_container { display: none !important; }\n';

        //Streaming websites ads
        custom_style.textContent +=
            '#pub, #pubs { display: none !important; }\n';
    }

    add_cookie_global_style();
    add_cookie_module_style();
    add_cookie_website_style();
    add_LAA_website_style(); //LAA: Login, App & Ads.

    //Add css to header to avoid cookie consent (or other) displayed few seconds before disappear with css added after body.
    if (typeof(document.head) !== 'undefined' && document.head !== null) {
        document.head.appendChild(custom_style);
    }
    else {
        document.addEventListener('DOMContentLoaded', function() {
            document.head.appendChild(custom_style);
        });
    }

    //Add css after body to bypass css added at end of body after page loaded.
    if (typeof(document.body) !== 'undefined' && document.body !== null) {
        document.body.after(custom_style);
    }
    else {
        document.addEventListener('DOMContentLoaded', function() {
            document.body.after(custom_style);
        });
    }

//2. Use javascript...
    var brute_force_cookie_website_interval = null;
    var brute_force_cookie_website_interval_count = 0;

    function brute_force_cookie_website() {
        //Bookingpremium (https://bookingpremium.secureholiday.net/)
        if (document.location.href.includes('/bookingpremium.secureholiday.net')) {
            var button_bookingpremium_refuse_cookie = null;
            if ((button_bookingpremium_refuse_cookie = document.querySelector('button[name="refuse-cookie-btn"]')) !== null) {
                button_bookingpremium_refuse_cookie.click();
                console.log('Automatically clicked on "' + button_bookingpremium_refuse_cookie.innerText + '".');
                clearInterval(brute_force_cookie_website_interval);
                return;
            }
        }

        //Canon (https://www.canon.fr/)
        else if (document.location.href.includes('/www.canon.')) {
            var div_canon_background = null;
            if ((div_canon_background = document.body.querySelector('div.evidon-background')) !== null) {
                div_canon_background.remove();
                clearInterval(brute_force_cookie_website_interval);
                return;
            }
        }

        //Dailymotion (https://www.dailymotion.com/) | Dailymotion Consent (https://consent.dailymotion.com/)
        else if (document.location.href.includes('/consent.dailymotion.')) {
            var button_dailymotion_continue_without_accepting = null;
            if (document.body.querySelector("button.cwa") !== null) {
                button_dailymotion_continue_without_accepting = document.body.querySelector("button.cwa");
                button_dailymotion_continue_without_accepting.click();
                console.log('Automatically clicked on "' + button_dailymotion_continue_without_accepting.innerText + '".');
                clearInterval(brute_force_cookie_website_interval);
                return;
            }
        }

        //GMX (https://www.gmx.fr/consentpage/)
        else if (document.location.href.includes('/www.gmx.fr/consentpage')) {
            var div_onetrust = null;
            var div_onetrust_continue_without_accepting = null;
            var button_onetrust_continue_without_accepting = null;
            if ((div_onetrust = document.querySelector('div#onetrust-consent-sdk')) !== null && (div_onetrust_continue_without_accepting = div_onetrust.querySelector('div#onetrust-close-btn-container')) !== null && (button_onetrust_continue_without_accepting = div_onetrust_continue_without_accepting.querySelector('button.onetrust-close-btn-handler.banner-close-button.ot-close-link')) !== null) {
                button_onetrust_continue_without_accepting.click();
                console.log('Automatically clicked on "' + button_onetrust_continue_without_accepting.innerText + '".');
                clearInterval(brute_force_cookie_website_interval);
            }
            window.location.replace('https://www.gmx.fr/');
            return;
        }

        //Google (https://www.google.com/) | Google Consent (https://consent.google.com/)
        else if (document.location.href.includes('/www.google.') || document.location.href.includes('/consent.google.')) {
            var div_google_cookie_consent = null;
            var form_google_cookie_consent = null;
            var button_google_cookie_consent_reject_all = null;
            if (document.location.href.includes('/consent.google.')) {
                if (document.body.id === 'yDmH0d' && (form_google_cookie_consent = document.body.querySelector('form[jsaction="JIbuQc:fN3dRc(tWT92d)"]')) !== null && (button_google_cookie_consent_reject_all = form_google_cookie_consent.querySelector('button[jsname="tWT92d"]')) !== null) {
                    button_google_cookie_consent_reject_all.click();
                    console.log('Automatically clicked on "' + button_google_cookie_consent_reject_all.innerText + '".');
                    clearInterval(brute_force_cookie_website_interval);
                    return;
                }
            }
            else if (document.location.href.includes('/www.google.')) {
                if (document.body.classList.contains('EM1Mrb') && (div_google_cookie_consent = document.body.querySelector('div#xe7COe')) !== null && (button_google_cookie_consent_reject_all = div_google_cookie_consent.querySelector('button[data-ved]#W0wltc')) !== null) {
                    button_google_cookie_consent_reject_all.click();
                    console.log('Automatically clicked on "' + button_google_cookie_consent_reject_all.innerText + '".');
                    clearInterval(brute_force_cookie_website_interval);
                    return;
                }
            }
        }

        //Medium (https://medium.com/)
        else if (document.location.href.includes('/medium.com')) {
            var body_medium_last_child = null;
            if ((body_medium_last_child = document.querySelector('body > div:last-of-type')) !== null && body_medium_last_child.tagName === 'DIV' && body_medium_last_child.childNodes.length == 1 && body_medium_last_child.childNodes[0].tagName === 'DIV' && body_medium_last_child.childNodes[0].classList.length >= 19) {
                body_medium_last_child.style.display = 'none';
                clearInterval(brute_force_cookie_website_interval);
                return;
            }
        }

        //Yahoo Consent (https://consent.yahoo.com/)
        else if (document.location.href.includes('/consent.yahoo.com')) {
            var div_yahoo_consent_page = null;
            var button_yahoo_consent_page_reject_all = null;
            if ((div_yahoo_consent_page = document.body.querySelector('div#consent-page')) !== null && (button_yahoo_consent_page_reject_all = div_yahoo_consent_page.querySelector('button.reject-all')) !== null) {
                button_yahoo_consent_page_reject_all.click();
                console.log('Automatically clicked on "' + button_yahoo_consent_page_reject_all.innerText + '".');
                clearInterval(brute_force_cookie_website_interval);
                return;
            }
        }

        //Youtube (https://www.youtube.com/) | Youtube Consent (https://consent.youtube.com/)
        else if (document.location.href.includes('/www.youtube.') || document.location.href.includes('/consent.youtube.')) {
            var element_youtube_cookie_consent = null;
            var form_youtube_cookie_consent = null;
            var button_youtube_cookie_consent_reject_all = null;
            if (document.location.href.includes('/consent.youtube.')) {
                if ((form_youtube_cookie_consent = document.body.querySelector('form[jsaction="JIbuQc:fN3dRc(tWT92d)"]')) !== null && (button_youtube_cookie_consent_reject_all = form_youtube_cookie_consent.querySelector('button[jsname="tWT92d"]')) !== null) {
                    button_youtube_cookie_consent_reject_all.click();
                    console.log('Automatically clicked on "' + button_youtube_cookie_consent_reject_all.innerText + '".');
                    clearInterval(brute_force_cookie_website_interval);
                    return;
                }
            }
            else if (document.location.href.includes('/www.youtube.')) {
                if ((element_youtube_cookie_consent = document.body.querySelector('ytd-consent-bump-v2-lightbox')) !== null && (button_youtube_cookie_consent_reject_all = document.body.querySelector('ytd-consent-bump-v2-lightbox div.eom-buttons > div.eom-button-row:first-of-type > ytd-button-renderer:first-of-type > yt-button-shape > button')) !== null) {
                    button_youtube_cookie_consent_reject_all.click();
                    console.log('Automatically clicked on "' + button_youtube_cookie_consent_reject_all.innerText + '".');
                    clearInterval(brute_force_cookie_website_interval);
                    return;
                }
            }
        }

        //Stop after eight attempts (two seconds) if nothing is found.
        brute_force_cookie_website_interval_count < 7 ? brute_force_cookie_website_interval_count++ : clearInterval(brute_force_cookie_website_interval);
    }

    function brute_force_pinterest_login() {
        //Pinterest (https://www.pinterest.com/)
        if (document.location.href.includes('/www.pinterest.')) {
            var a_pinterest_all_button_login = document.body.querySelectorAll('[data-test-id*="login-button"]');
            var a_pinterest_all_button_signup = document.body.querySelectorAll('[data-test-id*="signup-button"]');

            //Redirect to login page when click on "Log in" button.
            if (a_pinterest_all_button_login.length > 0) {
                Array.prototype.forEach.call(a_pinterest_all_button_login, function(a_pinterest_button_login) {
                    a_pinterest_button_login.addEventListener('click', function(element) {
                        window.location = 'https://www.pinterest.com/login/';
                    });
                });
            }

            //Redirect to login page when click on "Sign up" button.
            if (a_pinterest_all_button_signup.length > 0) {
                Array.prototype.forEach.call(a_pinterest_all_button_signup, function(a_pinterest_button_signup) {
                    a_pinterest_button_signup.addEventListener('click', function(element) {
                        window.location = 'https://www.pinterest.com/login/';
                    });
                });
            }
        }
    }

    function brute_force_tiktok_login() {
        //TikTok (https://www.tiktok.com/)
        if (document.location.href.includes('/www.tiktok.com')) {
            var a_tiktok_all_button_login = document.body.querySelectorAll('[data-e2e*="login-button"]');
            var a_tiktok_all_button_signup = document.body.querySelectorAll('[data-e2e*="signup-button"]');

            //Redirect to login page when click on "Log in" button.
            if (a_tiktok_all_button_login.length > 0) {
                Array.prototype.forEach.call(a_tiktok_all_button_login, function(a_tiktok_button_login) {
                    a_tiktok_button_login.addEventListener('click', function(element) {
                        window.location = 'https://www.tiktok.com/login';
                    });
                });
            }

            //Redirect to signup page when click on "Sign up" button.
            if (a_tiktok_all_button_signup.length > 0) {
                Array.prototype.forEach.call(a_tiktok_all_button_signup, function(a_tiktok_button_signup) {
                    a_tiktok_button_signup.addEventListener('click', function(element) {
                        window.location = 'https://www.tiktok.com/login';
                    });
                });
            }
        }
    }

    function brute_force_vk_unauthorized_click() {
        //VK (https://vk.com/)
        if (document.location.href.includes('/vk.com')) {
            var div_vk_page_wall_posts = document.body.querySelector('#page_wall_posts');
            var a_vk_link_closest = null;
            var a_vk_link_post = null;

            //Redirect to post when click on "Show more comments" or "x replies".
            if (div_vk_page_wall_posts !== null && div_vk_page_wall_posts.tagName === 'DIV') {
                div_vk_page_wall_posts.addEventListener('click', function(element) {
                    if (((a_vk_link_closest = element.target.closest('a[id^="replies_short_deep-"]')) !== null || (a_vk_link_closest = element.target.closest('a[class^="replies_next"]')) !== null) && a_vk_link_closest.attributes.onclick.textContent.includes('window.Unauthorized') && (a_vk_link_post = a_vk_link_closest.href).includes('https://vk.com/wall-')) {
                        window.location = a_vk_link_post;
                    }
                });
            }
        }
    }

    window.addEventListener('load', function() {
        brute_force_cookie_website();
        brute_force_cookie_website_interval = setInterval(brute_force_cookie_website, 250);

        if (document.location.href.includes('/www.pinterest.')) {
            brute_force_pinterest_login();
        }
        else if (document.location.href.includes('/www.tiktok.com')) {
            brute_force_tiktok_login();
        }
        else if (document.location.href.includes('/vk.')) {
            brute_force_vk_unauthorized_click();
        }
    });

//3. Enjoy!
})();