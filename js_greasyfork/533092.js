// ==UserScript==
// @name         NUS e-journals download redirect
// @version      1.3.1
// @description  e-journals download redirect for NUS students V1.3.1 (fixed overlap & delay only for AIP sites)
// @namespace    https://greasyfork.org/users/741351
// @include      *://advanced.onlinelibrary.wiley.com/*
// @include      *://onlinelibrary.wiley.com/*
// @include      *://www.nature.com/*
// @include      *://www.science.org/*
// @include      *://aip.scitation.org/*
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
// @include      *://pubs.aip.org/*
// @author       SAPEREAUDE&ChatGPT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533092/NUS%20e-journals%20download%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/533092/NUS%20e-journals%20download%20redirect.meta.js
// ==/UserScript==

(function () {
    const href = document.location.href;
    
    const redirect = () => {
    document.location.href = href
        .replace('advanced.onlinelibrary.wiley.com', 'advanced-onlinelibrary-wiley-com.libproxy1.nus.edu.sg')
        .replace('onlinelibrary.wiley.com', 'onlinelibrary-wiley-com.libproxy1.nus.edu.sg')
        .replace('www.nature.com', 'www-nature-com.libproxy1.nus.edu.sg')
        .replace('www.science.org', 'www-science-org.libproxy1.nus.edu.sg')
        .replace('aip.scitation.org', 'aip-scitation-org.libproxy1.nus.edu.sg')
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
        .replace('opg.optica.org', 'opg-optica-org.libproxy1.nus.edu.sg')
        .replace('pubs.aip.org', 'pubs-aip-org.libproxy1.nus.edu.sg');
    };

    // Apply delay only for AIP sites
    if (href.includes('aip.scitation.org') || href.includes('pubs.aip.org')) {
        const delay = Math.random() * (1867 - 1239) + 1239; // 1239 ms to 1867 ms
        setTimeout(redirect, delay);
    } else {
        redirect();
    }
})();