// ==UserScript==
// @name        Stealth URL Cleaner
// @description Silently cleans URLs by removing tracking parameters and other clutter.
// @license     BSD 3-Clause
// @author      ZerSKYi
// @namespace   zsk-url-cleaner
// @run-at      document-start
// @version     1.0
// @match       *://*/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/537122/Stealth%20URL%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/537122/Stealth%20URL%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const specificRules = [
        {
            regex: /^(https?:\/\/(?:[a-z0-9-]+\.)*aliexpress\.(?:[a-zA-Z.]{2,15})\/(?:item|store\/product))(\/[0-9_]+\.html)/,
            clean: (groups) => groups[1] + groups[2]
        },
        {
            regex: /^(https?:\/\/(?:www\.)?amazon\.(?:[a-zA-Z.]{2,15})\/(?:(?:[a-z]{2}(?:-[A-Z]{2})?\/)?(?:[^/]+\/))?dp\/)([A-Z0-9]{10})/,
            clean: (groups) => groups[1] + groups[2]
        },
        {
            regex: /^(https?:\/\/(?:www\.)?temu\.com\/)((?:[a-z]{2}(?:-[a-zA-Z]{2,4})?\/)?(?:[\w\-.%]+-g-\d+)\.html)/,
            clean: (groups) => groups[1] + groups[2]
        },
        {
            regex: /^(https?:\/\/(?:www\.)?temu\.com\/)((?:[a-z]{2}(?:-[a-zA-Z]{2,4})?\/)?search_result\.html\?search_key=[^&]+)/,
            clean: (groups) => groups[1] + groups[2]
        }
    ];

    const genericTrackingParamStrings = new Set([
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'utm_id',
        'utm_source_platform', 'utm_creative_format', 'utm_marketing_tactic',
        'fbclid', 'fb_action_ids', 'fb_action_types', 'fb_source',
        'gclid', 'gclsrc', 'dclid', '_gl',
        'msclkid', 'ocid',
        '_hsenc', '_hsmi', 'hsctatracking',
        'mc_cid', 'mc_eid',
        'mkt_tok',
        'yclid', '_openstat',
        's_kwcid', 'ef_id',
        'igshid', 'igsh', 'si', 'spm', 'epik',
        'pk_campaign', 'pk_kwd', 'pk_source', 'pk_medium',
        'piwik_campaign', 'piwik_kwd', 'piwik_source', 'piwik_medium',
        'mtm_campaign', 'mtm_kwd', 'mtm_source', 'mtm_medium', 'mtm_content',
        'mtm_cid', 'mtm_group', 'mtm_placement',
        '_x_sessn_id', 'refer_page_name', 'refer_page_id', 'refer_page_sn', 'is_back'
    ]);
    const genericTrackingParamRegexes = [];

    const currentHref = window.location.href;
    let newUrl = currentHref;
    let urlModified = false;

    for (const rule of specificRules) {
        const match = currentHref.match(rule.regex);
        if (match && match.length >= 3) {
            const cleanCandidate = rule.clean(match);
            if (currentHref.startsWith(cleanCandidate) && currentHref.length > cleanCandidate.length) {
                newUrl = cleanCandidate;
                urlModified = true;
                break;
            }
        }
    }

    const urlToProcessForGeneric = urlModified ? newUrl : currentHref;

    if (urlToProcessForGeneric.includes('?')) {
        try {
            const urlObject = new URL(urlToProcessForGeneric);
            const params = urlObject.searchParams;
            const paramsToDelete = [];

            for (const key of params.keys()) {
                const keyLower = key.toLowerCase();
                if (genericTrackingParamStrings.has(keyLower) ||
                    genericTrackingParamRegexes.some(regex => regex.test(key))) {
                    paramsToDelete.push(key);
                }
            }

            if (paramsToDelete.length > 0) {
                paramsToDelete.forEach(key => params.delete(key));
                newUrl = urlObject.toString();
                urlModified = true;
            } else if (urlModified && newUrl !== urlObject.toString()) {
                newUrl = urlObject.toString();
            }
        } catch (e) {}
    }

    if (urlModified && newUrl !== currentHref) {
        try {
            history.replaceState(null, '', newUrl);
        } catch (e) {}
    }
})();