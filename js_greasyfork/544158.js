// ==UserScript==
// @name         Tokopedia Hardcoded URL Param Cleaner
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Remove Tokopedia junk parameters injection
// @author       illawma, beelzebub-rising
// @match        https://www.tokopedia.com/*
// @run-at       document-start
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=tokopedia.com
// @supportURL   https://www.reddit.com/r/indonesia/comments/1mdrmup/psa_update_benerin_search_result_tokopedia_dengan/
// @downloadURL https://update.greasyfork.org/scripts/544158/Tokopedia%20Hardcoded%20URL%20Param%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/544158/Tokopedia%20Hardcoded%20URL%20Param%20Cleaner.meta.js
// ==/UserScript==

(function () {
    const junkParams = [
        'minus_ids',
        'search_id',
        'has_more',
        'next_offset_organic',
        'next_offset_organic_ad',
        'navsource',
        'srp_component_id',
        'srp_page_id',
        'srp_page_title',
        'st',
        '_sort',
        '_useSearchResultTracking'
    ];

    function buildCleanupScript() {
        return `
        (function() {
            const junkParams = ${JSON.stringify(junkParams)};

            function cleanParamsObject(obj) {
                if (typeof obj !== 'object' || obj === null) return obj;
                const cleaned = { ...obj };
                junkParams.forEach(p => delete cleaned[p]);
                return cleaned;
            }

            const originalFetch = window.fetch;
            window.fetch = function(input, init) {
                try {
                    const url = typeof input === 'string' ? input : input?.url;

                    if (url?.includes('gql.tokopedia.com/graphql') && init && init.body) {
                        const body = JSON.parse(init.body);

                        if (Array.isArray(body)) {
                            console.log(body);
                            let modified = false;

                            for (const obj of body) {
                                if (obj?.variables?.params) {
                                  if (typeof obj.variables.params === 'string') {
                                    const paramsObj = Object.fromEntries(new URLSearchParams(obj.variables.params));
                                    junkParams.forEach(p => delete paramsObj[p]);
                                    obj.variables.params = new URLSearchParams(paramsObj).toString();
                                    modified = true;
                                  } else if (typeof obj.variables.params === 'object') {
                                    const cleaned = { ...obj.variables.params };
                                    junkParams.forEach(p => delete cleaned[p]);
                                    if (JSON.stringify(cleaned) !== JSON.stringify(obj.variables.params)) {
                                      obj.variables.params = cleaned;
                                      modified = true;
                                    }
                                  }
                                }
                            }

                            if (modified) {
                                init.body = JSON.stringify(body);
                            }
                        }
                    }
                } catch (e) {
                    console.warn('[UserScript] Error intercepting fetch:', e);
                }

                return originalFetch.apply(this, arguments);
            };
        })();`;
    }

    const script = document.createElement('script');
    script.textContent = buildCleanupScript();
    document.documentElement.appendChild(script);
})();
