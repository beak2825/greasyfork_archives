// ==UserScript==
// @name         Facebook Remove Redundant URL Ref
// @namespace    https://github.com/livinginpurple
// @version      2025.11.28.09
// @description  Remove refsrc and tracking parameters from Facebook URLs
// @license      WTFPL
// @author       livinginpurple
// @match        https://*.facebook.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/387718/Facebook%20Remove%20Redundant%20URL%20Ref.user.js
// @updateURL https://update.greasyfork.org/scripts/387718/Facebook%20Remove%20Redundant%20URL%20Ref.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //https://m.facebook.com/story.php?story_fbid=426978937875840&id=291618078078594&refid=7&__tn__=-R

    const TARGET_PARAMS = ['refsrc', 'refid', '_rdr' , '__tn__', '__xts__', 'hrc', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'igshid', 'mc_cid', 'mc_eid', 'mkt_tok', 'dclid', 'fb_ref', 'fb_source', 'fref', 'efid', 'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net'];
    try {
        const currentUrl = new URL(window.location.href);
        const searchParams = currentUrl.searchParams;
        let hasModified = false;

        TARGET_PARAMS.forEach(param => {
            if (searchParams.has(param)) {
                searchParams.delete(param);
                hasModified = true;
            }
        });

        if (hasModified) {
            const newUrl = currentUrl.toString();
            window.history.replaceState(null, '', newUrl);
            console.log(`${GMInfo.script.name} URL clean: ${newUrl}`);
        }

    } catch (e) {
        console.error(`${GMInfo.script.name} Error processing URL:`, e);
    }
})();