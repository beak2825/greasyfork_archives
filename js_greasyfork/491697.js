// ==UserScript==
// @name         F**k BILIBILI'S TRACKING PARAMETER
// @namespace    https://ceplavia.com
// @version      1.0
// @description  Replace bilibili's tracking parameter and makes it funnier.
// @author       Ceplavia
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/s/video/*
// @match        https://acg.tv/*
// @match        https://b23.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491697/F%2A%2Ak%20BILIBILI%27S%20TRACKING%20PARAMETER.user.js
// @updateURL https://update.greasyfork.org/scripts/491697/F%2A%2Ak%20BILIBILI%27S%20TRACKING%20PARAMETER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkAndReplaceParams() {
        let url = new URL(window.location.href);
        let params = url.searchParams;

        let isChanged = false;
        if (params.has('vd_source')) {
            params.set('vd_source', 'CHEN_RUI_NI_MA_SHEN_ME_SHI_HOU_SI_A');
            isChanged = true;
        }
        if (params.has('spm_id_from')) {
            params.set('spm_id_from', 'SHA_BI_CHEN_RUI');
            isChanged = true;
        }

        if (isChanged) {
            url.search = params.toString();
            window.history.replaceState({}, '', url.toString());
        }
    }

    let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                checkAndReplaceParams();
            }
        });
    });

    let config = { childList: true, subtree: true };

    observer.observe(document.body, config);

    checkAndReplaceParams();
})();