// ==UserScript==
// @name         WME to Livemap link repair for vignettes
// @author       Ronald {rdnnk}
// @namespace    https://waze.cc
// @version      1.0.3
// @description  Add Vignette key to livemap link in WME
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542663/WME%20to%20Livemap%20link%20repair%20for%20vignettes.user.js
// @updateURL https://update.greasyfork.org/scripts/542663/WME%20to%20Livemap%20link%20repair%20for%20vignettes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function fixLinks() {
        const links = document.querySelectorAll('a.livemap-link');
        links.forEach(link => {
            if (link.href.includes('/livemap?lat') && !link.href.includes('rp_subscription=')) {
                link.href = link.href.replace('/livemap?lat', '/livemap?rp_subscription=*&lat');
                link.textContent += '+🛣️';
            }
        });
    }

    window.addEventListener('load', () => {
        // 5 second delay to allow Waze DOM
        setTimeout(() => {
            fixLinks();
        }, 5000);

        let checks = 0;
        const maxChecks = 6; // 6 * 5 sec = 30 sec
        const interval = setInterval(() => {
            fixLinks();
            checks++;
            if (checks >= maxChecks) clearInterval(interval);
        }, 5000);
    });
})();
