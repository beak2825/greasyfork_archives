// ==UserScript==
// @name         NUS e-journals download redirect
// @version      1.3.2
// @description  e-journals download redirect for NUS students V1.3.2 (auto‑redirect all sites except AIP; AIP links rewritten for user click)
// @namespace    https://greasyfork.org/users/741351
// @include      *://advanced.onlinelibrary.wiley.com/*
// @include      *://onlinelibrary.wiley.com/*
// @include      *://www.nature.com/*
// @include      *://www.science.org/*
// @include      *://aip.scitation.org/*
// @include      *://pubs.aip.org/*
// @include      *://journals.aps.org/*
// @include      *://pubs.acs.org/*
// @include      *://link.springer.com/*
// @include      *://www.sciencedirect.com/*
// @include      *://www.osapublishing.org/*
// @include      *://ieeexplore.ieee.org/*
// @include      *://pubs.rsc.org/*
// @include      *://iopscience.iop.org/*
// @include      *://science.sciencemag.org/*
// @include      *://www.spiedigitallibrary.org/*
// @include      *://www.cambridge.org/*
// @include      *://www.pnas.org/*
// @include      *://royalsocietypublishing.org/*
// @include      *://opg.optica.org/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533095/NUS%20e-journals%20download%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/533095/NUS%20e-journals%20download%20redirect.meta.js
// ==/UserScript==

(function() {
    const href = location.href;
    const isAIP = /aip\.scitation\.org/.test(href) || /pubs\.aip\.org/.test(href);

    // non-AIP domains: immediate redirect at document-start
    if (!isAIP) {
        const redirect = () => {
            document.location.href = href
                .replace('advanced.onlinelibrary.wiley.com', 'advanced-onlinelibrary-wiley-com.libproxy1.nus.edu.sg')
                .replace('onlinelibrary.wiley.com', 'onlinelibrary-wiley-com.libproxy1.nus.edu.sg')
                .replace('www.nature.com', 'www-nature-com.libproxy1.nus.edu.sg')
                .replace('www.science.org', 'www-science-org.libproxy1.nus.edu.sg')
                .replace('journals.aps.org', 'journals-aps-org.libproxy1.nus.edu.sg')
                .replace('pubs.acs.org', 'pubs-acs-org.libproxy1.nus.edu.sg')
                .replace('link.springer.com', 'link-springer-com.libproxy1.nus.edu.sg')
                .replace('www.sciencedirect.com', 'www-sciencedirect-com.libproxy1.nus.edu.sg')
                .replace('www.osapublishing.org', 'www-osapublishing-org.libproxy1.nus.edu.sg')
                .replace('ieeexplore.ieee.org', 'ieeexplore-ieee-org.libproxy1.nus.edu.sg')
                .replace('pubs.rsc.org', 'pubs-rsc-org.libproxy1.nus.edu.sg')
                .replace('iopscience.iop.org', 'iopscience-iop-org.libproxy1.nus.edu.sg')
                .replace('science.sciencemag.org', 'science-sciencemag-org.libproxy1.nus.edu.sg')
                .replace('www.spiedigitallibrary.org', 'www-spiedigitallibrary-org.libproxy1.nus.edu.sg')
                .replace('www.cambridge.org', 'www-cambridge-org.libproxy1.nus.edu.sg')
                .replace('www.pnas.org', 'www-pnas-org.libproxy1.nus.edu.sg')
                .replace('royalsocietypublishing.org', 'royalsocietypublishing-org.libproxy1.nus.edu.sg')
                .replace('opg.optica.org', 'opg-optica-org.libproxy1.nus.edu.sg');
        };
        redirect();
        return;
    }

    // AIP domains: rewrite links for user‑initiated clicks
    document.addEventListener('DOMContentLoaded', () => {
        const selectors = [
            'a[href*="aip.scitation.org"]',
            'a[href*="pubs.aip.org"]'
        ];
        function proxify(url) {
            return url
                .replace(/https?:\/\/aip\.scitation\.org/, 'https://aip-scitation-org.libproxy1.nus.edu.sg')
                .replace(/https?:\/\/pubs\.aip\.org/, 'https://pubs-aip-org.libproxy1.nus.edu.sg');
        }
        document.querySelectorAll(selectors.join(',')).forEach(link => {
            const orig = link.href;
            const prox = proxify(orig);
            if (orig !== prox) {
                link.setAttribute('data-original-href', orig);
                link.href = prox;
            }
        });

        // handle dynamically added links
        const obs = new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType===1 && node.matches && selectors.some(s=>node.matches(s))) {
                        const u = node.href, p = proxify(u);
                        if (u !== p) node.href = p;
                    }
                });
            });
        });
        obs.observe(document.body, { childList:true, subtree:true });
    });
})();